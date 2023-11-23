from django.shortcuts import render


def home_view(request):
    """
    Renders the home page.

    Parameters:
    - request: The HTTP request object.

    Returns:
    - The rendered index.html template.
    """
    return render(request, "index.html")
