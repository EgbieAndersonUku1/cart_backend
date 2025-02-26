
from django.urls import path
from . import views


urlpatterns = [
    path("",  view=views.cart, name="cart"),
    path("update/quantity/", view=views.update_quantity, name="update_quantity"),
]

