from rest_framework import status
from rest_framework.generics import (RetrieveUpdateDestroyAPIView, CreateAPIView, ListAPIView)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from user.models import User
from user.serializers import UserSerializer, UserRegisterSerializer


class UserRegistrView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    # Создаём метод для создания нового пользователя
    def post(self, request, *args, **kwargs):
        serializer = UserRegisterSerializer(data=request.data)
        # Создаём список data
        data = {}
        # Проверка данных на валидность
        if serializer.is_valid():
            # Сохраняем нового пользователя
            serializer.save()
            # Добавляем в список значение ответа True
            data['response'] = True
            # Возвращаем что всё в порядке
            return Response(data, status=status.HTTP_200_OK)
        else:  # Иначе
            data = serializer.errors
            return Response(data)


class UsersListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class StudentsListView(ListAPIView):
    queryset = User.objects.filter(is_student=True)
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class TeachersListView(ListAPIView):
    queryset = User.objects.filter(is_teacher=True)
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class ManagersListView(ListAPIView):
    queryset = User.objects.filter(is_manager=True)
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class UserDetailView(RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class CurrentUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
