from django.urls import path
from . import views

urlpatterns = [
    path("", views.register_user, name="register"),
    path("debug/", views.debug_calendar, name="debug-calendar")
]
