from django.shortcuts import render


def inscription_index(request):
    """
    Renders the index.html template for the inscription app.

    Parameters:
    - request: The HTTP request object.

    Returns:
    - The rendered HTML template.
    """
    return render(request, 'inscription/index.html')
