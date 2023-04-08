import learningDirections
# from learningDirections.serializers import learningDirectionSerializer
from user.models import User
from rest_framework import serializers


class UserRegisterSerializer(serializers.ModelSerializer):
    re_password = serializers.CharField()

    class Meta:
        model = User
        fields = ['email', 'password', 're_password', 'name', 'lastname', 'patronymic', 'is_staff', 'phone']

    def save(self, *args, **kwargs):
        user = User(
            email=self.validated_data['email'],  # Назначаем Email
            name=self.validated_data['name'],
            lastname=self.validated_data['lastname'],
            patronymic=self.validated_data['patronymic'],
            **kwargs,
        )
        password = self.validated_data['password']
        re_password = self.validated_data['re_password']
        if password != re_password:
            raise serializers.ValidationError({password: "Пароль не совпадает"})
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'lastname', 'patronymic', 'phone']


class UserFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password', 'created_at', 'updated_at']
