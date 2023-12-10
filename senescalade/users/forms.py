# users/forms.py
from django import forms
from django.utils.translation import gettext_lazy as _


class CustomUserLoginForm(forms.Form):
    """
    A form for user login with email and password fields.
    """

    mail = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)

    labels = {
        "mail": _("Email"),
        "password": _("Mot de passe"),
    }
