from django.contrib import admin

from feedback.models import Feedback, FeedbackParam

# Register your models here.
admin.site.register(Feedback)
admin.site.register(FeedbackParam)