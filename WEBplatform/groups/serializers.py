from rest_framework import serializers
from groups.models import learningGroup
from user.serializers import UserSerializer


class groupSerializer(serializers.ModelSerializer):
    students = UserSerializer(many=True)

    class Meta:
        model = learningGroup
        fields = '__all__'
