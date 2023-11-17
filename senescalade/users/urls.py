from django.urls import path
from . import views

urlpatterns = [
    path('', views.connexion, name='users-connexion'),
]