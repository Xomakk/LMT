from django.contrib.auth.models import Group

import learningDirections
# from learningDirections.serializers import learningDirectionSerializer
from user.models import User
from rest_framework import serializers


class UserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField()

    class Meta:
        model = User
        fields = ['email', 'password', 'password2', 'name', 'lastname', 'patronymic', 'is_staff', 'phone']

    def save(self, *args, **kwargs):
        user = User(
            email=self.validated_data['email'],  # Назначаем Email
            name=self.validated_data['name'],
            lastname=self.validated_data['lastname'],
            patronymic=self.validated_data['patronymic'],
            **kwargs,
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        if password != password2:
            raise serializers.ValidationError({password: "Пароль не совпадает"})
        user.set_password(password)
        user.save()
        return user


class GroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer):
    # groups = GroupsSerializer(many=True, required=False)

    class Meta:
        model = User
        exclude = ['password', 'created_at', 'updated_at', 'is_superuser', 'is_staff']
