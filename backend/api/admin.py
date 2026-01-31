from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Todo, Landmark, LandmarkDistance

# Register your models here.

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'username', 'first_name', 'phone', 'role', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'role')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'first_name', 'phone', 'role')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'phone', 'role', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email', 'username', 'first_name')
    ordering = ('email',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Todo)


class LandmarkDistanceInline(admin.TabularInline):
    model = LandmarkDistance
    fk_name = 'from_landmark'
    extra = 0


@admin.register(Landmark)
class LandmarkAdmin(admin.ModelAdmin):
    list_display = ('name', 'location_type', 'latitude', 'longitude')
    list_filter = ('location_type',)
    search_fields = ('name', 'address')
    inlines = [LandmarkDistanceInline]


@admin.register(LandmarkDistance)
class LandmarkDistanceAdmin(admin.ModelAdmin):
    list_display = ('from_landmark', 'to_landmark', 'distance_km', 'travel_time_min')
    list_filter = ('from_landmark', 'to_landmark')
