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
            'blood_group',
            'height',
            'weight',
            'emergency_contact_name',
            'emergency_contact_phone',
            'insurance_provider',
            'insurance_policy_number',
        ]
class HealthEducationResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthEducationResource
        fields = [
            'id', 'title', 'content', 'category',
            'image', 'video_url', 'is_published', 'created_at'
        ]

class AdminPatientSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(
        source='user.first_name',
        required=False
    )

    last_name = serializers.CharField(
        source='user.last_name',
        required=False
    )

    email = serializers.EmailField(
        source='user.email',
        required=False
    )

    phone = serializers.CharField(
        source='user.phone',
        required=False,
        allow_blank=True
    )

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            'id',
            'first_name',
            'last_name',
            'full_name',
            'email',
            'phone',
            'blood_group',
            'height',
            'weight',
            'emergency_contact_name',
            'emergency_contact_phone',
            'insurance_provider',
            'insurance_policy_number',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'full_name',
            'created_at',
            'updated_at',
        ]

    def get_full_name(self, obj):
        return obj.user.get_full_name()

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})

        user = instance.user

        if 'first_name' in user_data:
            user.first_name = user_data['first_name']

        if 'last_name' in user_data:
            user.last_name = user_data['last_name']

        if 'email' in user_data:
            user.email = user_data['email']

        if 'phone' in user_data:
            user.phone = user_data['phone']

        user.save()

        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()

        return instance