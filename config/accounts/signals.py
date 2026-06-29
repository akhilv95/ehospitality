from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User
from doctors.models import Doctor
from patients.models import Patient


@receiver(post_save, sender=User)
def create_role_profile(sender, instance, created, **kwargs):
    if not created:
        return

    if instance.role == User.Role.DOCTOR:
        Doctor.objects.get_or_create(
            user=instance,
            defaults={
                'license_number': f'DOC-{instance.id}',
                'experience_years': 0,
                'consultation_fee': 0,
                'bio': '',
                'is_available': True,
            }
        )

    elif instance.role == User.Role.PATIENT:
        Patient.objects.get_or_create(user=instance)
