# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Inscription(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    action = models.CharField(db_column='Action', max_length=1)  # Field name made lowercase.
    nom = models.CharField(db_column='Nom', max_length=100)  # Field name made lowercase.
    prenom = models.CharField(db_column='Prenom', max_length=100)  # Field name made lowercase.
    datenaissance = models.DateField(db_column='DateNaissance')  # Field name made lowercase.
    sexe = models.CharField(db_column='Sexe', max_length=1)  # Field name made lowercase.
    nationalite = models.CharField(db_column='Nationalite', max_length=2)  # Field name made lowercase.
    adresse = models.CharField(db_column='Adresse', max_length=255)  # Field name made lowercase.
    complementadresse = models.CharField(db_column='ComplementAdresse', max_length=255, blank=True, null=True)  # Field name made lowercase.
    codepostal = models.CharField(db_column='CodePostal', max_length=5)  # Field name made lowercase.
    ville = models.CharField(db_column='Ville', max_length=100)  # Field name made lowercase.
    pays = models.CharField(db_column='Pays', max_length=2)  # Field name made lowercase.
    telephone = models.CharField(db_column='Telephone', max_length=10, blank=True, null=True)  # Field name made lowercase.
    mobile = models.CharField(db_column='Mobile', max_length=10, blank=True, null=True)  # Field name made lowercase.
    courriel = models.CharField(db_column='Courriel', max_length=100)  # Field name made lowercase.
    courriel2 = models.CharField(db_column='Courriel2', max_length=100, blank=True, null=True)  # Field name made lowercase.
    personnenom = models.CharField(db_column='PersonneNom', max_length=100, blank=True, null=True)  # Field name made lowercase.
    personneprenom = models.CharField(db_column='PersonnePrenom', max_length=100, blank=True, null=True)  # Field name made lowercase.
    personnetelephone = models.CharField(db_column='PersonneTelephone', max_length=15, blank=True, null=True)  # Field name made lowercase.
    personnecourriel = models.CharField(db_column='PersonneCourriel', max_length=100, blank=True, null=True)  # Field name made lowercase.
    numlicence = models.CharField(db_column='NumLicence', max_length=6)  # Field name made lowercase.
    typelicence = models.CharField(db_column='TypeLicence', max_length=1)  # Field name made lowercase.
    assurance = models.CharField(db_column='Assurance', max_length=2)  # Field name made lowercase.
    optionski = models.IntegerField(db_column='OptionSki')  # Field name made lowercase.
    optionslackline = models.IntegerField(db_column='OptionSlackline')  # Field name made lowercase.
    optiontrail = models.IntegerField(db_column='OptionTrail')  # Field name made lowercase.
    optionvtt = models.IntegerField(db_column='OptionVTT')  # Field name made lowercase.
    optionassurance = models.IntegerField(db_column='OptionAssurance')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'inscription'
