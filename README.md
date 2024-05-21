# Niyo Task

Niyo Task is a simple task management app that requires authentication functionality and a socket to stream the data
created In real-time. This is needed as we need to monitor real-time updates and personalized task management.

This project was designed using `NestJS` as a framework and `TypeScript` as a Language `PostgreSQL` for the database
and `TypeORM` as the ORM.

## **System Requirements**

Before cloning the repo, ensure that your system meets the following requirements:

### Software Requirements

- NodeJS installed on your laptop

### Application Requirements

To test the API, you need the below installed on your laptop

- Postman

## Running the Application

To run the application, kindly visit the repo https://github.com/kelrob/hello-niyo and clone the application into your
machine.

### **Running the application locally**

1. Create a `.env` file in the root directory of the cloned application
2. Copy the content of the `.env.example` file into the newly created `.env` file.
3. Provide the values for each of the variables in your `.env` file
4. Run the following command in the root directory

    ```bash
    npm install
    ```

5. The application will be installed in your system locally and ready to run
6. Now run the command below to start the application

    ```bash
    npm run start:dev
    ```

7. To run the test you can run (Optional)

    ```bash
    npm run test
    ```

8. Your application should start running on `localhost:${PORT}`

   PORT = value defined in your PORT `.env` file.

### Running the Application via Docker

This app is also containerized via docker. To run this application on your local device via Docker, ensure you have
Docker installed.

1. Create a `.env` file in the root directory of the cloned application
2. Copy the content of the `.env.example` file into the newly created `.env` file.
3. Provide the values for each of the variables in your `.env` file
4. Run the following command in the root directory

    ```bash
    docker-compose build --no-cache
    ```

5. Now run the command below to start the spin up the containers

    ```bash
    docker-compose up -d
    ```

6. Your application should start running on `localhost:3000`

### **Running the application Online**

1. The application has already been set up online so you do not need to do anything to set it up online.

The app is running on
https://robert-hello-niyo-production.up.railway.app/api/v1/
![Screenshot 2024-05-18 030422](https://github.com/kelrob/hello-niyo/assets/11693108/5684a18b-bd3b-4f95-a21f-19f3111fdf02)


## Viewing the Stream

Once a new task is created, using the base url above, you can view the stream in real-time here
https://hello-niyo-websocket.vercel.app/ - Sample Below
![image](https://github.com/kelrob/hello-niyo/assets/11693108/dc6b638a-1f4e-434c-ae68-ed2019994918)



## API Documentation

You can view the documentation via https://documenter.getpostman.com/view/26868191/2sA3JT3yHh

## Technical Documentation

https://flat-exhaust-cf5.notion.site/Niyo-Assessment-Technical-Documentation-9e3a0efe332c4c66a8fe8b733be90107

## ERDIAGRAM
![Untitled (3)](https://github.com/kelrob/hello-niyo/assets/11693108/6209e8c4-d879-4a01-9c3b-7e37eceb8af3)


