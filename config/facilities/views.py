from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from accounts.permissions import IsAdmin
from .models import Facility, Department, Resource
from .serializers import FacilitySerializer, DepartmentSerializer, ResourceSerializer


class FacilityListView(generics.ListAPIView):
    queryset = Facility.objects.filter(is_active=True).prefetch_related('departments')
    serializer_class = FacilitySerializer
    permission_classes = [AllowAny]
    search_fields = ['name', 'city', 'state']


class FacilityDetailView(generics.RetrieveAPIView):
    queryset = Facility.objects.prefetch_related('departments__resources')
    serializer_class = FacilitySerializer
    permission_classes = [AllowAny]


class FacilityAdminView(generics.ListCreateAPIView):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    permission_classes = [IsAdmin]


class FacilityAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    permission_classes = [IsAdmin]


class DepartmentListView(generics.ListAPIView):
    queryset = Department.objects.filter(is_active=True)
    serializer_class = DepartmentSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['facility']


class DepartmentAdminView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdmin]


class DepartmentAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdmin]


class ResourceListView(generics.ListAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['facility', 'department', 'resource_type', 'status']


class ResourceAdminView(generics.ListCreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAdmin]


class ResourceAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAdmin]
