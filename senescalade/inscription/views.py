# views.py (mise à jour)
from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from .forms import CustomUserCreationForm


def inscription_index(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data.get("email")

            # Vérifier si l'e-mail est déjà utilisé
            if get_user_model().objects.filter(email=email).exists():
                return render(
                    request,
                    "inscription/index.html",
                    {"form": form, "error_message": "This email is already in use."},
                )

            form.save()
            return redirect("inscription_success")
    else:
        form = CustomUserCreationForm()

    return render(request, "inscription/index.html", {"form": form})


def inscription_success(request):
    return render(request, "inscription/success.html")
