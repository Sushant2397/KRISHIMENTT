from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()

class Command(BaseCommand):
    help = 'Create test labours with location data'

    def handle(self, *args, **options):
        # Create test labours with different locations
        test_labours = [
            {
                'username': 'labour1',
                'email': 'labour1@test.com',
                'first_name': 'Rajesh',
                'phone': '9876543210',
                'role': 'labour',
                'latitude': Decimal('19.0760'),  # Mumbai
                'longitude': Decimal('72.8777'),
                'address': 'Mumbai, Maharashtra',
                'is_available': True
            },
            {
                'username': 'labour2',
                'email': 'labour2@test.com',
                'first_name': 'Suresh',
                'phone': '9876543211',
                'role': 'labour',
                'latitude': Decimal('19.0760'),  # Close to Mumbai
                'longitude': Decimal('72.8777'),
                'address': 'Mumbai, Maharashtra',
                'is_available': True
            },
            {
                'username': 'labour3',
                'email': 'labour3@test.com',
                'first_name': 'Kumar',
                'phone': '9876543212',
                'role': 'labour',
                'latitude': Decimal('19.1000'),  # Slightly away from Mumbai
                'longitude': Decimal('72.9000'),
                'address': 'Thane, Maharashtra',
                'is_available': True
            },
            {
                'username': 'labour4',
                'email': 'labour4@test.com',
                'first_name': 'Vikram',
                'phone': '9876543213',
                'role': 'labour',
                'latitude': Decimal('19.2000'),  # Further away
                'longitude': Decimal('73.0000'),
                'address': 'Nashik, Maharashtra',
                'is_available': True
            }
        ]

        for labour_data in test_labours:
            user, created = User.objects.get_or_create(
                email=labour_data['email'],
                defaults=labour_data
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(
                    self.style.SUCCESS(f'Created labour: {user.first_name} ({user.email})')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Labour already exists: {user.first_name} ({user.email})')
                )

        self.stdout.write(
            self.style.SUCCESS('Test labours created successfully!')
        )
