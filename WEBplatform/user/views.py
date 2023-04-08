from rest_framework import status
from rest_framework.generics import (RetrieveUpdateDestroyAPIView, CreateAPIView, ListAPIView)
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import permissions
from django.contrib import auth
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator

from user.models import User
from user.serializers import UserSerializer, UserRegisterSerializer, UserFullSerializer


class UsersListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [IsAuthenticated]


class UserDetailView(RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [IsAuthenticated]


class CheckAuthenticatedView(APIView):
    def get(self, request, format=None):
        user = self.request.user
        print(user)
        try:
            isAuthenticated = user.is_authenticated

            if isAuthenticated:
                return Response({'isAuthenticated': 'success'})
            else:
                return Response({'isAuthenticated': 'error'})
        except:
            return Response({'error': 'Something went wrong when checking authentication status'})


@method_decorator(csrf_protect, name='dispatch')
class SignupView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data

        email = data['email']
        password = data['password']
        re_password = data['re_password']

        try:
            if password == re_password:
                if User.objects.filter(email=email).exists():
                    return Response({'error': 'Пользователь с таким email уже существует.'})
                else:
                    serializer = UserRegisterSerializer(data=request.data)
                    if not serializer.is_valid():
                        data = serializer.errors
                        return Response(data, status=status.HTTP_400_BAD_REQUEST)

                    serializer.save()
                    return Response({'success': 'Пользователь создан успешно!'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Пароли не совпадают'})
        except:
            return Response({'error': 'Недостаточно данных или произошла непредвиденная ошибка.'})


# @method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data

        email = data['email']
        password = data['password']

        try:
            user = auth.authenticate(email=email, password=password)
            print(user)
            if user is not None:
                auth.login(request, user)
                return Response({'success': 'User authenticated'})
            else:
                return Response({'error': 'Error Authenticating'})
        except:
            return Response({'error': 'Something went wrong when logging in'})


class LogoutView(APIView):
    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({'success': 'Loggout Out'})
        except:
            return Response({'error': 'Something went wrong when logging out'})


@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        return Response({'success': 'CSRF cookie set'})


class DeleteAccountView(APIView):
    def delete(self, request, format=None):
        user = self.request.user

        try:
            User.objects.filter(id=user.id).delete()

            return Response({'success': 'User deleted successfully'})
        except:
            return Response({'error': 'Something went wrong when trying to delete user'})


class GetCurrentUserView(APIView):
    def get(self, request):
        user = self.request.user
        try:
            user_serializer = UserFullSerializer(user)
            return Response(user_serializer.data)
        except:
            return Response(
                {'error': 'Произошла непредвиденная ошибка при получении информации о текущем пользователе.'})
