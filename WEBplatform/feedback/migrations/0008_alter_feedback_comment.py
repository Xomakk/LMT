# Generated by Django 4.1.1 on 2023-04-17 02:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("feedback", "0007_alter_feedback_options_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="feedback",
            name="comment",
            field=models.TextField(blank=True, verbose_name="Комментарий"),
        ),
    ]
