import product
import mysql.connector

database = mysql.connector.connect(
  host="helios.cec.gmu.edu",
  user="jjames27",
  password="araseeps",
  database="jjames27"
)

dbcursor = database.cursor()


def initialize():
    dbcursor.execute("SHOW TABLES")
    for x in dbcursor:
        if x[0] == 'product_listing':
            return
        else:
            dbcursor.execute(""" 
                            CREATE TABLE product_listing (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            description VARCHAR(1000) NOT NULL,
                            price DOUBLE NOT NULL,
                            category VARCHAR(100) NOT NULL)
                            """)

def create_listing(name, descr, price, category):
    sql = "INSERT INTO product_listing (name, description, price, category) VALUES (%s, %s, %s, %s)"
    vals = (name, descr, price, category)
    dbcursor.execute(sql, vals)
    database.commit()

def remove_listing(name):
    # Changed to delete product based off of id instead of name.
    sql = "DELETE FROM product_listing WHERE id = %s"
    dbcursor.execute(sql, (id))
    database.commit()

def edit_listing(id, new_name, new_descr, new_price, new_category):
    sql = "UPDATE product_listing SET name = %s, description = %s, price = %s, category = %s WHERE id = %s"
    vals = (new_name, new_descr, new_price, new_category, id)
    dbcursor.execute(sql, vals)
    database.commit()
