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


class CustomPersonne(models.Model):
    """
    Personne(idPersonne (INT, PK), action (CHAR(1)), nom (CHAR(100)), prenom (CHAR(100)), sexe (CHAR(1)), nationalite (CHAR(2)), adresse (CHAR(255)), complementAdresse (CHAR(255)), codePostal (CHAR(5)), ville (CHAR(100)), pays (CHAR(2)), telephone (CHAR(10)), mobile (CHAR(10)), courriel2 (CHAR(100)), personneNom (CHAR(100)), personnePrenom (CHAR(100)), personneTelephone (CHAR(15)), personneCourriel (CHAR(100)), numLicence (CHAR(6)), typeLicence (CHAR(1)), assurance (CHAR(2)), optionSki (BOOL), optionSlackline (BOOL), optionTrail (BOOL), optionVTT (BOOL), optionAssurance (BOOL), seance (INT), lInscription (INT))
    """

    idPersonne = models.IntegerField(primary_key=True)
    action = models.CharField(max_length=1)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    sexe = models.CharField(max_length=1)
    nationalite = models.CharField(max_length=2)
    adresse = models.CharField(max_length=255)
    complementAdresse = models.CharField(max_length=255)
    codePostal = models.CharField(max_length=5)
    ville = models.CharField(max_length=100)
    pays = models.CharField(max_length=2)
    telephone = models.CharField(max_length=10)
    mobile = models.CharField(max_length=10)
    courriel2 = models.CharField(max_length=100)
    personneNom = models.CharField(max_length=100)
    personnePrenom = models.CharField(max_length=100)
    personneTelephone = models.CharField(max_length=15)
    personneCourriel = models.CharField(max_length=100)
    numLicence = models.CharField(max_length=6)
    typeLicence = models.CharField(max_length=1)
    assurance = models.CharField(max_length=2)
    optionSki = models.BooleanField()
    optionSlackline = models.BooleanField()
    optionTrail = models.BooleanField()
    optionVTT = models.BooleanField()
    optionAssurance = models.BooleanField()
    seance = models.IntegerField()
    lInscription = models.IntegerField()

    class Meta:
        managed = False
        db_table = "Personne"
