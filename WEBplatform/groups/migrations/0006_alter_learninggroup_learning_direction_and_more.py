# Generated by Django 4.1.1 on 2023-03-24 05:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("learningDirections", "0004_alter_syllabus_learning_direction_and_more"),
        ("groups", "0005_alter_studentlessonstatus_options_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="learninggroup",
            name="learning_direction",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="learning_groups",
                to="learningDirections.learningdirection",
                verbose_name="Направление обучения",
            ),
        ),
        migrations.AlterField(
            model_name="lesson",
            name="learning_group",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="groups.learninggroup",
                verbose_name="Учебная группа",
            ),
        ),
        migrations.AlterField(
            model_name="lesson",
            name="topic",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="learningDirections.topic",
                verbose_name="Тема",
            ),
        ),
        migrations.AlterField(
            model_name="studentlessonstatus",
            name="lesson",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="student_lesson_status",
                to="groups.lesson",
                verbose_name="Урок",
            ),
        ),
        migrations.AlterField(
            model_name="studentlessonstatus",
            name="student",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="groups.student",
                verbose_name="Ученик",
            ),
        ),
    ]
