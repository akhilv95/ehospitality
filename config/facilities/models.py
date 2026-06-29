from django.db import models


class Facility(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Facilities'
        ordering = ['name']

    def __str__(self):
        return self.name


class Department(models.Model):
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    head_of_department = models.CharField(max_length=100, blank=True)
    phone_extension = models.CharField(max_length=10, blank=True)
    floor = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ['facility', 'name']
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.facility.name}"


class Resource(models.Model):
    class Type(models.TextChoices):
        ROOM = 'room', 'Room'
        EQUIPMENT = 'equipment', 'Equipment'
        BED = 'bed', 'Bed'
        VEHICLE = 'vehicle', 'Vehicle'

    class Status(models.TextChoices):
        AVAILABLE = 'available', 'Available'
        IN_USE = 'in_use', 'In Use'
        MAINTENANCE = 'maintenance', 'Under Maintenance'
        OUT_OF_SERVICE = 'out_of_service', 'Out of Service'

    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='resources')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=100)
    resource_type = models.CharField(max_length=20, choices=Type.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.AVAILABLE)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_resource_type_display()})"
