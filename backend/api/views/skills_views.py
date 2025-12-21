from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from ..models import LabourSkill, CustomUser
from ..serializers import LabourSkillSerializer


class LabourSkillViewSet(viewsets.ModelViewSet):
    serializer_class = LabourSkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'labour':
            # Labours can see their own skills
            return LabourSkill.objects.filter(labour=user)
        elif user.role == 'farmer':
            # Farmers can see skills of all labours (for hiring purposes)
            labour_id = self.request.query_params.get('labour_id')
            if labour_id:
                return LabourSkill.objects.filter(labour_id=labour_id)
            return LabourSkill.objects.all()
        return LabourSkill.objects.none()

    def create(self, request, *args, **kwargs):
        """Create a new skill (labour only)"""
        if request.user.role != 'labour':
            return Response(
                {'error': 'Only laborers can add skills'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """Update a skill (labour only, own skills)"""
        instance = self.get_object()
        if request.user.role != 'labour' or instance.labour != request.user:
            return Response(
                {'error': 'You can only update your own skills'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Delete a skill (labour only, own skills)"""
        instance = self.get_object()
        if request.user.role != 'labour' or instance.labour != request.user:
            return Response(
                {'error': 'You can only delete your own skills'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get all available skill categories"""
        categories = [{'value': choice[0], 'label': choice[1]} 
                     for choice in LabourSkill.SKILL_CATEGORIES]
        return Response(categories)

    @action(detail=False, methods=['get'])
    def experience_levels(self, request):
        """Get all available experience levels"""
        levels = [{'value': choice[0], 'label': choice[1]} 
                 for choice in LabourSkill.EXPERIENCE_LEVELS]
        return Response(levels)

