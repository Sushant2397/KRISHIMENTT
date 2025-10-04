from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status

def handler404(request, exception, *args, **kwargs):
    """
    Custom 404 error handler for API endpoints
    """
    return Response(
        {"error": "The requested resource was not found."},
        status=status.HTTP_404_NOT_FOUND
    )

def handler500(request, *args, **kwargs):
    """
    Custom 500 error handler for API endpoints
    """
    return Response(
        {"error": "An internal server error occurred. Please try again later."},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )
