from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import RegisterSerializer, LoginSerializer, TodoSerializer
from rest_framework import viewsets
from .models import Todo

# ---------------- Todo ViewSet ----------------
class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

# ---------------- Auth Views ----------------
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response({'user': serializer.data, 'tokens': tokens}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        tokens = get_tokens_for_user(user)
        return Response({
            'user': {
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'name': user.name
            }, 
            'tokens': tokens
        }, status=status.HTTP_200_OK)




from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def buy_equipment(request):
    try:
        buyer_name = request.data.get('buyer_name')
        buyer_email = request.data.get('buyer_email')
        seller_email = request.data.get('seller_email')
        equipment_name = request.data.get('equipment_name')

        subject = f"{buyer_name} is interested in your equipment: {equipment_name}"
        message = f"""
        Hello Seller,

        {buyer_name} ({buyer_email}) wants to buy your equipment: {equipment_name}.
        Please get in touch with them directly.

        Thank you,
        Krishiment Team
        """

        send_mail(
            subject,
            message,
            'krishimentapp@gmail.com',  # use your sender Gmail
            [seller_email],
            fail_silently=False,
        )

        return Response({"message": "Email sent successfully!"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
