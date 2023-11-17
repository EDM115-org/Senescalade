from django.urls import path
from . import views

urlpatterns = [
    path('', views.inscription_index, name='inscription-index'),
]
