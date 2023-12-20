from django.urls import path
from . import views

urlpatterns = [
    path("", views.login_user, name="users-connexion"),
    path("logout/", views.logout_user, name="users-deconnexion"),
    path("creneau/", views.creneau, name="users-creneau"),
    path("edit/", views.edit_user, name="users-edit"),
]
