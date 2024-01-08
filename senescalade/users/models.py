from django.db import models


class Seance(models.Model):
    """
    Represents a Django model for managing sessions.

    Fields:
    - idseance: AutoField, primary key for the Seance model.
    - jour: CharField, stores the day of the session.
    - heureseance: TimeField, stores the start time of the session.
    - dureeseance: TimeField, stores the duration of the session.
    - typeseance: CharField, stores the type of the session.
    - niveau: CharField, stores the level of the session.
    - nbplaces: IntegerField, stores the total number of available places for the session.
    - nbplacesrestantes: IntegerField, stores the number of remaining places for the session.
    - professeur: CharField, stores the name of the professor for the session.
    """

    idseance = models.AutoField(db_column="idSeance", primary_key=True)
    jour = models.CharField(max_length=50)
    heureseance = models.TimeField(db_column="heureSeance")
    dureeseance = models.TimeField(db_column="dureeSeance")
    typeseance = models.CharField(db_column="typeSeance", max_length=100)
    niveau = models.CharField(max_length=100, blank=True, default="")
    nbplaces = models.IntegerField(db_column="nbPlaces")
    nbplacesrestantes = models.IntegerField(db_column="nbPlacesRestantes")
    professeur = models.CharField(max_length=100, blank=True, default="")

    class Meta:
        managed = False
        db_table = "seance"
