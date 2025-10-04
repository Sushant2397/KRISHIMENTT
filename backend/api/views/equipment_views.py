from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from ..models import Equipment
from ..serializers import EquipmentSerializer

class EquipmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows equipment listings to be viewed or edited.
    """
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'condition', 'seller']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['price', 'posted_date']
    ordering = ['-posted_date']

    def perform_create(self, serializer):
        # Set the seller to the current user when creating a new equipment listing
        serializer.save(seller=self.request.user)

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """
        Get all available equipment categories
        """
        return Response({
            'categories': dict(Equipment.CATEGORY_CHOICES)
        })

    @action(detail=False, methods=['get'])
    def conditions(self, request):
        """
        Get all available equipment conditions
        """
        return Response({
            'conditions': dict(Equipment.CONDITION_CHOICES)
        })
