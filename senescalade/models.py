# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Admin(models.Model):
    """
    Represents an admin user.

    Fields:
    - idadmin: An AutoField that serves as the primary key for the Admin model.
    - droit: A CharField that stores the rights of the admin user.
    - lapersonne: A ForeignKey that references the Personne model, representing the associated person for the admin user.
    """

    idadmin = models.AutoField(db_column='idAdmin', primary_key=True)
    droit = models.CharField(max_length=5)
    lapersonne = models.ForeignKey('Personne', models.DO_NOTHING, db_column='laPersonne')

    class Meta:
        managed = False
        db_table = 'admin'


class AuthGroup(models.Model):
    """
    Represents a Django model for user groups.

    Fields:
    - name: A CharField that stores the name of the user group. It is unique and has a maximum length of 150 characters.
    """

    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    """
    Represents a Django model for managing the permissions of user groups.

    Fields:
    - id: An AutoField that serves as the primary key for the AuthGroupPermissions model.   
    - group: A ForeignKey that references the AuthGroup model, representing the user group associated with the permission.
    - permission: A ForeignKey that references the AuthPermission model, representing the permission associated with the user group.
    """

    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    """
    Represents a Django model for managing permissions of user groups.

    Fields:
    - name: A CharField that stores the name of the permission.
    - content_type: A ForeignKey that references the DjangoContentType model, representing the content type associated with the permission.
    - codename: A CharField that stores the codename of the permission.
    """
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    """
    Represents a Django model for managing user authentication and authorization.

    Fields:
    - password: Stores the user's password.
    - last_login: Stores the timestamp of the user's last login.
    - is_superuser: Indicates whether the user has superuser privileges.
    - username: Stores the user's username.
    - first_name: Stores the user's first name.
    - last_name: Stores the user's last name.
    - email: Stores the user's email address.
    - is_staff: Indicates whether the user is a staff member.
    - is_active: Indicates whether the user's account is active.
    - date_joined: Stores the timestamp of when the user joined.
    """

    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, default='')
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
    """
    Represents a Django model for managing the relationship between users and groups.

    Fields:
    - id: An AutoField that serves as the primary key for the AuthUserGroups model.
    - user: A ForeignKey that references the AuthUser model, representing the user associated with the group.
    - group: A ForeignKey that references the AuthGroup model, representing the group associated with the user.
    """

    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    """
    Represents a Django model for managing the permissions assigned to users.

    Fields:
    - id: An AutoField that serves as the primary key for the AuthUserUserPermissions model.
    - user: A ForeignKey that references the AuthUser model, representing the user associated with the permission.
    - permission: A ForeignKey that references the AuthPermission model, representing the permission associated with the user.
    """

    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    """
    Represents a Django model for managing admin logs.

    Fields:
    - action_time: The timestamp of the action.
    - object_id: The ID of the object involved in the action.
    - object_repr: A string representation of the object involved.
    - action_flag: An integer representing the type of action performed.
    - change_message: A message describing the change made.
    - content_type: The content type of the object involved.
    - user: The user who performed the action.
    """

    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, default='')
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, default='')
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    """
    Represents a Django model for managing content types in the Django admin interface.

    Fields:
    - app_label: A CharField that stores the app label of the content type.
    - model: A CharField that stores the model of the content type.
    """

    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    """
    Represents a Django model for managing migrations.

    Fields:
    - id: An AutoField that serves as the primary key for the DjangoMigrations model.
    - app: A CharField that stores the app of the migration.
    - name: A CharField that stores the name of the migration.
    - applied: A DateTimeField that stores the timestamp of when the migration was applied.
    """

    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    """
    Represents a Django model for managing sessions.

    Fields:
    - session_key: A CharField that serves as the primary key for the DjangoSession model.
    - session_data: A TextField that stores the session data.
    - expire_date: A DateTimeField that stores the timestamp of when the session expires.
    """

    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Inscription(models.Model):
    """
    Represents a Django model for managing user registrations.

    Fields:
    - idinscription: An AutoField that serves as the primary key for the Inscription model.
    - mail: A CharField that stores the email of the user registration.
    - password: A CharField that stores the password of the user registration.
    - datenaissance: A DateField that stores the date of birth of the user registration.
    """

    idinscription = models.AutoField(db_column='idInscription', primary_key=True)
    mail = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    confirm_password = models.CharField(max_length=100)
    datenaissance = models.DateField(db_column='dateNaissance')
    isadmin = models.BooleanField(db_column='isAdmin', default=False, db_default='False')

    class Meta:
        managed = False
        db_table = 'inscription'


