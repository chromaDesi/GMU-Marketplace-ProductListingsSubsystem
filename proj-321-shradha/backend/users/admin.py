from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'full_name', 'seller_rating', 'total_sales', 'active_listings', 'created_at']
    list_filter = ['seller_rating', 'created_at']
    search_fields = ['username', 'email', 'full_name']
    ordering = ['-created_at']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('full_name', 'location', 'bio', 'profile_picture', 'phone')}),
        ('Seller Stats', {'fields': ('seller_rating', 'total_reviews', 'total_sales', 'active_listings')}),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('full_name', 'email', 'location', 'phone')}),
    )

