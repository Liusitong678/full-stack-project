# full-stack-project
Drive Test Appointment Booking System
This is a full-stack web application built with Node.js, Express, MongoDB, and EJS. It simulates a drive test booking system for G and G2 license appointments in Ontario, allowing users to register, book, and manage appointments based on their roles.

🌟 Key Features
  User Authentication & Roles
  Supports secure registration and login with password encryption. Users can sign up as:

      Driver – books appointments and fills in personal/car info

      Examiner – views driver appointments and updates test results

      Admin – creates and manages available appointment slots

  Driver Interface

      G2 Test: Submit personal and car information

      G Test: View existing data and update car info

      Book available appointment slots

  Admin Interface

      Add appointment slots by date and time

      Prevent duplicate time slot creation

      View pass/fail lists for license processing

  Examiner Interface

      View and filter test candidates (G or G2)

      Add comments and mark pass/fail status

🧱 Tech Stack
  Backend: Node.js, Express.js

  Frontend: EJS, Bootstrap

  Database: MongoDB with Mongoose

  Authentication: Session-based with middleware for role-based access


