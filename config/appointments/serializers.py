from rest_framework import serializers
from doctors.serializers import DoctorSerializer
from patients.serializers import PatientSerializer
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source='patient', read_only=True)
    doctor_detail = DoctorSerializer(source='doctor', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    type_display = serializers.CharField(source='get_appointment_type_display', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_detail', 'doctor', 'doctor_detail',
            'department', 'date', 'time', 'end_time', 'appointment_type',
            'type_display', 'status', 'status_display', 'reason', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['doctor', 'department', 'date', 'time', 'appointment_type', 'reason']

    def validate(self, attrs):
        doctor = attrs['doctor']
        date = attrs['date']
        time = attrs['time']
        
        # Check for existing appointments
        if Appointment.objects.filter(
            doctor=doctor,
            date=date,
            time=time,
            status__in=['scheduled', 'confirmed']
        ).exists():
            raise serializers.ValidationError('This time slot is already booked')
        
        return attrs


class AppointmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['date', 'time', 'appointment_type', 'status', 'reason', 'notes']
