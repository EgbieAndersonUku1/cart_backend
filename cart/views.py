from django.shortcuts import render
from django.db.models import Sum


from .models import Product

# Create your views here.


def cart(request):
    products = Product.objects.all() 
    total = products.aggregate(Sum("price"))["price__sum"] or 0 
    
    context = {
        "products": products,
        "total": total
    }
    return render(request, "cart.html", context=context)