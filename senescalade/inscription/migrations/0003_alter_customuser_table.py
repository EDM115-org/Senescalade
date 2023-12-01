from django.db import migrations


class Migration(migrations.Migration):
    """
    Represents a database migration for altering the customuser table.
    """

    dependencies = [
        ("inscription", "0002_alter_customuser_options"),
    ]

    operations = [
        migrations.AlterModelTable(
            name="customuser",
            table="inscription_customuser",
        ),
    ]
