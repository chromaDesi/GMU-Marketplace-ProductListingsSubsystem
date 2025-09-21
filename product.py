"""
Simple Product creator - No MySQL needed
"""

class Product:
    """Simple Product class"""
    
    # This is a class variable (shared across all Products).
    # It keeps track of the "next available product ID".
    _next_id = 1
    
    def __init__(self, name, description, price, category):
        # Store product details as attributes
        self.name = name
        self.description = description
        self.price = price
        self.category = category
        
        # Call generate_id() to assign an auto-incremented product_id
        self.product_id = self.generate_id()
        
        # Make sure the data is valid (check name, price, etc.)
        self.validate()
    
    def generate_id(self):
        """Generate a simple incremental ID"""
        # Grab the current available ID
        current_id = Product._next_id
        # Increment the class-level counter for the next product
        Product._next_id += 1
        # Return the ID for this product
        return current_id
    
    def validate(self):
        """Check if product data is valid"""
        # Make sure name is not empty
        if not self.name:
            raise ValueError("Product name is required")
        
        # Make sure description is not empty
        if not self.description:
            raise ValueError("Description is required")
        
        # Price must be a positive number
        if self.price <= 0:
            raise ValueError("Price must be greater than 0")
        
        # Category must be given
        if not self.category:
            raise ValueError("Category is required")
    
    def to_dict(self):
        """Convert to dictionary"""
        # Return product data in dictionary form
        return {
            'product_id': self.product_id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category
        }
    
    def __str__(self):
        """String representation"""
        # This is what shows when you print(Product(...))
        return f"Product(id={self.product_id}, name='{self.name}', price=${self.price:.2f})"


# ============================
# Example usage / test section
# ============================
if __name__ == "__main__":
    # Create a product instance with sample data
    product = Product(
        name="CS 321 Textbook",
        description="Software Engineering book for class",
        price=75.5,
        category="textbooks"
    )
    
    # Print a message just to show test started
    print("Testing Product Creation and Dictionary...")
    
    # Confirm that product creation worked
    print("Product created successfully!")
    
    # Print individual attributes
    print(f"   ID: {product.product_id}")
    print(f"   Name: {product.name}")
    print(f"   Price: ${product.price}")
    print(f"   Category: {product.category}")
    
    print()  # Blank line for readability
    
    # Test dictionary conversion
    print("Dictionary representation:")
    product_dict = product.to_dict()
    print(product_dict)
    
    print()  # Blank line for readability
    
    # Print each dictionary key/value in detail with its type
    print("Dictionary contents broken down:")
    for key, value in product_dict.items():
        print(f"   {key}: {value} (type: {type(value).__name__})")
