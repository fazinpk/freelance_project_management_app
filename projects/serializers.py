from rest_framework import serializers
from .models import Project
from clients.serializers import ClientSerializer

class ProjectSerializer(serializers.ModelSerializer):
    client_details = ClientSerializer(
        source='client',
        read_only=True
    )

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['created_by']
        
    def validate_title(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value
    
    def validate_description(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Description must be at least 10 characters long.")
        return value
    
    def validate_client(self, value):
        request = self.context.get('request')

        if request and not value.created_by == request.user:
            raise serializers.ValidationError(
                "You can only assign projects to clients you have created."
            )

        return value