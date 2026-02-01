from django.urls import path, include
from rest_framework import routers
from .views.equipment_views import EquipmentViewSet
from .views.inquiry_views import InquiryViewSet
from .views.notification_views import NotificationViewSet
from .views.job_views import JobViewSet, JobApplicationViewSet
from .views.rating_views import LabourRatingViewSet
from .views.skills_views import LabourSkillViewSet
from .views.earnings_views import LabourEarningViewSet
from .views.auth_views import RegisterView, LoginView, AvailabilityView
from .views.buy_equipment import buy_equipment
from .views.ai_views import AIChatView
# DRF router for API endpoints
router = routers.DefaultRouter()
router.register(r'equipment', EquipmentViewSet, basename='equipment')
router.register(r'inquiries', InquiryViewSet, basename='inquiry')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'job-applications', JobApplicationViewSet, basename='job-application')
router.register(r'labour-ratings', LabourRatingViewSet, basename='labour-rating')
router.register(r'labour-skills', LabourSkillViewSet, basename='labour-skill')
router.register(r'labour-earnings', LabourEarningViewSet, basename='labour-earning')

urlpatterns = [
    path('', include(router.urls)),  # include all routes
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/me/availability/', AvailabilityView.as_view(), name='availability'),
    path('buy-equipment/', buy_equipment, name='buy_equipment'),
    path('ai/chat/', AIChatView.as_view(), name='ai-chat'),
    # Equipment endpoints
    path('equipment/categories/', EquipmentViewSet.as_view({'get': 'categories'}), name='equipment-categories'),
    path('equipment/conditions/', EquipmentViewSet.as_view({'get': 'conditions'}), name='equipment-conditions'),
]
