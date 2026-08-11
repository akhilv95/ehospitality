from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Doctor, DoctorSchedule, Specialization

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = ['id', 'name', 'description']


class DoctorScheduleSerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)

    class Meta:
        model = DoctorSchedule
        fields = [
            'id', 'day_of_week', 'day_name', 'start_time',
            'end_time', 'slot_duration', 'is_active'
        ]


class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    specializations = SpecializationSerializer(many=True, read_only=True)
    schedules = DoctorScheduleSerializer(many=True, read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = [
            'id', 'user', 'full_name', 'specializations', 'license_number',
            'qualifications', 'experience_years', 'consultation_fee',
            'bio', 'is_available', 'schedules', 'created_at'
        ]

    def get_full_name(self, obj):
        return f"Dr. {obj.user.get_full_name()}"


class DoctorCreateUpdateSerializer(serializers.ModelSerializer):
    specialization_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Doctor
        fields = [
            'license_number', 'qualifications', 'experience_years',
            'consultation_fee', 'bio', 'is_available', 'specialization_ids'
        ]

    def update(self, instance, validated_data):
        specialization_ids = validated_data.pop('specialization_ids', None)
        instance = super().update(instance, validated_data)
        
        if specialization_ids is not None:
            specializations = Specialization.objects.filter(id__in=specialization_ids)
            instance.specializations.set(specializations)
        
        return instance
    
from accounts.models import User
from django.contrib.auth.hashers import make_password

class AdminDoctorCreateSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    phone = serializers.CharField(required=False)
    license_number = serializers.CharField()

    qualifications = serializers.CharField(required=False)

    experience_years = serializers.IntegerField(default=0)

    consultation_fee = serializers.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    bio = serializers.CharField(
    required=False,
    allow_blank=True
)

    specializations = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )

    def create(self, validated_data):
        specializations = validated_data.pop("specializations", [])

        user = User.objects.create(
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            phone=validated_data.get("phone", ""),
            role="doctor",
            password=make_password(validated_data["password"]),
        )

        doctor = Doctor.objects.create(
            user=user,
            license_number=validated_data["license_number"],
            qualifications=validated_data.get("qualifications", ""),
            experience_years=validated_data["experience_years"],
            consultation_fee=validated_data["consultation_fee"],
             bio=validated_data.get(
        "bio",
        ""
    ),
        )

        doctor.specializations.set(specializations)

        return doctor

class AdminDoctorSerializer(serializers.ModelSerializer):

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

    specialization_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    specializations = SpecializationSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Doctor
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'full_name',
            'license_number',
            'qualifications',
            'experience_years',
            'consultation_fee',
            'bio',
            'is_available',
            'specializations',
            'specialization_ids',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'full_name',
            'specializations',
            'created_at',
        ]

    def get_full_name(self, obj):
        return f"Dr. {obj.user.get_full_name()}"

    def update(self, instance, validated_data):

        user_data = validated_data.pop(
            'user',
            {}
        )

        specialization_ids = validated_data.pop(
            'specialization_ids',
            None
        )

        # -----------------------
        # Update User
        # -----------------------

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

        # -----------------------
        # Update Doctor
        # -----------------------

        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()

        # -----------------------
        # Update Specializations
        # -----------------------

        if specialization_ids is not None:
            specializations = Specialization.objects.filter(
                id__in=specialization_ids
            )

            instance.specializations.set(
                specializations
            )

        return instance

class DoctorAdminUpdateSerializer(serializers.ModelSerializer):

    first_name = serializers.CharField(
        source="user.first_name",
        required=False
    )

    last_name = serializers.CharField(
        source="user.last_name",
        required=False
    )

    email = serializers.EmailField(
        source="user.email",
        required=False
    )

    phone = serializers.CharField(
        source="user.phone",
        required=False,
        allow_blank=True
    )

    specialization_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Doctor

        fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "license_number",
            "qualifications",
            "experience_years",
            "consultation_fee",
            "bio",
            "is_available",
            "specialization_ids",
        ]

    def update(self, instance, validated_data):

        user_data = validated_data.pop(
            "user",
            {}
        )

        specialization_ids = validated_data.pop(
            "specialization_ids",
            None
        )

        # Update Doctor
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # Update User
        user = instance.user

        for attr, value in user_data.items():
            setattr(user, attr, value)

        user.save()

        # Update specializations
        if specialization_ids is not None:

            specializations = Specialization.objects.filter(
                id__in=specialization_ids
            )

            instance.specializations.set(
                specializations
            )

        return instance
