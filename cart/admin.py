from django.contrib import admin
from .models import Product, Discount


# Register your models here.

class DiscountAdmin(admin.ModelAdmin):
    
    list_display       = ["id", "name","discount", "code", "start_date", "end_date"]
    list_display_links = ["id", "name"]
    list_per_page      = 25
    search_fields      = ["name", "id"]
    readonly_fields    = ["start_date"]
    


class ProductAdmin(admin.ModelAdmin):
    
    list_display       = ["id", "name", "price", "quantity", "has_discount", "created_on", "modified_on"]
    list_display_links = ["id", "name"]
    list_per_page      = 25
    search_fields      = ["name", "id"]
    readonly_fields    = ["created_on", "modified_on"]
    


admin.site.register(Product, ProductAdmin)
admin.site.register(Discount, DiscountAdmin)



