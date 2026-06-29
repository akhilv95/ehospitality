from health_resources.models import HealthResource
from rest_framework import serializers
class AppoinmentSerializer(serializers.ModelSerializer):
    class Meta:
        model=HealthResource
        fields="__all__"