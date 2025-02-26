import json

from django.shortcuts import render

from product.views_helper import CartRequestSession
from cart.views_helper import is_product_reserved, is_product_in_stock, reserve_product

from store.views_helper import create_json

# Create your views here.

def cart(request):
    
    cart     = CartRequestSession(request)  
    products = cart.get_products_from_request(to_class_object=True)
    
    for product in products:
        is_reserved, _, _ = is_product_reserved(product.id)
        if is_reserved:
            reserve_product(product.id)
            
    context = {
        "products": products,
    }
    return render(request, "cart.html", context=context)


def update_quantity(request):
    
    if request.method == "POST":
        
        BAD_REQUEST          = 400
        NOT_FOUND            = 400
        SUCCESS_CODE         = 200
        EMPTY_STOCK          = 0
        
        data = json.loads(request.body.decode("utf-8"))
        cart = CartRequestSession(request)
        
        if not request.user.is_authenticated:
            request.session.get("guest")
        
        if not data or not ("product_id" in data) and not ("qty" in data):
            return create_json(error=f"One or more the product information was not found, got: {data}", status_code=NOT_FOUND)
        
        product_id = data["product_id"]
        qty        = int(data["qty"])
      
        is_reserved, response = is_product_reserved(product_id)
        
        if is_reserved:
            return response

        is_in_stock, stock, response = is_product_in_stock(product_id)
                
        if is_in_stock == EMPTY_STOCK:
            return response
        
        if qty > stock:
            return create_json(error=f"The quantity you have selected exceeds the current stock: stock: {stock}, qty: {qty}", status_code=BAD_REQUEST)
        
        cart = CartRequestSession(request)
        cart.update_session_qty(product_id, qty)
        
        return create_json(is_success=True, message="Successfully updated the cart qty session", status_code=SUCCESS_CODE)
    

