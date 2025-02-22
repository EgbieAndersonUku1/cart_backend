
from django.urls import path
from . import views


urlpatterns = [
    path("",  view=views.home, name="storefront"),
    path("store/basket/add/", view=views.add_to_basket,  name="add_to_basket"),
    path("store/basket/remove/", view=views.remove_from_basket,  name="remove_from_basket"),
]

