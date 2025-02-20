from django.middleware.csrf import get_token
from django.utils.crypto import constant_time_compare


def validate_csrf_token(request):
    
    context = {'message': '',  'error': '', 'is_valid': False}
    
    client_request_token = request.META.get('HTTP_X_CSRFTOKEN') or request.POST.get('csrfmiddlewaretoken')
    
    if not client_request_token:
        context['error']    = 'Missing CSRF Token'
        context['is_valid'] =  False
        return context

    correct_token = request.session.get("guest_user", {}).get("CSRF_TOKEN")

    if not correct_token:  
        correct_token = get_token(request)

    if constant_time_compare(client_request_token, correct_token):
        context["message"]  = "CSRF Token is valid"
        context["is_valid"] = True
    else:
        context["message"]  = "CSRF Token is received invalid, please check your CSRF_TOKEN and then try again"
        context["error"]    = "The CSRF token is received is invalid"
    
    return context