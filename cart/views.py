from django.http import JsonResponse
from django.middleware.csrf import get_token

from django.shortcuts import render
from django.db.models import Sum


from product.models import Product

# Create your views here.


def cart(request):
    products = None
    # total = products.aggregate(Sum("price"))["price__sum"] or 0 
    total = 0
    
    context = {
        "products": products,
        "total": total
    }
    return render(request, "cart.html", context=context)