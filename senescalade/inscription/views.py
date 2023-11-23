from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader


def inscription_index(request):
    """
    Renders the index.html template for the inscription app.

    Parameters:
    - request: The HTTP request object.

    Returns:
    - The rendered HTML template.
    """
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        return render(request, "inscription/succes.html")

    else:
        return render(request, "inscription/index.html")


def inscription_success(request):
    """
    Renders the success.html template for the inscription app.

    Parameters:
    - request: The HTTP request object.

    Returns:
    - The rendered HTML template.
    """
    return render(request, "inscription/success.html")
