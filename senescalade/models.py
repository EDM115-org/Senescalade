from django.db import models


class Admin(models.Model):
    """
    Model definition for the Admin model

    Fields:
        idadmin (AutoField): Primary key
        droit (CharField): Droit d'administration
        lapersonne (ForeignKey): Foreign key to Personne

    Meta:
        managed (bool): If False, no database table creation, modification, or deletion operations will be performed for this model
        db_table (str): The name of the database table to use for the model
    """

    idadmin = models.AutoField(db_column="idAdmin", primary_key=True)
    droit = models.CharField(max_length=5)
    lapersonne = models.ForeignKey(
        "Personne", models.DO_NOTHING, db_column="laPersonne"
    )

    class Meta:
        managed = False
        db_table = "admin"


class AuthGroup(models.Model):
    """
    Model definition for the AuthGroup model

    Fields:
        name (CharField): Name of the group

    Meta:
        managed (bool): If False, no database table creation, modification, or deletion operations will be performed for this model
        db_table (str): The name of the database table to use for the model
    """

    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = "auth_group"


class AuthGroupPermissions(models.Model):
    """
    Model definition for the AuthGroupPermissions model

    Fields:
        id (AutoField): Primary key
        group (ForeignKey): Foreign key to AuthGroup
        permission (ForeignKey): Foreign key to AuthPermission

    Meta:
        managed (bool): If False, no database table creation, modification, or deletion operations will be performed for this model
        db_table (str): The name of the database table to use for the model
        unique_together (tuple): Tuple of fields that must be unique together
    """

    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey("AuthPermission", models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "auth_group_permissions"
        unique_together = (("group", "permission"),)


class AuthPermission(models.Model):
    """
    Model definition for the AuthPermission model

    Fields:
        name (CharField): Name of the permission
        content_type (ForeignKey): Foreign key to DjangoContentType
        codename (CharField): Codename of the permission

    Meta:
        managed (bool): If False, no database table creation, modification, or deletion operations will be performed for this model
        db_table (str): The name of the database table to use for the model
        unique_together (tuple): Tuple of fields that must be unique together
    """

    name = models.CharField(max_length=255)
    content_type = models.ForeignKey("DjangoContentType", models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = "auth_permission"
        unique_together = (("content_type", "codename"),)


class AuthUser(models.Model):
    """
    Model definition for the AuthUser model

    Fields:
        password (CharField): Hashed password
        last_login (DateTimeField): Last login
        is_superuser (IntegerField): Designates that this user has all permissions without explicitly assigning them
        username (CharField): Username
        first_name (CharField): First name
        last_name (CharField): Last name
        email (CharField): Email address
        is_staff (IntegerField): Designates whether the user can access the admin site
        is_active (IntegerField): Designates whether this user should be treated as active
        date_joined (DateTimeField): Date joined

    Meta:
        managed (bool): If False, no database table creation, modification, or deletion operations will be performed for this model
        db_table (str): The name of the database table to use for the model
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
        db_table = "auth_user"


class AuthUserGroups(models.Model):
    """
    Model definition for the AuthUserGroups model

    Fields:
        id (AutoField): Primary key
        user (ForeignKey): Foreign key to AuthUser
        group (ForeignKey): Foreign key to AuthGroup

    Meta:
        managed (bool): If False, no database table creation, modification, or deletion operations will be performed for this model
        db_table (str): The name of the database table to use for the model
        unique_together (tuple): Tuple of fields that must be unique together
    """

    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "auth_user_groups"
        unique_together = (("user", "group"),)


class AuthUserUserPermissions(models.Model):
    """
    Model definition for the AuthUserUserPermissions model

    Fields:
        id (AutoField): Primary key
        user (ForeignKey): Foreign key to AuthUser
        permission (ForeignKey): Foreign key to AuthPermission

    Meta:
        managed (bool): If False, no database table creation, modification, or deletion operations will be performed for this model
        db_table (str): The name of the database table to use for the model
        unique_together (tuple): Tuple of fields that must be unique together
    """

    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "auth_user_user_permissions"
        unique_together = (("user", "permission"),)


class DjangoAdminLog(models.Model):
    """
    Model definition for the DjangoAdminLog model

    Fields:
        action_time (DateTimeField): Action time
        object_id (TextField): Object id
        object_repr (CharField): Object representation
        action_flag (PositiveSmallIntegerField): Action flag
        change_message (TextField): Change message
        content_type (ForeignKey): Foreign key to DjangoContentType
        user (ForeignKey): Foreign key to AuthUser

    Meta:
        managed (bool): If False, no database table creation, modification, or deletion operations will be performed for this model
        db_table (str): The name of the database table to use for the model
    """

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
    """
    Model definition for the DjangoContentType model

    Fields:
        app_label (CharField): App label
        model (CharField): Model
        name (CharField): Name

    Meta:
        managed (bool): If False, no database table creation, modification, or deletion operations will be performed for this model
        db_table (str): The name of the database table to use for the model
        unique_together (tuple): Tuple of fields that must be unique together
    """

    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = "django_content_type"
        unique_together = (("app_label", "model"),)


class DjangoMigrations(models.Model):
    """
    Model definition for the DjangoMigrations model

    Fields:
        id (AutoField): Primary key
        app (CharField): App
        name (CharField): Name
        applied (DateTimeField): Applied

    Meta:
        managed (bool): If False, no database table creation, modification, or deletion operations will be performed for this model
        db_table (str): The name of the database table to use for the model
    """

    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "django_migrations"


class DjangoSession(models.Model):
    """
    Model definition for the DjangoSession model

    Fields:
        session_key (CharField): Primary key
        session_data (TextField): Session data
        expire_date (DateTimeField): Expire date

    Meta:
        managed (bool): If False, no database table creation, modification, or deletion operations will be performed for this model
        db_table (str): The name of the database table to use for the model
    """

    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "django_session"


class Inscription(models.Model):
    """
    Model definition for the Inscription model

    Fields:
        idinscription (AutoField): Primary key
        mail (CharField): Email address
        password (CharField): Password
        datenaissance (DateField): Date of birth

    Meta:
        managed (bool): If False, no database table creation, modification, or deletion operations will be performed for this model
        db_table (str): The name of the database table to use for the model
    """

    idinscription = models.AutoField(db_column="idInscription", primary_key=True)
    mail = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    datenaissance = models.DateField(db_column="dateNaissance")

    class Meta:
        managed = False
        db_table = "inscription"


class InscriptionCustomuser(models.Model):
    """
    Model definition for the InscriptionCustomuser model

    Fields:
        id (AutoField): Primary key
        birth_date (DateField): Date of birth
        email (CharField): Email address
        password (CharField): Password
        confirm_password (CharField): Password confirmation

    Meta:
        managed (bool): If False, no database table creation, modification, or deletion operations will be performed for this model
        db_table (str): The name of the database table to use for the model
    """

    id = models.BigAutoField(primary_key=True)
    birth_date = models.DateField()
    email = models.CharField(unique=True, max_length=254)
    password = models.CharField(max_length=100)
    confirm_password = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = "inscription_customuser"


class Personne(models.Model):
    """
    Model definition for the Personne model

    Fields:
        idpersonne (AutoField): The unique identifier for the person.
        action (CharField): The action associated with the person.
        nom (CharField): The last name of the person.
        prenom (CharField): The first name of the person.
        sexe (CharField): The gender of the person.
        nationalite (CharField): The nationality of the person.
        adresse (CharField): The address of the person.
        complementadresse (CharField): The additional address information of the person.
        codepostal (CharField): The postal code of the person.
        ville (CharField): The city of the person.
        pays (CharField): The country of the person.
        telephone (CharField): The telephone number of the person.
        mobile (CharField): The mobile number of the person.
        courriel2 (CharField): The secondary email address of the person.
        personnenom (CharField): The last name of the contact person.
        personneprenom (CharField): The first name of the contact person.
        personnetelephone (CharField): The telephone number of the contact person.
        personnecourriel (CharField): The email address of the contact person.
        numlicence (CharField): The license number of the person.
        typelicence (CharField): The type of license of the person.
        assurance (CharField): The insurance information of the person.
        optionski (IntegerField): The ski option of the person.
        optionslackline (IntegerField): The slackline option of the person.
        optiontrail (IntegerField): The trail option of the person.
        optionvtt (IntegerField): The mountain biking option of the person.
        optionassurance (IntegerField): The insurance option of the person.
        seance (ForeignKey): The foreign key to the associated Seance object.
        linscription (ForeignKey): The foreign key to the associated Inscription object.

    Meta:
        managed (bool): If False, no database table creation, modification, or deletion operations will be performed for this model
        db_table (str): The name of the database table to use for the model
    """

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
    """
    Model definition for the Seance model

    Fields:
        idseance (AutoField): Primary key
        jour (CharField): Day of the week
        heureseance (TimeField): Time of the session
        dureeseance (TimeField): Duration of the session
        typeseance (CharField): Type of session
        niveau (CharField): Level of the session
        nbplaces (IntegerField): Number of places
        nbplacesrestantes (IntegerField): Number of remaining places
        professeur (CharField): Teacher of the session

    Meta:
        managed (bool): If False, no database table creation, modification, or deletion operations will be performed for this model
        db_table (str): The name of the database table to use for the model
    """

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
