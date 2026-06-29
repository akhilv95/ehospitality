from django.contrib import admin
from .models import Facility, Department, Resource


@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'state', 'phone', 'is_active']
    list_filter = ['is_active', 'city']
    search_fields = ['name', 'city']


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'facility', 'head_of_department', 'is_active']
    list_filter = ['is_active', 'facility']


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['name', 'resource_type', 'status', 'facility', 'department']
    list_filter = ['resource_type', 'status']
