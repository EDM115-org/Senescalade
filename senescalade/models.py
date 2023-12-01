# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Admin(models.Model):
    idadmin = models.AutoField(db_column="idAdmin", primary_key=True)
    droit = models.CharField(max_length=5)
    lapersonne = models.ForeignKey(
        "Personne", models.DO_NOTHING, db_column="laPersonne"
    )

    class Meta:
        managed = False
        db_table = "admin"


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = "auth_group"


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey("AuthPermission", models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "auth_group_permissions"
        unique_together = (("group", "permission"),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey("DjangoContentType", models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = "auth_permission"
        unique_together = (("content_type", "codename"),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "auth_user"


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "auth_user_groups"
        unique_together = (("user", "group"),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "auth_user_user_permissions"
        unique_together = (("user", "permission"),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, default='')
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey(
        "DjangoContentType", models.DO_NOTHING, blank=True, null=True
    )
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "django_admin_log"


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = "django_content_type"
        unique_together = (("app_label", "model"),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "django_migrations"


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "django_session"


class Inscription(models.Model):
    idinscription = models.AutoField(db_column="idInscription", primary_key=True)
    mail = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    datenaissance = models.DateField(db_column="dateNaissance")

    class Meta:
        managed = False
        db_table = "inscription"


class InscriptionCustomuser(models.Model):
    id = models.BigAutoField(primary_key=True)
    birth_date = models.DateField()
    email = models.CharField(unique=True, max_length=254)
    password = models.CharField(max_length=100)
    confirm_password = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = "inscription_customuser"


class Personne(models.Model):
    idpersonne = models.AutoField(db_column="idPersonne", primary_key=True)
    action = models.CharField(max_length=1)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    sexe = models.CharField(max_length=1)
    nationalite = models.CharField(max_length=2)
    adresse = models.CharField(max_length=255)
    complementadresse = models.CharField(
        db_column="complementAdresse", max_length=255, blank=True, default=''
    )
    codepostal = models.CharField(db_column="codePostal", max_length=5)
    ville = models.CharField(max_length=100)
    pays = models.CharField(max_length=2)
    telephone = models.CharField(max_length=10, blank=True, default='')
    mobile = models.CharField(max_length=10, blank=True, default='')
    courriel2 = models.CharField(max_length=100, blank=True, default='')
    personnenom = models.CharField(
        db_column="personneNom", max_length=100, blank=True, default=''
    )
    personneprenom = models.CharField(
        db_column="personnePrenom", max_length=100, blank=True, default=''
    )
    personnetelephone = models.CharField(
        db_column="personneTelephone", max_length=15, blank=True, default=''
    )
    personnecourriel = models.CharField(
        db_column="personneCourriel", max_length=100, blank=True, default=''
    )
    numlicence = models.CharField(db_column="numLicence", max_length=6)
    typelicence = models.CharField(db_column="typeLicence", max_length=1)
    assurance = models.CharField(max_length=2)
    optionski = models.IntegerField(db_column="optionSki")
    optionslackline = models.IntegerField(db_column="optionSlackline")
    optiontrail = models.IntegerField(db_column="optionTrail")
    optionvtt = models.IntegerField(db_column="optionVTT")
    optionassurance = models.IntegerField(db_column="optionAssurance")
    seance = models.ForeignKey(
        "Seance", models.DO_NOTHING, db_column="seance", blank=True, null=True
    )
    linscription = models.ForeignKey(
        Inscription, models.DO_NOTHING, db_column="lInscription"
    )

    class Meta:
        managed = False
        db_table = "personne"


class Seance(models.Model):
    idseance = models.AutoField(db_column="idSeance", primary_key=True)
    jour = models.CharField(max_length=50)
    heureseance = models.TimeField(db_column="heureSeance")
    dureeseance = models.TimeField(db_column="dureeSeance")
    typeseance = models.CharField(db_column="typeSeance", max_length=100)
    niveau = models.CharField(max_length=100, blank=True, default='')
    nbplaces = models.IntegerField(db_column="nbPlaces")
    nbplacesrestantes = models.IntegerField(db_column="nbPlacesRestantes")
    professeur = models.CharField(max_length=100, blank=True, default='')

    class Meta:
        managed = False
        db_table = "seance"
