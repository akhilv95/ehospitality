
from rest_framework import serializers
from patients.serializers import PatientSerializer
from doctors.serializers import DoctorSerializer
from .models import Prescription, Medication, DrugInteractionWarning


class MedicationSerializer(serializers.ModelSerializer):
    frequency_display = serializers.CharField(source='get_frequency_display', read_only=True)

    class Meta:
        model = Medication
        fields = [
            'id', 'name', 'dosage', 'frequency', 'frequency_display',
            'duration_days', 'instructions', 'quantity', 'refills_allowed'
        ]


class PrescriptionSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source='patient', read_only=True)
    doctor_detail = DoctorSerializer(source='doctor', read_only=True)
    medications = MedicationSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Prescription
        fields = [
            'id', 'patient', 'patient_detail', 'doctor', 'doctor_detail',
            'appointment', 'diagnosis', 'notes', 'pharmacy_name',
            'pharmacy_address', 'status', 'status_display',
            'medications', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PrescriptionCreateSerializer(serializers.ModelSerializer):
    medications = MedicationSerializer(many=True)

    class Meta:
        model = Prescription
        fields = [
            'patient', 'appointment', 'diagnosis', 'notes',
            'pharmacy_name', 'pharmacy_address', 'medications'
        ]

    def create(self, validated_data):
        medications_data = validated_data.pop('medications')
        prescription = Prescription.objects.create(**validated_data)
        
        for med_data in medications_data:
            Medication.objects.create(prescription=prescription, **med_data)
        
        return prescription


class DrugInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrugInteractionWarning
        fields = ['id', 'drug_a', 'drug_b', 'severity', 'description']
