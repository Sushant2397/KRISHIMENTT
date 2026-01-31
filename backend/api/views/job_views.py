from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count
from django.utils import timezone
from decimal import Decimal
import math

from ..models import Job, JobApplication, CustomUser, Notification, LabourEarning, Landmark, LandmarkDistance
from ..serializers import JobSerializer, JobApplicationSerializer
from ..routing_service import compute_optimal_route


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
        
        # Check distance (only if user has location set)
        if request.user.latitude and request.user.longitude:
            try:
                distance = calculate_distance(
                    float(request.user.latitude), float(request.user.longitude),
                    float(job.latitude), float(job.longitude)
                )
                if distance > float(job.radius_km):
                    return Response(
                        {'error': f'You are too far from this job location ({distance:.1f}km > {job.radius_km}km). Please update your location or find jobs closer to you.'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except (ValueError, TypeError) as e:
                # If distance calculation fails, log but don't block application
                print(f"Distance calculation error: {e}")
        
        # Create application
        application_data = {
            'job': job.id,  # Pass job ID - DRF will convert to ForeignKey
            'message': request.data.get('message', ''),
            'contact_name': request.data.get('contact_name', ''),
            'contact_phone': request.data.get('contact_phone', ''),
        }
        
        serializer = JobApplicationSerializer(data=application_data, context={'request': request, 'job': job})
        
        # Debug: Print what we're sending
        print(f"Application data: {application_data}")
        print(f"Serializer is_valid: {serializer.is_valid()}")
        if not serializer.is_valid():
            print(f"Serializer errors: {serializer.errors}")
        if serializer.is_valid():
            try:
                application = serializer.save()
            except Exception as e:
                print(f"Error saving application: {e}")
                return Response(
                    {'error': f'Failed to create application: {str(e)}'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Notify farmer about new application
            try:
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
            
            except Exception as e:
                print(f"Error creating notification: {e}")
                # Don't fail the application if notification fails
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Return serializer errors in a consistent format
        error_messages = []
        for field, errors in serializer.errors.items():
            if isinstance(errors, list):
                error_messages.extend([f"{field}: {error}" for error in errors])
            else:
                error_messages.append(f"{field}: {errors}")
        
        return Response(
            {'error': ' '.join(error_messages) if error_messages else 'Invalid application data'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
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

    @action(detail=False, methods=['get'], url_path='route')
    def route(self, request):
        """
        Compute optimal route between farmer/job location and destination (labour, mandi, warehouse).
        Uses Dijkstra for local routing and Spatial Landmark Model (SLM) for long-distance.
        Query params: from_lat, from_lon, to_lat, to_lon; optional to_type, to_id, to_label.
        """
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        from_lat = request.query_params.get('from_lat')
        from_lon = request.query_params.get('from_lon')
        to_lat = request.query_params.get('to_lat')
        to_lon = request.query_params.get('to_lon')
        to_type = request.query_params.get('to_type', 'labour')
        to_id = request.query_params.get('to_id')
        to_label = request.query_params.get('to_label', 'Destination')
        if not all([from_lat, from_lon, to_lat, to_lon]):
            return Response(
                {'error': 'from_lat, from_lon, to_lat, to_lon are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            from_lat = float(from_lat)
            from_lon = float(from_lon)
            to_lat = float(to_lat)
            to_lon = float(to_lon)
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid latitude/longitude values'},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Labour nodes: destination plus nearby labours (for graph connectivity)
        labour_nodes = [
            {
                'id': 'dest',
                'lat': to_lat,
                'lon': to_lon,
                'label': to_label or 'Destination',
            }
        ]
        radius_km = 80
        labours = CustomUser.objects.filter(
            role='labour',
            latitude__isnull=False,
            longitude__isnull=False,
        )
        for labour in labours:
            d = calculate_distance(from_lat, from_lon, float(labour.latitude), float(labour.longitude))
            if d <= radius_km:
                labour_nodes.append({
                    'id': f'labour_{labour.id}',
                    'lat': float(labour.latitude),
                    'lon': float(labour.longitude),
                    'label': labour.first_name or labour.email,
                })
        result = compute_optimal_route(
            from_lat, from_lon, to_lat, to_lon,
            labour_nodes,
            Landmark.objects.all(),
            LandmarkDistance.objects.all(),
        )
        return Response(result)


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

    def update(self, request, *args, **kwargs):
        """Custom update to handle status changes"""
        instance = self.get_object()
        
        # Check permissions
        if request.user.role == 'farmer':
            # Farmers can only update applications for their own jobs
            if instance.job.farmer != request.user:
                return Response(
                    {'error': 'You can only update applications for your own jobs'},
                    status=status.HTTP_403_FORBIDDEN
                )
        elif request.user.role == 'labour':
            # Labours can only update their own applications
            if instance.labour != request.user:
                return Response(
                    {'error': 'You can only update your own applications'},
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            return Response(
                {'error': 'Invalid user role'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Only allow status updates
        new_status = request.data.get('status')
        if new_status:
            # Validate status transition
            if instance.status == 'pending' and new_status == 'completed':
                return Response(
                    {'error': 'Cannot mark pending application as completed. Please accept it first.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if instance.status == 'rejected' and new_status == 'completed':
                return Response(
                    {'error': 'Cannot mark rejected application as completed.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update status
            old_status = instance.status
            instance.status = new_status
            if new_status == 'completed' and not instance.responded_at:
                # Set responded_at if marking as completed
                instance.responded_at = timezone.now()
            instance.save()
            
            # Automatically create earning record when job is marked as completed
            if new_status == 'completed' and old_status != 'completed':
                try:
                    # Check if earning already exists
                    if not LabourEarning.objects.filter(job_application=instance).exists():
                        job = instance.job
                        days_worked = (job.end_date - job.start_date).days + 1
                        if days_worked < 1:
                            days_worked = 1
                        
                        LabourEarning.objects.create(
                            job_application=instance,
                            labour=instance.labour,
                            job_title=job.title,
                            farmer_name=job.farmer.first_name,
                            wage_per_day=job.wage_per_day,
                            days_worked=days_worked,
                            job_start_date=job.start_date,
                            job_end_date=job.end_date,
                            payment_status='pending'
                        )
                except Exception as e:
                    # Log error but don't fail the status update
                    print(f"Error creating earning record: {e}")
            
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        
        # For other fields, use default update
        return super().update(request, *args, **kwargs)
