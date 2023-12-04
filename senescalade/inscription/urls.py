from django.urls import path
from . import views

urlpatterns = [
    path("", views.register_user, name="register"),
    path("register/", views.register_user, name="register"),
    path("login/", views.login_user, name="login"),
    path("debug/", views.debug_calendar, name="debug-calendar")
]
