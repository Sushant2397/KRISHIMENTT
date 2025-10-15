from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.mail import send_mail

from ..models import Inquiry, Equipment, Notification
from rest_framework.exceptions import ValidationError
from ..serializers import InquirySerializer


class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.select_related('equipment', 'seller').all()
    serializer_class = InquirySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        # Anyone can create an inquiry; reads require authentication
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
        qs = super().get_queryset()
        # If authenticated, optionally filter to current seller using ?mine=1 or via the 'mine' action
        user = getattr(self.request, 'user', None)
        if user and user.is_authenticated and self.request.query_params.get('mine'):
            return qs.filter(seller=user)
        return qs

    def perform_create(self, serializer):
        equipment_id = self.request.data.get('equipment')
        if not equipment_id:
            raise ValidationError({'equipment': 'This field is required.'})
        try:
            equipment = Equipment.objects.get(pk=equipment_id)
        except (Equipment.DoesNotExist, ValueError, TypeError):
            raise ValidationError({'equipment': 'Invalid equipment id.'})
        try:
            seller = equipment.seller
            inquiry = serializer.save(seller=seller)

            # Optional: email notification to seller (console backend in dev)
            try:
                send_mail(
                    subject=f"New inquiry for {equipment.title}",
                    message=(
                        f"You have received a new inquiry for {equipment.title}.\n\n"
                        f"From: {inquiry.buyer_name} <{inquiry.buyer_email}>\n"
                        f"Phone: {inquiry.buyer_phone or 'N/A'}\n\n"
                        f"Message:\n{inquiry.message}"
                    ),
                    from_email=None,
                    recipient_list=[seller.email],
                    fail_silently=True,
                )
            except Exception:
                # Ignore email errors in dev
                pass
            # Create in-app notification for seller
            try:
                Notification.objects.create(
                    user=seller,
                    title=f"New inquiry for {equipment.title}",
                    message=f"{inquiry.buyer_name} is interested in {equipment.title}.",
                    equipment=equipment,
                    inquiry=inquiry,
                    buyer_name=inquiry.buyer_name,
                    buyer_email=inquiry.buyer_email,
                    buyer_phone=inquiry.buyer_phone or '',
                )
            except Exception:
                pass
        except Exception as e:
            raise ValidationError({'detail': str(e)})

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mine(self, request):
        """Return inquiries where the authenticated user is the seller."""
        inquiries = self.get_queryset().filter(seller=request.user)
        serializer = self.get_serializer(inquiries, many=True)
        return Response(serializer.data)

