from django.http import HttpResponse
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from feedback.generate_report_for_student import generate_feedback
from feedback.models import Feedback, FeedbackList, FeedbackGroupList, FeedbackStudentList, GeneratedReport
from feedback.report_tables import create_student_report_table, create_group_report_table
from feedback.serializers import FeedbackSerializer, FeedbackListSerializer, FeedbackGroupListSerializer, \
    FeedbackStudentListFullSerializer
from learningDirections.models import LearningDirection


class FeedbackCreateView(ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    # permission_classes = [IsAuthenticated]


class FeedbackDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    # permission_classes = [IsAuthenticated]


class FeedbackListCreateView(ListCreateAPIView):
    queryset = FeedbackList.objects.all()
    serializer_class = FeedbackListSerializer
    # permission_classes = [IsAuthenticated]


class FeedbackListDetailView(RetrieveUpdateDestroyAPIView):
    queryset = FeedbackList.objects.all()
    serializer_class = FeedbackListSerializer
    # permission_classes = [IsAuthenticated]


class FeedbackGroupListCreateView(ListAPIView):
    queryset = FeedbackGroupList.objects.all()
    serializer_class = FeedbackGroupListSerializer

    def get(self, request, *args, **kwargs):
        group_id = kwargs.get('group_id', None)
        if group_id:
            queryset = filter(lambda obj: obj.learning_group.id == group_id, self.filter_queryset(self.get_queryset()))
        else:
            queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class FeedbackStudentListDetailView(RetrieveUpdateDestroyAPIView):
    queryset = FeedbackStudentList.objects.all()
    serializer_class = FeedbackStudentListFullSerializer

    def update(self, request, *args, **kwargs):
        feedback = request.data.get('feedback', None)
        if feedback:
            for fb in feedback:
                fb_instance = Feedback.objects.get(pk=fb['id'])
                serializer = FeedbackSerializer(fb_instance, data=fb, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        generated_report = instance.generated_report
        if feedback:
            course_id = feedback[0]['parameter']['learning_direction']
            course = LearningDirection.objects.get(pk=course_id)
            if course and not generated_report.text:
                generated_report.text = generate_feedback(
                    instance.student.name,
                    list(map(lambda i: i.get('comment'), feedback)),
                    course.name
                )
                generated_report.save()
            else:
                changed_generated_report = request.data.get('generated_report')
                if changed_generated_report:
                    generated_report.text = changed_generated_report['text']
                    generated_report.save()

        return Response(serializer.data)


class RegenerateReportView(APIView):
    def post(self, request, *args, **kwargs):
        report_id = request.data.get('id')
        if report_id:
            report = GeneratedReport.objects.get(pk=report_id)
            if report:
                student_feedback_list = report.feedback_student_list
                student_name = student_feedback_list.student.name
                params_queryset = student_feedback_list.feedback.all()
                params_list = list(map(lambda i: i.comment, params_queryset))
                course_name = params_queryset[0].parameter.learning_direction.name
                report.text = generate_feedback(
                    student_name,
                    params_list,
                    course_name
                )
                report.save()
                return Response(data={'text': report.text}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class DownloadGroupReport(APIView):
    def get(self, request, *args, **kwargs):
        group_id = kwargs.get('group_id')
        if group_id:
            wb_response = create_group_report_table(group_id)
            return wb_response
        return Response(status=status.HTTP_400_BAD_REQUEST)


class DownloadStudentReport(APIView):
    def get(self, request, *args, **kwargs):
        student_id = kwargs.get('student_id')
        if student_id:
            wb_response = create_student_report_table(student_id)
            return wb_response
        return Response(status=status.HTTP_400_BAD_REQUEST)