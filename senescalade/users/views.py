from django.shortcuts import render


def connexion(request):
    """
    This function handles the request for the 'connexion' view.
    It renders the 'index.html' template.
    """
    return render(request, "users/index.html")
