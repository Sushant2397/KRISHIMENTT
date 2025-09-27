from rest_framework import serializers
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'
# api/serializers.py
from .models import CustomUser
from django.contrib.auth import authenticate

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
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'name', 'phone', 'role', 'password', 'confirm_password')
        extra_kwargs = {
            'name': {'required': True},
            'email': {'required': True},
            'phone': {'required': True},
            'role': {'required': True},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('confirm_password'):
            raise serializers.ValidationError("Passwords do not match")
        return attrs
    
    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    
    def create(self, validated_data):
        # Remove confirm_password as it's not a model field
        validated_data.pop('confirm_password', None)
        
        # Create the user with all fields
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            name=validated_data['name'],
            phone=validated_data['phone'],
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
