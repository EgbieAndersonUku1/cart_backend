import json

from django.core.cache import cache
from django.http import JsonResponse
from store.views_helper import create_json

from product.models import Product
from store.views_helper import create_json
from typing import Optional, Tuple


CART_LOCK_TIMEOUT = 600  # 10 minutes
CACHE_TIMEOUT     = 1800  # 30 minutes for product stock


def is_product_reserved(request, product_id: int) -> tuple[bool, JsonResponse | None]:
    """
    Checks if a product is currently reserved by another user cart.

    Args: 
        request: The session request
        product_id (int): The product ID to check for reservation.

    Returns:
        tuple:
            - `True` and a JsonResponse if the product is reserved.
            - `False` and `None` if the product is not reserved.

    Example usage:
        >>> is_reserved, response = is_product_reserved(product_id=10)
        >>> if is_reserved:
        >>>     return response  # Return the JsonResponse in a view.
    """
    UNPROCESSABLE_ENTITY = 422
    lock_key             = f"cart_lock_{product_id}"

    if cache.get(lock_key):
        return True, create_json(error="This item is reserved by another user. Try again later.", status_code=UNPROCESSABLE_ENTITY)
    return False, None


def reserve_product(request, product_id):
    """
    Reserves a product by associating it with a guest user or session.

    This function assigns a unique user ID (either a guest user ID or session key)
    and stores it in the cache to lock the product for a certain duration for the given
    user.

    Args:
        request (HttpRequest): The HTTP request object.
        product_id (int): The ID of the product to be reserved.

    Returns:
        None
    """
    lock_key = f"cart_lock_{product_id}"
    user_id  = get_user_id_from_request(request)

    cache.set(lock_key, user_id, timeout=CART_LOCK_TIMEOUT)


def get_user_id_from_request(request):
    """
    Retrieves a unique user identifier from the request.

    If the user is authenticated, returns the user's ID.
    If the user is a guest, assigns and returns a session-based guest ID.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        int | str: The user ID or guest session key.
    """
    if request.user.is_authenticated:
        return request.user.id
    
    if "guest_user" not in request.session:
        request.session["guest_user"] = {}

    if "id" not in request.session["guest_user"]:
        if not request.session.session_key:
            request.session.save()
        request.session["guest_user"]["id"] = request.session.session_key

    return request.session["guest_user"]["id"]


def is_product_in_stock(product_id: int) -> Tuple[bool, Optional[int], Optional[JsonResponse]]:
    """
    Checks if the stock for a product is available.

    First checks the cache for the stock, if unavailable, queries the database.

    Args: 
        product_id (int): The product ID to check for available stock.

    Returns:
        Tuple:
            - `True, stock_quantity, None` if product is in stock.
            - `False, None, JsonResponse` if product is not found.

    Example usage:
        >>> is_stock, stock, response = is_product_in_stock(product_id=10)
        >>> if is_stock:
        >>>     # Do something with stock
    """
    cache_key = f"stock_{product_id}"
    stock     = cache.get(cache_key)
    NOT_FOUND = 404
    
    if stock:
        return True, stock[product_id], None
    
    product = Product.get_by_id(product_id)
    if not product:
        return False, None, create_json(error=f"The product information with id: {product_id} was not found", status_code=NOT_FOUND)
    
    stock = product.quantity
    cache.set("stock", stock, CACHE_TIMEOUT) 
    return True, stock, None