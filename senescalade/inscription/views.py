from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm, CustomUserLoginForm
from .models import DataCalendar
from django.contrib.auth import authenticate, login, logout


def register_user(request):
    """
    Register a new user.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: The HTTP response object.

    """
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            new_user = form.save(commit=False)
            new_user.save()

            # Récupérer toutes les lignes de la table
            queryset = DataCalendar.objects.all()

            return render(
                request,
                "inscription/creneau.html",
                {"new_user": new_user, "data": queryset},
            )

    else:
        form = CustomUserCreationForm()
    return render(request, "inscription/register.html", {"form": form})


def login_user(request):
    """
    Logs in a user.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: The HTTP response object.

    """
    if request.method == "POST":
        form = CustomUserLoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data["email"]
            password = form.cleaned_data["password"]
            user = authenticate(email=email, password=password)
            if user is not None:
                login(request, user)
                return redirect("home")
    else:
        form = CustomUserLoginForm()
    return render(request, "inscription/login.html", {"form": form})


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


def creneau(request):
    """
    Affiche les créneaux disponibles

    Parameters:
    - request: The HTTP request object.

    Returns:
    - A redirect response to the login page.
    """
    queryset = DataCalendar.objects.all()
    return render(request, "inscription/creneau.html", {"data": queryset})
