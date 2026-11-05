# Travel Booking API

A JavaScript backend project for managing travel records, tickets, users, administrators, and roles. Built with Node.js, Express, MySQL, and Sequelize.

This project is being revisited to practise backend development, improve authentication and error handling, and document the API. It is a learning project, not a production-ready booking service.

## Features implemented

- User registration and login with bcrypt password hashing and JWT issuance.
- Administrator account creation, login, and updates.
- Travel creation, listing, search, updates, and deletion.
- Ticket creation, listing, updates, and deletion.
- Relational models linking tickets to users and travels, and accounts to roles.
- Request validation with express-validator.
- Bearer-token middleware on travel and ticket routes.
- Request rate limiting on `/api` routes.

Some flows require corrections listed under **Current limitations** below. This repository contains the backend only; it does not include payments, seat inventory, or a frontend.

## Technology stack

| Area | Technologies |
| --- | --- |
| Runtime and language | Node.js, JavaScript ES modules |
| HTTP API | Express, cors, express-rate-limit |
| Database | MySQL, Sequelize, mysql2 |
| Authentication | jsonwebtoken, bcryptjs |
| Validation and errors | express-validator, express-async-handler |
| Configuration | dotenv |

## Project organization

| Path | Purpose |
| --- | --- |
| `app/config/db.js` | MySQL connection and Sequelize synchronization |
| `app/Models/` | User, administrator, role, travel, and ticket models |
| `app/Controllers/` | Request handlers and database operations |
| `app/Routes/` | Express routes and route initialization |
| `app/middlewares/` | Authentication and error handling |
| `app.js` | Express configuration and route mounting |
| `server.js` | HTTP server startup |

## Local setup

### 1. Prerequisites

Install Node.js with npm and run a local MySQL server. Use a separate development database with disposable data.

### 2. Clone and install

```bash
git clone https://github.com/kawther27/travel-booking-api.git
cd travel-booking-api
npm ci
```

Access to the repository is required if it is private.

### 3. Create the database

Run this SQL using your MySQL client:

```sql
CREATE DATABASE travel_booking;
```

Use a MySQL account with access to this database and permission to create its tables. The existing connection module calls `sequelize.sync()`; database migrations are not yet implemented.

### 4. Configure the environment

Create a `.env` file at the project root, beside `package.json`:

```dotenv
DB_NAME=travel_booking
DB_USER=your_local_mysql_user
DB_PASS=your_local_mysql_password
HOST=localhost
PORT=3000
```

Replace these examples with your local settings. Keep `.env` out of Git. The current code reads `HOST`, not `DB_HOST`.

### 5. Start the server

```bash
node server.js
```

The default API base URL is `http://localhost:3000/api`. An npm start script has not been added yet. Confirm the database connection and table synchronization messages in the terminal before trying database requests; the current server can listen even if database initialization fails.

Use `/api/user/get_all_user` for a local database-backed request. The root URL `/` currently falls through to the undefined-route handler because of route registration order.

## API routes

All paths below include their mounted prefix.

### Users

| Method | Endpoint | Handler purpose |
| --- | --- | --- |
| GET | `/api/user/get_all_user` | List users |
| GET | `/api/user/get_user_by_id/:id` | Get one user |
| POST | `/api/user/create_user` | Register a user |
| POST | `/api/user/login_user` | Log in |
| PUT | `/api/user/update_user/:id` | Update a user; currently needs fixes |
| DELETE | `/api/user/delete_user/:id` | Delete a user |

### Administrators and roles

| Method | Endpoint | Handler purpose |
| --- | --- | --- |
| GET | `/api/admin/get_all_admin` | List administrators |
| POST | `/api/admin/create_admin` | Create an administrator |
| POST | `/api/admin/login_admin` | Log in as an administrator |
| PUT | `/api/admin/update_admin/:id` | Update an administrator; currently needs fixes |
| POST | `/api/role/create_role` | Create a role |

### Travels

These routes currently require a Bearer token.

| Method | Endpoint | Handler purpose |
| --- | --- | --- |
| GET | `/api/travel/get_all_travel` | List travels |
| GET | `/api/travel/get_travel_by_id/:id` | Get one travel |
| GET | `/api/travel/search_travel/:de/:a/:date` | Search by departure, destination, and date |
| POST | `/api/travel/create_travel` | Create a travel |
| PUT | `/api/travel/update_travel/:id` | Update a travel |
| DELETE | `/api/travel/delete_travel/:id` | Delete a travel |

### Tickets

These routes currently require a Bearer token.

| Method | Endpoint | Handler purpose |
| --- | --- | --- |
| GET | `/api/ticket/get_all_ticket` | List tickets |
| GET | `/api/ticket/get_one_ticket/:id` | Get one ticket |
| POST | `/api/ticket/create_ticket` | Create a ticket |
| PUT | `/api/ticket/update_ticket/:id` | Update a ticket; currently needs fixes |
| DELETE | `/api/ticket/delete_ticket/:id` | Delete a ticket |

## Example local requests

Use Postman with `Content-Type: application/json`. Create a role first:

**POST `/api/role/create_role`**

```json
{
  "role": "Utilisateur"
}
```

Use the returned role ID when registering a user. In the example below, replace `1` if your role has a different ID.

**POST `/api/user/create_user`**

```json
{
  "prenom": "Demo",
  "nom": "User",
  "date_de_naissance": "1995-01-01",
  "telephone": 123456789,
  "email": "demo@example.com",
  "mot_de_passe": "LocalDemoOnly123!",
  "roleId": 1
}
```

The phone field currently uses an integer; changing it to a string is planned.

**POST `/api/user/login_user`**

```json
{
  "email": "demo@example.com",
  "mot_de_passe": "LocalDemoOnly123!"
}
```

For travel and ticket requests, select **Authorization → Bearer Token** in Postman and paste the returned token. Keep tokens private.

**POST `/api/travel/create_travel`**

```json
{
  "de": "Ottawa",
  "a": "Montreal",
  "date": "2027-01-15",
  "heure": "09:00",
  "prix": 45.5
}
```

These examples describe the existing request formats; they are not evidence that every flow has passed integration tests.

## Current limitations and next improvements

- Move the hardcoded JWT signing secret into environment configuration and identify the authenticated account separately from its role.
- Protect user, administrator, and role management routes; enforce role and resource-ownership checks. Existing token checks are not complete authorization.
- Exclude password hashes from API responses and remove token logging.
- Fix the undefined `token` in user updates, align update IDs with route parameters, and correct administrator role-field casing.
- Align ticket update fields with `voyageId` and `utilisateurId` in the model.
- Fix login validation and stop handlers immediately after sending error responses.
- Improve missing-record handling and HTTP status codes; avoid exposing stack traces in production responses.
- Register the root route before the catch-all handler and retain the server instance for shutdown handling.
- Initialize the database after model loading and before accepting requests; add migrations and repeatable seed data.
- Add start scripts and automated tests. The current `npm test` command is a placeholder that exits with an error.

Run this version locally with test data while these improvements are in progress.

## Learning focus

- Following a request from an Express route to a controller and database model.
- Designing relational data with Sequelize associations.
- Understanding password hashing, JWTs, authentication, and authorization.
- Validating requests and debugging asynchronous JavaScript.
- Making focused Git commits and documenting project changes.

## Author

Kawther Khlif — [GitHub](https://github.com/kawther27) · [Portfolio](https://kawtherdev.com)