class Personne(models.Model):
    """
    Represents a Django model for managing personal information of users.
    
    Fields:
    - idpersonne: An AutoField that serves as the primary key for the Personne model.
    - action: A CharField that stores the action related to the person.
    - nom: A CharField that stores the last name of the person.
    - prenom: A CharField that stores the first name of the person.
    - sexe: A CharField that stores the gender of the person.
    - nationalite: A CharField that stores the nationality of the person.
    - adresse: A CharField that stores the address of the person.
    - complementadresse: A CharField that stores additional address information.
    - codepostal: A CharField that stores the postal code of the person's address.
    - ville: A CharField that stores the city of the person's address.
    - pays: A CharField that stores the country of the person's address.
    - telephone: A CharField that stores the telephone number of the person.
    - mobile: A CharField that stores the mobile number of the person.
    - courriel2: A CharField that stores the secondary email of the person.
    - personnenom: A CharField that stores the last name of another person associated with the person.
    - personneprenom: A CharField that stores the first name of another person associated with the person.
    - personnetelephone: A CharField that stores the telephone number of another person associated with the person.
    - personnecourriel: A CharField that stores the email of another person associated with the person.
    - numlicence: A CharField that stores the license number of the person.
    - typelicence: A CharField that stores the type of license of the person.
    - assurance: A CharField that stores the insurance information of the person.
    - optionski: An IntegerField that stores the option for skiing.
    - optionslackline: An IntegerField that stores the option for slacklining.
    - optiontrail: An IntegerField that stores the option for trail activities.
    - optionvtt: An IntegerField that stores the option for mountain biking.
    - optionassurance: An IntegerField that stores the option for additional insurance.
    - seance: A ForeignKey that references the Seance model, representing the associated session for the person.
    - linscription: A ForeignKey that references the Inscription model, representing the associated user registration for the person.
    """

    idpersonne = models.AutoField(db_column='idPersonne', primary_key=True)
    action = models.CharField(max_length=1)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    sexe = models.CharField(max_length=1)
    nationalite = models.CharField(max_length=2)
    adresse = models.CharField(max_length=255)
    complementadresse = models.CharField(db_column='complementAdresse', max_length=255, blank=True, default='', db_default='')
    codepostal = models.CharField(db_column='codePostal', max_length=5)
    ville = models.CharField(max_length=100)
    pays = models.CharField(max_length=2)
    telephone = models.CharField(max_length=10, blank=True, default='', db_default='')
    mobile = models.CharField(max_length=10, blank=True, default='', db_default='')
    courriel2 = models.CharField(max_length=100, blank=True, default='', db_default='')
    personnenom = models.CharField(db_column='personneNom', max_length=100, blank=True, default='', db_default='')
    personneprenom = models.CharField(db_column='personnePrenom', max_length=100, blank=True, default='', db_default='')
    personnetelephone = models.CharField(db_column='personneTelephone', max_length=15, blank=True, default='', db_default='')
    personnecourriel = models.CharField(db_column='personneCourriel', max_length=100, blank=True, default='', db_default='')
    numlicence = models.CharField(db_column='numLicence', max_length=6)
    typelicence = models.CharField(db_column='typeLicence', max_length=1)
    assurance = models.CharField(max_length=2)
    optionski = models.IntegerField(db_column='optionSki', db_default='NON')
    optionslackline = models.IntegerField(db_column='optionSlackline', db_default='NON')
    optiontrail = models.IntegerField(db_column='optionTrail', db_default='NON')
    optionvtt = models.IntegerField(db_column='optionVTT', db_default='NON')
    optionassurance = models.IntegerField(db_column='optionAssurance', db_default='NON')
    seance = models.ForeignKey('Seance', models.DO_NOTHING, db_column='seance', blank=True, default='')
    linscription = models.ForeignKey(Inscription, models.DO_NOTHING, db_column='lInscription')

    class Meta:
        managed = False
        db_table = 'personne'


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

    idseance = models.AutoField(db_column='idSeance', primary_key=True)
    jour = models.CharField(max_length=50)
    heureseance = models.TimeField(db_column='heureSeance')
    dureeseance = models.TimeField(db_column='dureeSeance')
    typeseance = models.CharField(db_column='typeSeance', max_length=100)
    niveau = models.CharField(max_length=100, blank=True, default='')
    nbplaces = models.IntegerField(db_column='nbPlaces')
    nbplacesrestantes = models.IntegerField(db_column='nbPlacesRestantes')
    professeur = models.CharField(max_length=100, blank=True, default='')

    class Meta:
        managed = False
        db_table = 'seance'
