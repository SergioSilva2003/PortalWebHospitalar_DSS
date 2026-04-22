from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Paciente

# 1. EDITAR PERFIL (SEGURO - Usa ORM)
class PacienteDetail(APIView):
    def put(self, request, pk):
        novo_nome = request.data.get('name')
        paciente = Paciente.objects.filter(pk=pk).first()
        if not paciente:
            return Response({"error": "Paciente não encontrado"}, status=404)
        
        paciente.nome = novo_nome
        paciente.save()
        return Response({"status": "Sucesso! Perfil atualizado com segurança."})

# 2. LISTAR HISTÓRICO (SEGURO - Query Parametrizada)
class HistoricoList(APIView):
    def get(self, request):
        paciente_id = request.query_params.get('paciente')
        query = "SELECT data, tipo, notas FROM accounts_historico WHERE paciente_id = %s"
        try:
            with connection.cursor() as cursor:
                cursor.execute(query, [paciente_id])
                rows = cursor.fetchall()
            dados = [{"date": r[0], "type": r[1], "notes": r[2]} for r in rows]
            return Response(dados)
        except Exception as e:
            return Response({"error": "Erro ao processar histórico"}, status=500)

# 3. LOGIN SEGURO (SEGURO - Usa ORM)
@api_view(['POST'])
def login_seguro(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = Paciente.objects.filter(email=email, password=password).first()
    if user:
        return Response({
            "id": user.id,
            "name": user.nome,
            "email": user.email,
            "role": "patient"
        }, status=200)
    return Response({"error": "Credenciais inválidas"}, status=401)

# 4. REGISTAR PACIENTE (ESTAVA A FALTAR AQUI)
@api_view(['POST'])
def registar_paciente(request):
    nome = request.data.get('name')
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        # O uso do .create() é seguro contra SQL Injection por padrão
        novo_paciente = Paciente.objects.create(
            nome=nome,
            email=email,
            password=password
        )
        return Response({"message": "Sucesso", "id": novo_paciente.id}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)