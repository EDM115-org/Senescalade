# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    """
    Represents an authorization group.

    Attributes:
        name (str): The name of the authorization group.

    Meta:
        managed (bool): Specifies whether the table for this model is managed by Django.
        db_table (str): The name of the database table for this model.
        unique_together (tuple): Specifies the unique constraint for the combination of content_type and codename.
    """

    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    """
    Represents the relationship between an authorization group and its permissions.

    Attributes:
        id (int): The ID of the relationship.
        group (AuthGroup): The authorization group.
        permission (AuthPermission): The permission.

    Meta:
        managed (bool): Specifies whether the table for this model is managed by Django.
        db_table (str): The name of the database table for this model.
        unique_together (tuple): Specifies the unique constraint for the combination of content_type and codename.
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
    Represents a permission in the authentication system.

    Attributes:
        name (str): The name of the permission.
        content_type (DjangoContentType): The content type associated with the permission.
        codename (str): The codename of the permission.

    Meta:
        managed (bool): Specifies whether the table for this model is managed by Django.
        db_table (str): The name of the database table for this model.
        unique_together (tuple): Specifies the unique constraint for the combination of content_type and codename.
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
    Represents a user in the authentication system.

    Attributes:
        password (str): The password of the user.
        last_login (datetime): The last login of the user.
        is_superuser (int): Whether the user is a superuser.
        username (str): The username of the user.
        first_name (str): The first name of the user.
        last_name (str): The last name of the user.
        email (str): The email of the user.
        is_staff (int): Whether the user is a staff member.
        is_active (int): Whether the user is active.
        date_joined (datetime): The date the user joined.
    
    Meta:
        managed (bool): Specifies whether the table for this model is managed by Django.
        db_table (str): The name of the database table for this model.
    """

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
    """
    Represents the relationship between a user and a group.

    Attributes:
        id (int): The ID of the relationship.
        user (AuthUser): The user.
        group (AuthGroup): The group.

    Meta:
        managed (bool): Specifies whether the table for this model is managed by Django.
        db_table (str): The name of the database table for this model.
        unique_together (tuple): Specifies the unique constraint for the combination of content_type and codename.
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
    Represents the relationship between a user and a permission.

    Attributes:
        id (int): The ID of the relationship.
        user (AuthUser): The user.
        permission (AuthPermission): The permission.

    Meta:
        managed (bool): Specifies whether the table for this model is managed by Django.
        db_table (str): The name of the database table for this model.
        unique_together (tuple): Specifies the unique constraint for the combination of content_type and codename.
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
    Represents an entry in the admin log.

    Attributes:
        action_time (datetime): The time of the action.
        object_id (str): The ID of the object.
        object_repr (str): The representation of the object.
        action_flag (int): The action flag.
        change_message (str): The change message.
        content_type (DjangoContentType): The content type of the object.
        user (AuthUser): The user who performed the action.

    Meta:
        managed (bool): Specifies whether the table for this model is managed by Django.
        db_table (str): The name of the database table for this model.
    """

    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, default='')
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    """
    Represents a content type.

    Attributes:
        app_label (str): The app label of the content type.
        model (str): The model of the content type.
    
    Meta:
        managed (bool): Specifies whether the table for this model is managed by Django.
        db_table (str): The name of the database table for this model.
        unique_together (tuple): Specifies the unique constraint for the combination of content_type and codename.
    """

    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    """
    Represents a migration.

    Attributes:
        id (int): The ID of the migration.
        app (str): The app of the migration.
        name (str): The name of the migration.
        applied (datetime): The time the migration was applied.

    Meta:
        managed (bool): Specifies whether the table for this model is managed by Django.
        db_table (str): The name of the database table for this model.
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
    Represents a session.

    Attributes:
        session_key (str): The session key.
        session_data (str): The session data.
        expire_date (datetime): The expiration date of the session.

    Meta:
        managed (bool): Specifies whether the table for this model is managed by Django.
        db_table (str): The name of the database table for this model.
    """

    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Inscription(models.Model):
    """
    Represents an inscription for an activity.

    Attributes:
        id (int): The ID of the inscription.
        action (str): The action of the inscription.
        nom (str): The last name of the person.
        prenom (str): The first name of the person.
        datenaissance (datetime): The date of birth of the person.
        sexe (str): The gender of the person.
        nationalite (str): The nationality of the person.
        adresse (str): The address of the person.
        complementadresse (str, optional): The complement address of the person.
        codepostal (str): The postal code of the person.
        ville (str): The city of the person.
        pays (str): The country of the person.
        telephone (str, optional): The telephone number of the person.
        mobile (str, optional): The mobile number of the person.
        courriel (str): The email address of the person.
        courriel2 (str, optional): The second email address of the person.
        personnenom (str, optional): The last name of the emergency contact person.
        personneprenom (str, optional): The first name of the emergency contact person.
        personnetelephone (str, optional): The telephone number of the emergency contact person.
        personnecourriel (str, optional): The email address of the emergency contact person.
        numlicence (str): The license number of the person.
        typelicence (str): The type of license of the person.
        assurance (str): The insurance of the person.
        optionski (int): The ski option chosen by the person.
        optionslackline (int): The slackline option chosen by the person.
        optiontrail (int): The trail option chosen by the person.
        optionvtt (int): The VTT option chosen by the person.
        optionassurance (int): The insurance option chosen by the person.
        seance (Seance, optional): The session associated with the inscription.

    Meta:
        managed (bool): Specifies whether the table for this model is managed by Django.
        db_table (str): The name of the database table for this model.
    """

    id = models.AutoField(db_column='ID', primary_key=True)
    action = models.CharField(db_column='Action', max_length=1)
    nom = models.CharField(db_column='Nom', max_length=100)
    prenom = models.CharField(db_column='Prenom', max_length=100)
    datenaissance = models.DateField(db_column='DateNaissance')
    sexe = models.CharField(db_column='Sexe', max_length=1)
    nationalite = models.CharField(db_column='Nationalite', max_length=2)
    adresse = models.CharField(db_column='Adresse', max_length=255)
    complementadresse = models.CharField(db_column='ComplementAdresse', max_length=255, blank=True, default='')
    codepostal = models.CharField(db_column='CodePostal', max_length=5)
    ville = models.CharField(db_column='Ville', max_length=100)
    pays = models.CharField(db_column='Pays', max_length=2)
    telephone = models.CharField(db_column='Telephone', max_length=10, blank=True, default='')
    mobile = models.CharField(db_column='Mobile', max_length=10, blank=True, default='')
    courriel = models.CharField(db_column='Courriel', max_length=100)
    courriel2 = models.CharField(db_column='Courriel2', max_length=100, blank=True, default='')
    personnenom = models.CharField(db_column='PersonneNom', max_length=100, blank=True, default='')
    personneprenom = models.CharField(db_column='PersonnePrenom', max_length=100, blank=True, default='')
    personnetelephone = models.CharField(db_column='PersonneTelephone', max_length=15, blank=True, default='')
    personnecourriel = models.CharField(db_column='PersonneCourriel', max_length=100, blank=True, default='')
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
        db_table = 'inscription'


class Seance(models.Model):
    """
    Represents a session.

    Attributes:
        id (int): The ID of the session.
        dateseance (datetime): The date of the session.
        heureseance (datetime): The time of the session.
        typeseance (str): The type of session.
        niveau (str): The level of the session.
        nbplaces (int): The number of places in the session.
        nbplacesrestantes (int): The number of remaining places in the session.
    
    Meta:
        managed (bool): Specifies whether the table for this model is managed by Django.
        db_table (str): The name of the database table for this model.
    """

    id = models.AutoField(db_column='ID', primary_key=True)
    dateseance = models.DateField(db_column='DateSeance')
    heureseance = models.TimeField(db_column='HeureSeance')
    typeseance = models.CharField(db_column='TypeSeance', max_length=50)
    niveau = models.CharField(db_column='Niveau', max_length=10)
    nbplaces = models.IntegerField(db_column='NbPlaces')
    nbplacesrestantes = models.IntegerField(db_column='NbPlacesRestantes')

    class Meta:
        managed = False
        db_table = 'seance'
