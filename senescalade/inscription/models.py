from django.db import models


class CustomUser(models.Model):
    birth_date = models.DateField()
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    confirm_password = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = "inscription_customuser"
