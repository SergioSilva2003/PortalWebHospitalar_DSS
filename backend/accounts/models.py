from django.db import models

class Paciente(models.Model):
    # Usamos o ID do Lovable como chave primária
    id = models.CharField(max_length=100, primary_key=True)
    nome = models.CharField(max_length=255)
    email = models.EmailField()

    def __str__(self):
        return self.nome