# Category Management API

This API provides CRUD operations for managing categories with the ability to nest categories 
and handle automatic deactivation of child categories when a parent category is deactivated. 
It also integrates Redis caching to improve query performance and automatically clears the 
cache when data is modified.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose

## Installation

1. Clone the repository:

git clone https://github.com/Fardin7864/ts4.git

cd ts4

Install dependencies: npm install

Set up environment variables:

Create a .env file in the root directory.
Add the following environment variables:
PORT: Port number for the server (e.g., 3000).
MONGODB_URI: MongoDB connection URI.

Start the server: npm start


## API Endpoints
 
### Get All Categories

URL: /api/v1/categories

- Method: GET

- Description: Retrieve all categories.
- Query Parameters: None
- Response: JSON array of category objects.

### Get Single Categories

URL: /api/v1/categories?_id=(mongo id)

- Method: GET

- Description: Retrieve single categories.
- Query Parameters: None
- Response: JSON array of category objects.

### Get Child Categories

URL: /api/v1/categories/:parentId/children

- Method: GET
- Description: Retrieve all child categories (including nested children) of a parent category.
- Request Parameters: parentId (string) - ID of the parent category.
- Response: JSON array of child category objects.


### Create Category

URL: /api/v1/categories

- Method: POST
- Description: Create a new category.
- Request Body: JSON object containing name (string), parent (optional, string - parent category ID), and active (optional, boolean - defaults to true).
- Response: JSON object of the created category.

### Update Category

 URL: /api/v1/categories/:id

- Method: PUT
- Description: Update an existing category.
- Request Parameters: id (string) - ID of the category to update.
- Request Body: JSON object containing updated name, parent, and active fields.
- Response: JSON object of the updated category.

### Delete Category

URL: /api/v1/categories/:id

- Method: DELETE
- Description: Delete an existing category.
- Request Parameters: id (string) - ID of the category to delete.
- Response: Success message.

