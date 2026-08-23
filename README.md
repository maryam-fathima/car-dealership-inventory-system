# Car Dealership Inventory System

A full-stack web application for managing a car dealership's vehicle inventory. 
The application allows customers to browse and purchase vehicles, while administrators 
can manage the dealership inventory.

## Features

### User
- User registration and login
- JWT-based authentication
- View available vehicles
- Search and filter vehicles
- View vehicle details
- Purchase a vehicle
- View purchased vehicles
- Purchase is disabled when a vehicle is out of stock

### Admin
- Add new vehicles
- Update vehicle details
- Delete vehicles
- Restock vehicles
- View inventory

## Technologies Used

### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite
- React Router

### Backend
- Python
- FastAPI
- JWT Authentication
- REST API

### Database
- MySQL

### Testing
- Pytest

## Project Structure

```text
car-dealership-inventory-system/
│
├── backend/
│   ├── routers/
│   │   ├── auth.py
│   │   └── vehicles.py
│   ├── tests/
│   ├── database.py
│   ├── dependencies.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   └── cars/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── PROMPTS.md
├── README.md
└── .gitignore

 Project Overview 

- The Car Dealership Inventory System is a full-stack web application designed to manage vehicle inventory.
- The system provides separate functionality for normal users and administrators.
- Users can register, log in, browse available vehicles, search the inventory and purchase vehicles.
- Administrators can add, update, delete and restock vehicles.
- Vehicle stock is automatically updated after a successful purchase.
- Users can view the vehicles they have purchased.
- The application uses a RESTful backend API connected to a MySQL database.
- The React frontend communicates with the FastAPI backend through HTTP API requests.
- JWT authentication is used to secure protected operations.
- The project also includes automated backend testing using Pytest.
