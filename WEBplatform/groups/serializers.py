from rest_framework import serializers
from groups.models import learningGroup, Attendance, LessonAttendance, LessonDays, StudentAttendanceStatus, \
    CommentStatus
from user.serializers import UserSerializer


class LessonDaysSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonDays
        fields = ['day_number']


class CommentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentStatus
        fields = ['text', 'status']


class StudentAttendanceStatusSerializer(serializers.ModelSerializer):
    comment = CommentStatusSerializer()

    class Meta:
        model = StudentAttendanceStatus
        fields = ['student', 'status', 'comment']


class LessonAttendanceSerializer(serializers.ModelSerializer):
    students_list = StudentAttendanceStatusSerializer(many=True)

    class Meta:
        model = LessonAttendance
        fields = '__all__'


class AttendanceSerializer(serializers.ModelSerializer):
    lessons_attendance_sheet = LessonAttendanceSerializer(many=True)

    class Meta:
        model = Attendance
        fields = '__all__'


class groupSerializer(serializers.ModelSerializer):
    students = UserSerializer(many=True)
    attendance_sheet = AttendanceSerializer()
    dayOfLessons = LessonDaysSerializer(many=True)

    class Meta:
        model = learningGroup
        fields = '__all__'
