# users/forms.py
from django import forms
from django.utils.translation import gettext_lazy as _
from inscription.models import CustomUser


class CustomUserLoginForm(forms.Form):
    """
    A form for user login with email and password fields.
    """

    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)

    labels = {
        "email": _("Email"),
        "password": _("Mot de passe"),
    }


