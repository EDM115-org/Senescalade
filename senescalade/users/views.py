from math import e
from django.contrib.auth import logout
from django.core import serializers
from django.shortcuts import render, get_object_or_404
from django.http import Http404
from django.contrib.sessions.backends.db import SessionStore
from .forms import CustomUserLoginForm
from inscription.forms import CompleteUserCreationForm, CustomUserCreationForm
from inscription.models import CustomUser, CustomPersonne
from .models import Seance


def login_user(request):
    """
    Handles user login functionality.

    Args:
        request (HttpRequest): The HTTP request object containing the user's login information.

    Returns:
        Rendered HTML page: The rendered login form or one of the success pages based on the user's role and enrollment status.
    """
    if request.method == "POST":
        form = CustomUserLoginForm(request.POST)
        if form.is_valid():
            mail = form.cleaned_data["email"]
            password = form.cleaned_data["mot_de_passe"]

            try:
                user = get_object_or_404(CustomUser, mail=mail)
            except Http404:
                return render(request, "users/login.html", {"form": form})

            if mail == user.mail and password == user.password:
                s = SessionStore()
                s["user_id"] = user.idInscription
                s["mail"] = user.mail
                s.create()
                request.session["session"] = s.session_key

                if user.isAdmin == 1:
                    return render(
                        request, "users/PortailAdmin/success.html", {"user": user}
                    )
                try:
                    personne = get_object_or_404(
                        CustomPersonne, lInscription=user.idInscription
                    )
                    serialized_data = serializers.serialize("json", [personne])
                    return render(
                        request,
                        "users/PortailUser/Inscrit/success.html",
                        {"user": serialized_data, "mail": mail},
                    )
                except Http404:
                    serialized_data = serializers.serialize("json", [user])

                    return render(
                        request,
                        "users/PortailUser/NonInscrit/success.html",
                        {"user": serialized_data, "mail": mail},
                    )
            else:
                return render(request, "users/login.html", {"form": form})
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
    return render(request, "users/logout.html")


def creneau(request):
    s = SessionStore(session_key=request.session["session"])
    user_mail = s["mail"]

    user = CustomUser.objects.get(mail=user_mail)
    serialized_data = serializers.serialize("json", [user])

    try:
        personne = get_object_or_404(CustomPersonne, lInscription=user.idInscription)
        seance = get_object_or_404(Seance, pk=personne.seance)
        serialized_seance = serializers.serialize("json", [seance])
        serialized_data = serializers.serialize("json", [personne])
        return render(
            request,
            "users/PortailUser/Inscrit/creneau.html",
            {"user": serialized_data, "seance": serialized_seance},
        )
    except Http404:
        return render(
            request,
            "users/PortailUser/NonInscrit/success.html",
            {"user": serialized_data, "mail": user_mail},
        )


def edit_user(request):
    s = SessionStore(session_key=request.session["session"])
    user_mail = s["mail"]
    user = get_object_or_404(CustomUser, mail=user_mail)

    try:
        personne = CustomPersonne.objects.get(lInscription=user.idInscription)
        est_inscrit = True
    except CustomPersonne.DoesNotExist:
        est_inscrit = False

    if est_inscrit:
        form = CompleteUserCreationForm(instance=personne)
        template = "users/PortailUser/Inscrit/edit.html"
    else:
        form = CustomUserCreationForm(instance=user)
        template = "users/PortailUser/NonInscrit/edit.html"

    if request.method == "POST":
        if est_inscrit:
            form = CompleteUserCreationForm(request.POST, instance=personne)
        else:
            form = CustomUserCreationForm(request.POST, instance=user)

        if form.is_valid():
            form.save()
            request.session["mail"] = user.mail
            request.session.save()
            s["mail"] = user.mail
            s.save()

            success_template = (
                "users/PortailUser/Inscrit/success.html"
                if est_inscrit
                else "users/PortailUser/NonInscrit/success.html"
            )
            return render(request, success_template, {"user": user})

    serialized_data = serializers.serialize("json", [user])
    return render(request, template, {"user": serialized_data, "form": form})
