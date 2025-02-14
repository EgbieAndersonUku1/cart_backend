
import django
import logging

from os import environ, mkdir
from os.path import join, exists, abspath, dirname

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


from cart.models import Product
from django.conf import settings

MEDIA_PATH  = join(settings.BASE_DIR, "media", "product")



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
    
    for product_obj in products:
        
        try:
            products_list.append(
                Product(
                    name=product_obj["name"],
                    description=product_obj["description"],
                    price=product_obj["price"],
                    quantity=product_obj["quantity"],
                    image=product_obj.get("image", ""),
                )
            )
        except KeyError as e:
            raise ValueError(f"Missing required field in product object: {e}")
    
    return products_list


def main():
    """Runs the script and ensures that the products are uploaded to the database"""
    
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