from product.views_helper import CartRequestSession


def update_cart_qty(request):
    
    cart = CartRequestSession(request)
    return {
        "cart_total": cart.number_of_items_in_cart_session,
    }