from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Custom User model for marketplace sellers/buyers"""
    
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    
    # Seller statistics
    seller_rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    total_reviews = models.IntegerField(default=0)
    total_sales = models.IntegerField(default=0)
    active_listings = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.full_name} ({self.username})"
    
    def update_seller_stats(self):
        """Update seller statistics based on their products"""
        from products.models import Product
        
        self.active_listings = Product.objects.filter(
            seller=self,
            status='active'
        ).count()
        
        self.save()

