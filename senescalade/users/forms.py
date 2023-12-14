# users/forms.py
from django import forms
from django.utils.translation import gettext_lazy as _


class CustomUserLoginForm(forms.Form):
    """A form for user login with email and password fields."""

    email = forms.EmailField()
    mot_de_passe = forms.CharField(widget=forms.PasswordInput)
    fields = ["email", "mot_de_passe"]
    
    labels = {
        "email": _("Email"),
        "mot_de_passe": _("Mot de passe"),
    }
