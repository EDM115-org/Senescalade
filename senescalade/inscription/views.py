from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm, CustomUserLoginForm
from django.contrib.auth import authenticate, login, logout

def register_user(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            new_user = form.save(commit=False)
            new_user.save()

            return render(request, 'inscription/creneau.html', {'new_user': new_user})
    else:
        form = CustomUserCreationForm()
    return render(request, 'inscription/register.html', {'form': form})

def login_user(request):
    if request.method == 'POST':
        form = CustomUserLoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(email=email, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
    else:
        form = CustomUserLoginForm()
    return render(request, 'inscription/login.html', {'form': form})

def logout_user(request):
    logout(request)
    return redirect('login')
