from django.db import models
from django.conf import settings


class Patient(models.Model):
    class BloodGroup(models.TextChoices):
        A_POSITIVE = 'A+', 'A+'
        A_NEGATIVE = 'A-', 'A-'
        B_POSITIVE = 'B+', 'B+'
        B_NEGATIVE = 'B-', 'B-'
        AB_POSITIVE = 'AB+', 'AB+'
        AB_NEGATIVE = 'AB-', 'AB-'
        O_POSITIVE = 'O+', 'O+'
        O_NEGATIVE = 'O-', 'O-'

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='patient_profile'
    )
    blood_group = models.CharField(max_length=5, choices=BloodGroup.choices, blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text='Height in cm')
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text='Weight in kg')
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    insurance_provider = models.CharField(max_length=100, blank=True)
    insurance_policy_number = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Patient: {self.user.get_full_name()}"


class Allergy(models.Model):
    class Severity(models.TextChoices):
        MILD = 'mild', 'Mild'
        MODERATE = 'moderate', 'Moderate'
        SEVERE = 'severe', 'Severe'

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='allergies')
    allergen = models.CharField(max_length=100)
    reaction = models.TextField(blank=True)
    severity = models.CharField(max_length=20, choices=Severity.choices, default=Severity.MILD)
    diagnosed_date = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name_plural = 'Allergies'

    def __str__(self):
        return f"{self.patient.user.get_full_name()} - {self.allergen}"


class HealthEducationResource(models.Model):
    class Category(models.TextChoices):
        WELLNESS = 'wellness', 'Wellness'
        NUTRITION = 'nutrition', 'Nutrition'
        EXERCISE = 'exercise', 'Exercise'
        MENTAL_HEALTH = 'mental_health', 'Mental Health'
        DISEASE_PREVENTION = 'disease_prevention', 'Disease Prevention'
        CHRONIC_CONDITIONS = 'chronic_conditions', 'Chronic Conditions'

    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=30, choices=Category.choices)
    image = models.ImageField(upload_to='health_resources/', null=True, blank=True)
    video_url = models.URLField(blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
