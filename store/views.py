from django.shortcuts import render
from django.middleware.csrf import get_token

from product.models import Product

from product.views_helper import CartRequestSession
from store.views_helper import handle_csrf_validation, create_json, get_product_data_from_request


# Create your views here.

def home(request):
    
    if "guest_user" not in request.session:
        request.session["guest_user"] = {}
    
    if not request.session.session_key:
        request.session.save()
        
    if "id" not in request.session["guest_user"]:
         request.session["guest_user"]["id"] = request.session.session_key 

    csrf_token = get_token(request)
    cart       = CartRequestSession(request)
        
    # Store the CSRF token inside the guest session because, as a guest, there is no authentication. 
    # Without this, each call to `get_token(request)` generates a new CSRF token, instead of reusing 
    # the one sent to the frontend from the backend, this means that CSRF_TOKEN will never match.
    request.session["guest_user"]["CSRF_TOKEN"] = csrf_token
    request.session["guest_user"]["id"] = request.session.session_key
    
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
        return create_json(error='Only a POST response is allowed', status_code=405)
   
    cart      = CartRequestSession(request)
    response  = handle_csrf_validation(request, cart)
    
    if response is not None:
        return response
                 
    is_success, product_data, json_data = get_product_data_from_request(request, cart)
    if is_success == False:
        return json_data
       
    try:
        cart.add_to_session(product_data)
    except KeyError as error:
        return create_json(cart=cart, error=error, status_code=405)
    except ValueError as error:
        return create_json(cart=cart, error=error, status_code=405)
    return create_json(cart=cart, message='Added product to cart request session', is_success=True, status_code=200)
  


