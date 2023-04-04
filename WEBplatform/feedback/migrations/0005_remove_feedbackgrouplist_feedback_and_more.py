# Generated by Django 4.1.1 on 2023-04-04 02:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("feedback", "0004_alter_feedbackparam_learning_direction_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="feedbackgrouplist",
            name="feedback",
        ),
        migrations.AddField(
            model_name="feedback",
            name="feedback_group_list",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="feedback.feedbackgrouplist",
                verbose_name="Лист ОС группы",
            ),
        ),
    ]
