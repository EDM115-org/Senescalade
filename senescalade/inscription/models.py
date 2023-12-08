from django.db import models


class CustomUser(models.Model):
    """
    Represents a custom user in the system.

    Attributes:
        dateNaissance (DateField): The birth date of the user.
        mail (EmailField): The email address of the user.
        password (CharField): The password of the user.
        confirm_password (CharField): The confirmed password of the user.
    """

    idInscription = models.IntegerField(primary_key=True)
    dateNaissance = models.DateField()
    mail = models.EmailField(unique=False)
    password = models.CharField(max_length=100)
    confirm_password = models.CharField(max_length=100)
    isAdmin = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = "Inscription"


class DataCalendar(models.Model):
    """
    Seance(idSeance (INT, PK), jour (CHAR(50)), heureSeance (TIME), dureeSeance (TIME), typeSeance (CHAR(100)), niveau (CHAR(100)), nbPlaces (INT), nbPlacesRestantes (INT), professeur (CHAR(100)))
    """

    idSeance = models.IntegerField(primary_key=True)
    jour = models.CharField(max_length=50)
    heureSeance = models.TimeField()
    dureeSeance = models.TimeField()
    typeSeance = models.CharField(max_length=100)
    niveau = models.CharField(max_length=100)
    nbPlaces = models.IntegerField()
    nbPlacesRestantes = models.IntegerField()
    professeur = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = "Seance"
