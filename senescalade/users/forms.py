# users/forms.py
from django import forms
from django.utils.translation import gettext_lazy as _


class CustomUserLoginForm(forms.Form):
    """A form for user login with email and password fields."""

    email = forms.EmailField()
    mot_de_passe = forms.CharField(widget=forms.PasswordInput)
    fields = ["mail", "password"]

    labels = {
        "mail": _("Email"),
        "password": _("Mot de passe"),
    }
