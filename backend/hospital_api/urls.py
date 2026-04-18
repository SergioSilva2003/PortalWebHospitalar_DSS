"""
URL configuration for hospital_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
# Adiciona este import (ajusta 'hospital_api' se o nome da tua app for diferente)
from accounts.views import PacienteDetail, HistoricoList, registar_paciente

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/pacientes/<str:pk>/', PacienteDetail.as_view()),
    path('api/historico/', HistoricoList.as_view()),
    path('api/registar/', registar_paciente)

]
