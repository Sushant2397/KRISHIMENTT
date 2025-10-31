from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import make_password
from ..serializers import UserSerializer, RegisterSerializer

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        # Use RegisterSerializer for validation
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                # Create the user with the validated data
                user = serializer.save()
                
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'user': UserSerializer(user).data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Debug logging
        print(f"Attempting to authenticate user: {username}")
        
        # Try to get the user first to check if they exist
        try:
            user = User.objects.get(username=username)
            print(f"User found: {user.username}, checking password...")
            
            # Manually check the password
            if not user.check_password(password):
                print("Password check failed")
                return Response(
                    {'error': 'Invalid username or password'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
            # If password is correct, generate tokens
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data
            print("Authentication successful")
            return Response({
                'user': user_data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
            
        except User.DoesNotExist:
            print(f"User {username} does not exist")
            return Response(
                {'error': 'Invalid username or password'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            print(f"Error during authentication: {str(e)}")
            return Response(
                {'error': 'An error occurred during authentication'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({'is_available': user.is_available})

    def put(self, request):
        user = request.user
        is_available = request.data.get('is_available')
        if is_available is None:
            return Response({'error': 'is_available is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user.is_available = bool(is_available) if isinstance(is_available, bool) else str(is_available).lower() in ['true', '1', 'yes']
            user.save(update_fields=['is_available'])
            return Response({'is_available': user.is_available})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)