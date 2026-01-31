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

# Rating model for farmers to rate laborers after job completion
class LabourRating(models.Model):
    RATING_CHOICES = [
        (1, '1 - Poor'),
        (2, '2 - Fair'),
        (3, '3 - Good'),
        (4, '4 - Very Good'),
        (5, '5 - Excellent'),
    ]
    
    job_application = models.OneToOneField(JobApplication, on_delete=models.CASCADE, related_name='rating')
    farmer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='given_ratings')
    labour = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received_ratings')
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True, help_text='Optional feedback about the laborer')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['job_application', 'farmer']  # One rating per job application
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.farmer.first_name} rated {self.labour.first_name} - {self.rating}/5"

# Skills model for laborers to showcase their skills
class LabourSkill(models.Model):
    SKILL_CATEGORIES = [
        ('planting', 'Planting'),
        ('harvesting', 'Harvesting'),
        ('irrigation', 'Irrigation'),
        ('pest_control', 'Pest Control'),
        ('plowing', 'Plowing'),
        ('fertilizing', 'Fertilizing'),
        ('pruning', 'Pruning'),
        ('livestock', 'Livestock Management'),
        ('machinery', 'Machinery Operation'),
        ('organic_farming', 'Organic Farming'),
        ('other', 'Other'),
    ]
    
    EXPERIENCE_LEVELS = [
        ('beginner', 'Beginner (0-1 years)'),
        ('intermediate', 'Intermediate (1-3 years)'),
        ('advanced', 'Advanced (3-5 years)'),
        ('expert', 'Expert (5+ years)'),
    ]
    
    labour = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='skills')
    skill_name = models.CharField(max_length=100)
    category = models.CharField(max_length=30, choices=SKILL_CATEGORIES)
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVELS)
    years_of_experience = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)
    certifications = models.TextField(blank=True, help_text='Comma-separated list of certifications')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['labour', 'skill_name']  # Prevent duplicate skills
    
    def __str__(self):
        return f"{self.labour.first_name} - {self.skill_name} ({self.get_experience_level_display()})"

# Earnings model to track laborer earnings from completed jobs
class LabourEarning(models.Model):
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('disputed', 'Disputed'),
    ]
    
    job_application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name='earnings')
    labour = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='earnings')
    job_title = models.CharField(max_length=200)
    farmer_name = models.CharField(max_length=150)
    wage_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    days_worked = models.PositiveIntegerField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    payment_date = models.DateField(null=True, blank=True)
    payment_method = models.CharField(max_length=50, blank=True, help_text='Cash, Bank Transfer, UPI, etc.')
    transaction_id = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    job_start_date = models.DateField()
    job_end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.labour.first_name} - {self.job_title} - ₹{self.total_amount}"
    
    def save(self, *args, **kwargs):
        # Auto-calculate total amount
        if not self.total_amount:
            self.total_amount = self.wage_per_day * self.days_worked
        super().save(*args, **kwargs)

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


# Routing: landmarks (mandis, warehouses) for Spatial Landmark Model (SLM)
class Landmark(models.Model):
    """Major locations used as landmarks for long-distance route optimization (SLM)."""
    TYPE_CHOICES = [
        ('mandi', 'Mandi'),
        ('warehouse', 'Warehouse'),
        ('market', 'Market'),
    ]
    name = models.CharField(max_length=200)
    location_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    address = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_location_type_display()})"


class LandmarkDistance(models.Model):
    """Pre-computed distance between two landmarks for fast SLM routing."""
    from_landmark = models.ForeignKey(Landmark, on_delete=models.CASCADE, related_name='distances_from')
    to_landmark = models.ForeignKey(Landmark, on_delete=models.CASCADE, related_name='distances_to')
    distance_km = models.DecimalField(max_digits=10, decimal_places=2)
    travel_time_min = models.PositiveIntegerField(help_text='Estimated travel time in minutes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['from_landmark', 'to_landmark']
        ordering = ['from_landmark', 'to_landmark']

    def __str__(self):
        return f"{self.from_landmark.name} → {self.to_landmark.name}: {self.distance_km}km"