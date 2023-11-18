from django.apps import AppConfig


class AdminConfig(AppConfig):
    """
    AppConfig for the 'admins' app.
    """
    default_auto_field = "django.db.models.BigAutoField"
    name = "admins"
