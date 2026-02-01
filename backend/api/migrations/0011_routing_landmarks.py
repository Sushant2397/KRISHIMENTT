# Generated for Krishiment route optimization (SLM)

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_labourearning_labourskill'),
    ]

    operations = [
        migrations.CreateModel(
            name='Landmark',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('location_type', models.CharField(choices=[('mandi', 'Mandi'), ('warehouse', 'Warehouse'), ('market', 'Market')], max_length=20)),
                ('latitude', models.DecimalField(decimal_places=6, max_digits=9)),
                ('longitude', models.DecimalField(decimal_places=6, max_digits=9)),
                ('address', models.CharField(blank=True, max_length=300)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='LandmarkDistance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('distance_km', models.DecimalField(decimal_places=2, max_digits=10)),
                ('travel_time_min', models.PositiveIntegerField(help_text='Estimated travel time in minutes')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('from_landmark', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='distances_from', to='api.landmark')),
                ('to_landmark', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='distances_to', to='api.landmark')),
            ],
            options={
                'ordering': ['from_landmark', 'to_landmark'],
                'unique_together': {('from_landmark', 'to_landmark')},
            },
        ),
    ]
