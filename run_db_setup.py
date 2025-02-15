
import django
import logging

from os import environ, mkdir
from datetime import timedelta, datetime
from os.path import join, exists, abspath, dirname
from datetime import datetime

from django.forms import ValidationError

from products import get_products

from typing import List

log_dir = join(dirname(abspath(__file__)), 'logs')


if not exists(log_dir):
    
    print("[+] Log directory not found, creating one, please wait...")
    
    mkdir(log_dir)
    
    print("[+] Log file sucessfully created.")
    
# Since this is being run without using `python manage.py` this is needed to setup django otherwise an error is thrown
environ.setdefault('DJANGO_SETTINGS_MODULE', 'cart_backend.settings') 
django.setup()

from django.conf import settings

from cart.models import Product, Discount
from utils.discount import create_discount_code


MEDIA_PATH  = join(settings.BASE_DIR, "media", "product")


def create_discount_instance(name:str="save25%", discount:float=25, num_of_days_to_expire:int=7) -> Discount:
    """
    Takes a name, discount and the number of days that a given discount will expire and returns
    a discount instance.
    
    Args:
        name (str)           : A unique name that identifies the discount being used.
        discount (float)     : A percentage that will be used as the discount.
        num_of_days_to_expire: The number of days before the discount expires.
        
    Raises:
        Raises a ValidationError if an error occurs during creation.
    
    Returns:
        Raises an error if an error arises during creation or returns a discount instance.
    """
    
    if not isinstance(discount, (int or float)) or discount < 0:
        raise ValueError("This discount amount is either not an int or a float or it is less than 0")
    
    discount_code = create_discount_code()
    expire_date   = datetime.now() + timedelta(days=num_of_days_to_expire)
    
    try:
        
        discount_instance = Discount(
            name=name,
            discount=discount,
            code=discount_code,
            end_date=expire_date
        )
        discount_instance.full_clean()  
        discount_instance.save()
        
        return discount_instance
    
    except ValidationError as e:
        raise ValueError(f"Failed to create discount instance: {e.messages}")
    

def prepare_bulk_products(products: list) -> List[Product]:
    """
    Prepares a list of Product instances for bulk creation in the database.

    Args:
        products (list): A list of dictionaries, where each dictionary contains product data.

    Returns:
        list: A list of Product instances ready for bulk creation.

    Raises:
        ValueError: If the provided 'products' argument is None or not a list.
    """
    if not products:
        raise ValueError("Expected a list of product objects but got None or empty list.")
    
    

    products_list = []
    discount_25   = create_discount_instance()
    discount_50   = create_discount_instance(name="save50%", discount=50)
    
    for index, product_obj in enumerate(products):
        
        try:
            products_list.append(
                Product(
                    name=product_obj["name"],
                    description=product_obj["description"],
                    price=product_obj["price"],
                    quantity=product_obj["quantity"],
                    image=product_obj.get("image", ""),
                    discount=discount_25 if (index % 2 == 0) else discount_50,
                    has_discount=True if (discount_25 or discount_50) else False,
                )
            )
        except KeyError as e:
            raise ValueError(f"Missing required field in product object: {e}")
    
    return products_list


def main():
    """Runs the script and ensures that the products are uploaded to the database"""
    
    logger.info("[*] Please wait, checking if there is a discount applied to the products")
    
    products = Product.objects.all()
    
    if len(products) > 0:
        products.delete()
        Discount.objects.all().delete()
        
    logger.info("[*] Please wait, attempting to populate the database...")
    
    try:
        products = get_products(MEDIA_PATH)
    except ValueError as e:
        logger.error(f"[-] There was an error preparing the products: {e}")
        return
    
    logger.info("[+] Successfully prepared the product data.")
    
    if not products:
        logger.error("[-] No products to upload. Exiting.")
        return

    try:
        products_list = prepare_bulk_products(products)
        logger.info("[+] Bulk preparation successful. Uploading to database...")
        
        Product.objects.bulk_create(products_list)
        logger.info("[+] Successfully created products in the database.")
    except Exception as e:
        logger.error(f"[-] Failed to create products in the database: {e}")

    
      

if __name__ == "__main__":
 
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    main()