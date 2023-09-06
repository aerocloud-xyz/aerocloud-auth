 # Authentication Server 

This is a simple authentication server built with Node.js, Express, and MongoDB. The server allows users to register, login, and delete their accounts. The server also provides an API for verifying tokens and deleting users.

## Prerequisites

* Node.js v14 or later
* MongoDB v4.2 or later
* Docker
* Docker Compose

## Installation

1. Clone the repository.
2. Install the dependencies.
3. Start the MongoDB container.
4. Start the authentication server container.

```
git clone https://github.com/antonio0806/authentication-server.git
cd authentication-server
npm install
docker-compose up -d
```

## Usage

### Register a user

```
curl -X POST -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john.doe@example.com", "password": "password123"}' http://localhost:3001/users/register
```

### Login a user

```
curl -X POST -H "Content-Type: application/json" -d '{"email": "john.doe@example.com", "password": "password123"}' http://localhost:3001/users/login
```

### Verify a token

```
curl -X POST -H "Content-Type: application/json" -d '{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjY3YjY0YjY1YjY1YjY1YjY1YjY1YjUifQ.6_6666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666