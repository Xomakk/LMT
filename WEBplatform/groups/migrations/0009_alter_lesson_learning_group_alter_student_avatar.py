# Generated by Django 4.1.1 on 2023-04-02 05:45

from django.db import migrations, models
import django.db.models.deletion
import groups.models


class Migration(migrations.Migration):

    dependencies = [
        ("groups", "0008_alter_student_avatar"),
    ]

    operations = [
        migrations.AlterField(
            model_name="lesson",
            name="learning_group",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="lessons",
                to="groups.learninggroup",
                verbose_name="Учебная группа",
            ),
        ),
        migrations.AlterField(
            model_name="student",
            name="avatar",
            field=models.ImageField(
                blank=True,
                null=True,
                upload_to=groups.models.make_path,
                verbose_name="Аватар",
            ),
        ),
    ]
