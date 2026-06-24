from django.db import models
from projects.models import Project
from django.contrib.auth.models import User

# Create your models here.
class Task(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]
    
    PRIORITY_CHOICES = [
        ('3', 'Low'),
        ('2', 'Medium'),
        ('1', 'High'),
    ]
    
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES,
        default='Pending'
    )
    
    priority = models.CharField(
        max_length=10, 
        choices=PRIORITY_CHOICES,
        default='1'
    )
    
    project = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE
    )
    
    created_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.title
    
class TaskAttachment(models.Model):
    
    task = models.ForeignKey(
        Task, 
        on_delete=models.CASCADE, 
        related_name='attachments'
    )
    
    file = models.FileField(
        upload_to='task_attachments/'
    )
    
    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"Attachment for {self.task.title}"