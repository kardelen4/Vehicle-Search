# Vehicle and People Search System

This is a web based vehicle and driver lookup system that allows users to search for vehicles, search for people, and add new vehicles to a database. It was built as part of an Interfaces coursework project and includes front end design, Supabase integration, and automated browser testing with Playwright.

The project contains three main pages  
**People Search**  
**Vehicle Search**  
**Add a Vehicle**

---

## Features

### People Search
Search for drivers by  
* Name  
* Licence number  

The page validates input so the user cannot search by both fields or by neither. Results are shown with details such as address, date of birth, licence number and expiry date.

### Vehicle Search
Search for vehicles by registration or plate number.  
Displays the make, model, colour and owner ID.  
Returns helpful messages including “Search successful” or “No result found”.

### Add a Vehicle
Allows a user to register a new vehicle.  
If the owner does not exist in the database, the site prompts the user to add the owner first.  
This page has full input validation and error handling.

### Responsive Layout
The interface is built with CSS Grid and adapts below 500px.  
Navigation collapses into a vertical layout to support mobile screens.

### Dark Mode
All pages include a Dark Mode toggle that switches the colour scheme between light and dark.

### Automated Testing
Includes a Playwright test suite that checks  
* Form validation  
* Successful and unsuccessful searches  
* Error messages  
* Correct database output  

---

## Technologies Used

* HTML  
* CSS Grid and responsive styling  
* JavaScript  
* Supabase  
* Playwright  
* Node and npm



