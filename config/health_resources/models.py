from django.db import models

class HealthResource(models.Model):

    CATEGORY_CHOICES = (
        ('Nutrition', 'Nutrition'),
        ('Diabetes', 'Diabetes'),
        ('Heart Health', 'Heart Health'),
        ('Mental Health', 'Mental Health'),
        ('Fitness', 'Fitness'),
        ('General', 'General'),
    )

    title = models.CharField(max_length=200)

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES
    )

    image = models.ImageField(
        upload_to='health_resources/',
        blank=True,
        null=True
    )

    content = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title