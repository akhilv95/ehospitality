from rest_framework import serializers
from .models import Facility, Department, Resource


class ResourceSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_resource_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Resource
        fields = [
            'id', 'name', 'resource_type', 'type_display',
            'status', 'status_display', 'description', 'location',
            'facility', 'department'
        ]


class DepartmentSerializer(serializers.ModelSerializer):
    resources = ResourceSerializer(many=True, read_only=True)

    class Meta:
        model = Department
        fields = [
            'id', 'facility', 'name', 'description',
            'head_of_department', 'phone_extension', 'floor',
            'is_active', 'resources'
        ]


class FacilitySerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)

    class Meta:
        model = Facility
        fields = [
            'id', 'name', 'address', 'city', 'state', 'postal_code',
            'phone', 'email', 'website', 'is_active',
            'departments', 'created_at', 'updated_at'
        ]
