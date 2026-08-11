from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from accounts.permissions import IsAdmin, IsPatient, IsOwnerOrAdmin, IsDoctorOrAdmin
from .models import Patient, Allergy, HealthEducationResource
from .serializers import (
    PatientSerializer,
    PatientCreateUpdateSerializer,
    AdminPatientSerializer,
    AllergySerializer,
    HealthEducationResourceSerializer
)


class PatientListView(generics.ListAPIView):
    queryset = Patient.objects.select_related('user').prefetch_related('allergies')
    serializer_class = PatientSerializer
    permission_classes = [IsDoctorOrAdmin]
    filterset_fields = ['blood_group']
    search_fields = ['user__first_name', 'user__last_name', 'user__email']


class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.select_related(
        'user'
    ).prefetch_related('allergies')

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):

        if self.request.user.is_admin:
            return AdminPatientSerializer

        if self.request.method in ['PUT', 'PATCH']:
            return PatientCreateUpdateSerializer

        return PatientSerializer

    def get_queryset(self):

        user = self.request.user

        if user.is_admin:
            return Patient.objects.select_related(
                'user'
            ).prefetch_related('allergies')

        if user.is_doctor:
            return Patient.objects.select_related(
                'user'
            ).prefetch_related('allergies')

        if user.is_patient:
            return Patient.objects.filter(
                user=user
            ).select_related('user')

        return Patient.objects.none()

class PatientProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [IsPatient]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PatientCreateUpdateSerializer
        return PatientSerializer

    def get_object(self):
        patient, _ = Patient.objects.get_or_create(user=self.request.user)
        return patient


class AllergyListCreateView(generics.ListCreateAPIView):
    serializer_class = AllergySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_patient:
            return Allergy.objects.filter(patient__user=self.request.user)
        return Allergy.objects.none()

    def perform_create(self, serializer):
        patient = Patient.objects.get(user=self.request.user)
        serializer.save(patient=patient)


class AllergyDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AllergySerializer
    permission_classes = [IsOwnerOrAdmin]

    def get_queryset(self):
        if self.request.user.is_patient:
            return Allergy.objects.filter(patient__user=self.request.user)
        if self.request.user.is_admin:
            return Allergy.objects.all()
        return Allergy.objects.none()


class HealthEducationResourceListView(generics.ListAPIView):
    queryset = HealthEducationResource.objects.filter(is_published=True)
    serializer_class = HealthEducationResourceSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['category']
    search_fields = ['title', 'content']


class HealthEducationResourceDetailView(generics.RetrieveAPIView):
    queryset = HealthEducationResource.objects.filter(is_published=True)
    serializer_class = HealthEducationResourceSerializer
    permission_classes = [AllowAny]


class HealthEducationResourceAdminView(generics.ListCreateAPIView):
    queryset = HealthEducationResource.objects.all()
    serializer_class = HealthEducationResourceSerializer
    permission_classes = [IsAdmin]


class HealthEducationResourceAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = HealthEducationResource.objects.all()
    serializer_class = HealthEducationResourceSerializer
    permission_classes = [IsAdmin]
