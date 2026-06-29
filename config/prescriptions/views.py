from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsDoctor, IsDoctorOrAdmin
from doctors.models import Doctor
from .models import Prescription, Medication, DrugInteractionWarning
from .serializers import (
    PrescriptionSerializer, PrescriptionCreateSerializer,
    MedicationSerializer, DrugInteractionSerializer
)


class PrescriptionListView(generics.ListAPIView):
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'patient', 'doctor']
    ordering_fields = ['created_at']

    def get_queryset(self):
        user = self.request.user
        queryset = Prescription.objects.select_related(
            'patient__user', 'doctor__user'
        ).prefetch_related('medications')
        
        if user.is_patient:
            return queryset.filter(patient__user=user)
        elif user.is_doctor:
            return queryset.filter(doctor__user=user)
        elif user.is_admin:
            return queryset.all()
        return Prescription.objects.none()


class PrescriptionCreateView(generics.CreateAPIView):
    serializer_class = PrescriptionCreateSerializer
    permission_classes = [IsDoctor]

    def perform_create(self, serializer):
        doctor = Doctor.objects.get(user=self.request.user)
        serializer.save(doctor=doctor)


class PrescriptionDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Prescription.objects.select_related(
            'patient__user', 'doctor__user'
        ).prefetch_related('medications')
        
        if user.is_patient:
            return queryset.filter(patient__user=user)
        elif user.is_doctor:
            return queryset.filter(doctor__user=user)
        elif user.is_admin:
            return queryset.all()
        return Prescription.objects.none()


@api_view(['POST'])
@permission_classes([IsDoctor])
def check_drug_interactions(request):
    """Check for drug interactions between medications."""
    medications = request.data.get('medications', [])
    
    if len(medications) < 2:
        return Response({'interactions': []})
    
    interactions = []
    medication_names = [med.lower() for med in medications]
    
    for i, drug_a in enumerate(medication_names):
        for drug_b in medication_names[i+1:]:
            warning = DrugInteractionWarning.objects.filter(
                drug_a__iexact=drug_a,
                drug_b__iexact=drug_b
            ).first() or DrugInteractionWarning.objects.filter(
                drug_a__iexact=drug_b,
                drug_b__iexact=drug_a
            ).first()
            
            if warning:
                interactions.append(DrugInteractionSerializer(warning).data)
    
    return Response({'interactions': interactions})


@api_view(['POST'])
@permission_classes([IsDoctor])
def send_to_pharmacy(request, pk):
    """Send prescription to pharmacy (e-prescribing)."""
    try:
        prescription = Prescription.objects.get(pk=pk)
        
        # In production, integrate with pharmacy API
        # For now, just update the pharmacy info
        pharmacy_name = request.data.get('pharmacy_name')
        pharmacy_address = request.data.get('pharmacy_address')
        
        if pharmacy_name:
            prescription.pharmacy_name = pharmacy_name
        if pharmacy_address:
            prescription.pharmacy_address = pharmacy_address
        prescription.save()
        
        return Response({
            'message': 'Prescription sent to pharmacy successfully',
            'pharmacy': prescription.pharmacy_name
        })
    except Prescription.DoesNotExist:
        return Response({'error': 'Prescription not found'}, status=status.HTTP_404_NOT_FOUND)
