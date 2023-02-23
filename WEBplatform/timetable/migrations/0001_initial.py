# Generated by Django 4.1.1 on 2022-11-08 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("lesson", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="timeTable",
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
                ("year", models.CharField(default="2022", max_length=10)),
                ("academic_hours", models.IntegerField(default=1)),
                ("lessons", models.ManyToManyField(blank=True, to="lesson.lesson")),
            ],
        ),
    ]
