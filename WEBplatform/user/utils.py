from rest_framework.permissions import IsAuthenticated

from user.serializers import UserSerializer


# пока нигде не применено
class UserViewMixin:
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]