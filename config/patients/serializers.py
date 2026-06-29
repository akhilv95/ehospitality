from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Patient, Allergy, HealthEducationResource


class AllergySerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergy
        fields = ['id', 'allergen', 'reaction', 'severity', 'diagnosed_date']


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    allergies = AllergySerializer(many=True, read_only=True)
    bmi = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            'id', 'user', 'blood_group', 'height', 'weight', 'bmi',
            'emergency_contact_name', 'emergency_contact_phone',
            'insurance_provider', 'insurance_policy_number',
            'allergies', 'created_at', 'updated_at'
        ]

    def get_bmi(self, obj):
        if obj.height and obj.weight:
            height_m = float(obj.height) / 100
            return round(float(obj.weight) / (height_m ** 2), 2)
        return None


class PatientCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            'blood_group', 'height', 'weight',
            'emergency_contact_name', 'emergency_contact_phone',
            'insurance_provider', 'insurance_policy_number'
        ]


class HealthEducationResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthEducationResource
        fields = [
            'id', 'title', 'content', 'category',
            'image', 'video_url', 'is_published', 'created_at'
        ]
