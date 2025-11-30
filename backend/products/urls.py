from django.urls import path
from .views import (
    ProductListCreateView,
    ProductDetailView,
    MyProductsView,
    ProductStatsView
)

urlpatterns = [
    path('', ProductListCreateView.as_view(), name='product-list-create'),
    path('my-products/', MyProductsView.as_view(), name='my-products'),
    path('stats/', ProductStatsView.as_view(), name='product-stats'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
]

