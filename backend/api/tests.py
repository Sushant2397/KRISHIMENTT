from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from .models import Job, JobApplication, LabourEarning


class JobApplicationAuthorizationTests(TestCase):
    def setUp(self):
        user_model = get_user_model()
        self.farmer = user_model.objects.create_user(
            username='test-farmer', email='farmer@example.test', password='test-pass-123',
            first_name='Farmer', phone='9000000001', role='farmer',
        )
        self.labour = user_model.objects.create_user(
            username='test-labour', email='labour@example.test', password='test-pass-123',
            first_name='Labour', phone='9000000002', role='labour',
        )
        self.labour.latitude = '19.000000'
        self.labour.longitude = '72.000000'
        self.labour.save(update_fields=['latitude', 'longitude'])
        start = date.today() + timedelta(days=1)
        self.job = Job.objects.create(
            farmer=self.farmer, title='Test harvest', description='Test job',
            category='harvesting', wage_per_day='500', duration_days=1,
            required_workers=1, start_date=start, end_date=start,
            address='Test location', latitude='19.000000', longitude='72.000000',
        )
        self.application = JobApplication.objects.create(job=self.job, labour=self.labour)
        self.client = APIClient()

    def test_farmer_cannot_apply_for_jobs_as_a_labour(self):
        self.client.force_authenticate(self.farmer)
        response = self.client.post('/api/job-applications/', {'job': self.job.id}, format='json')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(JobApplication.objects.count(), 1)

    def test_nearby_labour_cannot_edit_or_delete_farmer_job(self):
        self.client.force_authenticate(self.labour)
        edit_response = self.client.patch(
            f'/api/jobs/{self.job.id}/', {'title': 'Changed by labour'}, format='json'
        )
        delete_response = self.client.delete(f'/api/jobs/{self.job.id}/')
        self.assertEqual(edit_response.status_code, 403)
        self.assertEqual(delete_response.status_code, 403)
        self.job.refresh_from_db()
        self.assertEqual(self.job.title, 'Test harvest')

    def test_labour_cannot_approve_own_pending_application(self):
        self.client.force_authenticate(self.labour)
        response = self.client.patch(
            f'/api/job-applications/{self.application.id}/', {'status': 'accepted'}, format='json'
        )
        self.assertEqual(response.status_code, 400)
        self.application.refresh_from_db()
        self.assertEqual(self.application.status, 'pending')

    def test_accepted_application_can_be_completed_and_earning_is_created(self):
        self.application.status = 'accepted'
        self.application.save()
        self.client.force_authenticate(self.labour)
        response = self.client.patch(
            f'/api/job-applications/{self.application.id}/', {'status': 'completed'}, format='json'
        )
        self.assertEqual(response.status_code, 200)
        self.application.refresh_from_db()
        self.assertEqual(self.application.status, 'completed')
        self.assertTrue(LabourEarning.objects.filter(job_application=self.application).exists())


class LoginIdentifierTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='login-test-user', email='login-test@example.test',
            password='Login-Test-Password-82!', first_name='Login Test',
            phone='9000000003', role='farmer',
        )
        self.client = APIClient()

    def test_login_accepts_username(self):
        response = self.client.post('/api/auth/login/', {
            'username': self.user.username, 'password': 'Login-Test-Password-82!',
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user']['id'], self.user.id)

    def test_login_accepts_email_case_insensitively(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'LOGIN-TEST@EXAMPLE.TEST', 'password': 'Login-Test-Password-82!',
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user']['id'], self.user.id)

    def test_login_rejects_wrong_password(self):
        response = self.client.post('/api/auth/login/', {
            'username': self.user.username, 'password': 'incorrect-password',
        }, format='json')
        self.assertEqual(response.status_code, 401)
