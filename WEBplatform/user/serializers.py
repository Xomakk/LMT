import learningDirections
# from learningDirections.serializers import learningDirectionSerializer
from user.models import User
from rest_framework import serializers


class UserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField()

    class Meta:
        model = User
        fields = ['email', 'password', 'password2', 'name', 'lastname', 'patronymic', 'is_staff', 'is_manager',
                  'is_teacher', 'is_student']

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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'lastname', 'patronymic', 'is_manager', 'is_teacher', 'is_student']
