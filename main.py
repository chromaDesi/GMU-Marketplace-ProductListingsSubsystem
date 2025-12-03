import product
import mysql.connector

# Connect to MySQL database
database = mysql.connector.connect(
  host="helios.cec.gmu.edu",
  user="jjames27",
  password="araseeps",
  database="jjames27"
)

# Create a cursor object to interact with the MySQL database
dbcursor = database.cursor()


def initialize():
    """
    Ensure that table for all product listings exists. 
    Create one if it does not.
    Table should include product information:
    -id (an auto-incremented int)
    -name (up to 100 characters)
    -description (up to 1000 characters)
    -price (stored as double)
    -category (up to 100 characters)
    """

    # Show all tables in the connected database
    dbcursor.execute("SHOW TABLES")

    # Iterate through the tables returned by the database
    for x in dbcursor:
        # If the product_lising table already exists, stop here
        if x[0] == 'product_listing':
            break
        # If the product_listing table does not exist, create it with these valid data: id, name, description, price, and category
        else:
            dbcursor.execute(""" 
                            CREATE TABLE product_listing (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            description VARCHAR(1000) NOT NULL,
                            price DOUBLE NOT NULL,
                            category VARCHAR(100) NOT NULL)
                            """)
            database.commit()
    for x in dbcursor:
        # If the catagories table already exists, stop here
        if x[0] == 'catagories':
            return
        # If the catagories table does not exist, create it and populate it
        else:
            dbcursor.execute(""" 
                            CREATE TABLE catagories (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(100) NOT NULL UNIQUE)
                            """)
            sql = """INSERT INTO catagories (name) VALUES
            ('Furniture'),
            ('Automotive'),
            ('Health'),
            ('Entertainment'),
            ('Office Supplies'),
            ('Electronics'),
            ('Fashion'),
            ('Sports'),
            ('Home Improvement'),
            (Miscellanious)
            """
            dbcursor.execute(sql)
            database.commit()

def create_catagory(name: str) -> bool:
    try:
        dbcursor.execute("INSERT INTO catagories (name) VALUES (%s)", (name,))
        database.commit()
        return True
    except:
        print("Creation error")
        return False

def getCatagoryName(cid: int) -> str:
    try:
        dbcursor.execute("SELECT name FROM catagories WHERE id = %s",(cid,))
        r = dbcursor.fetchone()
        return r[0] if r else None
    except:
        print("Error 404: Catagory not found")
        return None

def create_listing(name: str, descr: str, price: float, category: int):
    """
    Create a product listing to go in the product_listing database table.
    Includes the product's name, description, price, and category.
    """

    # SQL statement to insert a new row into the product_listing table
    sql = "INSERT INTO product_listing (name, description, price, category) VALUES (%s, %s, %s, %s)"

    # Values to substitute into the SQL statement
    vals = (name, descr, price, category, )

    # Execute the SQL statement with the given values
    dbcursor.execute(sql, vals)

    # Save the changes to the database so the new product is stored permanently
    database.commit()

def remove_listing(name):
    """Delete a product from the product_listing database"""

    # SQL statement to delete the product from the database table
    # The product is identified by its name
    sql = "DELETE FROM product_listing WHERE name = %s"

    # Value to substitute into the SQL statement (product name)
    val = (name, )

    # Execute the SQL statement with the given values
    dbcursor.execute(sql, val)

    # Save the changes to the database so the product is deleted
    database.commit()

def edit_listing(id, new_name, new_descr, new_price, new_category):
    """Edit a pre-existing product in the product_listing database table"""

    # SQL statement to update the name, description, price, and category of a given id
    sql = "UPDATE product_listing SET name = %s, description = %s, price = %s, category = %s WHERE id = %s"

    # The new product details and the product to modify's id, which will be substituted into the SQL statement
    vals = (new_name, new_descr, new_price, new_category, id)

    # Execute the SQL statement with the given values
    dbcursor.execute(sql, vals)

    # Save the changes to the database so the product is deleted
    database.commit()
