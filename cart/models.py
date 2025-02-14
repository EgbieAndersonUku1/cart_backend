from django.db import models

# Create your models here.

class Product(models.Model):
    name         = models.CharField(max_length=100, db_index=True)
    price        = models.DecimalField(max_digits=8, decimal_places=2, db_index=True)
    description  = models.TextField()
    image        = models.ImageField(upload_to="product/")
    quantity     = models.PositiveSmallIntegerField()
    created_on   = models.DateTimeField(auto_now_add=True)
    modified_on  = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['name', 'price']),  # Composite index on name and price for faster lookup when combined look up
        ]
    
    @property
    def product_image(self):
        return self.image.url
    
    @property
    def short_description(self):
        return f"{self.description[:95]}.."
    
    def save(self, *args, **kwargs):
       if self.price < 0:
            self.price = abs(self.price)  
       return super().save(*args, **kwargs)
   
    def __str__(self):
       return self.name
   

