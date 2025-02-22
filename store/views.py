import json

from django.http import JsonResponse
from django.shortcuts import render
from django.middleware.csrf import get_token

from product.models import Product
from utils.validator import validate_csrf_token

from product.views_helper import CartRequestSession
# Create your views here.

def home(request):
    
    request.session["guest_user"] = {}
    
    if not request.session.session_key:
        request.session.save()

    csrf_token = get_token(request)
    cart       = CartRequestSession(request)
        
    # Store the CSRF token inside the guest session because, as a guest, there is no authentication. 
    # Without this, each call to `get_token(request)` generates a new CSRF token, instead of reusing 
    # the one sent to the frontend from the backend, this means that CSRF_TOKEN will never match.
    request.session["guest_user"]["CSRF_TOKEN"] = csrf_token
    
    products = Product.objects.all()
    
    context = {
        "products": products.all(),
        "total": products.count(),
        "csrf_token": csrf_token,
        'cart_total': cart.number_of_items_in_cart_session,
    }
    return render(request, "store.html", context=context)


def add_to_basket(request):
    
    if request.method != "POST":
        return _create_json(error='Only a POST response is allowed', status_code=405)

    response  = validate_csrf_token(request)
    cart      = CartRequestSession(request)
   
    if response.get("error"):
        
        FORBIDDEN_CODE = 403
        
        return _create_json(cart=cart, 
                            status_code=FORBIDDEN_CODE, 
                            error=response.get("error", ""), 
                            message=response.get("error", ""), 
                            is_success=response.get("is_valid", False),
                            )
          
    product_data = json.loads(request.body.decode("utf-8"))

    if not product_data:
        
        error = 'Something went wrong and no product data was not received'
        return _create_json(error=error, cart=cart, status_code=405)
       
    try:
        cart.add_to_session(product_data)
        
    except KeyError as error:
        return _create_json(cart=cart, error=error, status_code=405)
     
    except ValueError as error:
        return _create_json(cart=cart, error=error, status_code=405)
    return _create_json(cart=cart, message='Added product to cart request session', is_success=True, status_code=200)
  
        
def _create_json(status_code, error='', is_success=False, message='', cart=None):
    return JsonResponse({'ERROR': error, 
                         'isSuccess': is_success, 
                         'MESSAGE': message, 
                         'NUM_OF_ITEMS_IN_CART': cart.number_of_items_in_cart_session
                         },
                          status=status_code,
                         )
    
