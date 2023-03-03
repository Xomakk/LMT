from django.contrib import admin

from learningDirections.models import LearningDirection, Syllabus, Topic

admin.site.register(LearningDirection)
admin.site.register(Syllabus)
admin.site.register(Topic)