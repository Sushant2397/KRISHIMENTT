from django.urls import path, include
from rest_framework import routers
from .views.equipment_views import EquipmentViewSet
from .views.auth_views import RegisterView, LoginView

# DRF router for API endpoints
router = routers.DefaultRouter()
router.register(r'equipment', EquipmentViewSet, basename='equipment')

urlpatterns = [
    path('', include(router.urls)),  # include all routes
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    
    # Equipment endpoints
    path('equipment/categories/', EquipmentViewSet.as_view({'get': 'categories'}), name='equipment-categories'),
    path('equipment/conditions/', EquipmentViewSet.as_view({'get': 'conditions'}), name='equipment-conditions'),
]
