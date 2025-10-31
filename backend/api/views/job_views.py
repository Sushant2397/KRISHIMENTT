from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count
from django.utils import timezone
from decimal import Decimal
import math

from ..models import Job, JobApplication, CustomUser, Notification
from ..serializers import JobSerializer, JobApplicationSerializer


def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points using Haversine formula"""
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(float(lat1))
    lat2_rad = math.radians(float(lat2))
    delta_lat = math.radians(float(lat2) - float(lat1))
    delta_lon = math.radians(float(lon2) - float(lon1))
    
    a = (math.sin(delta_lat / 2) ** 2 + 
         math.cos(lat1_rad) * math.cos(lat2_rad) * 
         math.sin(delta_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c


def find_available_labours(job_lat, job_lon, radius_km, required_workers):
    """Find available labours within radius, expanding if needed (Uber-like)"""
    max_radius = 50  # Maximum search radius in km
    current_radius = float(radius_km)
    available_labours = []  # Initialize the list
    
    print(f"Searching for labours at {job_lat}, {job_lon} with radius {radius_km}km")
    
    while current_radius <= max_radius:
        # Get all available labours
        labours = CustomUser.objects.filter(
            role='labour',
            is_available=True,
            latitude__isnull=False,
            longitude__isnull=False
        )
        
        print(f"Found {labours.count()} total labours in database")
        
        # Filter by distance for current radius
        current_radius_labours = []
        for labour in labours:
            distance = calculate_distance(
                job_lat, job_lon, 
                labour.latitude, labour.longitude
            )
            if distance <= current_radius:
                current_radius_labours.append({
                    'labour': labour,
                    'distance': distance
                })
        
        print(f"Found {len(current_radius_labours)} labours within {current_radius}km")
        
        # Update the main list with current radius results
        available_labours = current_radius_labours
        
        # If we have enough labours, return them
        if len(available_labours) >= required_workers:
            return available_labours[:required_workers], current_radius
        
        # Expand radius by 5km
        current_radius += 5
    
    # Return all available labours if we can't find enough
    print(f"Final result: {len(available_labours)} labours within {current_radius}km")
    return available_labours, current_radius


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Job.objects.none()
            
        user = self.request.user
        if user.role == 'farmer':
            return Job.objects.filter(farmer=user)
        elif user.role == 'labour':
            # Return jobs that labour can see (within their area)
            if user.latitude and user.longitude:
                jobs = Job.objects.filter(status='open')
                nearby_jobs = []
                for job in jobs:
                    distance = calculate_distance(
                        user.latitude, user.longitude,
                        job.latitude, job.longitude
                    )
                    if distance <= float(job.radius_km):
                        nearby_jobs.append(job.id)
                return Job.objects.filter(id__in=nearby_jobs)
            return Job.objects.none()
        return Job.objects.none()
    
    def perform_create(self, serializer):
        print(f"perform_create called with user: {self.request.user}")
        print(f"User role: {getattr(self.request.user, 'role', 'No role')}")
        print(f"Serializer data: {serializer.validated_data}")
        
        try:
            job = serializer.save()
            print(f"Job created successfully: {job.id}")
            
            # Find available labours and send notifications
            available_labours, final_radius = find_available_labours(
                job.latitude, job.longitude, 
                job.radius_km, job.required_workers
            )
            
            print(f"Found {len(available_labours)} available labours")
            
            # Update job radius if it was expanded
            if final_radius != job.radius_km:
                job.radius_km = final_radius
                job.save()
                print(f"Updated job radius to {final_radius}km")
            
            # Send notifications to available labours
            for labour_data in available_labours:
                labour = labour_data['labour']
                distance = labour_data['distance']
                
                Notification.objects.create(
                    user=labour,
                    title=f"New Job Available: {job.title}",
                    message=f"A new {job.get_category_display()} job is available near you. "
                           f"Wage: ₹{job.wage_per_day}/day, Duration: {job.duration_days} days. "
                           f"Distance: {distance:.1f}km away.",
                    job=job
                )
                print(f"Notification sent to {labour.first_name}")
        except Exception as e:
            print(f"Error in perform_create: {e}")
            raise
    
    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        """Apply for a job (labour only)"""
        if request.user.role != 'labour':
            return Response(
                {'error': 'Only labours can apply for jobs'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        # Fetch job directly by ID instead of using filtered queryset
        try:
            job = Job.objects.get(id=pk)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if already applied
        if JobApplication.objects.filter(job=job, labour=request.user).exists():
            return Response(
                {'error': 'You have already applied for this job'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if job is still open
        if job.status != 'open':
            return Response(
                {'error': 'This job is no longer accepting applications'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check distance
        if request.user.latitude and request.user.longitude:
            distance = calculate_distance(
                request.user.latitude, request.user.longitude,
                job.latitude, job.longitude
            )
            if distance > float(job.radius_km):
                return Response(
                    {'error': f'You are too far from this job location (>{job.radius_km}km)'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Create application
        application_data = {
            'job': job.id,
            'message': request.data.get('message', ''),
            'contact_name': request.data.get('contact_name', ''),
            'contact_phone': request.data.get('contact_phone', ''),
        }
        
        serializer = JobApplicationSerializer(data=application_data, context={'request': request})
        if serializer.is_valid():
            application = serializer.save()
            
            # Notify farmer about new application
            contact_phone = application.contact_phone or request.user.phone or ''
            contact_name = application.contact_name or request.user.first_name or ''
            Notification.objects.create(
                user=job.farmer,
                title=f"New Application for {job.title}",
                message=(
                    f"{request.user.first_name} has applied for your job. "
                    f"Contact: {contact_name} {('(' + contact_phone + ')') if contact_phone else ''}"
                ).strip(),
                job=job,
                job_application=application
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def applications(self, request, pk=None):
        """Get applications for a job (farmer only)"""
        if request.user.role != 'farmer':
            return Response(
                {'error': 'Only farmers can view job applications'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        job = self.get_object()
        applications = JobApplication.objects.filter(job=job)
        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def respond_to_application(self, request, pk=None):
        """Accept or reject an application (farmer only)"""
        if request.user.role != 'farmer':
            return Response(
                {'error': 'Only farmers can respond to applications'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        job = self.get_object()
        application_id = request.data.get('application_id')
        new_status = request.data.get('status')  # 'accepted' or 'rejected'
        
        if not application_id or new_status not in ['accepted', 'rejected']:
            return Response(
                {'error': 'Invalid application_id or status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            application = JobApplication.objects.get(
                id=application_id, 
                job=job, 
                status='pending'
            )
        except JobApplication.DoesNotExist:
            return Response(
                {'error': 'Application not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if we already have enough accepted workers
        if new_status == 'accepted':
            accepted_count = JobApplication.objects.filter(
                job=job, 
                status='accepted'
            ).count()
            if accepted_count >= job.required_workers:
                return Response(
                    {'error': 'Job already has enough workers'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Update application status
        application.status = new_status
        application.responded_at = timezone.now()
        application.save()
        
        # Notify labour about the response
        Notification.objects.create(
            user=application.labour,
            title=f"Application {new_status.title()} for {job.title}",
            message=f"Your application for {job.title} has been {new_status}. "
                   f"{'Congratulations!' if new_status == 'accepted' else 'Better luck next time!'}",
            job=job,
            job_application=application
        )
        
        # If job is full, mark it as in_progress
        if new_status == 'accepted':
            accepted_count = JobApplication.objects.filter(
                job=job, 
                status='accepted'
            ).count()
            if accepted_count >= job.required_workers:
                job.status = 'in_progress'
                job.save()
        
        serializer = JobApplicationSerializer(application)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        """Get nearby jobs for labours"""
        print(f"Nearby jobs request from user: {request.user.email}, role: {request.user.role}")
        
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if request.user.role != 'labour':
            return Response(
                {'error': 'Only labours can view nearby jobs'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get user's location from query params if not set in profile
        user_lat = request.user.latitude
        user_lon = request.user.longitude
        
        # Allow location to be passed as query params for testing
        if not user_lat or not user_lon:
            user_lat = request.query_params.get('latitude')
            user_lon = request.query_params.get('longitude')
            
            if not user_lat or not user_lon:
                return Response(
                    {'error': 'Please update your location to find nearby jobs'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        print(f"Searching for jobs near user location: {user_lat}, {user_lon}")
        
        # Get open jobs
        jobs = Job.objects.filter(status='open')
        print(f"Found {jobs.count()} open jobs in database")
        
        nearby_jobs = []
        
        for job in jobs:
            distance = calculate_distance(
                user_lat, user_lon,
                job.latitude, job.longitude
            )
            print(f"Job {job.id} ({job.title}) is {distance:.1f}km away (radius: {job.radius_km}km)")
            
            if distance <= float(job.radius_km):
                job_data = JobSerializer(job).data
                job_data['distance_from_user'] = round(distance, 1)
                nearby_jobs.append(job_data)
                print(f"Added job {job.id} to nearby jobs")
        
        print(f"Found {len(nearby_jobs)} nearby jobs")
        
        # Sort by distance
        nearby_jobs.sort(key=lambda x: x['distance_from_user'])
        
        return Response(nearby_jobs)
    
    @action(detail=False, methods=['get'])
    def labour_count(self, request):
        """Get count of available labours in area (for farmers)"""
        print(f"Labour count request from user: {request.user.email}, role: {request.user.role}")
        
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if request.user.role != 'farmer':
            return Response(
                {'error': 'Only farmers can check labour availability'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        lat = request.query_params.get('latitude')
        lon = request.query_params.get('longitude')
        radius = request.query_params.get('radius', 5)
        
        print(f"Labour count request params: lat={lat}, lon={lon}, radius={radius}")
        
        if not lat or not lon:
            return Response(
                {'error': 'Latitude and longitude are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            available_labours, final_radius = find_available_labours(
                lat, lon, radius, 1  # Just checking availability, not specific count
            )
            
            return Response({
                'available_labours_count': len(available_labours),
                'search_radius_used': final_radius,
                'labours': [
                    {
                        'id': labour['labour'].id,
                        'name': labour['labour'].first_name,
                        'phone': labour['labour'].phone,
                        'distance': round(labour['distance'], 1),
                        'latitude': float(labour['labour'].latitude),
                        'longitude': float(labour['labour'].longitude)
                    }
                    for labour in available_labours
                ]
            })
        except Exception as e:
            return Response(
                {'error': f'Error finding labours: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return JobApplication.objects.none()
            
        user = self.request.user
        if user.role == 'farmer':
            # Farmers can see applications for their jobs
            return JobApplication.objects.filter(job__farmer=user)
        elif user.role == 'labour':
            # Labours can see their own applications
            return JobApplication.objects.filter(labour=user)
        return JobApplication.objects.none()
