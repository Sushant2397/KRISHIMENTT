from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from .models import Equipment, Inquiry, Notification

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='first_name', read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'name', 'phone', 'role')
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
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Notification
        fields = (
            'id', 'title', 'message', 'created_at', 'is_read',
            'equipment', 'equipment_title', 'inquiry',
            'buyer_name', 'buyer_email', 'buyer_phone'
        )
        read_only_fields = ('created_at',)
