# Generated by Django 4.1.1 on 2023-04-17 02:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("learningDirections", "0004_alter_syllabus_learning_direction_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="learningdirection",
            name="course_duration",
            field=models.IntegerField(
                default=9, verbose_name="Длительность курса (в месяцах)"
            ),
        ),
    ]