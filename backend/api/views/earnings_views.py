from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta

from ..models import LabourEarning, JobApplication, CustomUser
from ..serializers import LabourEarningSerializer


class LabourEarningViewSet(viewsets.ModelViewSet):
    serializer_class = LabourEarningSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'labour':
            # Labours can see their own earnings
            return LabourEarning.objects.filter(labour=user)
        elif user.role == 'farmer':
            # Farmers can see earnings for their jobs
            return LabourEarning.objects.filter(job_application__job__farmer=user)
        return LabourEarning.objects.none()

    def create(self, request, *args, **kwargs):
        """Create an earning record (typically done automatically when job is completed)"""
        if request.user.role != 'labour':
            return Response(
                {'error': 'Only laborers can create earnings'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get earnings summary statistics"""
        if request.user.role != 'labour':
            return Response(
                {'error': 'This endpoint is only for laborers'},
                status=status.HTTP_403_FORBIDDEN
            )

        earnings = LabourEarning.objects.filter(labour=request.user)
        
        # Overall statistics
        total_earnings = earnings.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_jobs = earnings.count()
        paid_earnings = earnings.filter(payment_status='paid').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        pending_earnings = earnings.filter(payment_status='pending').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # Monthly statistics (last 6 months)
        six_months_ago = timezone.now() - timedelta(days=180)
        monthly_earnings = []
        for i in range(6):
            month_start = six_months_ago + timedelta(days=30*i)
            month_end = month_start + timedelta(days=30)
            month_data = earnings.filter(
                created_at__gte=month_start,
                created_at__lt=month_end
            ).aggregate(
                total=Sum('total_amount'),
                jobs=Count('id')
            )
            monthly_earnings.append({
                'month': month_start.strftime('%B %Y'),
                'total': float(month_data['total'] or 0),
                'jobs': month_data['jobs'] or 0
            })
        
        # Recent earnings (last 10)
        recent_earnings = earnings.order_by('-created_at')[:10]
        recent_serializer = self.get_serializer(recent_earnings, many=True)
        
        return Response({
            'total_earnings': float(total_earnings),
            'total_jobs': total_jobs,
            'paid_earnings': float(paid_earnings),
            'pending_earnings': float(pending_earnings),
            'monthly_earnings': monthly_earnings,
            'recent_earnings': recent_serializer.data
        })

    @action(detail=False, methods=['post'])
    def create_from_job(self, request):
        """Create earning record from completed job application"""
        if request.user.role != 'labour':
            return Response(
                {'error': 'Only laborers can create earnings'},
                status=status.HTTP_403_FORBIDDEN
            )

        application_id = request.data.get('job_application_id')
        if not application_id:
            return Response(
                {'error': 'job_application_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            application = JobApplication.objects.get(
                id=application_id,
                labour=request.user,
                status='completed'
            )
        except JobApplication.DoesNotExist:
            return Response(
                {'error': 'Completed job application not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if earning already exists
        if LabourEarning.objects.filter(job_application=application).exists():
            return Response(
                {'error': 'Earning record already exists for this job'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate days worked
        job = application.job
        days_worked = (job.end_date - job.start_date).days + 1
        
        earning_data = {
            'job_application': application,
            'labour': request.user,
            'job_title': job.title,
            'farmer_name': job.farmer.first_name,
            'wage_per_day': job.wage_per_day,
            'days_worked': days_worked,
            'job_start_date': job.start_date,
            'job_end_date': job.end_date,
        }

        serializer = self.get_serializer(data=earning_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

