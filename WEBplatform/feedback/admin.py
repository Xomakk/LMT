from django.contrib import admin

from feedback.models import Feedback, FeedbackParam, FeedbackList, FeedbackGroupList


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['comment', 'parameter', 'student', 'send_date', 'feedback_group_list']
    list_editable = ['parameter', 'student', 'feedback_group_list']
    list_filter = ['parameter']


@admin.register(FeedbackParam)
class FeedbackParamAdmin(admin.ModelAdmin):
    list_display = ['name', 'learning_direction']
    list_editable = ['learning_direction']
    list_filter = ['learning_direction']


@admin.register(FeedbackGroupList)
class FeedbackGroupListAdmin(admin.ModelAdmin):
    list_display = ['learning_group', 'feedback_list']
    list_editable = ['feedback_list']
    list_filter = ['learning_group']


@admin.register(FeedbackList)
class FeedbackListAdmin(admin.ModelAdmin):
    list_display = ['date', 'responsible', 'template']
    list_editable = ['responsible', 'template']
    list_filter = ['date']
