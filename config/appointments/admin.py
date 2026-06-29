from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'date', 'time', 'appointment_type', 'status']
    list_filter = ['status', 'appointment_type', 'date']
    search_fields = ['patient__user__first_name', 'doctor__user__first_name']
    ordering = ['-date', '-time']
