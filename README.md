# Principle 1 MoPi Project

This application is used to store and manage policing data in line with a company MoPi policies. These policies will dictate when a person must be review or deleted determined by it's length within the database and its classification.

There are 3 user roles: admin, Information manager and User. admin is incharge of the adminstration of the system, the IM is inchrage of data mangament and user can add and edit data. With the admin role users and IM can be created.

Guest admin login:
yexoxap443@laklica.com
Password123!

## Installation

Ensure [Node.js](https://nodejs.org/en/) has been installed via node website. Ensure all dependencies are installed by the application by executing the command in the terminal:
```bash
npm update
```

## Usage
in the command line run the command to run the system. use the admin details in this file to login.
```bash
node ./index.js
```

### MoPi System
The MoPi system is ran when a user enters the review webpage. Everytime a person meets the review requirements it will be flagged in the review tab. If it is due for deletion, the classification is set for automatic deletion and it is also due for review - the data will be automatically deleted at this point.

A review will trigger when a user review data when it meets review years.

A delete will trigger when a user edited reaches the deletion date, and the review reaches the review date

Please note that reviewed and edited dates can not be changed using the front end of the system for secuirty concern and not wa. For marking and testing of this system editing of these within the external database is required. Please contact team 22 for access to this db.