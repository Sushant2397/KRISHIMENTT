from django.urls import path, include
from rest_framework import routers
from .views.equipment_views import EquipmentViewSet
from .views.inquiry_views import InquiryViewSet
from .views.notification_views import NotificationViewSet
from .views.auth_views import RegisterView, LoginView
from .views.buy_equipment import buy_equipment 
# DRF router for API endpoints
router = routers.DefaultRouter()
router.register(r'equipment', EquipmentViewSet, basename='equipment')
router.register(r'inquiries', InquiryViewSet, basename='inquiry')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),  # include all routes
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('buy-equipment/', buy_equipment, name='buy_equipment'),
 
    # Equipment endpoints
    path('equipment/categories/', EquipmentViewSet.as_view({'get': 'categories'}), name='equipment-categories'),
    path('equipment/conditions/', EquipmentViewSet.as_view({'get': 'conditions'}), name='equipment-conditions'),
]
