class listing:
    def __init__(self, product_name, product_desc, product_price, prodcut_category):
        self.product_name = product_name
        self.product_desc = product_desc
        self.product_price = product_price
        self.prodcut_category = prodcut_category
        self.product_id = len(database) + 1
    
    def update_name(self, new_name):
        self.product_name = new_name
    
    def update_desc(self, new_desc):
        self.product_desc = new_desc
    
    def update_price(self, new_price):
        self.product_price = new_price

    def update_category(self, new_category):
        self.prodcut_category = new_category


database = []

def add_product(product):
    database.append(product)

def create_listing(product_name, product_desc, product_price, product_category):
    new_item = listing(product_name, product_desc, product_price, product_category)
    add_product(new_item)