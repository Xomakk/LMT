import learningDirections
# from learningDirections.serializers import learningDirectionSerializer
from user.models import User
from rest_framework import serializers


class UserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField()

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2', 'name', 'lastname', 'is_staff', 'is_active', 'userType']

    def save(self, *args, **kwargs):
        user = User(
            email=self.validated_data['email'],  # Назначаем Email
            username=self.validated_data['username'],  # Назначаем Логин
            name=self.validated_data['name'],
            lastname=self.validated_data['lastname'],
            userType=self.validated_data['userType'],
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
    userType = serializers.StringRelatedField(read_only=True)
    # learningDirections = learningDirectionSerializer(many=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'lastname', 'userType']
