from django.db import models

class Paciente(models.Model):
    nome = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255) # Adiciona esta linha!

    def __str__(self):
        return self.nome