from django.db.models.signals import post_save
from django.dispatch import receiver

from learningDirections.models import LearningDirection, Syllabus


# при создании ученбого курса создается учебный план для него
@receiver(post_save, sender=LearningDirection)
def post_save_learning_direction(created, instance, **kwargs):
    if created:
        Syllabus.objects.create(
            learning_direction=instance
        )
