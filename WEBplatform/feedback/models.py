from django.db import models

from groups.models import Student
from learningDirections.models import LearningDirection
from user.models import User


class FeedbackParam(models.Model):
    name = models.CharField(max_length=200)
    learning_direction = models.ForeignKey(LearningDirection, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f'{self.learning_direction.name} | {self.name}'


class Feedback(models.Model):
    parameter = models.ForeignKey(FeedbackParam, on_delete=models.CASCADE)
    comment = models.TextField()
    send_date = models.DateField(auto_now_add=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.parameter}: | {self.parameter.learning_direction.name}: | {self.comment}'
