from django.shortcuts import render


def inscription_index(request):
    return render(request, 'inscription/index.html')
