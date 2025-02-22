from django.db import models
from django.forms import ValidationError
from django.utils.timezone import is_aware, make_aware, now

from utils.custom_errors import DiscountExpiredError

# Create your models here.


class Product(models.Model):
    name                = models.CharField(max_length=100, db_index=True)
    discount            = models.ForeignKey("Discount", on_delete=models.CASCADE, related_name="products", blank=True, null=True)
    price               = models.DecimalField(max_digits=8, decimal_places=2, db_index=True)
    description         = models.TextField()
    image               = models.ImageField(upload_to="product/")
    quantity            = models.PositiveSmallIntegerField()
    has_discount        = models.BooleanField(default=False)
    is_discount_applied = models.BooleanField(default=False)
    created_on          = models.DateTimeField(auto_now_add=True)
    modified_on         = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['name', 'price']),  # Composite index on name and price for faster lookup when combined look up
        ]
    
    @property
    def product_image(self):
        """Returns the direct url path to the image."""
        return self.image.url
    
    @property
    def short_description(self):
        """Returns the shorter version of the full product description"""
        return f"{self.description[:95]}.."
    
    def save(self, *args, **kwargs):
       if self.price < 0:
            self.price = round(abs(self.price), 2)  
      
       self.has_discount = True if self.discount is not None else False
       
       return super().save(*args, **kwargs)
   
    def __str__(self):
       return self.name
   

class Discount(models.Model):
    
    discount   = models.DecimalField(decimal_places=2, verbose_name="Discount in percentages", max_digits=10)
    name       = models.CharField(max_length=100, unique=True)
    code       = models.CharField(max_length=23, db_index=True)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date   = models.DateTimeField()

    def __str__(self):
        return f"Code: {self.code}, Discount: {self.discount}%"

    def is_expired(self):
        """Checks if a given discount has expired. Returns True for expired or False otherwise."""
        return now() > self.end_date

    def apply_discount(self, product: Product):
        """
        
        Applies a discount to a given product instance.

        This method calculates the discounted price of a product based on the 
        percentage discount of discount model and updates the product's price instance. 

        Args:
            product (Product): The product instance that the discount will be applied to.
            
        Raises:
            ValueError: If the provided object is not an instance of `Product`.
            DiscountExpiredError: If the discount has expired.
            AttributeError: If the product does not have the necessary attributes.
            Exception: For any unexpected errors during the discount application process.

        Example Usage:

            ```python
            
            # Run the shell command 
            python manage.py shell
            
            # import the necessary modules
            
            from cart.models import Product, Discount
            from datetime import datetime, timedelta
            from utils.discount import create_discount_code

            # Create a discount
            
            expire_date   = datetime.now() + timedelta(days=1)
            discount_code = create_discount_code()
            
            discount = Discount.objects.create(
                name="save25%",
                discount=25,
                code=discount_code,
                end_date=expire_date
            )

            # Retrieve a product instance
            product_instance = Product.objects.first()
            print(product_instance.price)  # Example: 100

            # Apply the discount
            discount.apply_discount(product_instance)
            print(product_instance.price)  # Example: 75
            ```
        """
        
        if not isinstance(product, Product):
            raise ValueError(f"The passed object is not a Product instance. Got {type(product).__name__}.")
        
        if self.is_expired():
            raise DiscountExpiredError("The discount has expired. Please try another code.")
        
        discount_amount = (self.discount / 100) * product.price
        
        try:
            
            product.price = product.price - discount_amount
            product.save()
            return True
        
        except AttributeError as e:
            raise AttributeError(f"Error applying discount: {e}")
        except Exception as e:
            raise Exception(f"Unexpected error: {e}")

    @classmethod
    def get_by_code(cls, code):
        """
        Takes a given code and returns the discount instance associated
        with that code or None if not found.
        
        Args:
            code (str): The code that will be queried against the database.
        """
        try:
            return cls.objects.get(code=code)
        except cls.DoesNotExist:
            return None
    
    def clean(self):
        if not (0 <= self.discount <= 100):
            raise ValidationError("Discount must be between 0 and 100.")
        
    def save(self, *args, **kwargs):
        
        if not is_aware(self.end_date):
            self.end_date = make_aware(self.end_date)
       
        super().save(*args, **kwargs)


class ProductDTO:
    """
    A Data Transfer Object (DTO) for representing product information.

    Attributes:
        id (int): The unique identifier for the product.
        name (str): The name of the product.
        description (str): A brief description of the product.
        price (float): The price of the product.
        current_stock (int): The number of units available in stock.
        image (str): The URL or path to the product image.
        qty (int): The quantity of the product selected or added to the cart.

    Properties:
        is_in_stock (bool): Returns True if the product is in stock, otherwise False.
    """
    def __init__(self, id, name, description, price, current_stock, image, qty):
        self.id                = id
        self.name              = name
        self.description       = description
        self.price             = price
        self.current_stock     = current_stock
        self.image             = image
        self.qty               = qty
    
    @property
    def is_in_stock(self):
        """Returns True if the item is in stock or false otherwise"""
        return self.current_stock > 0
    
    def to_json(self):
        """
        Transforms a productDTO to a dictionary (or JSON) .
        """
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "current_stock" : self.current_stock,
            "qty": self.qty,
        }