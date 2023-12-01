from django.db import models


class CustomUser(models.Model):
    """
    Represents a custom user in the system.

    Attributes:
        birth_date (DateField): The birth date of the user.
        email (EmailField): The email address of the user.
        password (CharField): The password of the user.
        confirm_password (CharField): The confirmed password of the user.
    """

    birth_date = models.DateField()
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    confirm_password = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = "inscription_customuser"
