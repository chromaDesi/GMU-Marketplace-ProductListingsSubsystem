from django.db import models
from django.conf import settings

class Product(models.Model):
    """Product listing model"""
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('sold', 'Sold'),
        ('draft', 'Draft'),
    ]
    
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('used', 'Used'),
    ]
    
    CATEGORY_CHOICES = [
        ('textbooks', 'Textbooks'),
        ('electronics', 'Electronics'),
        ('furniture', 'Furniture'),
        ('clothing', 'Clothing'),
        ('supplies', 'Supplies'),
        ('sports', 'Sports & Outdoors'),
        ('other', 'Other'),
    ]
    
    # Basic product information
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    
    # Additional details
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='good')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    
    # Metadata
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'product_listing'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category', 'status']),
            models.Index(fields=['seller', 'status']),
        ]
    
    def __str__(self):
        return f"{self.name} - ${self.price}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update seller's active listings count
        if self.seller:
            self.seller.update_seller_stats()
    
    def delete(self, *args, **kwargs):
        seller = self.seller
        super().delete(*args, **kwargs)
        # Update seller's active listings count after deletion
        if seller:
            seller.update_seller_stats()

