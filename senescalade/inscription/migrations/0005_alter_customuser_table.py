# Generated by Django 4.2.7 on 2023-12-01 15:10

from django.db import migrations


class Migration(migrations.Migration):
    """Represents a database migration for altering the customuser table."""

    dependencies = [
        ("inscription", "0004_datacalendar"),
    ]

    operations = [
        migrations.AlterModelTable(
            name="customuser",
            table="Sceance",
        ),
    ]
