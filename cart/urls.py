
from django.urls import path
from . import views


urlpatterns = [
    path("cart/",  view=views.cart, name="cart"),
    path("",  view=views.cart, name="cart"),
]

