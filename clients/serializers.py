from rest_framework import serializers
from .models import Client
import re

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ['created_by']
        
    def validate_name(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters long.")
        return value
    
    def validate_phone(self, value):

        if not re.match(r'^\d{10,15}$', value):
            raise serializers.ValidationError(
                "Phone number must contain 10 to 15 digits."
            )

        return value
    
    def validate_email(self, value):
        
        request = self.context.get('request')

        if request:

            existing_client = Client.objects.filter(
                email=value,
                created_by=request.user
            )
            
            if self.instance:
                existing_client = existing_client.exclude(
                id=self.instance.id
            )

            if existing_client.exists():
                raise serializers.ValidationError(
                    "A client with this email already exists."
                )

        return value