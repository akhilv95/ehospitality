from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsDoctor, IsDoctorOrAdmin
from doctors.models import Doctor
from .models import MedicalRecord, LabResult
from appointments.models import Appointment
from .serializers import (
    MedicalRecordSerializer, MedicalRecordCreateSerializer,
    LabResultSerializer
)


class MedicalRecordListView(generics.ListAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['patient', 'doctor', 'is_confidential']
    ordering_fields = ['created_at']

    def get_queryset(self):
        user = self.request.user
        queryset = MedicalRecord.objects.select_related('patient__user', 'doctor__user')
        
        if user.is_patient:
            return queryset.filter(patient__user=user, is_confidential=False)
        elif user.is_doctor:
            doctor = Doctor.objects.get(user=user)

            patient_ids = list(
            Appointment.objects.filter(
            doctor=doctor
            ).values_list("patient_id", flat=True)
    )

            print("Doctor:", doctor.id)
            print("Patient IDs:", patient_ids)

            queryset = queryset.filter(patient_id__in=patient_ids).distinct()

            print("Medical Record Count:", queryset.count())

            return queryset
        elif user.is_admin:
            return queryset.all()
        return MedicalRecord.objects.none()


class MedicalRecordCreateView(generics.CreateAPIView):
    serializer_class = MedicalRecordCreateSerializer
    permission_classes = [IsDoctor]

    def perform_create(self, serializer):
        doctor = Doctor.objects.get(user=self.request.user)
        serializer.save(doctor=doctor)


class MedicalRecordDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return MedicalRecordCreateSerializer
        return MedicalRecordSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = MedicalRecord.objects.select_related('patient__user', 'doctor__user')
        
        if user.is_patient:
            return queryset.filter(patient__user=user, is_confidential=False)
        elif user.is_doctor:
            doctor = Doctor.objects.get(user=user)

            patient_ids = Appointment.objects.filter(
        doctor=doctor
    ).values_list("patient_id", flat=True)

            return queryset.filter(patient_id__in=patient_ids).distinct()
        elif user.is_admin:
            return queryset.all()
        return MedicalRecord.objects.none()


class PatientMedicalHistoryView(generics.ListAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsDoctorOrAdmin]


    def get_queryset(self):

        patient_id = self.kwargs.get("patient_id")

        if self.request.user.is_doctor:
            doctor = Doctor.objects.get(user=self.request.user)

            has_appointment = Appointment.objects.filter(
            doctor=doctor,
            patient_id=patient_id
        ).exists()

            if not has_appointment:
                return MedicalRecord.objects.none()

        return MedicalRecord.objects.filter(
            patient_id=patient_id
    ).select_related(
        "patient__user",
        "doctor__user"
    ).prefetch_related("lab_results")


class LabResultCreateView(generics.CreateAPIView):
    serializer_class = LabResultSerializer
    permission_classes = [IsDoctorOrAdmin]


class LabResultDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LabResult.objects.all()
    serializer_class = LabResultSerializer
    permission_classes = [IsDoctorOrAdmin]
