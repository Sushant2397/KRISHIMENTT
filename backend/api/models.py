from django.db import models
from django.contrib.auth.models import AbstractUser

# User roles
USER_ROLES = (
    ('farmer', 'Farmer'),
    ('labour', 'Labour'),
)

# Custom user model
class CustomUser(AbstractUser):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    role = models.CharField(max_length=10, choices=USER_ROLES)
    
    # Make username and email required
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name', 'phone', 'role']
    
    def __str__(self):
        return f"{self.name} ({self.get_role_display()})"

# Example Todo model
class Todo(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
