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

    idInscription = models.AutoField(primary_key=True)
    dateNaissance = models.DateField()
    mail = models.EmailField()
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

    idSeance = models.AutoField(primary_key=True)
    jour = models.CharField(max_length=50)
    heureSeance = models.TimeField()
    dureeSeance = models.TimeField()
    typeSeance = models.CharField(max_length=100)
    niveau = models.CharField(max_length=100)
    nbPlaces = models.IntegerField()
    nbPlacesRestantes = models.IntegerField()
    professeur = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = "Seance"


class CustomPersonne(models.Model):
    """
    Personne(idPersonne (INT, PK), action (CHAR(1)), nom (CHAR(100)), prenom (CHAR(100)), sexe (CHAR(1)), nationalite (CHAR(2)), adresse (CHAR(255)), complementAdresse (CHAR(255)), codePostal (CHAR(5)), ville (CHAR(100)), pays (CHAR(2)), telephone (CHAR(10)), mobile (CHAR(10)), courriel2 (CHAR(100)), personneNom (CHAR(100)), personnePrenom (CHAR(100)), personneTelephone (CHAR(15)), personneCourriel (CHAR(100)), numLicence (CHAR(6)), typeLicence (CHAR(1)), assurance (CHAR(2)), optionSki (BOOL), optionSlackline (BOOL), optionTrail (BOOL), optionVTT (BOOL), optionAssurance (BOOL), seance (INT), lInscription (INT))
    """

    idPersonne = models.AutoField(primary_key=True)
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
        managed = True
        db_table = "Personne"

    SEXE_CHOICES = (("H", "Homme"), ("F", "Femme"))

    ASSURANCE_CHOICES = (
        ("RC", "Responsabilité Civile"),
        ("B", "Base"),
        ("B+", "Base+"),
        ("B++", "Base++"),
    )

    OPTIONS_CHOICES = (("OUI", "OUI"), ("NON", "NON"))

    OPTION_ASSURANCE_CHOICES = (
        ("IJ1", "IJ1"),
        ("IJ2", "IJ2"),
        ("IJ3", "IJ3"),
        ("NON", "NON"),
    )

    CODE_PAYS = (
        ("AF", "Afghanistan"),
        ("ZA", "Afrique du Sud"),
        ("AL", "Albanie"),
        ("DZ", "Algérie"),
        ("DE", "Allemagne"),
        ("AD", "Andorre"),
        ("AO", "Angola"),
        ("AI", "Anguilla"),
        ("AQ", "Antarctique"),
        ("AG", "Antigua-et-Barbuda"),
        ("AN", "Antilles néerlandaises"),
        ("SA", "Arabie saoudite"),
        ("AR", "Argentine"),
        ("AM", "Arménie"),
        ("AW", "Aruba"),
        ("AU", "Australie"),
        ("AT", "Autriche"),
        ("AZ", "Azerbaïdjan"),
        ("BS", "Bahamas"),
        ("BH", "Bahreïn"),
        ("BD", "Bangladesh"),
        ("BB", "Barbade"),
        ("PW", "Belau"),
        ("BE", "Belgique"),
        ("BZ", "Belize"),
        ("BJ", "Bénin"),
        ("BM", "Bermudes"),
        ("BT", "Bhoutan"),
        ("BY", "Biélorussie"),
        ("MM", "Birmanie"),
        ("BO", "Bolivie"),
        ("BA", "Bosnie-Herzégovine"),
        ("BW", "Botswana"),
        ("BR", "Brésil"),
        ("BN", "Brunei"),
        ("BG", "Bulgarie"),
        ("BF", "Burkina Faso"),
        ("BI", "Burundi"),
        ("KH", "Cambodge"),
        ("CM", "Cameroun"),
        ("CA", "Canada"),
        ("CV", "Cap-Vert"),
        ("CL", "Chili"),
        ("CN", "Chine"),
        ("CY", "Chypre"),
        ("CO", "Colombie"),
        ("KM", "Comores"),
        ("CG", "Congo"),
        ("KP", "Corée du Nord"),
        ("KR", "Corée du Sud"),
        ("CR", "Costa Rica"),
        ("CI", "Côte d'Ivoire"),
        ("HR", "Croatie"),
        ("CU", "Cuba"),
        ("DK", "Danemark"),
        ("DJ", "Djibouti"),
        ("DM", "Dominique"),
        ("EG", "Égypte"),
        ("AE", "Émirats arabes unis"),
        ("EC", "Équateur"),
        ("ER", "Érythrée"),
        ("ES", "Espagne"),
        ("EE", "Estonie"),
        ("US", "États-Unis"),
        ("ET", "Éthiopie"),
        ("MK", "ex-République yougoslave de Macédoine"),
        ("FI", "Finlande"),
        ("FR", "France"),
        ("GA", "Gabon"),
        ("GM", "Gambie"),
        ("GE", "Géorgie"),
        ("GH", "Ghana"),
        ("GI", "Gibraltar"),
        ("GR", "Grèce"),
        ("GD", "Grenade"),
        ("GL", "Groenland"),
        ("GP", "Guadeloupe"),
        ("GU", "Guam"),
        ("GT", "Guatemala"),
        ("GN", "Guinée"),
        ("GQ", "Guinée équatoriale"),
        ("GW", "Guinée-Bissao"),
        ("GY", "Guyana"),
        ("GF", "Guyane française"),
        ("HT", "Haïti"),
        ("HN", "Honduras"),
        ("HK", "Hong Kong"),
        ("HU", "Hongrie"),
        ("BV", "Ile Bouvet"),
        ("CX", "Ile Christmas"),
        ("NF", "Ile Norfolk"),
        ("KY", "Iles Cayman"),
        ("CK", "Iles Cook"),
        ("CC", "Iles des Cocos (Keeling)"),
        ("FK", "Iles Falkland"),
        ("FO", "Iles Féroé"),
        ("FJ", "Iles Fidji"),
        ("GS", "Iles Géorgie du Sud et Sandwich du Sud"),
        ("HM", "Iles Heard et McDonald"),
        ("MH", "Iles Marshall"),
        ("UM", "Iles mineures éloignées des États-Unis"),
        ("PN", "Iles Pitcairn"),
        ("SB", "Iles Salomon"),
        ("SJ", "Iles Svalbard et Jan Mayen"),
        ("TC", "Iles Turks-et-Caicos"),
        ("VI", "Iles Vierges américaines"),
        ("VG", "Iles Vierges britanniques"),
        ("IN", "Inde"),
        ("ID", "Indonésie"),
        ("IR", "Iran"),
        ("IQ", "Iraq"),
        ("IE", "Irlande"),
        ("IS", "Islande"),
        ("IL", "Israël"),
        ("IT", "Italie"),
        ("JM", "Jamaïque"),
        ("JP", "Japon"),
        ("JO", "Jordanie"),
        ("KZ", "Kazakhstan"),
        ("KE", "Kenya"),
        ("KG", "Kirghizistan"),
        ("KI", "Kiribati"),
        ("KW", "Koweït"),
        ("LA", "Laos"),
        ("LS", "Lesotho"),
        ("LV", "Lettonie"),
        ("LB", "Liban"),
        ("LR", "Liberia"),
        ("LY", "Libye"),
        ("LI", "Liechtenstein"),
        ("LT", "Lituanie"),
        ("LU", "Luxembourg"),
        ("MO", "Macao"),
        ("MK", "Macédoine"),
        ("MG", "Madagascar"),
        ("MY", "Malaisie"),
        ("MW", "Malawi"),
        ("MV", "Maldives"),
        ("ML", "Mali"),
        ("MT", "Malte"),
        ("MP", "Mariannes du Nord"),
        ("MA", "Maroc"),
        ("MQ", "Martinique"),
        ("MU", "Maurice"),
        ("MR", "Mauritanie"),
        ("YT", "Mayotte"),
        ("MX", "Mexique"),
        ("FM", "Micronésie"),
        ("MD", "Moldavie"),
        ("MC", "Monaco"),
        ("MN", "Mongolie"),
        ("MS", "Montserrat"),
        ("MZ", "Mozambique"),
        ("NA", "Namibie"),
        ("NR", "Nauru"),
        ("NP", "Népal"),
        ("NI", "Nicaragua"),
        ("NE", "Niger"),
        ("NG", "Nigeria"),
        ("NU", "Nioué"),
        ("NO", "Norvège"),
        ("NC", "Nouvelle-Calédonie"),
        ("NZ", "Nouvelle-Zélande"),
        ("OM", "Oman"),
        ("UG", "Ouganda"),
        ("UZ", "Ouzbékistan"),
        ("PK", "Pakistan"),
        ("PA", "Panama"),
        ("PG", "Papouasie-Nouvelle-Guinée"),
        ("PY", "Paraguay"),
        ("NL", "Pays-Bas"),
        ("PE", "Pérou"),
        ("PH", "Philippines"),
        ("PL", "Pologne"),
        ("PF", "Polynésie française"),
        ("PR", "Porto Rico"),
        ("PT", "Portugal"),
        ("QA", "Qatar"),
        ("CF", "République centrafricaine"),
        ("CD", "République démocratique du Congo"),
        ("DO", "République dominicaine"),
        ("CZ", "République tchèque"),
        ("RE", "Réunion"),
        ("RO", "Roumanie"),
        ("GB", "Royaume-Uni"),
        ("RU", "Russie"),
        ("RW", "Rwanda"),
        ("EH", "Sahara occidental"),
        ("KN", "Saint-Christophe-et-Niévès"),
        ("SM", "Saint-Marin"),
        ("PM", "Saint-Pierre-et-Miquelon"),
        ("VA", "Saint-Siège"),
        ("VC", "Saint-Vincent-et-les-Grenadines"),
        ("SH", "Sainte-Hélène"),
        ("LC", "Sainte-Lucie"),
        ("SV", "Salvador"),
        ("WS", "Samoa"),
        ("AS", "Samoa américaines"),
        ("ST", "Sao Tomé-et-Principe"),
        ("SN", "Sénégal"),
        ("SER", "Serbie"),
        ("SC", "Seychelles"),
        ("SL", "Sierra Leone"),
        ("SG", "Singapour"),
        ("SK", "Slovaquie"),
        ("SI", "Slovénie"),
        ("SO", "Somalie"),
        ("SD", "Soudan"),
        ("LK", "Sri Lanka"),
        ("SE", "Suède"),
        ("CH", "Suisse"),
        ("SR", "Suriname"),
        ("SZ", "Swaziland"),
        ("SY", "Syrie"),
        ("TJ", "Tadjikistan"),
        ("TW", "Taïwan"),
        ("TZ", "Tanzanie"),
        ("TD", "Tchad"),
        ("TF", "Terres australes françaises"),
        ("IO", "Territoire britannique de l'Océan Indien"),
        ("TH", "Thaïlande"),
        ("TL", "Timor Oriental"),
        ("TG", "Togo"),
        ("TK", "Tokélaou"),
        ("TO", "Tonga"),
        ("TT", "Trinité-et-Tobago"),
        ("TN", "Tunisie"),
        ("TM", "Turkménistan"),
        ("TR", "Turquie"),
        ("TV", "Tuvalu"),
        ("UA", "Ukraine"),
        ("UY", "Uruguay"),
        ("VU", "Vanuatu"),
        ("VE", "Venezuela"),
        ("VN", "Viêt Nam"),
        ("WF", "Wallis-et-Futuna"),
        ("YE", "Yémen"),
        ("ZM", "Zambie"),
        ("ZW", "Zimbabwe"),
    )
