from django.db import migrations


class Migration(migrations.Migration):
    """
    Represents a database migration for altering the options of the CustomUser model.
    """

    dependencies = [
        ("inscription", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="customuser",
            options={"managed": False},
        ),
    ]
