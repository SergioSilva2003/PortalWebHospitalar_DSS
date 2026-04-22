from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from .models import Paciente
import uuid

# 1. CLASSE PARA EDITAR PERFIL (Vulnerável para Testes)
class PacienteDetail(APIView):
    def put(self, request, pk):
        novo_nome = request.data.get('name')
        query = f"UPDATE accounts_paciente SET nome = '{novo_nome}' WHERE id = '{pk}'"
        
        with connection.cursor() as cursor:
            # Permite múltiplos comandos para testar SQL Injection
            cursor.connection.executescript(query)
            
        return Response({"status": "Sucesso!"})

# 2. CLASSE PARA LISTAR HISTÓRICO (Vulnerável para Testes)
class HistoricoList(APIView):
    def get(self, request):
        try:
            paciente_id = request.query_params.get('paciente')
            query = f"SELECT data, tipo, notas FROM accounts_historico WHERE paciente_id = '{paciente_id}'"
            
            with connection.cursor() as cursor:
                cursor.execute(query)
                rows = cursor.fetchall()

            dados = [{"date": r[0], "type": r[1], "notes": r[2]} for r in rows]
            return Response(dados)
        except Exception as e:
            print(f"Erro no Histórico: {e}")
            return Response([])

# 3. FUNÇÃO DE REGISTO (Segura e Normalizada)
@api_view(['POST'])
def registar_paciente(request):
    nome = request.data.get('name') # ou 'nome', confirma o que envias no JSON
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        # Criamos o paciente SEM passar o ID. O SQLite atribui o 1, 2, 3...
        novo_paciente = Paciente.objects.create(
            nome=nome,
            email=email,
            password=password
        )
        return Response({"message": "Sucesso", "id": novo_paciente.id}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])

def login_vulneravel(request):
    email = request.data.get('email')
    password = request.data.get('password')

    # O ERRO FATAL: Concatenação direta de strings na Query
    query = f"SELECT id, nome, email FROM accounts_paciente WHERE email = '{email}' AND password = '{password}'"
    
    with connection.cursor() as cursor:
        cursor.execute(query)
        user = cursor.fetchone()

    if user:
        return Response({
            "id": user[0],
        "name": user[1],
        "email": user[2], # Se o índice 2 for o email na tua query
        "role": "patient"
        }, status=200)
    else:
        return Response({"error": "Login falhou"}, status=401)