from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from .models import Equipment, Inquiry, Notification, Job, JobApplication, LabourRating, LabourSkill, LabourEarning

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='first_name', read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'name', 'phone', 'role', 'address', 'latitude', 'longitude', 'is_available')
        read_only_fields = ('id',)

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        data['user'] = user
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    name = serializers.CharField(source='first_name', required=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password', 'name', 'phone', 'role')
        extra_kwargs = {
            'email': {'required': True},
            'phone': {'required': True},
            'role': {'required': True}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('confirm_password'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        # Remove confirm_password as it's not a model field
        validated_data.pop('confirm_password', None)
        # Create user with the validated data
        user = User.objects.create_user(**validated_data)
        return user


class EquipmentSerializer(serializers.ModelSerializer):
    seller_name = serializers.SerializerMethodField()
    seller_rating = serializers.FloatField(source='seller.rating', read_only=True)
    posted_date = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Equipment
        fields = [
            'id', 'title', 'description', 'price', 'category', 'condition',
            'location', 'image', 'image_url', 'posted_date', 'seller', 'seller_name', 'seller_rating'
        ]
        read_only_fields = ['seller', 'posted_date', 'image_url', 'seller_name']

    def get_seller_name(self, obj):
        # Use first_name if available, else fallback to username
        return obj.seller.first_name or obj.seller.username or "Seller"

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['seller'] = request.user
        return super().create(validated_data)



class InquirySerializer(serializers.ModelSerializer):
    equipment_title = serializers.CharField(source='equipment.title', read_only=True)
    seller_email = serializers.EmailField(source='seller.email', read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Inquiry
        fields = (
            'id', 'equipment', 'seller', 'buyer_name', 'buyer_email', 'buyer_phone', 'message',
            'created_at', 'equipment_title', 'seller_email'
        )
        read_only_fields = ('seller', 'created_at')

    def create(self, validated_data):
        return super().create(validated_data)

class NotificationSerializer(serializers.ModelSerializer):
    equipment_title = serializers.CharField(source='equipment.title', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Notification
        fields = (
            'id', 'title', 'message', 'created_at', 'is_read',
            'equipment', 'equipment_title', 'inquiry', 'job', 'job_title', 'job_application',
            'buyer_name', 'buyer_email', 'buyer_phone'
        )
        read_only_fields = ('created_at',)

class JobSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.first_name', read_only=True)
    farmer_phone = serializers.CharField(source='farmer.phone', read_only=True)
    applications_count = serializers.SerializerMethodField()
    accepted_applications_count = serializers.SerializerMethodField()
    available_labours_count = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Job
        fields = [
            'id', 'farmer', 'farmer_name', 'farmer_phone', 'title', 'description', 
            'category', 'wage_per_day', 'duration_days', 'required_workers',
            'start_date', 'end_date', 'address', 'latitude', 'longitude', 
            'radius_km', 'status', 'created_at', 'updated_at',
            'applications_count', 'accepted_applications_count', 'available_labours_count'
        ]
        read_only_fields = ['farmer', 'created_at', 'updated_at']

    def validate(self, data):
        print(f"Validating job data: {data}")
        
        # Check if end_date is after start_date
        if 'start_date' in data and 'end_date' in data:
            if data['start_date'] >= data['end_date']:
                raise serializers.ValidationError("End date must be after start date")
        
        # Check if required_workers is positive
        if 'required_workers' in data and data['required_workers'] <= 0:
            raise serializers.ValidationError("Required workers must be greater than 0")
        
        # Check if duration_days is positive
        if 'duration_days' in data and data['duration_days'] <= 0:
            raise serializers.ValidationError("Duration must be greater than 0")
        
        # Check if wage_per_day is positive
        if 'wage_per_day' in data and data['wage_per_day'] <= 0:
            raise serializers.ValidationError("Wage per day must be greater than 0")
        
        return data

    def get_applications_count(self, obj):
        return obj.applications.count()

    def get_accepted_applications_count(self, obj):
        return obj.applications.filter(status='accepted').count()

    def get_available_labours_count(self, obj):
        # This will be calculated in the view using location-based matching
        return 0  # Placeholder, actual count calculated in view

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['farmer'] = request.user
        
        print(f"Creating job with validated data: {validated_data}")
        
        try:
            job = super().create(validated_data)
            print(f"Job created successfully with ID: {job.id}")
            return job
        except Exception as e:
            print(f"Error creating job: {e}")
            print(f"Validated data: {validated_data}")
            raise

class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    job_category = serializers.CharField(source='job.category', read_only=True)
    job_wage = serializers.DecimalField(source='job.wage_per_day', max_digits=10, decimal_places=2, read_only=True)
    labour_name = serializers.CharField(source='labour.first_name', read_only=True)
    labour_phone = serializers.CharField(source='labour.phone', read_only=True)
    applied_at = serializers.DateTimeField(read_only=True)
    responded_at = serializers.DateTimeField(read_only=True)
    has_rating = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'job_category', 'job_wage',
            'labour', 'labour_name', 'labour_phone', 'message',
            'contact_name', 'contact_phone',
            'status', 'applied_at', 'responded_at', 'has_rating', 'rating'
        ]
        read_only_fields = ['labour', 'applied_at', 'responded_at']

    def get_has_rating(self, obj):
        try:
            return hasattr(obj, 'rating') and obj.rating is not None
        except Exception:
            return False

    def get_rating(self, obj):
        try:
            if hasattr(obj, 'rating') and obj.rating:
                return {
                    'id': obj.rating.id,
                    'rating': obj.rating.rating,
                    'comment': obj.rating.comment,
                    'created_at': obj.rating.created_at
                }
        except Exception:
            pass
        return None

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['labour'] = request.user
        
        # Ensure job is set - prefer from context (job object) over validated_data (job ID)
        job = self.context.get('job')
        if job:
            # Use the job object from context if available
            validated_data['job'] = job
        elif 'job' in validated_data and validated_data['job']:
            # If job is an ID in validated_data, ensure it's converted to object
            job_id = validated_data['job']
            if isinstance(job_id, int):
                from ..models import Job
                validated_data['job'] = Job.objects.get(id=job_id)
        
        # Ensure job is set - raise error if not
        if 'job' not in validated_data or validated_data.get('job') is None:
            raise serializers.ValidationError({'job': 'Job is required'})
        
        return super().create(validated_data)

class LabourRatingSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.first_name', read_only=True)
    labour_name = serializers.CharField(source='labour.first_name', read_only=True)
    job_title = serializers.CharField(source='job_application.job.title', read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = LabourRating
        fields = [
            'id', 'job_application', 'farmer', 'farmer_name', 'labour', 'labour_name',
            'rating', 'comment', 'created_at', 'job_title'
        ]
        read_only_fields = ['farmer', 'labour', 'created_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['farmer'] = request.user
            # Get labour from job_application
            job_application = validated_data.get('job_application')
            if job_application:
                validated_data['labour'] = job_application.labour
        return super().create(validated_data)

class LabourSkillSerializer(serializers.ModelSerializer):
    labour_name = serializers.CharField(source='labour.first_name', read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = LabourSkill
        fields = [
            'id', 'labour', 'labour_name', 'skill_name', 'category',
            'experience_level', 'years_of_experience', 'description',
            'certifications', 'created_at', 'updated_at'
        ]
        read_only_fields = ['labour', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['labour'] = request.user
        return super().create(validated_data)

class LabourEarningSerializer(serializers.ModelSerializer):
    labour_name = serializers.CharField(source='labour.first_name', read_only=True)
    job_title_display = serializers.CharField(source='job_title', read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = LabourEarning
        fields = [
            'id', 'job_application', 'labour', 'labour_name', 'job_title', 'job_title_display',
            'farmer_name', 'wage_per_day', 'days_worked', 'total_amount',
            'payment_status', 'payment_date', 'payment_method', 'transaction_id',
            'notes', 'job_start_date', 'job_end_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['labour', 'total_amount', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['labour'] = request.user
            # Auto-calculate total amount
            if 'wage_per_day' in validated_data and 'days_worked' in validated_data:
                validated_data['total_amount'] = validated_data['wage_per_day'] * validated_data['days_worked']
        return super().create(validated_data)
