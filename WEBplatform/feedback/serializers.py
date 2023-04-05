from rest_framework import serializers

from feedback.models import Feedback, FeedbackParam, FeedbackList, FeedbackGroupList, FeedbackStudentList
from groups.models import Student, LearningGroup
from groups.serializers import LearningGroupSerializer
from user.serializers import UserSerializer


class FeedbackParamSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackParam
        fields = '__all__'


class FeedbackSerializer(serializers.ModelSerializer):
    parameter = FeedbackParamSerializer(required=False, read_only=True)

    class Meta:
        model = Feedback
        fields = '__all__'


class StudentsFeedbackFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'lastname', 'patronymic', 'avatar']


class FeedbackStudentListSerializer(serializers.ModelSerializer):
    student = StudentsFeedbackFieldSerializer(required=False, read_only=True)

    class Meta:
        model = FeedbackStudentList
        fields = '__all__'


class FeedbackStudentListFullSerializer(serializers.ModelSerializer):
    student = StudentsFeedbackFieldSerializer(required=False, read_only=True)
    feedback = FeedbackSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = FeedbackStudentList
        exclude = ['feedback_group_list']


class LearningGroupFeedbackSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True, required=False)
    class Meta:
        model = LearningGroup
        fields = '__all__'


class FeedbackGroupListSerializer(serializers.ModelSerializer):
    feedback_student_list = FeedbackStudentListSerializer(many=True, read_only=True, required=False)
    learning_group = LearningGroupFeedbackSerializer(read_only=True, required=False)

    class Meta:
        model = FeedbackGroupList
        fields = '__all__'


class FeedbackListSerializer(serializers.ModelSerializer):
    feedback_group_list = FeedbackGroupListSerializer(many=True, required=False, read_only=True)
    responsible = UserSerializer(read_only=True, required=False)

    class Meta:
        model = FeedbackList
        fields = '__all__'
