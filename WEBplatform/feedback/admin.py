from django.contrib import admin

from feedback.models import Feedback, FeedbackParam, FeedbackList, FeedbackGroupList, FeedbackStudentList, \
    GeneratedReport


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['feedback_student_list', 'parameter']
    list_editable = ['parameter']
    list_filter = ['feedback_student_list']


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


@admin.register(FeedbackStudentList)
class FeedbackStudentListAdmin(admin.ModelAdmin):
    list_display = ['student', 'feedback_group_list', 'send_date', 'status']
    list_editable = ['feedback_group_list', 'status']
    list_filter = ['feedback_group_list', 'send_date', 'status']


@admin.register(FeedbackList)
class FeedbackListAdmin(admin.ModelAdmin):
    list_display = ['date', 'responsible', 'template']
    list_editable = ['responsible', 'template']
    list_filter = ['date']


@admin.register(GeneratedReport)
class GeneratedReportAdmin(admin.ModelAdmin):
    list_display = ['feedback_student_list', 'text']
    list_filter = ['feedback_student_list']
