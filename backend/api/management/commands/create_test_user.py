from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates a test user with the specified credentials'

    def handle(self, *args, **options):
        user_data = {
            'username': 'harsh',
            'email': 'harshagnani7@gmail.com',
            'name': 'harsh agnani',
            'phone': '9511858753',
            'password': 'Sushant@23',
            'role': 'farmer'
        }
        
        try:
            # Check if user already exists
            if User.objects.filter(email=user_data['email']).exists():
                self.stdout.write(self.style.WARNING('User with this email already exists'))
                return
                
            # Create new user
            user = User.objects.create_user(
                username=user_data['username'],
                email=user_data['email'],
                name=user_data['name'],
                phone=user_data['phone'],
                role=user_data['role'],
                password=user_data['password']
            )
            
            self.stdout.write(self.style.SUCCESS(f'Successfully created user: {user.email}'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating user: {str(e)}'))
