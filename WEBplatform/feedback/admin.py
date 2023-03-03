from django.contrib import admin

from feedback.models import Feedback, FeedbackParam

admin.site.register(Feedback)
admin.site.register(FeedbackParam)