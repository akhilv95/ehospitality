from django.contrib import admin
from .models import Doctor, DoctorSchedule, Specialization


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['get_full_name', 'license_number', 'experience_years', 'consultation_fee', 'is_available']
    list_filter = ['is_available', 'specializations']
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'license_number']

    def get_full_name(self, obj):
        return f"Dr. {obj.user.get_full_name()}"
    get_full_name.short_description = 'Name'


@admin.register(DoctorSchedule)
class DoctorScheduleAdmin(admin.ModelAdmin):
    list_display = ['doctor', 'day_of_week', 'start_time', 'end_time', 'is_active']
    list_filter = ['day_of_week', 'is_active']


@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']
