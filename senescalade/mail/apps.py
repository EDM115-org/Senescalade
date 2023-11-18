from django.apps import AppConfig


class MailConfig(AppConfig):
    """
    AppConfig for the 'mail' app.

    This AppConfig is responsible for configuring the 'mail' app in Django.
    It sets the default auto field to 'django.db.models.BigAutoField' and
    specifies the name of the app as 'mail'.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "mail"
