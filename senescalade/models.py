# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Inscription(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    action = models.CharField(db_column='Action', max_length=1)
    nom = models.CharField(db_column='Nom', max_length=100)
    prenom = models.CharField(db_column='Prenom', max_length=100)
    datenaissance = models.DateField(db_column='DateNaissance')
    sexe = models.CharField(db_column='Sexe', max_length=1)
    nationalite = models.CharField(db_column='Nationalite', max_length=2)
    adresse = models.CharField(db_column='Adresse', max_length=255)
    complementadresse = models.CharField(db_column='ComplementAdresse', max_length=255, blank=True, null=True)
    codepostal = models.CharField(db_column='CodePostal', max_length=5)
    ville = models.CharField(db_column='Ville', max_length=100)
    pays = models.CharField(db_column='Pays', max_length=2)
    telephone = models.CharField(db_column='Telephone', max_length=10, blank=True, null=True)
    mobile = models.CharField(db_column='Mobile', max_length=10, blank=True, null=True)
    courriel = models.CharField(db_column='Courriel', max_length=100)
    courriel2 = models.CharField(db_column='Courriel2', max_length=100, blank=True, null=True)
    personnenom = models.CharField(db_column='PersonneNom', max_length=100, blank=True, null=True)
    personneprenom = models.CharField(db_column='PersonnePrenom', max_length=100, blank=True, null=True)
    personnetelephone = models.CharField(db_column='PersonneTelephone', max_length=15, blank=True, null=True)
    personnecourriel = models.CharField(db_column='PersonneCourriel', max_length=100, blank=True, null=True)
    numlicence = models.CharField(db_column='NumLicence', max_length=6)
    typelicence = models.CharField(db_column='TypeLicence', max_length=1)
    assurance = models.CharField(db_column='Assurance', max_length=2)
    optionski = models.IntegerField(db_column='OptionSki')
    optionslackline = models.IntegerField(db_column='OptionSlackline')
    optiontrail = models.IntegerField(db_column='OptionTrail')
    optionvtt = models.IntegerField(db_column='OptionVTT')
    optionassurance = models.IntegerField(db_column='OptionAssurance')

    class Meta:
        managed = False
        db_table = 'inscription'
