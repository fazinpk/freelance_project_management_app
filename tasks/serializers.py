from rest_framework import serializers
from .models import Task, TaskAttachment
from projects.serializers import ProjectSerializer

class TaskSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Task
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
    
    def validate_project(self, value):
        request = self.context.get('request')
        if request and value.created_by != request.user:
            raise serializers.ValidationError("You can only assign tasks to your own projects.")
        return value
    
class TaskAttachmentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = TaskAttachment
        fields = '__all__'
        read_only_fields = ['uploaded_at']
        
    def validate_file(self, value):
        if value.size > 5 * 1024 * 1024:  # 5 MB limit
            raise serializers.ValidationError("File size must be less than 5 MB.")
        return value
    
    def validate_task(self, value):
        
        request = self.context.get(
            'request'
        )
        
        if request and value.created_by != request.user:
            raise serializers.ValidationError("You can only attach files to your own tasks.")
        return value