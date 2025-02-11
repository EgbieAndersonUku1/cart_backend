# Cart System (In progress)

## Overview

This project is a minimal cart system designed to handle backend interactions using JavaScript, Django and Python and how to communicate with the backend via the Fetch API. The goal for this is to focus on the core functionality of managing cart items without building a full e-commerce application, hence which is why the cart page is only built.


## Key Areas of Exploration

As well as processing orders from the cart, this project also explores the security risks in the interaction between the frontend and backend. A key principle in web development is never to trust data sent from the frontend to the backend, as it can easily be manipulated before being sent to the backend.
The core reason is that frontend code (HTML, JavaScript, etc.) runs on the user's device, so it can be easily manipulated by users, even by those with little technical knowledge. For example, users can modify form inputs or use browser developer tools to change data before it gets submitted to the backend. Therefore, any data sent over from the frontend to the backend should always be validate, sanitize, and verify against the data on the server side before processing or storing it. This ensures that any data sent from the frontend is safe and trustworthy.

For example, imagine a user adds a single item to their cart priced at £9.99. If they manipulate the frontend to show five items at the same price, the backend may process the order incorrectly. Instead of paying £49.95 (5 × £9.99), the user could end up paying just £9.99.

To prevent this, the backend must validate cart data before processing payments. The backend should ensure correct prices and quantities are applied by checking data against the database. Token-based authentication (e.g., JWT or CSRF protection) can also help prevent unauthorised changes to the cart.

Other common attack scenarios include tampering with discount codes or altering request payloads. This project aims to explore these vulnerabilities and implement best practices for secure cart management.


## Features

- **Backend Handling**: JavaScript dynamically updates the cart when items are added, saved, or removed.
- **Fetch API Integration**: The system sends cart data to the backend for processing.
- **Preloaded Items**: The cart starts with two dummy products for demonstration purposes.
- **Minimal Backend Dependency**: The backend receives and processes cart updates but does not include a full application structure.
- **Discount**: Allowing a user to add a code which then decrease the price of the item providing the code is valid
- **Process**: Processing the order once it is correct

## Project Structure

- **`index.html`**: Contains the basic layout for the cart interface.
- **`cart.js`**: Handles adding, saving, and updating cart items using JavaScript.
- **`backend with django`** No login, registration, etc only the cart related functionalities will be added.

## Installation & Usage

1. Clone the repository:
   ```sh
   git clone https://github.com/EgbieAndersonUku1/cart_backend.git .
   cd cart_
   ```


## To do
- Add the backend which only go to be cart related functionalities
- Make the JS functional e.g. clicking the buttons, fetch, etc
- Add Footer

## Notes

This project is intentionally limited in scope. The focus is on developing a functional cart system that communicates with a backend, rather than a fully-fledged e-commerce solution. Only a basic cart item structure is implemented, with two dummy products preloaded for testing. Also the site is not responsible on smaller device e.g mobile, tablets, etc because the responsive element hasn't been added.


