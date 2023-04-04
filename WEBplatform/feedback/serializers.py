from rest_framework import serializers

from feedback.models import Feedback, FeedbackParam, FeedbackList, FeedbackGroupList
from groups.serializers import LearningGroupSerializer
from user.serializers import UserSerializer


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        exclude = ['feedback_group_list']


class FeedbackParamSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackParam
        fields = '__all__'


class FeedbackGroupListSerializer(serializers.ModelSerializer):
    learning_group = LearningGroupSerializer(read_only=True, required=False)

    class Meta:
        model = FeedbackGroupList
        fields = ['learning_group']


class FeedbackListSerializer(serializers.ModelSerializer):
    feedback_group_list = FeedbackGroupListSerializer(many=True, required=False, read_only=True)
    responsible = UserSerializer(read_only=True, required=False)

    class Meta:
        model = FeedbackList
        fields = '__all__'
