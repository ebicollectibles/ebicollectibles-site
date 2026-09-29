-- Run this ONCE in the Neon SQL Editor, on the branch you're setting RLS up
-- for (dev-testing first, production later as its own separate step).
--
-- Creates a login-capable role that customer-facing reads run as, with RLS
-- policies limiting it to the calling user's own rows. Your app's normal
-- DATABASE_URL (neondb_owner) is unaffected — that role has BYPASSRLS, so
-- admin panel / order placement / everything else keeps working exactly as
-- it does today.
--
-- Replace REPLACE_WITH_STRONG_PASSWORD below with a real generated password
-- before running (e.g. `openssl rand -base64 24`), then throw that value
-- into CUSTOMER_DATABASE_URL (see .env.example) — never commit it.

CREATE ROLE app_customer LOGIN PASSWORD 'REPLACE_WITH_STRONG_PASSWORD';

GRANT USAGE ON SCHEMA public TO app_customer;
GRANT SELECT ON users, orders, order_items, shipments, shipment_items TO app_customer;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_items ENABLE ROW LEVEL SECURITY;

-- The app sets this per-request (via set_config, scoped to one transaction)
-- to the Clerk-resolved users.id right before running a customer's own
-- read — see getCustomerScopedRows in src/lib/db/client.ts.
CREATE POLICY customer_select_own_user ON users
  FOR SELECT TO app_customer
  USING (id = current_setting('app.user_id', true)::uuid);

CREATE POLICY customer_select_own_orders ON orders
  FOR SELECT TO app_customer
  USING (user_id = current_setting('app.user_id', true)::uuid);

CREATE POLICY customer_select_own_order_items ON order_items
  FOR SELECT TO app_customer
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
      AND orders.user_id = current_setting('app.user_id', true)::uuid
  ));

CREATE POLICY customer_select_own_shipments ON shipments
  FOR SELECT TO app_customer
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = shipments.order_id
      AND orders.user_id = current_setting('app.user_id', true)::uuid
  ));

CREATE POLICY customer_select_own_shipment_items ON shipment_items
  FOR SELECT TO app_customer
  USING (EXISTS (
    SELECT 1 FROM shipments
    JOIN orders ON orders.id = shipments.order_id
    WHERE shipments.id = shipment_items.shipment_id
      AND orders.user_id = current_setting('app.user_id', true)::uuid
  ));
