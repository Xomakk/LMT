from django.contrib import admin

from learningDirections.models import LearningDirection, Syllabus, Topic


@admin.register(LearningDirection)
class TopicAdmin(admin.ModelAdmin):
    list_display = ['name', 'course_duration']
    list_filter = ['name', 'course_duration']
    list_editable = ['course_duration']


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ['number', 'name', 'methodical_material', 'syllabus']
    list_filter = ['syllabus']


@admin.register(Syllabus)
class TopicAdmin(admin.ModelAdmin):
    list_display = ['year', 'learning_direction']
    list_filter = ['year']
