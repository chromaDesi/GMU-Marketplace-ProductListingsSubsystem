from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'seller', 'price', 'category', 'status', 'condition', 'views', 'created_at']
    list_filter = ['category', 'status', 'condition', 'created_at']
    search_fields = ['name', 'description', 'seller__username', 'seller__full_name']
    ordering = ['-created_at']
    readonly_fields = ['views', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('seller', 'name', 'description', 'price', 'category')
        }),
        ('Details', {
            'fields': ('condition', 'status', 'image')
        }),
        ('Metadata', {
            'fields': ('views', 'created_at', 'updated_at')
        }),
    )

