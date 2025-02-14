from django.contrib import admin
from .models import Product


# Register your models here.

class ProductAdmin(admin.ModelAdmin):
    
    list_display       = ["id", "name", "price", "quantity", "created_on", "modified_on"]
    list_display_links = ["id", "name"]
    list_per_page      = 25
    search_fields      = ["name", "id"]
    readonly_fields    = ["created_on", "modified_on"]
    




admin.site.register(Product, ProductAdmin)



