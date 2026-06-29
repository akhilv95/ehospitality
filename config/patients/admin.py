from django.contrib import admin
from .models import Patient, Allergy, HealthEducationResource


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['get_full_name', 'blood_group', 'insurance_provider']
    search_fields = ['user__first_name', 'user__last_name', 'user__email']

    def get_full_name(self, obj):
        return obj.user.get_full_name()
    get_full_name.short_description = 'Name'


@admin.register(Allergy)
class AllergyAdmin(admin.ModelAdmin):
    list_display = ['patient', 'allergen', 'severity']
    list_filter = ['severity']


@admin.register(HealthEducationResource)
class HealthEducationResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'is_published', 'created_at']
    list_filter = ['category', 'is_published']
    search_fields = ['title']
