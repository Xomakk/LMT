from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.response import Response

from feedback.models import Feedback, FeedbackList, FeedbackGroupList, FeedbackStudentList
from feedback.serializers import FeedbackSerializer, FeedbackListSerializer, FeedbackGroupListSerializer, \
    FeedbackStudentListFullSerializer


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

        return Response(serializer.data)
