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
@csrf_exempt
def registar_paciente(request):
    try:
        nome = request.data.get('name')
        email = request.data.get('email')

        if not nome or not email:
            return Response({"error": "Nome e email são obrigatórios"}, status=400)

        # Gera ID único para evitar erro de UNIQUE constraint
        novo_id = f"usr_{uuid.uuid4().hex[:8]}"

        # Uso do ORM para um registo estável
        novo_paciente = Paciente.objects.create(
            id=novo_id,
            nome=nome,
            email=email
        )

        return Response({
            "id": novo_paciente.id,
            "name": novo_paciente.nome,
            "email": novo_paciente.email,
            "status": "sucesso"
        }, status=201)
        
    except Exception as e:
        print(f"Erro no Registo: {e}")
        return Response({"error": str(e)}, status=400)