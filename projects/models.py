from django.db import models
from clients.models import Client
from django.contrib.auth.models import User

# Create your models here.
class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    
    client = models.ForeignKey(
        Client, 
        on_delete=models.CASCADE
    )
    
    created_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE
    )
    
    def __str__(self):
        return self.title