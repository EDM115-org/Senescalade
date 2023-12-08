from django.shortcuts import render
from django.core import serializers
from .forms import CustomUserCreationForm, CustomUserLoginForm
from .models import DataCalendar


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
            queryset = DataCalendar.objects.all()
            serialized_data = serializers.serialize('json', queryset)

            return render(
                request,
                "inscription/creneau.html",
                {"user": new_user, "data": serialized_data},
            )
    else:
        form = CustomUserCreationForm()
    return render(request, "inscription/register.html", {"form": form})

def debug_calendar(request):
    """Debug view to get all the events on the calendar"""
    queryset = DataCalendar.objects.all()
    serialized_data = serializers.serialize('json', queryset)

    return render(
        request,
        "inscription/debug_calendar.html",
        {"data": serialized_data},
    )

