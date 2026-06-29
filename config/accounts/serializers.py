from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User
from patients.models import Patient


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'phone', 'date_of_birth', 'address',
            'profile_picture', 'is_verified', 'created_at'
        ]
        read_only_fields = ['id', 'is_verified', 'created_at']

    def get_full_name(self, obj):
        return obj.get_full_name()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    # Patient fields
    blood_group = serializers.CharField(required=False)
    height = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)
    weight = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)
    emergency_contact_name = serializers.CharField(required=False)
    emergency_contact_phone = serializers.CharField(required=False)
    insurance_provider = serializers.CharField(required=False)
    insurance_policy_number = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "password_confirm",
            "first_name",
            "last_name",
            "role",
            "phone",
            "date_of_birth",
            "address",

            "blood_group",
            "height",
            "weight",
            "emergency_contact_name",
            "emergency_contact_phone",
            "insurance_provider",
            "insurance_policy_number",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match"}
            )
        return attrs

    def create(self, validated_data):

        validated_data.pop("password_confirm")

        patient_data = {
            "blood_group": validated_data.pop("blood_group", ""),
            "height": validated_data.pop("height", None),
            "weight": validated_data.pop("weight", None),
            "emergency_contact_name": validated_data.pop(
                "emergency_contact_name", ""
            ),
            "emergency_contact_phone": validated_data.pop(
                "emergency_contact_phone", ""
            ),
            "insurance_provider": validated_data.pop(
                "insurance_provider", ""
            ),
            "insurance_policy_number": validated_data.pop(
                "insurance_policy_number", ""
            ),
        }

        user = User.objects.create_user(**validated_data)

        if user.role == "patient":
            patient, _ = Patient.objects.get_or_create(user=user)

            patient.blood_group = patient_data.get("blood_group", "")
            patient.height = patient_data.get("height")
            patient.weight = patient_data.get("weight")
            patient.emergency_contact_name = patient_data.get("emergency_contact_name", "")
            patient.emergency_contact_phone = patient_data.get("emergency_contact_phone", "")
            patient.insurance_provider = patient_data.get("insurance_provider", "")
            patient.insurance_policy_number = patient_data.get("insurance_policy_number", "")
            patient.save()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(email=attrs['email'], password=attrs['password'])
        if not user:
            raise serializers.ValidationError('Invalid credentials')
        if not user.is_active:
            raise serializers.ValidationError('Account is disabled')
        attrs['user'] = user
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect')
        return value

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
