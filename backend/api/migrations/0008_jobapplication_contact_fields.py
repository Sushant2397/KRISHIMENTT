from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_job_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobapplication',
            name='contact_name',
            field=models.CharField(max_length=150, blank=True),
        ),
        migrations.AddField(
            model_name='jobapplication',
            name='contact_phone',
            field=models.CharField(max_length=20, blank=True),
        ),
    ]


