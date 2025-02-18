from django.middleware.csrf import get_token
from django.utils.crypto import constant_time_compare
from django.http import JsonResponse


def validate_csrf_token(request):
    
    # the one sent by the client
    request_token = request.META.get('HTTP_X_CSRFTOKEN') or request.POST.get('csrfmiddlewaretoken')
    
    if not request_token:
        return JsonResponse({'ERROR': 'Missing CSRF Token', 'isValid': False}, status=405)
        
    correct_token = get_token(request)
    
    if constant_time_compare(request_token, correct_token):
        return JsonResponse({'message': 'CSRF token is valid.', 'isValid': True })
    return JsonResponse({'error': 'CSRF token is invalid.', 'isValid': False}, status=403)
        