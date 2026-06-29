from django.contrib import admin
from .models import Prescription, Medication, DrugInteractionWarning


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'doctor', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['patient__user__first_name', 'doctor__user__first_name']


@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ['name', 'dosage', 'frequency', 'duration_days']


@admin.register(DrugInteractionWarning)
class DrugInteractionWarningAdmin(admin.ModelAdmin):
    list_display = ['drug_a', 'drug_b', 'severity']
