# from django.core.mail import send_mail
# from django.conf import settings
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from api.models import Equipment  # ✅ Correct import

# @api_view(['POST'])
# def buy_equipment(request):
#     try:
#         equipment_id = request.data.get("equipment_id")
#         buyer_name = request.data.get("buyer_name")
#         buyer_email = request.data.get("buyer_email")
#         buyer_phone = request.data.get("buyer_phone")
#         message = request.data.get("message")

#         if not all([equipment_id, buyer_name, buyer_email, message]):
#             return Response(
#                 {"error": "Missing required fields."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         # Get equipment and seller email
#         equipment = Equipment.objects.get(id=equipment_id)
#         seller_email = equipment.seller.email

#         subject = f"Inquiry for {equipment.title}"

#         # Plain text fallback
#         body = f"""
# You have received a new inquiry for your equipment listing.

# Equipment: {equipment.title}
# From: {buyer_name}
# Email: {buyer_email}
# Phone: {buyer_phone or 'Not provided'}

# Message:
# {message}

# Regards,
# Owner, Krishiment
# """

#         # HTML formatted email
#         html_message = f"""
# <html>
# <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
#     <h2 style="color: #2a9d8f;">New Equipment Inquiry Received</h2>
    
#     <p>Dear {equipment.seller.first_name},</p>
    
#     <p>We would like to inform you that a new inquiry has been submitted for your equipment listing on <strong>Krishiment</strong>.</p>
    
#     <p><strong>Equipment:</strong> {equipment.title}<br>
#        <strong>Buyer Name:</strong> {buyer_name}<br>
#        <strong>Email:</strong> {buyer_email}<br>
#        <strong>Phone:</strong> {buyer_phone or 'Not provided'}</p>
    
#     <p><strong>Message from Buyer:</strong><br>{message}</p>
    
#     <p>Please respond to the buyer at your earliest convenience to ensure a smooth transaction.</p>
    
#     <p>Best regards,<br>
#     <strong>Owner, Krishiment</strong></p>
# </body>
# </html>
# """

#         # Send email
#         send_mail(
#             subject,
#             body,
#             settings.DEFAULT_FROM_EMAIL,
#             [seller_email],
#             fail_silently=False,
#             html_message=html_message
#         )

#         return Response({"message": "Inquiry sent successfully!"}, status=200)

#     except Equipment.DoesNotExist:
#         return Response({"error": "Equipment not found."}, status=404)
#     except Exception as e:
#         return Response({"error": str(e)}, status=500)



from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.models import Equipment, Inquiry

@api_view(['POST'])
def buy_equipment(request):
    try:
        print("Payload:", request.data)  # Log incoming data

        equipment_id = int(request.data.get('equipment_id'))
        buyer_name = request.data.get('buyer_name')
        buyer_email = request.data.get('buyer_email')
        buyer_phone = request.data.get('buyer_phone', '')
        message = request.data.get('message', '')

        # Get the equipment and seller
        equipment = Equipment.objects.get(id=equipment_id)
        seller = equipment.seller

        # Create inquiry in DB
        inquiry = Inquiry.objects.create(
            equipment=equipment,
            seller=seller,
            buyer_name=buyer_name,
            buyer_email=buyer_email,
            buyer_phone=buyer_phone,
            message=message,
        )

        # Send email to seller
        send_mail(
            subject=f"New inquiry for your equipment: {equipment.title}",
            message=f"""
Hello {seller.first_name},

You have a new inquiry for your equipment listing.

Buyer: {buyer_name}
Email: {buyer_email}
Phone: {buyer_phone}
Message: {message}

View the listing in your dashboard.
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[seller.email],
            fail_silently=False,
        )

        return Response({"detail": "Inquiry sent successfully"}, status=status.HTTP_200_OK)

    except Equipment.DoesNotExist:
        return Response({"detail": "Equipment not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("Error sending inquiry:", str(e))  # Log full error
        return Response({"detail": "Failed to send inquiry"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
