from django import forms
from django.utils.translation import gettext_lazy as _
from .models import CustomUser, CustomPersonne


class CustomUserCreationForm(forms.ModelForm):
    """
    A form for creating a new user.

    Inherits from forms.ModelForm and provides fields and widgets for user registration.

    Attributes:
        birth_date (DateInput): The user's birth date.
        email (EmailInput): The user's email address.
        password (PasswordInput): The user's password.
        confirm_password (PasswordInput): The confirmation of the user's password.

    Labels:
        birth_date: "Date de naissance"
        email: "Email"
        password: "Mot de passe"
        confirm_password: "Confirmez le mot de passe"
    """

    isAdmin = forms.BooleanField(
        initial=False, widget=forms.HiddenInput(), required=False
    )

    class Meta:
        model = CustomUser
        fields = ["dateNaissance", "mail", "password", "confirm_password", "isAdmin"]
        widgets = {
            "dateNaissance": forms.DateInput(attrs={"type": "date"}),
            "mail": forms.EmailInput(),
            "password": forms.PasswordInput(),
            "confirm_password": forms.PasswordInput(),
        }
        labels = {
            "dateNaissance": _("Date de naissance"),
            "mail": _("Email"),
            "password": _("Mot de passe"),
            "confirm_password": _("Confirmez le mot de passe"),
        }


class CompleteUserCreationForm(forms.ModelForm):
    """
    A form for completing the user's profile.

    Inherits from forms.ModelForm and provides fields and widgets for user profile completion.

    Attributes:
        nom (TextInput): The user's last name.
        prenom (TextInput): The user's first name.
        telephone (TextInput): The user's phone number.
        adresse (TextInput): The user's address.
        codePostal (TextInput): The user's postal code.
        ville (TextInput): The user's city.
        pays (TextInput): The user's country.

    Labels:
        nom: "Nom"
        prenom: "Prénom"
        telephone: "Téléphone"
        adresse: "Adresse"
        codePostal: "Code postal"
        ville: "Ville"
        pays: "Pays"
    """

    action = forms.CharField(
        initial='C', widget=forms.HiddenInput(), required=False
    )

    class Meta:
        model = CustomPersonne
        fields = [
            "nom",
            "prenom",
            "sexe",
            "nationalite",
            "adresse",
            "complementAdresse",
            "codePostal",
            "ville",
            "pays",
            "telephone",
            "mobile",
            "courriel2",
            "personneNom",
            "personnePrenom",
            "personneTelephone",
            "personneCourriel",
            "assurance",
            "optionSki",
            "optionSlackline",
            "optionTrail",
            "optionVTT",
            "optionAssurance",
        ]
        widgets = {
            "nom": forms.TextInput(),
            "prenom": forms.TextInput(),
            "sexe": forms.RadioSelect(choices=CustomPersonne.SEXE_CHOICES),
            "nationalite": forms.Select(choices=CustomPersonne.CODE_PAYS),
            "adresse": forms.TextInput(),
            "complementAdresse": forms.TextInput(),
            "codePostal": forms.TextInput(),
            "ville": forms.TextInput(),
            "pays": forms.Select(choices=CustomPersonne.CODE_PAYS),
            "telephone": forms.TextInput(),
            "mobile": forms.TextInput(),
            "courriel2": forms.EmailInput(),
            "personneNom": forms.TextInput(),
            "personnePrenom": forms.TextInput(),
            "personneTelephone": forms.TextInput(),
            "personneCourriel": forms.EmailInput(),
            "assurance": forms.RadioSelect(choices=CustomPersonne.ASSURANCE_CHOICES),
            "optionSki": forms.RadioSelect(choices=CustomPersonne.OPTIONS_CHOICES),
            "optionSlackline": forms.RadioSelect(
                choices=CustomPersonne.OPTIONS_CHOICES
            ),
            "optionTrail": forms.RadioSelect(choices=CustomPersonne.OPTIONS_CHOICES),
            "optionVTT": forms.RadioSelect(choices=CustomPersonne.OPTIONS_CHOICES),
            "optionAssurance": forms.RadioSelect(
                choices=CustomPersonne.OPTION_ASSURANCE_CHOICES
            ),
        }
        labels = {
            "nom": _("Nom"),
            "prenom": _("Prénom"),
            "sexe": _("Sexe"),
            "nationalite": _("Nationalité"),
            "adresse": _("Adresse"),
            "complementAdresse": _("Complément d'adresse (facultatif)"),
            "codePostal": _("Code postal"),
            "ville": _("Ville"),
            "pays": _("Pays"),
            "telephone": _("Téléphone (facultatif)"),
            "mobile": _("Mobile (facultatif)"),
            "courriel2": _("Second Email (facultatif)"),
            "personneNom": _("Nom de la personne à contacter (facultatif)"),
            "personnePrenom": _("Prénom de la personne à contacter (facultatif)"),
            "personneTelephone": _("Téléphone de la personne à contacter (facultatif)"),
            "personneCourriel": _("Email de la personne à contacter (facultatif)"),
            "assurance": _("Assurance"),
            "optionSki": _("Option ski"),
            "optionSlackline": _("Option slackline"),
            "optionTrail": _("Option trail"),
            "optionVTT": _("Option VTT"),
            "optionAssurance": _("Option assurance"),
        }

    def __init__(self, *args, **kwargs):
        super(CompleteUserCreationForm, self).__init__(*args, **kwargs)
        self.fields["nationalite"].initial = "FR"
        self.fields["complementAdresse"].required = False
        self.fields["pays"].initial = "FR"
        self.fields["telephone"].required = False
        self.fields["mobile"].required = False
        self.fields["courriel2"].required = False
        self.fields["personneNom"].required = False
        self.fields["personnePrenom"].required = False
        self.fields["personneTelephone"].required = False
        self.fields["personneCourriel"].required = False
