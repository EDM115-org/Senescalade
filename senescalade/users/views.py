# users/views.py
from django.contrib.auth import logout
from django.shortcuts import render, redirect, get_object_or_404
from django.http import Http404
from django.contrib.sessions.backends.db import SessionStore
from .forms import CustomUserLoginForm
from inscription.forms import CompleteUserCreationForm, CustomUserCreationForm
from inscription.models import CustomUser, CustomPersonne


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
                # Login the user
                s = SessionStore()
                s["user_id"] = user.idInscription
                s["mail"] = user.mail
                s.create()

                request.session["session"] = s.session_key

                # If you want get data to the session you can do this
                # s = SessionStore(session_key=request.session["session"])
                # variable = s["variable"]

                if user.isAdmin == 1:
                    return render(
                        request, "users/PortailAdmin/success.html", {"user": user}
                    )
                try:
                    personne = get_object_or_404(
                        CustomPersonne, lInscription=user.idInscription
                    )
                    form = CompleteUserCreationForm(instance=personne)
                    return render(
                        request,
                        "users/PortailUser/Inscrit/success.html",
                        {"user": personne, "form": form},
                    )
                except Http404:
                    form = CustomUserCreationForm(instance=user)

                    return render(
                        request,
                        "users/PortailUser/NonInscrit/success.html",
                        {"user": user, "form": form},
                    )

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
    return render(request, "users/logout.html")


def creneauNonInscrit(request):
    s = SessionStore(session_key=request.session["session"])
    user_mail = s["mail"]

    user = CustomUser.objects.get(mail=user_mail)

    return render(request, "users/PortailUser/NonInscrit/creneau.html", {"user": user})


def edit_user(request):
    s = SessionStore(session_key=request.session["session"])
    user_mail = s["mail"]
    print("mail :", user_mail)

    try:
        user = get_object_or_404(CustomUser, mail=user_mail)
    except Http404:
        return render(
            request, "users/PortailUser/NonInscrit/success.html", {"user": user}
        )

    user = CustomUser.objects.get(mail=user_mail)

    form = CustomUserCreationForm(instance=user)

    if request.method == "POST":
        form = CustomUserCreationForm(request.POST, instance=user)
        if form.is_valid():
            user = form.save(commit=False)
            user.save()
            request.session["new_user_id"] = user.idInscription
            request.session["mail"] = user.mail
            request.session.save()

            s["mail"] = user.mail
            s.save()

            return render(
                request, "users/PortailUser/NonInscrit/success.html", {"user": user}
            )
        print("hello")
        return render(
            request,
            "users/PortailUser/NonInscrit/edit.html",
            {"user": user, "form": form},
        )
    else:
        print("hi")
        return render(
            request,
            "users/PortailUser/NonInscrit/edit.html",
            {"user": user, "form": form},
        )
