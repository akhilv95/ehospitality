from rest_framework import serializers
from patients.serializers import PatientSerializer
from doctors.serializers import DoctorSerializer
from .models import MedicalRecord, LabResult


class LabResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabResult
        fields = [
            'id', 'test_name', 'result', 'normal_range',
            'unit', 'is_abnormal', 'test_date', 'report_file'
        ]


class MedicalRecordSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source='patient', read_only=True)
    doctor_detail = DoctorSerializer(source='doctor', read_only=True)
    lab_results = LabResultSerializer(many=True, read_only=True)

    class Meta:
        model = MedicalRecord
        fields = [
            'id', 'patient', 'patient_detail', 'doctor', 'doctor_detail',
            'appointment', 'diagnosis', 'symptoms', 'treatment',
            'vital_signs', 'attachments', 'is_confidential',
            'lab_results', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MedicalRecordCreateSerializer(serializers.ModelSerializer):
    class Meta:
        
        model = MedicalRecord
        fields = [
        "patient",
        "appointment",
        "diagnosis",
        "symptoms",
        "treatment",
        "vital_signs",
        "attachments",
        "is_confidential",
    ]