from django.test import TestCase

from groups.models import LearningGroup

# Create your tests here.
group = LearningGroup.objects.get(learning_direction=1)
print(group)