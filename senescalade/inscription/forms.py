# inscription/forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(max_length=254, help_text='Required. Enter a valid email address.')
    birthdate = forms.DateField(widget=forms.SelectDateWidget, help_text='Required. Enter your date of birth.')

    class Meta:
        model = get_user_model()
        fields = ('email', 'password1', 'password2', 'birthdate')
