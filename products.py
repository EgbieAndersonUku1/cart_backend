from os import listdir
from os.path import join

from product_list import products


def add_images_to_products(products:list, images_path:str) -> None:
    """
    Associates images from a specified directory with products in a given list.

    Each image in the directory is added to the corresponding product dictionary in the list. 
    The function ensures that the number of images matches the number of products.

    Args:
        products (list): A list of dictionaries, where each dictionary represents a product.
        images_path (str): Path to the directory containing product images.

    Raises:
        ValueError: If:
            - The `products` parameter is not a list.
            - The directory specified by `images_path` contains no images.
            - The number of images in the directory does not match the number of products in the list.
    """
    
    if not isinstance(products, list):
        raise ValueError(f"Expected a list of dictionary but got {type(products)}")
    
    images = listdir(images_path)
 
    if len(images) == 0:
        raise ValueError("Couldn't add imagees to the product because there was not files in media directory")
    
    EXPECTED_LENGTH = len(images)
    
    if len(products) != EXPECTED_LENGTH:
        raise ValueError(f"The number of images in the media directory must equal the number of products in dictionary: Images: {EXPECTED_LENGTH}, products: {len(products)} ")
    
    for index, image in enumerate(images):
        add_image_to_product(product=products[index], image=image, image_path=images_path)
        

def add_image_to_product(product:dict, image:str, image_path:str) -> None:
    """
    Takes a product dictionary and adds an image path to it.
    
    Args:
        product (dict): A product dictionary containing the various attribrutes of a product .e.g name, price, etc.
        image (str): The name of the image that will be added to product dictionary.
        image_path (str): The direct path to the location of the image.
        
    Raises:
        Raises a ValueError if the product is not a dicionary.
    
    Returns:
        Returns none.
    
    """
    if not isinstance(product, dict):
        raise ValueError(f"Expected a dictionary but got type {type((product))}")
    
    product["image"] = join(image_path, image)
    
        
def get_products(images_path: str) -> list:
    """
    Takes an image path to a given images directory and returns a list of products
    each containing an image found in the given directory.
    
    Args:
        images_path (str): The path to a given image directory
    
    """
    add_images_to_products(products, images_path)
    return products