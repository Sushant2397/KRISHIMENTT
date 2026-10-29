from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, get_user_model
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
                
            except Exception:
                return Response(
                    {'error': 'Registration could not be completed. Please try again.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        identifier = request.data.get('username')
        password = request.data.get('password')
        
        if not identifier or not password:
            return Response(
                {'error': 'Username or email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Keep the existing `username` request field while allowing users to
        # sign in with the email address they provided during registration.
        try:
            user = User.objects.filter(username__iexact=identifier).first()
            if user is None:
                user = User.objects.filter(email__iexact=identifier).first()
            
            if user is None or not user.check_password(password):
                return Response(
                    {'error': 'Invalid username/email or password'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
            # If password is correct, generate tokens
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data
            return Response({
                'user': user_data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
            
        except Exception:
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
