from django.shortcuts import render


from .models import Product

# Create your views here.


def cart(request):
    products = Product.objects.all() 
    
    context = {
        "products": products
    }
    return render(request, "cart.html", context=context)