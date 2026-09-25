# Online Food Delivery System – Node.js Assignment

This project contains two separate implementations of the Online Food Delivery System.

## Implementation A – Node.js HTTP Module

Location: `implementation-http/`

This version uses Node.js's built-in `http` module. Routing and request/response handling are implemented manually. Express.js and Handlebars are not used.

### Routes
- `GET /` – Home
- `GET /restaurants` – Display restaurants
- `GET /restaurant/:id` – Display restaurant details
- `GET /order/:id` – Display order status

## Implementation B – Express.js + Handlebars

Location: `implementation-express/`

This version uses Express.js for routing and Handlebars (HBS) for server-side templates.

It demonstrates:
- Static routes
- Dynamic routes and route parameters
- Request/response handling
- Dynamic server-side data
- `{{#each}}` loops
- Conditional/helper functionality
- Appropriate HTTP status codes

### Routes
- `GET /` – Home
- `GET /restaurants` – Display restaurants
- `GET /restaurant/:id` – Display restaurant details
- `GET /order/:id` – Display order status

## How to Run

Open a terminal in the required implementation folder and install dependencies:

```bash
npm install
```

Then start the server using the command specified in that folder's `package.json` (commonly `npm start` or `node server.js`).

Open the localhost URL shown by the terminal in a browser.

## HTTP Module vs Express.js

| Feature | Node.js HTTP Module | Express.js |
|---|---|---|
| Routing | Manual | Built-in routing |
| Code complexity | More code | Simpler and cleaner |
| Maintainability | More difficult as the app grows | Easier to organize |
| Scalability | Requires more manual structure | Better suited to larger applications |
| Templates | Not used | Handlebars used |
| Middleware | Manual implementation | Rich middleware ecosystem |

## Important

GitHub can store and display the source code, but GitHub Pages cannot run Node.js/Express server applications. To make the backend publicly accessible, deploy the Node.js application on a Node-compatible hosting service and use this GitHub repository for the source code.
