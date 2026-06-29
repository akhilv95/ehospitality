from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import time

from .models import Doctor, DoctorSchedule


@receiver(post_save, sender=Doctor)
def create_default_schedule(sender, instance, created, **kwargs):
    if created:
        for day in range(5):   # Monday to Friday
            DoctorSchedule.objects.create(
                doctor=instance,
                day_of_week=day,
                start_time=time(9, 0),
                end_time=time(17, 0),
                slot_duration=30,
                is_active=True,
            )