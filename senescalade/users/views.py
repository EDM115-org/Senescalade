# users/views.py
from django.contrib.auth import logout
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages 
from .forms import CustomUserLoginForm
from inscription.models import CustomUser
from django.http import Http404

def login_user(request):

    if request.method == "POST":
        form = CustomUserLoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data["email"]
            password = form.cleaned_data["password"]
            
            try:
                user = get_object_or_404(CustomUser, email=email)
            except Http404:
                return render(request, "users/login.html", {"form": form})

            if email == user.email and password == user.password:
                return render(request, "users/success.html")
            
            else:
                messages.error(request, 'Identifiants invalides. Vérifiez vos champs.')
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


