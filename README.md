# Product Listings Subsystem

## Overview
The **Product Listings Subsystem** is a core backend component of the GMU Marketplace web application. It is responsible for managing the lifecycle of product listings posted by users, including creation, retrieval, updates, deletion, and search. This subsystem ensures data integrity, secure access control, and efficient querying for marketplace-scale usage.

The subsystem was developed as part of a **team-based Agile project**, with a focus on modular backend design, database normalization, and API-driven interaction with the frontend.

---

## Responsibilities
This subsystem handles:
- Creating new product listings
- Retrieving listings (by user, category, or search filters)
- Updating listing details (price, description, availability)
- Deleting or deactivating listings
- Maintaining relational integrity between users, listings, and categories

---

## Tech Stack
- **Backend Language:** Python  
- **Database:** MySQL  
- **Architecture:** RESTful API design  
- **Version Control:** GitLab  
- **Development Methodology:** Agile (sprints, code reviews, issue tracking)

---

## Database Design
The subsystem uses a normalized relational schema to support efficient queries and scalability.

### Core Tables

#### Products
- `product_id` (PK)
- `title`
- `description`
- `price`
- `category_id` (FK)
- `seller_id` (FK)
- `created_at`
- `status` (active / inactive)

#### Categories
- `category_id` (PK)
- `name`

#### Users (Referenced)
- `user_id` (PK)

Foreign key constraints ensure:
- Listings are always associated with valid users
- Categories remain consistent across listings
