from django.db import models


# lesson groups
from user.models import User
# from learningDirections.models import learningDirection


class learningGroup(models.Model):
    name = models.CharField(max_length=50)
    dayOfLessons = models.CharField(max_length=50)
    # direction = models.ForeignKey(learningDirection, on_delete=models.PROTECT, null=True)
    studyCourse = models.IntegerField(default=1)
    location = models.CharField(max_length=30, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    firstLesson = models.DateTimeField(auto_now=True)
    teacher = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    students = models.ManyToManyField(User, blank=True, related_name='students')

    def __str__(self):
        return self.name