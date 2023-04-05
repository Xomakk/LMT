# Generated by Django 4.1.1 on 2023-04-05 05:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("groups", "0009_alter_lesson_learning_group_alter_student_avatar"),
        ("feedback", "0006_alter_feedback_feedback_group_list_and_more"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="feedback",
            options={
                "ordering": ["feedback_student_list", "parameter"],
                "verbose_name": "Обратная связь",
                "verbose_name_plural": "Обратная связь",
            },
        ),
        migrations.RemoveField(
            model_name="feedback",
            name="feedback_group_list",
        ),
        migrations.RemoveField(
            model_name="feedback",
            name="send_date",
        ),
        migrations.RemoveField(
            model_name="feedback",
            name="student",
        ),
        migrations.CreateModel(
            name="FeedbackStudentList",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("send_date", models.DateField(auto_now_add=True, verbose_name="Дата")),
                (
                    "status",
                    models.SmallIntegerField(
                        choices=[
                            (10, "Принято"),
                            (11, "Требует проверки"),
                            (20, "Не заполнено"),
                        ],
                        default=20,
                        verbose_name="Статус",
                    ),
                ),
                (
                    "feedback_group_list",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="feedback_student_list",
                        to="feedback.feedbackgrouplist",
                        verbose_name="Лист ОС группы",
                    ),
                ),
                (
                    "student",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="feedback_student_list",
                        to="groups.student",
                        verbose_name="Ученик",
                    ),
                ),
            ],
            options={
                "verbose_name": "Список по ученику",
                "verbose_name_plural": "Список по ученикам",
                "ordering": ["student"],
            },
        ),
        migrations.AddField(
            model_name="feedback",
            name="feedback_student_list",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="feedback",
                to="feedback.feedbackstudentlist",
                verbose_name="Лист ОС ученика",
            ),
            preserve_default=False,
        ),
    ]
