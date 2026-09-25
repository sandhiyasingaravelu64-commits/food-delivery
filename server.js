/**
 * Implementation A - Online Food Delivery System
 * Built using ONLY the built-in Node.js "http" module.
 * No Express, no template engine - HTML is generated manually.
 */

const http = require('http');
const url = require('url');

// ---------- In-memory mock data ----------

const restaurants = [
  {
    id: 1,
    name: 'Spice Villa',
    cuisine: 'Indian',
    rating: 4.5,
    menu: [
      { item: 'Butter Chicken', price: 12.99 },
      { item: 'Paneer Tikka', price: 10.49 },
      { item: 'Garlic Naan', price: 3.50 }
    ]
  },
  {
    id: 2,
    name: 'Pasta Palace',
    cuisine: 'Italian',
    rating: 4.2,
    menu: [
      { item: 'Spaghetti Carbonara', price: 13.50 },
      { item: 'Margherita Pizza', price: 11.00 },
      { item: 'Tiramisu', price: 6.00 }
    ]
  },
  {
    id: 3,
    name: 'Sushi Central',
    cuisine: 'Japanese',
    rating: 4.8,
    menu: [
      { item: 'Salmon Nigiri (6pc)', price: 9.00 },
      { item: 'California Roll', price: 8.50 },
      { item: 'Miso Soup', price: 3.00 }
    ]
  }
];

const orders = {
  101: { id: 101, restaurantId: 1, items: ['Butter Chicken', 'Garlic Naan'], status: 'Out for Delivery', total: 16.49 },
  102: { id: 102, restaurantId: 2, items: ['Margherita Pizza'], status: 'Preparing', total: 11.00 },
  103: { id: 103, restaurantId: 3, items: ['California Roll', 'Miso Soup'], status: 'Delivered', total: 11.50 }
};

// ---------- View helpers (manual HTML string building) ----------

function layout(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title} | QuickBite</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: #f7f7f7; color: #222; }
    header { background: #ff5a5f; color: #fff; padding: 16px 24px; }
    header a { color: #fff; text-decoration: none; margin-right: 16px; font-weight: bold; }
    main { max-width: 800px; margin: 24px auto; padding: 0 16px; }
    .card { background: #fff; border-radius: 8px; padding: 16px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .status { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 0.85em; color: #fff; }
    .status.Preparing { background: #f0ad4e; }
    .status.Out { background: #5bc0de; }
    .status.Delivered { background: #5cb85c; }
    h1, h2 { margin-top: 0; }
    footer { text-align: center; color: #888; font-size: 0.8em; margin: 32px 0; }
  </style>
</head>
<body>
  <header>
    <a href="/">Home</a>
    <a href="/restaurants">Restaurants</a>
  </header>
  <main>${body}</main>
  <footer>Implementation A &mdash; built with the Node.js "http" module only</footer>
</body>
</html>`;
}

function sendHTML(res, statusCode, html) {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function notFound(res, message) {
  sendHTML(res, 404, layout('Not Found', `<h1>404 - Not Found</h1><p>${message}</p>`));
}

// ---------- Manual router ----------

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (method !== 'GET') {
    return sendHTML(res, 405, layout('Method Not Allowed', '<h1>405 - Method Not Allowed</h1>'));
  }

  // Static route: home
  if (pathname === '/') {
    const body = `
      <h1>Welcome to QuickBite Delivery</h1>
      <p>Order food from your favorite local restaurants, tracked in real time.</p>
      <p><a href="/restaurants">Browse Restaurants &rarr;</a></p>
    `;
    return sendHTML(res, 200, layout('Home', body));
  }

  // Static route: restaurant list
  if (pathname === '/restaurants') {
    const cards = restaurants.map(r => `
      <div class="card">
        <h2><a href="/restaurant/${r.id}">${r.name}</a></h2>
        <p>${r.cuisine} &middot; Rating: ${r.rating} / 5</p>
      </div>
    `).join('');
    return sendHTML(res, 200, layout('Restaurants', `<h1>Restaurants</h1>${cards}`));
  }

  // Dynamic route: restaurant detail -> /restaurant/:id
  let match = pathname.match(/^\/restaurant\/(\d+)\/?$/);
  if (match) {
    const id = parseInt(match[1], 10);
    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) return notFound(res, `No restaurant with id ${id}.`);

    const menuRows = restaurant.menu
      .map(m => `<li>${m.item} &mdash; $${m.price.toFixed(2)}</li>`)
      .join('');

    const body = `
      <h1>${restaurant.name}</h1>
      <p>${restaurant.cuisine} &middot; Rating: ${restaurant.rating} / 5</p>
      <h2>Menu</h2>
      <ul>${menuRows}</ul>
      <p><a href="/restaurants">&larr; Back to restaurants</a></p>
    `;
    return sendHTML(res, 200, layout(restaurant.name, body));
  }

  // Dynamic route: order status -> /order/:id
  match = pathname.match(/^\/order\/(\d+)\/?$/);
  if (match) {
    const id = parseInt(match[1], 10);
    const order = orders[id];
    if (!order) return notFound(res, `No order with id ${id}.`);

    const restaurant = restaurants.find(r => r.id === order.restaurantId);
    const itemsList = order.items.map(i => `<li>${i}</li>`).join('');
    const statusClass = order.status.split(' ')[0]; // Preparing | Out | Delivered

    const body = `
      <h1>Order #${order.id}</h1>
      <p>From: ${restaurant ? restaurant.name : 'Unknown restaurant'}</p>
      <h2>Items</h2>
      <ul>${itemsList}</ul>
      <p>Total: $${order.total.toFixed(2)}</p>
      <p>Status: <span class="status ${statusClass}">${order.status}</span></p>
    `;
    return sendHTML(res, 200, layout(`Order #${order.id}`, body));
  }

  // Fallback: 404
  return notFound(res, 'The page you requested does not exist.');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Implementation A (http module) running at http://localhost:${PORT}`);
});
