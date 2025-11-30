from rest_framework import serializers
from .models import Product
from users.serializers import UserSerializer

class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model"""
    seller = UserSerializer(read_only=True)
    seller_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Product
        fields = [
            'id', 'seller', 'seller_id', 'name', 'description', 'price',
            'category', 'condition', 'status', 'image', 'views',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'views', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Set seller to the current user
        validated_data['seller'] = self.context['request'].user
        return super().create(validated_data)


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating products"""
    
    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'category',
            'condition', 'status', 'image'
        ]
    
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value


class ProductListSerializer(serializers.ModelSerializer):
    """Simplified serializer for product listings"""
    seller_name = serializers.CharField(source='seller.full_name', read_only=True)
    seller_username = serializers.CharField(source='seller.username', read_only=True)
    seller_rating = serializers.DecimalField(source='seller.seller_rating', max_digits=2, decimal_places=1, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'category', 'condition', 'status',
            'image', 'seller_name', 'seller_username', 'seller_rating',
            'views', 'created_at'
        ]

