from django.shortcuts import render
from django.core import serializers
from .forms import CustomUserCreationForm, CompleteUserCreationForm
from .models import CustomUser, DataCalendar
from django.contrib.sessions.models import Session


def register_user(request):
    """
    Register a new user.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: The HTTP response object.

    """
    if request.method == "POST":
        form_id = request.POST.get("form_id")
        if form_id == "register":
            form = CustomUserCreationForm(request.POST)
            if form.is_valid():
                new_user = form.save(commit=False)
                new_user.save()
                request.session["new_user_id"] = new_user.idInscription
                request.session.save()
                queryset = DataCalendar.objects.all()
                serialized_data = serializers.serialize("json", queryset)

                return render(
                    request,
                    "inscription/creneau.html",
                    {"user": new_user, "data": serialized_data},
                )
            return render(request, "error.html", {"error": "Le formulaire n'est pas valide. Veuillez réessayer."})
        elif form_id == "creneau":
            selected_event_id = request.POST.get("selectedEventId")
            new_user_id = request.session.get("new_user_id")
            if new_user_id is not None:
                new_user = CustomUser.objects.get(idInscription=new_user_id)
                form = CompleteUserCreationForm()
                return render(request, "inscription/complete_register.html", {"form": form, "event_id": selected_event_id, "user": new_user})
            return render(request, "error.html", {"error": "L'identification a échouée. Soit la session a expirée, soit vous n'avez pas rempli le formulaire d'inscription. Veuillez réessayer."})
        elif form_id == "waitlist":
            print(request.POST)
            return render(request, "error.html", {"error": "La liste d'attente n'est pas encore implémentée. Veuillez réessayer plus tard."})
    form = CustomUserCreationForm()
    return render(request, "inscription/register.html", {"form": form})


def debug_calendar(request):
    """Debug view to get all the events on the calendar"""
    if request.method == "POST":
        form_id = request.POST.get("form_id")
        if form_id == "creneau":
            selected_event_id = request.POST.get("selectedEventId")
            form = CompleteUserCreationForm()
            return render(request, "inscription/complete_register.html", {"form": form, "id": selected_event_id})
        elif form_id == "waitlist":
            print(request.POST)
    queryset = DataCalendar.objects.all()
    serialized_data = serializers.serialize("json", queryset)

    return render(
        request,
        "inscription/debug_calendar.html",
        {"data": serialized_data},
    )
