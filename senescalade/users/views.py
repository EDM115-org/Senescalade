# users/views.py
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib import messages 
from .forms import CustomUserLoginForm

def login_user(request):

    if request.method == "POST":
        form = CustomUserLoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data["email"]
            password = form.cleaned_data["password"]
            user = authenticate(request, email=email, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, 'Vous êtes maintenant connecté.')
                return redirect("success")
            else:
                messages.error(request, 'Échec de l\'authentification. Vérifiez votre email et votre mot de passe.')
        else:
            messages.error(request, 'Formulaire invalide. Vérifiez vos champs.')
    else:
        form = CustomUserLoginForm()
    return render(request, "users/login.html", {"form": form})


def logout_user(request):
    """
    Logs out the user and redirects to the login page.

    Parameters:
    - request: The HTTP request object.

    Returns:
    - A redirect response to the login page.
    """
    logout(request)
    return redirect("login")


