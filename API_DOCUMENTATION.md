# API Documentation

## Overview

This backend exposes a Django REST Framework API for authentication, clients, projects, tasks, and task attachments.

Base endpoints:
- `POST /auth/register/`
- `POST /auth/token/`
- `POST /auth/token/refresh/`
- `GET /auth/me/`
- `GET /clients/`, `POST /clients/`
- `GET /clients/{id}/`, `PUT /clients/{id}/`, `PATCH /clients/{id}/`, `DELETE /clients/{id}/`
- `GET /projects/`, `POST /projects/`
- `GET /projects/{id}/`, `PUT /projects/{id}/`, `PATCH /projects/{id}/`, `DELETE /projects/{id}/`
- `GET /tasks/list/`, `POST /tasks/list/`
- `GET /tasks/list/{id}/`, `PUT /tasks/list/{id}/`, `PATCH /tasks/list/{id}/`, `DELETE /tasks/list/{id}/`
- `GET /tasks/attachments/`, `POST /tasks/attachments/`
- `GET /tasks/attachments/{id}/`, `PUT /tasks/attachments/{id}/`, `PATCH /tasks/attachments/{id}/`, `DELETE /tasks/attachments/{id}/`

> The API uses JWT authentication via `rest_framework_simplejwt`.

---

## Authentication

### Register

`POST /auth/register/`

Request body:
```json
{
  "username": "user1",
  "email": "user1@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "id": 1,
  "username": "user1",
  "email": "user1@example.com"
}
```

### Obtain Token

`POST /auth/token/`

Request body:
```json
{
  "username": "user1",
  "password": "securepassword"
}
```

Response:
```json
{
  "refresh": "<refresh_token>",
  "access": "<access_token>"
}
```

### Refresh Token

`POST /auth/token/refresh/`

Request body:
```json
{
  "refresh": "<refresh_token>"
}
```

Response:
```json
{
  "access": "<new_access_token>"
}
```

### Current User

`GET /auth/me/`

Headers:
- `Authorization: Bearer <access_token>`

Response:
```json
{
  "id": 1,
  "username": "user1",
  "email": "user1@example.com"
}
```

---

## Authorization

Most endpoints require authentication via JWT access token.

Header:
```
Authorization: Bearer <access_token>
```

The authenticated user is used to filter resources and to set `created_by` on new objects.

---

## Clients

### Endpoints

- `GET /clients/`
- `POST /clients/`
- `GET /clients/{id}/`
- `PUT /clients/{id}/`
- `PATCH /clients/{id}/`
- `DELETE /clients/{id}/`

### Fields

- `id` (integer)
- `name` (string)
- `email` (string)
- `phone` (string)
- `created_by` (integer, read-only)

### Validation rules

- `name`: minimum 3 characters
- `phone`: must be 10 to 15 digits
- `email`: must be unique per authenticated user

### Filtering and search

`GET /clients/?search=term&ordering=name`

- `search`: searches `name`, `email`, and `phone`
- `ordering`: supports `name`

---

## Projects

### Endpoints

- `GET /projects/`
- `POST /projects/`
- `GET /projects/{id}/`
- `PUT /projects/{id}/`
- `PATCH /projects/{id}/`
- `DELETE /projects/{id}/`

### Fields

- `id` (integer)
- `title` (string)
- `description` (string)
- `client` (integer)
- `client_details` (object, read-only)
- `created_by` (integer, read-only)

### Sample project response

```json
{
  "id": 1,
  "title": "New Website",
  "description": "Create a marketing website for the client.",
  "client": 2,
  "client_details": {
    "id": 2,
    "name": "Client Name",
    "email": "client@example.com",
    "phone": "1234567890",
    "created_by": 1
  },
  "created_by": 1
}
```

### Validation rules

- `title`: minimum 3 characters
- `description`: minimum 10 characters
- `client`: must belong to the authenticated user

### Filtering and search

`GET /projects/?client=2&search=keyword&ordering=title`

- `client`: filter by client ID
- `search`: searches `title` and `description`
- `ordering`: supports `title`

---

## Tasks

### Endpoints

- `GET /tasks/list/`
- `POST /tasks/list/`
- `GET /tasks/list/{id}/`
- `PUT /tasks/list/{id}/`
- `PATCH /tasks/list/{id}/`
- `DELETE /tasks/list/{id}/`

### Fields

- `id` (integer)
- `title` (string)
- `description` (string)
- `status` (string)
- `priority` (string)
- `project` (integer)
- `created_by` (integer, read-only)

### Status options

- `Pending`
- `In Progress`
- `Completed`

### Priority options

- `1`: High
- `2`: Medium
- `3`: Low

### Validation rules

- `title`: minimum 3 characters
- `description`: minimum 10 characters
- `project`: must belong to the authenticated user

### Filtering and search

`GET /tasks/list/?status=Pending&priority=1&search=keyword&ordering=title`

- `status`: filter by status
- `priority`: filter by priority
- `search`: searches `title` and `description`
- `ordering`: supports `title`, `status`, and `priority`

### Ownership

Task object permissions enforce that only the owner can access or modify a task.

---

## Task Attachments

### Endpoints

- `GET /tasks/attachments/`
- `POST /tasks/attachments/`
- `GET /tasks/attachments/{id}/`
- `PUT /tasks/attachments/{id}/`
- `PATCH /tasks/attachments/{id}/`
- `DELETE /tasks/attachments/{id}/`

### Fields

- `id` (integer)
- `task` (integer)
- `file` (file upload)
- `uploaded_at` (datetime, read-only)

### Validation rules

- `file`: maximum 5 MB
- `task`: must belong to a task created by the authenticated user

### Notes

- Attachments are restricted to tasks owned by the authenticated user.
- File upload uses standard multipart form-data.

---

## Pagination

The API uses DRF `LimitOffsetPagination` with a default page size of 5.

Example:
- `GET /clients/?limit=5&offset=0`

---

## Media files

Uploaded task attachments are served via Django media settings at `/media/`.

---

## Notes

- All list and detail views are scoped to the authenticated user via `created_by`.
- `created_by` is always set automatically and cannot be written by API clients.
- Client and project objects must belong to the user before they may be assigned to projects or tasks.
