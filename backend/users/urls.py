from django.urls import path
from .views import (
    UserRegistrationView,
    UserProfileView,
    UserDetailView,
    UserListView
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('<str:username>/', UserDetailView.as_view(), name='user-detail'),
    path('', UserListView.as_view(), name='user-list'),
]

