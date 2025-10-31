from django.db import models
from django.contrib.auth.models import AbstractUser

# User roles
USER_ROLES = (
    ('farmer', 'Farmer'),
    ('labour', 'Labour'),
)

# Custom user model
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    role = models.CharField(max_length=10, choices=USER_ROLES)
    
    # Location fields for both farmers and labours
    address = models.CharField(max_length=300, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_available = models.BooleanField(default=True)  # For labours to indicate availability
    
    # Make email the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'phone', 'role']
    
    def __str__(self):
        return f"{self.first_name} ({self.get_role_display()})"

# Equipment listing model
def equipment_image_path(instance, filename):
    # File will be uploaded to MEDIA_ROOT/equipment_images/<id>/<filename>
    return f'equipment_images/{instance.id}/{filename}'

class Equipment(models.Model):
    CONDITION_CHOICES = [
        ('New', 'New'),
        ('Used - Like New', 'Used - Like New'),
        ('Used - Good', 'Used - Good'),
        ('Used - Fair', 'Used - Fair'),
    ]
    
    CATEGORY_CHOICES = [
        ('Tractors', 'Tractors'),
        ('Irrigation', 'Irrigation'),
        ('Seeds', 'Seeds'),
        ('Fertilizers', 'Fertilizers'),
        ('Tools', 'Tools'),
        ('Other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    location = models.CharField(max_length=200)
    image = models.ImageField(upload_to=equipment_image_path, null=True, blank=True)
    posted_date = models.DateTimeField(auto_now_add=True)
    seller = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='equipment_listings')
    
    class Meta:
        ordering = ['-posted_date']
    
    def __str__(self):
        return f"{self.title} - {self.get_condition_display()} - {self.price}₹"

# Example Todo model
class Todo(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

# Buyer inquiry model capturing contact details sent to a seller about an equipment
class Inquiry(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='inquiries')
    seller = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received_inquiries')
    buyer_name = models.CharField(max_length=120)
    buyer_email = models.EmailField()
    buyer_phone = models.CharField(max_length=20, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Inquiry for {self.equipment.title} by {self.buyer_name}"

# Job model for farmers to post agricultural work opportunities
class Job(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    CATEGORY_CHOICES = [
        ('planting', 'Planting'),
        ('harvesting', 'Harvesting'),
        ('irrigation', 'Irrigation'),
        ('pest_control', 'Pest Control'),
        ('maintenance', 'Maintenance'),
        ('transport', 'Transport'),
        ('other', 'Other'),
    ]
    
    farmer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='posted_jobs')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    wage_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.PositiveIntegerField()
    required_workers = models.PositiveIntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Location fields
    address = models.CharField(max_length=300)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    radius_km = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)  # Initial search radius
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.get_category_display()} - {self.wage_per_day}₹/day"

# Job application model for labours to apply for jobs
class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    labour = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='job_applications')
    message = models.TextField(blank=True)
    # Optional alternate contact details the labour wants to share with farmer
    contact_name = models.CharField(max_length=150, blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['job', 'labour']  # Prevent duplicate applications
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.labour.first_name} applied for {self.job.title}"

# Simple notification model for notifying sellers about buyer inquiries
class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    # Snapshot fields for quick display
    equipment = models.ForeignKey(Equipment, on_delete=models.SET_NULL, null=True, blank=True)
    inquiry = models.ForeignKey(Inquiry, on_delete=models.SET_NULL, null=True, blank=True)
    job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True, blank=True)
    job_application = models.ForeignKey(JobApplication, on_delete=models.SET_NULL, null=True, blank=True)
    buyer_name = models.CharField(max_length=120, blank=True)
    buyer_email = models.EmailField(blank=True)
    buyer_phone = models.CharField(max_length=20, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.user.email}: {self.title}"