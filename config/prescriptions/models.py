from django.db import models
from patients.models import Patient
from doctors.models import Doctor
from appointments.models import Appointment


class Prescription(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='prescriptions')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='prescriptions')
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True, blank=True)
    diagnosis = models.TextField()
    notes = models.TextField(blank=True)
    pharmacy_name = models.CharField(max_length=200, blank=True)
    pharmacy_address = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Rx-{self.id} - {self.patient.user.get_full_name()}"


class Medication(models.Model):
    class Frequency(models.TextChoices):
        ONCE_DAILY = 'once_daily', 'Once Daily'
        TWICE_DAILY = 'twice_daily', 'Twice Daily'
        THREE_TIMES = 'three_times', 'Three Times Daily'
        FOUR_TIMES = 'four_times', 'Four Times Daily'
        AS_NEEDED = 'as_needed', 'As Needed'
        WEEKLY = 'weekly', 'Weekly'

    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='medications')
    name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=20, choices=Frequency.choices)
    duration_days = models.PositiveIntegerField()
    instructions = models.TextField(blank=True)
    quantity = models.PositiveIntegerField(default=1)
    refills_allowed = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.name} - {self.dosage}"


class DrugInteractionWarning(models.Model):
    drug_a = models.CharField(max_length=200)
    drug_b = models.CharField(max_length=200)
    severity = models.CharField(max_length=20, choices=[
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('severe', 'Severe'),
    ])
    description = models.TextField()

    class Meta:
        unique_together = ['drug_a', 'drug_b']

    def __str__(self):
        return f"{self.drug_a} + {self.drug_b} ({self.severity})"
