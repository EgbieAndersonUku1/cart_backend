import logging
from typing import List

from django.http import HttpRequest

from product.models import ProductDTO


logger = logging.getLogger(__name__)


class CartRequestSession:
    """
    Manages the cart functionality for a user session in a Django application.

    This class is responsible for handling cart-related operations within a user's 
    session, including adding, updating, removing, and retrieving products from the cart. 
    It uses Django's session framework to store and persist cart data throughout the 
    user's browsing session which avoids storing in the database thus preventing the hitting 
    of the database each time the user makes an update to their cart
    
    """
    def __init__(self, request, session_name="cart"):
        self._request      = request 
        self._session_name = session_name
        
        if not isinstance(self._request, HttpRequest):
            raise ValueError(f"The request is not an instance of request module. Got {type(self._request).__name__}")
        
        self._cart = self._request.session.get(session_name, {})
    
    def add_to_session(self, product_data: dict) -> bool:
        """
        Adds product data to the cart stored in the request session.

        This method takes a dictionary containing product attributes (e.g., name, description, etc.)
        and either updates the product in the session if it already exists or adds it as a new entry.

        Args:
            product_data (dict): A dictionary containing the product attributes.

        Raises:
            ValueError: If `product_data` is not a dictionary.
            KeyError: If required keys (e.g., "productID") are missing.

        Returns:
            bool: Returns True if the product was successfully added to or updated in the session, 
            or False otherwise.
        """
        
        if not isinstance(product_data, dict):
            raise ValueError(f"Expected the product_data to be a dictionary but got {type(product_data).__name__}")
        
        if not product_data.get("productID"):
            raise KeyError(f"Missing key product key id")
        
        is_updated = self._if_found_update(product_data)
    
        if is_updated:
           return True
        
        product = self._parse_product_data(product_data)
       
        self._cart[product_data["productID"]] = product
        self._update_session()

        return True
    
    def _if_found_update(self, product_data: dict) -> bool:
        """
        A private method that increments the quantity of a product in the cart if it already exists.

        Args:
            product_data (dict): A dictionary containing the product attributes, 
            including the "productID" key.

        Returns:
            bool: Returns True if the product was found and updated in the session, 
            or False if the product was not found in the cart.
        """
        
        product_id = product_data["productID"]

        if product_id in self._cart:
            self._cart[product_id]["qty"] += 1
            self._request.session.modified = True
            return True
        return False
    
    def _parse_product_data(self, product_data):
        """
        Parses raw product data into a structured dictionary.

        Args:
            product_data (dict): A dictionary containing product details with keys such as 
                                'productID', 'name', 'price', 'description', 'stock', and 'productImage'.

        Returns:
            dict: A structured product dictionary containing:
                - 'id' (str): The product ID.
                - 'product_name' (str): The product name.
                - 'price' (float/int): The product price.
                - 'description' (str): The product description (default: empty string if missing).
                - 'current_stock' (int): The stock count (converted to an integer if originally a string).
                - 'img' (str or None): The product image URL (default: None if missing).
                - 'in_stock' (bool): True if stock is greater than 0, otherwise False.
                - 'qty' (int): Default quantity set to 1.

        Raises:
            ValueError: If 'stock' contains a non-numeric value that cannot be converted to an integer.
            KeyError: If any required field ('productID', 'name', or 'price') is missing.        
        
        """
        try:
            
            try:
                current_stock = product_data["stock"]
                current_stock = int(current_stock) if isinstance(current_stock, str) else current_stock
            except ValueError as e:
                logger.error(f"Invalid stock value: {e}")
                raise ValueError(f"Invalid stock value: {current_stock}")
           
        except KeyError as e:
            logger.error(f"Missing key: {e}")
            raise KeyError(e)
        
        product = {"id": product_data["productID"],
                    "product_name": product_data["name"],
                    "price": product_data["price"],
                    "description": product_data["description"],
                    "current_stock": current_stock,
                    "img": product_data["productImage"],
                    "in_stock":  current_stock > 0,
                    "qty": 1,
            }
        return product
           
    def remove_from_session(self, product_id):
        """
        Removes product data from the cart request session
        
        This method takes a product_id and removes that entry from the cart session.
        
        Args:
            product_id (str): The product id that will be used to delete the product from the request.

        Returns:
            bool: Returns True to signalify that the product has been removed from the session.
        
        """
        if product_id in self._cart:
            del self._cart[product_id]
            self._request.session.modified = True
        
        self._update_session()
        return True
    
    def _update_session(self):
        """Updates the cart session with the cart data"""
        self._request.session[self._session_name] = self._cart
        self._request.session.modified            = True
        
    @property
    def number_of_items_in_cart_session(self):
        """
        Returns the number of unique items in the cart.

        This method counts only the unique product entries in the cart, 
        not the total quantity of items. For example, if the cart contains:
        {"id": 1, "qty": 4} and {"id": 2, "qty": 1}, the method will return 2 
        (unique products), not the total quantity of 5.
        
        """
        return len(self._cart)
    
    def get_products_from_request(self, to_class_object: bool = False) -> List[dict] | List[ProductDTO]:
        """
        Returns a JSON list containing cart items if found or returns an empty list. 

        The method returns the entire cart items in the form of a JSON list or an empty
        list if it is not found. By default it returns the data as a dictionary (JSON), however: 
        
        If `to_class_object` is False (default), the method returns a list of cart items as dictionaries. 
        If `to_class_object` is True, it returns a list of `ProductDTO` objects. 
        If no cart items are found, an empty list is returned.
                
        Args:
            `to_class_object (bool)`: If True, returns the cart items as `ProductDTO` objects. 
                                      If False, returns the cart items as dictionaries (default).

        Raises:
             KeyError: If any expected key is missing from the cart data.
        
        Returns:
            -  list of cart items in either JSON format (dictionaries) or as `ProductDTO` objects. 
               Returns an empty list if no cart items are found.
        """
        if to_class_object:
            try:
                return [ProductDTO(id=self._cart[id]["id"], 
                                name=self._cart[id]["product_name"],
                                price=self._cart[id]["price"],
                                description=self._cart[id]["description"],
                                current_stock=self._cart[id]["current_stock"],
                                image=self._cart[id]["img"],
                                qty=self._cart[id]["qty"],
                                ) for id in self._cart]
            except KeyError as e:
                logger.warning(f"[*] Missing key: {str(e)}")
                

        return self._cart or []
    
    def flush_session(self):
        """Clears the entire session"""
        self._request.session.flush()