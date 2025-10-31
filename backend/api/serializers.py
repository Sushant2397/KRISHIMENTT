from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from .models import Equipment, Inquiry, Notification, Job, JobApplication

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

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'job_category', 'job_wage',
            'labour', 'labour_name', 'labour_phone', 'message',
            'contact_name', 'contact_phone',
            'status', 'applied_at', 'responded_at'
        ]
        read_only_fields = ['labour', 'applied_at', 'responded_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['labour'] = request.user
        return super().create(validated_data)
