from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Client(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    created_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE
    )
    
    def __str__(self):
        return self.name