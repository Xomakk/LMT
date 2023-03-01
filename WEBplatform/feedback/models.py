from django.db import models

from learningDirections.models import learningDirection
from user.models import User


class FeedbackParam(models.Model):
    name = models.CharField(max_length=200)
    learning_direction = models.ForeignKey(learningDirection, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.learning_direction} >> {self.name}'


class Feedback(models.Model):
    parameter = models.ForeignKey(FeedbackParam, on_delete=models.PROTECT)
    comment = models.TextField()
    send_date = models.DateField(auto_now_add=True)

    student = models.ForeignKey(User, on_delete=models.PROTECT)

    def __str__(self):
        return f'{self.parameter}: \n\n>> {self.comment}'
