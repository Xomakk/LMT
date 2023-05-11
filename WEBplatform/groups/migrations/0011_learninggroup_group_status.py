# Generated by Django 4.1.1 on 2023-04-17 02:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("groups", "0010_learninggroup_curator_alter_learninggroup_teacher"),
    ]

    operations = [
        migrations.AddField(
            model_name="learninggroup",
            name="group_status",
            field=models.SmallIntegerField(
                choices=[(10, "Активна"), (20, "Завершена")],
                default=10,
                verbose_name="Статус",
            ),
        ),
    ]