from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Count

from ..models import LabourRating, JobApplication, CustomUser
from ..serializers import LabourRatingSerializer


class LabourRatingViewSet(viewsets.ModelViewSet):
    serializer_class = LabourRatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'farmer':
            # Farmers can see ratings they've given
            return LabourRating.objects.filter(farmer=user)
        elif user.role == 'labour':
            # Labours can see ratings they've received
            return LabourRating.objects.filter(labour=user)
        return LabourRating.objects.none()

    def create(self, request, *args, **kwargs):
        """Create a rating for a completed job application"""
        if request.user.role != 'farmer':
            return Response(
                {'error': 'Only farmers can rate laborers'},
                status=status.HTTP_403_FORBIDDEN
            )

        job_application_id = request.data.get('job_application')
        if not job_application_id:
            return Response(
                {'error': 'job_application is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            job_application = JobApplication.objects.get(id=job_application_id)
        except JobApplication.DoesNotExist:
            return Response(
                {'error': 'Job application not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if farmer owns the job
        if job_application.job.farmer != request.user:
            return Response(
                {'error': 'You can only rate laborers for your own jobs'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if job application is completed
        if job_application.status != 'completed':
            return Response(
                {'error': 'You can only rate laborers for completed jobs'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if rating already exists
        if LabourRating.objects.filter(job_application=job_application, farmer=request.user).exists():
            return Response(
                {'error': 'You have already rated this laborer for this job'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(farmer=request.user, labour=job_application.labour)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def labour_ratings(self, request):
        """Get all ratings for a specific labour"""
        labour_id = request.query_params.get('labour_id')
        if not labour_id:
            return Response(
                {'error': 'labour_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        ratings = LabourRating.objects.filter(labour_id=labour_id)
        serializer = self.get_serializer(ratings, many=True)
        
        # Calculate average rating
        avg_rating = ratings.aggregate(Avg('rating'))['rating__avg'] or 0
        total_ratings = ratings.count()

        return Response({
            'ratings': serializer.data,
            'average_rating': round(avg_rating, 2),
            'total_ratings': total_ratings
        })

    @action(detail=False, methods=['get'])
    def my_average_rating(self, request):
        """Get average rating for the current user (if labour)"""
        if request.user.role != 'labour':
            return Response(
                {'error': 'This endpoint is only for laborers'},
                status=status.HTTP_403_FORBIDDEN
            )

        ratings = LabourRating.objects.filter(labour=request.user)
        avg_rating = ratings.aggregate(Avg('rating'))['rating__avg'] or 0
        total_ratings = ratings.count()

        return Response({
            'average_rating': round(avg_rating, 2),
            'total_ratings': total_ratings
        })

