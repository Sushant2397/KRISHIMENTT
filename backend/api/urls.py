# api/urls.py
from django.urls import path, include
from rest_framework import routers
from .views import TodoViewSet, RegisterView, LoginView

# DRF router for Todo CRUD
router = routers.DefaultRouter()
router.register(r'todos', TodoViewSet)

urlpatterns = [
    path('', include(router.urls)),  # include all Todo routes
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
]
