# Adidas Inventory Sync API

## Overview

Adidas Inventory Sync API is a RESTful backend application built with Node.js, Express, and SQLite. The project simulates multiple Adidas stores reporting inventory updates to a centralized database, allowing the inventory to remain synchronized while providing different ways to query the available stock.

The main objective is to keep inventory information consistent across all stores and provide an up-to-date consolidated view of the network inventory.

---

## Features

- Report stock movements (stock in / stock out).
- API Key authentication for each store.
- Automatic inventory consolidation across all stores.
- Inventory queries with filters by store and product.
- Consolidated inventory queries by product or for the entire network.
- Low-stock queries based on a configurable threshold.
- Automatic low-stock warnings after inventory updates.

---

## Technologies

- Node.js
- Express.js
- SQLite
- better-sqlite3
- dotenv
- Postman (API testing)

---

## Project Structure

The project follows the **Model-View-Controller (MVC)** architecture to keep the code organized and modular.

```
src/
├── controllers/
├── database/
├── middleware/
├── models/
├── routes/
```

### Folder responsibilities

- **routes/**  
  Defines the available API endpoints and maps each request to its corresponding controller.

- **controllers/**  
  Handles incoming requests, processes the required logic, and communicates with the models.

- **models/**  
  Interacts directly with the SQLite database by executing queries and returning the required data.

- **middleware/**  
  Contains the API Key authentication logic used to validate stores before allowing stock updates.

- **database/**  
  Contains the database connection, schema definition, and seed data used to initialize the project.

Although the project follows MVC, no explicit View layer is included since the API is tested using Postman, which simulates client requests.

---

## Installation

### Prerequisites

- Node.js v24.18.0 (Windows x64)
- npm v11.6.0

### Steps

Clone the repository.

```bash
git clone <repository-url>
```

Move into the project directory.

```bash
cd adidas-inventory-sync
```

Install the dependencies.

```bash
npm install
```

Start the server.

```bash
npm start
```

When the project runs for the first time, the SQLite database is created automatically. The database structure is generated from `schema.sql`, and the initial stores, products, and inventory are populated using `seed.sql`.

---

## Environment Variables

The project uses the following environment variables:

| Variable | Description |
|----------|-------------|
| `PORT` | Port where the Express server runs. |
| `LOW_STOCK_THRESHOLD` | Threshold used to generate low-stock warnings and retrieve products with low inventory. |

---

## Authentication

Inventory updates require API Key authentication.

Each store owns a unique API Key that must be sent in the request header:

```
x-api-key
```

Available API Keys:

- `api-key-bogota`
- `api-key-pereira`
- `api-key-medellin`

If the API Key is missing or invalid, the request is rejected with a **401 Unauthorized** response.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stores` | Retrieve all registered stores. |
| GET | `/inventory` | Retrieve inventory with optional filters. |
| GET | `/inventory/consolidate` | Retrieve the consolidated inventory across all stores. |
| GET | `/inventory/low-stock` | Retrieve products below the configured stock threshold. |
| POST | `/inventory/stock-report` | Report stock movements (stock in / stock out). |

---

## Design Decisions

The project was designed with simplicity and modularity in mind.

The MVC architecture keeps responsibilities separated, making the code easier to understand, maintain, and extend. Routes handle incoming requests, controllers process the required actions, models interact with the database, and middleware is responsible for authentication.

Instead of storing consolidated inventory in an additional table, the project calculates it dynamically from the inventory table whenever it is requested. This avoids duplicated information and ensures that the consolidated stock always reflects the current state of every store.

Environment variables are used to keep configurable values, such as the server port and the low-stock threshold, outside the application code.

---

## Future Improvements

Possible future improvements include:

- Stock movement history.
- User management with different permission levels.
- Improved logging and error handling.
- A frontend interface instead of testing only through Postman.

---

## Limitations

This project was developed as a backend-focused challenge.

Currently, it does not include a graphical user interface. All API functionality is intended to be tested using Postman.

Additionally, stock movement history is not implemented, since it was considered an optional feature for the scope of this project.
