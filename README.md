Authentication using JWT
------------------------

### Project Specifications

Implement a REST API to manage authentication using JWT (JSON Web Token).

The task is to implement an Auth API using `User` model which exposes the following:

`POST` request to `/login`:

*   creates a new JWT every time
*   expects a username and password of the user in the request body 
*   Checks if the username and password are correct from the DB
*   Saves the JWT in the User table
*   the response code is 200 on the successful token creation, and the response body is the JWT token 

`POST` request to `/validate`:

*   decodes the JWT
*   expects the JWT in the request body
*   the response code is 200 on the successful token decode, and the response body is the username of the user

#### User Model - 

*   `id`: The unique id of the user (Integer)
*   `username`: The unique username of the user (String)
*   `password`: The password of the user (String)
*   `token`: The latest JWT (String) 

#### Notes - 

*   Replace the newly created JWT with the older one in the User table
*   Encode the username and current timestamp in the JWT body like the following - 

```
{
  username: <Username>,
  timestamp: <Current\_Timestamp>
}
```

*   Use **Sequelize** ORM to fetch/update User data.
*   Get the secret of JWT from the `.env` file programmatically.

Example

POST request **/login**

Request Body -

```
{
  "username": "Jarvisporter",
  "password": "myPassword"
}
```

Response Body -

```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV\_adQssw5c"
}
```

POST request **/validate**

Request Body -

```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV\_adQssw5c"
}
```

Response Body -

```
{
  "username": "Jarvisporter"
}
```

Complete the project so that it passes the unit tests, Please check `test/index.spec.js`

### Environment

*    Node Version: v14(LTS)
*    Default Port: 8000

Read-only files:

*   test/\*.spec.js
*   fixtures/data.json
    
*   connection.js
    
*   seed.js
    
*   models/users.js