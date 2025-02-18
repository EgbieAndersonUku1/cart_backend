import json

from django.http import JsonResponse
from django.shortcuts import render

from product.models import Product
from utils.validator import validate_csrf_token

# Create your views here.

def home(request):
    products = Product.objects.all()
    
   
    context = {
        "products": products.all(),
        "total": products.count(),
      
    }
    return render(request, "store.html", context=context)


def add_to_basket(request):
    
    if request.method != "POST":
        return JsonResponse({'ERROR': 'Only a POST response is allowed', 'isSuccess': False, 'MESSAGE': ''}, status=405)

    response = validate_csrf_token(request)
    
    if not response:
        return JsonResponse({'ERROR': 'Something went wrong and no response was received', 'isSuccess': True, 'MESSAGE': ''}, status=405)
    
    if not response.get("isSuccess"):
        return response

    product = json.loads(request.body.decode("utf-8"))
    
    if product:
        response["MESSAGE"] = "Product received"
    else:
        response["MESSAGE"] = "Product was not received received"
    
    is_success = not product is None
    
    ## To do add product in the request
    return JsonResponse({'ERROR': '', 'isSuccess': is_success, 'MSG': ''}, status=405)
        
        
    
    
    
  
