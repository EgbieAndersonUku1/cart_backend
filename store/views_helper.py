import json
from django.http import JsonResponse

from utils.validator import validate_csrf_token


def handle_csrf_validation(request, cart):
    """
    Validates the CSRF token from the request and returns a JSON response 
    if the validation fails.

    Args:
        request (HttpRequest): The incoming HTTP request.
        cart (Cart): The cart object associated with the request.

    Returns:
        dict or None: A JSON response with a 403 status code if CSRF validation fails,
                      otherwise None.
    """
    response       = validate_csrf_token(request)
    FORBIDDEN_CODE = 403

    if response.get("error"):
        
        return create_json(
            cart=cart,
            status_code=FORBIDDEN_CODE,
            error=response.get("error", ""),
            message=response.get("error", ""),
            is_success=response.get("is_valid", False),
        )
    return None  # Indicating no CSRF error


def get_product_data_from_request(request, cart):
    """
    Extracts product data from the request body. If no data is found, 
    returns a JSON response with an error.

    Args:
        request (HttpRequest): The incoming HTTP request.
        cart (Cart): The cart object associated with the request.

    Returns:
        tuple: Returns a tuple containing three elements. 
              
              - The first element is a boolean object:
                        - Success: returns the boolean value of True if the product was successful retrieved from the request
                        - Unsuccessful: Returns the boolean value of False if no product was found
                        
              - The second element is the product data:
                        - Success: returns the product data retrieved from the request
                        - Unsuccessful: returns the value of None
                        
              - The third element is the json data:
                        - Success: Returns an empty dictionary
                        - Unsuccessful: Returns a JSON object containing the error, status code and the cart info
                        
    
    Example usage:
        >>> from product.views_helper import CartRequestSession
        >>> cart  = CartRequestSession(request)
        >>> is_success, product_data, json_data = get_product_data_from_request(request, cart)
        
    """
    BAD_REQUEST_CODE = 405
    
    try:
        product_data = json.loads(request.body.decode("utf-8"))
        if not product_data:
            raise ValueError 
        return True, product_data, {}

    except (json.JSONDecodeError, ValueError):
        error = "Something went wrong and no product data was received."
        return False, None, create_json(error=error, cart=cart, status_code=BAD_REQUEST_CODE)


def create_json(status_code, error='', is_success=False, message='', cart=None):
    return JsonResponse({'ERROR': error, 
                         'isSuccess': is_success, 
                         'MESSAGE': message, 
                         'NUM_OF_ITEMS_IN_CART': cart.number_of_items_in_cart_session
                         },
                          status=status_code,
                         )
    