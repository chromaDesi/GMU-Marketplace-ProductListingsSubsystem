from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product
from .serializers import (
    ProductSerializer,
    ProductCreateUpdateSerializer,
    ProductListSerializer
)


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners of a product to edit it"""
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner
        return obj.seller == request.user


class ProductListCreateView(generics.ListCreateAPIView):
    """API endpoint for listing and creating products"""
    queryset = Product.objects.select_related('seller').all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'condition', 'seller']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'views']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductCreateUpdateSerializer
        return ProductListSerializer
    
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API endpoint for viewing, updating, and deleting a product"""
    queryset = Product.objects.select_related('seller').all()
    serializer_class = ProductSerializer
    permission_classes = [IsOwnerOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ProductCreateUpdateSerializer
        return ProductSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.views += 1
        instance.save(update_fields=['views'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class MyProductsView(generics.ListAPIView):
    """API endpoint for viewing current user's products"""
    serializer_class = ProductListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['price', 'created_at', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user)


class ProductStatsView(APIView):
    """API endpoint for product statistics"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        products = Product.objects.filter(seller=user)
        
        stats = {
            'total_products': products.count(),
            'active_listings': products.filter(status='active').count(),
            'sold_items': products.filter(status='sold').count(),
            'draft_items': products.filter(status='draft').count(),
            'total_views': sum(p.views for p in products),
            'categories': {}
        }
        
        # Count products by category
        for category, _ in Product.CATEGORY_CHOICES:
            count = products.filter(category=category).count()
            if count > 0:
                stats['categories'][category] = count
        
        return Response(stats)

