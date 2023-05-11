# Generated by Django 4.1.1 on 2023-04-21 09:04

from django.db import migrations, models
import user.models


class Migration(migrations.Migration):

    dependencies = [
        ("user", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="avatar",
            field=models.ImageField(
                blank=True,
                null=True,
                upload_to=user.models.make_path,
                verbose_name="Аватар",
            ),
        ),
    ]
