# Create your views here.
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from feedback.models import FeedbackParam
from feedback.serializers import FeedbackParamSerializer
from learningDirections.models import LearningDirection, Syllabus, Topic
from learningDirections.serializers import SyllabusSerializer, TopicSerializer, \
    LearningDirectionSerializer, LearningDirectionAttendanceSerializer


class LearningDirectionCreateView(ListCreateAPIView):
    queryset = LearningDirection.objects.all()
    serializer_class = LearningDirectionSerializer

    # permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        course_id = serializer.data.get('id', None)
        feedback_params = request.data.get('feedback_params', None)
        if feedback_params:
            if course_id and feedback_params:
                try:
                    for param in feedback_params:
                        del param['id']
                        param['learning_direction'] = course_id
                        serializer = FeedbackParamSerializer(data=param, partial=True)
                        serializer.is_valid(raise_exception=True)
                        serializer.save()
                except Exception:
                    return Response(status=status.HTTP_400_BAD_REQUEST, headers=headers)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class LearningDirectionAttendanceListView(ListAPIView):
    queryset = LearningDirection.objects.all()
    serializer_class = LearningDirectionAttendanceSerializer
    # permission_classes = [IsAuthenticated]


class LearningDirectionDetailView(RetrieveUpdateDestroyAPIView):
    queryset = LearningDirection.objects.all()
    serializer_class = LearningDirectionSerializer

    # permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        feedback_params = request.data.get('feedback_params', None)
        print(feedback_params)
        try:
            id_list = list(filter(lambda id: type(id) is int, map(lambda item: item['id'], feedback_params)))
            FeedbackParam.objects.filter(learning_direction=instance.id).exclude(id__in=id_list).delete()
            if feedback_params:
                for param in feedback_params:
                    if type(param['id']) is not int:
                        del param['id']
                        param['learning_direction'] = instance.id
                    param_id = param.get('id', None)
                    if param_id:
                        obj = FeedbackParam.objects.get(pk=param_id)
                        serializer = FeedbackParamSerializer(obj, data=param, partial=True)
                    else:
                        serializer = FeedbackParamSerializer(data=param, partial=True)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data)


# TIME TABLE
class SyllabusCreateView(ListCreateAPIView):
    queryset = Syllabus.objects.all()
    serializer_class = SyllabusSerializer
    # permission_classes = [IsAuthenticated]


class SyllabusDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Syllabus.objects.all()
    serializer_class = SyllabusSerializer
    # permission_classes = [IsAuthenticated]


class SyllabusCurrentView(APIView):
    def get(self, request, *args, **kwargs):
        direction_id = kwargs.get('direction_id', None)

        if direction_id:
            syllabus = Syllabus.objects.filter(learning_direction=direction_id).first()
            return Response(SyllabusSerializer(syllabus).data, status=status.HTTP_200_OK)

        return Response({'error': 'syllabus not found'}, status=status.HTTP_404_NOT_FOUND)


class TopicCreateView(ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    # permission_classes = [IsAuthenticated]


class TopicDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    # permission_classes = [IsAuthenticated]
