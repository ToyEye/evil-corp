# Evil Corp

Evil Corp is a workspace for warehouse and transport companies. The platform grants access, and each client company runs its own stock, orders, invoices, and deliveries in a private cabinet.

There is no open signup. A person submits a request, a platform admin reviews it, creates the company, and sets up the first SEO account. The company then configures roles and works inside its own cabinet.

The UI is React (Vite, MUI, Redux, React Query). Data comes from the API (`VITE_API_URL`, default `http://localhost:3000/api`).

## How it works

There are two kinds of companies.

The **platform** (Vertex Capital in the demo data) reviews access requests, sees users across every company, and answers support chats. Warehouse, orders, and trips do not belong to the platform.

A **client company** (RapidRoute Logistics, Peak Storage) gets its own cabinet URL, for example `/rapidroute-logistics/dashboard`. Inside it:

1. Staff creates a client order and reserves warehouse stock.
2. A storekeeper picks the order from bins. If stock is short, a restock request goes out.
3. Supply keeps the supplier directory and moves restock requests forward.
4. An accountant sees orders and the invoices issued from paid orders.
5. A dispatcher (SEO or Staff) assigns a vehicle and builds a route on the map.
6. A driver sees only their own trips: depart, arrive, and proof of delivery.
7. If work is blocked, anyone can message platform Support.

The company SEO decides which roles can open which pages. The sidebar updates immediately. The platform Admin cannot be removed from settings access.

## Roles

| Role | Where | Default pages |
| --- | --- | --- |
| Admin | Platform | Dashboard, users across all companies, settings, support |
| Support | Platform | Inbox of client-company chats |
| SEO | Client company | Almost the whole cabinet, plus the access matrix |
| Staff | Client company | Clients, orders, dispatch |
| Storekeeper | Client company | Warehouse: bins, picking, receipts |
| Supply | Client company | Suppliers and restock requests |
| Accountant | Client company | Orders and invoices |
| Driver | Client company | Assigned trips |
| Client | Client company | Own dashboard and the support chat |

## Run

```bash
npm install
npm run dev
```

The app opens at `http://localhost:5173`. Sign-in needs the API running.

## Screenshots

### Public site

Home: what the cabinet covers, and how to get in — by request, not by open signup.

![Home page](docs/screenshots/01-home.png)

About: the platform and client companies stay separate, and roles stay on their own pages.

![About page](docs/screenshots/02-about.png)

Sign-in and the access request share one window.

![Sign-in window](docs/screenshots/03-sign-in.png)

### Platform — Admin

John Doe's admin dashboard (Vertex Capital): user count, support chats, and the request queue. Approving a request creates the company and the first SEO account.

![Platform admin dashboard](docs/screenshots/04-admin-dashboard.png)

Users across every company. The admin filters by name, company, and role, and can add a person.

![Users across companies](docs/screenshots/05-admin-users.png)

### Platform — Support

Lena Ortiz's support inbox: chats from client-company staff. The reply goes into the selected thread.

![Support inbox](docs/screenshots/18-support-inbox.png)

### Client company — SEO

Ethan Park's dashboard (RapidRoute Logistics): employees, clients, suppliers, restock requests, and what needs attention — low stock and late trips.

![Client company SEO dashboard](docs/screenshots/06-seo-dashboard.png)

Access settings: the SEO checks which role can open each page. The sidebar updates immediately.

![Page access matrix](docs/screenshots/07-seo-settings.png)

Dispatch: the route map, stops, and orders that are not on a trip yet.

![Dispatch board](docs/screenshots/15-seo-dispatch.png)

Fleet: vehicles, capacity already on trips, and what is still free.

![Fleet](docs/screenshots/16-seo-fleet.png)

### Client company — Storekeeper

Sofia Alvarez's warehouse: pick lists by bin and the stock list. A red row is a critical quantity.

![Storekeeper warehouse](docs/screenshots/08-storekeeper-warehouse.png)

### Client company — Supply

Harper Quinn's supplier directory: supplier type and what they do not supply.

![Supplier directory](docs/screenshots/09-supply-directory.png)

Restock requests: where they came from (warehouse or a specific order), status, and note.

![Restock requests](docs/screenshots/10-supply-restock.png)

### Client company — Staff

Owen Blake's clients: contacts and the addresses later orders ship to.

![Company clients](docs/screenshots/11-staff-clients.png)

Orders: payment and warehouse status. One order is ready to ship, the other is waiting for stock.

![Order list](docs/screenshots/12-staff-orders.png)

A new order reserves warehouse stock. Staff picks the client, address, and line items.

![Create order form](docs/screenshots/13-staff-create-order.png)

### Client company — Accountant

Maya Singh's invoices are issued from paid orders. The PDF downloads from the row.

![Invoices](docs/screenshots/14-accountant-invoices.png)

### Client company — Driver

Liam Brooks's trips. The driver sees only their stops: address, status, and the button to open the trip.

![Driver trips](docs/screenshots/17-driver-trips.png)

### Client company — Client

Daniel Crowe's chat with platform Support. The Client role has no warehouse or orders — only their cabinet and this thread.

![Client support chat](docs/screenshots/19-client-support.png)
