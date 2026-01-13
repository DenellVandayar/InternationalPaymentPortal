# International Bank Payment System

A full-stack web application designed for processing international payments. It features separate workflows for customers making payments and for employees reviewing and processing them. This project was built with a secure Node.js backend and a dynamic React frontend.

SonarQube Tests Repo: https://github.com/ST10381731/insy7314-poe-ST10381731.git

Youtube Video: https://youtu.be/Qp2CDOBoFGA

    international-payment-system-backend-api: A RESTApi with all backend functionality and endpoints for the main application

    payment-frontend: A react frontend app that contains the frontend for customers and employees

The entire system is powered by a Node.js backend and MongoDB for database services.

Prerequisites

Before you begin, ensure you have the following installed on your machine:

    Node.js (LTS version recommended)

    npm (comes bundled with Node.js)

    Git

    Chocolatey

    mkcert
    
---

1. Install Dependencies

Installing mkcert:
  `choco install mkcert`
    
---

You need to install the required npm packages for both the backend and frontend applications.

Install Backend Dependencies:
    
    cd international-payment-system-backend-api
    mkdir certs
    mkcert -install
    mkcert -key-file ./certs/localhost-key.pem -cert-file ./certs/localhost.pem localhost 127.0.0.1 ::1
    npm install

Install Frontend Dependencies (IN A SEPARATE CONSOLE):

    cd ../payment-frontend
    npm install

This ensures all the required libraries for React, Node.js, and MongoDB are downloaded.

---

2. Security hardening — Added packages

**We added extra safety middlewares to the backend to improve resilience against common web attacks and to provide better auditing/logging:**

- **hpp** — prevents HTTP Parameter Pollution attacks.

- **xss-clean** — sanitises incoming input to reduce XSS (Cross-Site Scripting) risk.

- **morgan** — HTTP request logger for auditing and debugging.

**Install**

- Run in the backend folder:
```
npm install hpp xss-clean morgan
```
---

3. Set Up MongoDB (Crucial)

The backend server requires a private key to securely connect to the database. This key is not stored in Git for security reasons.

  * Open the international-payment-system-backend-api folder.

  * Create a .env file by copying the example file. This will store your secret keys.

  * Open the new .env file and add the connection string for MONGO_URI and your own random 13 character or longer JWT_SECRET.

---

5. Run the Application

To run the full system, you need to start both the backend server and the frontend application, each in its own terminal.

Terminal 1: Start the Backend Server
## Make sure you are in the backend directory
    cd international-payment-system-backend-api
    node server.js

You should see Server is listening on port 5000.

Terminal 2: Start the Frontend Portal
## Make sure you are in the Frontend directory
    cd payment-frontend
    npm run dev

This will open the customer application in your browser.


You can now test the full workflow by registering as a customer, submitting a payment, and then logging into the staff portal to approve it.

# LOGIN FOR STAFF
username: staff01

Password: securepassword
