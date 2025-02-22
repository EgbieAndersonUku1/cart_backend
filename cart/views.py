from django.http import JsonResponse
from django.middleware.csrf import get_token

from django.shortcuts import render
from django.db.models import Sum


from product.models import Product
from product.views_helper import CartRequestSession

# Create your views here.


def cart(request):
    
    
    cart     = CartRequestSession(request)  
    products = cart.get_products_from_request(to_class_object=True)
   
    context = {
        "products": products,
    }
    return render(request, "cart.html", context=context)