from django.http import HttpRequest


class CartRequestSession:
    
    def __init__(self, request, session_name="cart"):
        self._request      = request 
        self._session_name = session_name
        
        if not isinstance(self._request, HttpRequest):
            raise ValueError(f"The request is not an instance of request module. Got {type(self._request).__name__}")
        
        self._cart = self._request.session[session_name] = {}
    
    def add_to_session(self, product_id, name, price, description, qty, current_stock):
        
        is_updated = self._if_found_update(product_id)
        
        if not is_updated:
            
            product = self._cart[product_id] = {
                
                "product_name": name,
                "price": price,
                "description": description,
                "qty": qty,
                "current_stock": current_stock,
                "in_stock": current_stock > 0,
            }
            
            self._request.session["cart"].append(product)
            self._request.session.modified = True
            
        return True
        
    def _if_found_update(self, product_id):
        
        if product_id in self._cart:
            self._cart[product_id]["qty"] += 1
            self._request.session.modified = True
            return True
        return False
                
    def remove_from_session(self, product_id):
        
        if product_id in self._cart:
            del self._cart[product_id]
            self._request.session.modified = True
        
        self._request.session[self._session_name] = self._cart
        return True
    
    def get_products_from_request(self):
        return self._cart or {}
    
    