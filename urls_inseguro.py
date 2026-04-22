from django.urls import path
from . import views

urlpatterns = [
    # Esta linha liga o URL /api/login/ à tua função vulnerável
    path('login/', views.login_vulneravel, name='login'),
]