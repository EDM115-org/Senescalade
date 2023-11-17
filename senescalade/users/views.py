from django.shortcuts import render

def connexion(request):
    return render(request, 'users/index.html')
