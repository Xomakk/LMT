# Generated by Django 4.1.1 on 2023-03-21 13:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("groups", "0003_alter_student_learning_group"),
    ]

    operations = [
        migrations.AlterField(
            model_name="student",
            name="birthday",
            field=models.DateField(blank=True, null=True, verbose_name="День рождения"),
        ),
        migrations.AlterField(
            model_name="student",
            name="learning_group",
            field=models.ManyToManyField(
                blank=True,
                related_name="students",
                to="groups.learninggroup",
                verbose_name="Учебные группы",
            ),
        ),
    ]
