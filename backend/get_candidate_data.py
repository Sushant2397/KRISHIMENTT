"""
Run from backend directory:
  python get_candidate_data.py

Or from Django shell:
  exec(open('get_candidate_data.py').read())

Outputs candidate data:
1. Job candidates = JobApplication records (labour who applied to jobs)
2. Labour users = CustomUser with role=labour (potential candidates)
3. Labour with skills = candidate profiles
"""
import os
import sys

# Allow running as script from backend/ so Django can find settings
if __name__ == '__main__':
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    import django
    django.setup()

from api.models import CustomUser, Job, JobApplication, LabourSkill

# --- 1. Job candidates (applications: labour + job + status)
print("=" * 60)
print("JOB CANDIDATES (JobApplication: labour applied to job)")
print("=" * 60)

applications = JobApplication.objects.select_related('job', 'labour').order_by('-applied_at')
if not applications.exists():
    print("No job applications found.\n")
else:
    for app in applications:
        print(f"ID: {app.id}")
        print(f"  Job: {app.job.title} (ID {app.job_id})")
        print(f"  Candidate: {app.labour.first_name} {app.labour.last_name} | email: {app.labour.email} | phone: {app.labour.phone}")
        print(f"  Status: {app.status} | Applied: {app.applied_at}")
        if app.contact_phone:
            print(f"  Contact: {app.contact_name or '-'} | {app.contact_phone}")
        print()
    print(f"Total: {applications.count()} application(s)\n")

# --- 2. Labour users (potential candidates)
print("=" * 60)
print("LABOUR USERS (Potential candidates)")
print("=" * 60)

labours = CustomUser.objects.filter(role='labour').order_by('id')
if not labours.exists():
    print("No labour users found.\n")
else:
    for u in labours:
        loc = f"({u.latitude}, {u.longitude})" if (u.latitude and u.longitude) else "N/A"
        print(f"ID: {u.id} | {u.first_name} {u.last_name} | {u.email} | {u.phone} | available={u.is_available} | location={loc}")
    print(f"\nTotal: {labours.count()} labour user(s)\n")

# --- 3. Optional: labour with skills (candidate profile)
print("=" * 60)
print("LABOUR WITH SKILLS (Candidate profiles)")
print("=" * 60)

labour_with_skills = CustomUser.objects.filter(role='labour').prefetch_related('skills').order_by('id')
count = 0
for u in labour_with_skills:
    skills = list(u.skills.all())
    if not skills:
        continue
    count += 1
    print(f"{u.first_name} {u.last_name} (ID {u.id}) | {u.email}")
    for s in skills:
        print(f"  - {s.skill_name} | {s.category} | {s.experience_level}")
    print()
if count == 0:
    print("No labour with skills found.\n")
else:
    print(f"Total: {count} labour with skills\n")

print("Done.")
