from django.contrib import admin
from .models import MedicalRecord, LabResult


@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'diagnosis', 'is_confidential', 'created_at']
    list_filter = ['is_confidential']
    search_fields = ['patient__user__first_name', 'doctor__user__first_name', 'diagnosis']


@admin.register(LabResult)
class LabResultAdmin(admin.ModelAdmin):
    list_display = ['test_name', 'test_date', 'is_abnormal']
    list_filter = ['is_abnormal']
