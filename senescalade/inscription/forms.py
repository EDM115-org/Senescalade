from django import forms
from django.utils.translation import gettext_lazy as _
from .models import CustomUser


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


class CustomUserLoginForm(forms.Form):
    """A form for user login with email and password fields."""

    mail = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)
