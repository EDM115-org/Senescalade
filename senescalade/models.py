# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Admin(models.Model):
    idadmin = models.AutoField(db_column='idAdmin', primary_key=True)
    droit = models.CharField(db_column='Droit', max_length=5)
    lapersonne = models.ForeignKey('Personne', models.DO_NOTHING, db_column='laPersonne')

    class Meta:
        managed = False
        db_table = 'admin'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


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
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Inscription(models.Model):
    idinscription = models.AutoField(db_column='idInscription', primary_key=True)
    mail = models.CharField(db_column='Mail', max_length=100)
    password = models.CharField(db_column='Password', max_length=100)
    datenaissance = models.DateField(db_column='DateNaissance')
    lapersonne = models.ForeignKey('Personne', models.DO_NOTHING, db_column='laPersonne')

    class Meta:
        managed = False
        db_table = 'inscription'


class Personne(models.Model):
    idpersonne = models.AutoField(db_column='idPersonne', primary_key=True)
    action = models.CharField(db_column='Action', max_length=1)
    nom = models.CharField(db_column='Nom', max_length=100)
    prenom = models.CharField(db_column='Prenom', max_length=100)
    sexe = models.CharField(db_column='Sexe', max_length=1)
    nationalite = models.CharField(db_column='Nationalite', max_length=2)
    adresse = models.CharField(db_column='Adresse', max_length=255)
    complementadresse = models.CharField(db_column='ComplementAdresse', max_length=255, blank=True, null=True)
    codepostal = models.CharField(db_column='CodePostal', max_length=5)
    ville = models.CharField(db_column='Ville', max_length=100)
    pays = models.CharField(db_column='Pays', max_length=2)
    telephone = models.CharField(db_column='Telephone', max_length=10, blank=True, null=True)
    mobile = models.CharField(db_column='Mobile', max_length=10, blank=True, null=True)
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
    seance = models.ForeignKey('Seance', models.DO_NOTHING, db_column='Seance', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'personne'


class Seance(models.Model):
    idseance = models.AutoField(db_column='idSeance', primary_key=True)
    jour = models.CharField(db_column='Jour', max_length=10)
    dateseance = models.DateField(db_column='DateSeance')
    heureseance = models.TimeField(db_column='HeureSeance')
    dureeseance = models.TimeField(db_column='DureeSeance')
    typeseance = models.CharField(db_column='TypeSeance', max_length=50)
    niveau = models.CharField(db_column='Niveau', max_length=10)
    nbplaces = models.IntegerField(db_column='NbPlaces')
    nbplacesrestantes = models.IntegerField(db_column='NbPlacesRestantes')
    professeur = models.CharField(db_column='Professeur', max_length=100)

    class Meta:
        managed = False
        db_table = 'seance'
