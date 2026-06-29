from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from accounts.permissions import IsAdmin, IsPatient, IsDoctor, IsDoctorOrAdmin
from patients.models import Patient
from doctors.models import Doctor
from .models import Appointment
from .serializers import (
    AppointmentSerializer, AppointmentCreateSerializer,
    AppointmentUpdateSerializer
)
from billing.models import Invoice, InvoiceItem
from datetime import timedelta
from django.utils import timezone



class AppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'appointment_type', 'date', 'doctor', 'patient']
    ordering_fields = ['date', 'time', 'created_at']

    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.select_related(
            'patient__user', 'doctor__user', 'department'
        )
        
        if user.is_patient:
            return queryset.filter(patient__user=user)
        elif user.is_doctor:
            return queryset.filter(doctor__user=user)
        elif user.is_admin:
            return queryset.all()
        return Appointment.objects.none()


class AppointmentCreateView(generics.CreateAPIView):
    serializer_class = AppointmentCreateSerializer
    permission_classes = [IsPatient]

    def perform_create(self, serializer):
        patient, _ = Patient.objects.get_or_create(user=self.request.user)
        serializer.save(patient=patient)


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return AppointmentUpdateSerializer
        return AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.select_related(
            'patient__user', 'doctor__user', 'department'
        )
        
        if user.is_patient:
            return queryset.filter(patient__user=user)
        elif user.is_doctor:
            return queryset.filter(doctor__user=user)
        elif user.is_admin:
            return queryset.all()
        return Appointment.objects.none()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_appointment(request, pk):
    """Cancel an appointment."""
    try:
        user = request.user
        if user.is_patient:
            appointment = Appointment.objects.get(pk=pk, patient__user=user)
        elif user.is_doctor or user.is_admin:
            appointment = Appointment.objects.get(pk=pk)
        else:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        if appointment.status in ['completed', 'cancelled']:
            return Response({'error': 'Cannot cancel this appointment'}, status=status.HTTP_400_BAD_REQUEST)
        
        appointment.status = Appointment.Status.CANCELLED
        appointment.save()
        
        return Response({'message': 'Appointment cancelled successfully'})
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsDoctorOrAdmin])
def confirm_appointment(request, pk):
    """Confirm an appointment."""
    try:
        appointment = Appointment.objects.get(pk=pk)
        
        if appointment.status != Appointment.Status.SCHEDULED:
            return Response({'error': 'Only scheduled appointments can be confirmed'}, status=status.HTTP_400_BAD_REQUEST)
        
        appointment.status = Appointment.Status.CONFIRMED
        appointment.save()
        
        return Response({'message': 'Appointment confirmed successfully'})
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsDoctorOrAdmin])
def complete_appointment(request, pk):
    """Mark an appointment as completed."""
    try:
        appointment = Appointment.objects.get(pk=pk)

        if appointment.status not in [
            Appointment.Status.SCHEDULED,
            Appointment.Status.CONFIRMED,
        ]:
            return Response(
                {"error": "Cannot complete this appointment"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Complete appointment
        appointment.status = Appointment.Status.COMPLETED

        notes = request.data.get("notes", "")
        if notes:
            appointment.notes = notes

        appointment.save()

        # Create invoice only if one doesn't already exist
        invoice, created = Invoice.objects.get_or_create(
            appointment=appointment,
            defaults={
                "patient": appointment.patient,
                "subtotal": appointment.doctor.consultation_fee,
                "tax": 0,
                "discount": 0,
                "amount_paid": 0,
                "due_date": timezone.now().date() + timedelta(days=7),
            },
        )

        if created:
            InvoiceItem.objects.create(
                invoice=invoice,
                description="Doctor Consultation",
                quantity=1,
                unit_price=appointment.doctor.consultation_fee,
            )

            # Calculate invoice total
            invoice.save()

        return Response({
            "message": "Appointment completed successfully",
            "invoice": invoice.invoice_number,
            "amount": invoice.total,
        })

    except Appointment.DoesNotExist:
        return Response(
            {"error": "Appointment not found"},
            status=status.HTTP_404_NOT_FOUND,
        )