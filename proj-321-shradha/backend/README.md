# Django Marketplace Backend

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Database Setup

The project is configured to use MySQL on GMU's Helios server. Make sure the database credentials in `marketplace/settings.py` are correct:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'jjames27',
        'USER': 'jjames27',
        'PASSWORD': 'araseeps',
        'HOST': 'helios.cec.gmu.edu',
        'PORT': '3306',
    }
}
```

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Load Sample Data (Optional)

```bash
python manage.py shell
```

Then in the Python shell:

```python
from django.contrib.auth import get_user_model
from products.models import Product

User = get_user_model()

# Create sample users
user1 = User.objects.create_user(
    username='nikhil_t',
    email='nikhil.t@gmu.edu',
    password='password123',
    full_name='Nikhil Tirunagiri',
    location='Fairfax, VA',
    bio='GMU student selling textbooks and tech items.',
    phone='(703) 555-0123',
    seller_rating=4.9,
    total_reviews=88,
    total_sales=152
)

# Create sample products
Product.objects.create(
    seller=user1,
    name='CS 321 Software Engineering Textbook',
    description='Like new condition. Only used for one semester.',
    price=75.50,
    category='textbooks',
    condition='like_new',
    status='active'
)

Product.objects.create(
    seller=user1,
    name='Gaming Laptop - ASUS ROG',
    description='ASUS ROG Strix G15. RTX 3060, 16GB RAM, 512GB SSD.',
    price=850.00,
    category='electronics',
    condition='good',
    status='active'
)
```

### 7. Run Development Server

```bash
python manage.py runserver
```

The API will be available at: http://localhost:8000

## API Endpoints

### Authentication
- `POST /api/token/` - Get JWT tokens (login)
- `POST /api/token/refresh/` - Refresh access token
- `POST /api/users/register/` - Register new user

### User Endpoints
- `GET /api/users/profile/` - Get current user profile
- `PUT/PATCH /api/users/profile/` - Update current user profile
- `GET /api/users/<username>/` - Get user profile by username
- `GET /api/users/` - List all users

### Product Endpoints
- `GET /api/products/` - List all products (with filters)
- `POST /api/products/` - Create new product (auth required)
- `GET /api/products/<id>/` - Get product detail
- `PUT/PATCH /api/products/<id>/` - Update product (owner only)
- `DELETE /api/products/<id>/` - Delete product (owner only)
- `GET /api/products/my-products/` - Get current user's products
- `GET /api/products/stats/` - Get current user's product statistics

### Query Parameters for Products
- `?category=textbooks` - Filter by category
- `?status=active` - Filter by status
- `?condition=like_new` - Filter by condition
- `?search=laptop` - Search in name and description
- `?ordering=-price` - Order by price (descending)
- `?ordering=created_at` - Order by date (ascending)

## Admin Panel

Access the admin panel at: http://localhost:8000/admin

Use the superuser credentials you created.

## Testing with cURL

### Register a user:
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "full_name": "Test User",
    "password": "testpass123",
    "password2": "testpass123",
    "location": "Fairfax, VA"
  }'
```

### Get JWT token:
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Get products:
```bash
curl http://localhost:8000/api/products/
```

### Create product (with auth):
```bash
curl -X POST http://localhost:8000/api/products/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "This is a test product",
    "price": 25.99,
    "category": "other",
    "condition": "good",
    "status": "active"
  }'
```

