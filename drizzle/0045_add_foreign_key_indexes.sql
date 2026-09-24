CREATE INDEX "auth_events_user_id_idx" ON "auth_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "email_events_order_id_idx" ON "email_events" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "marketplace_order_items_marketplace_order_id_idx" ON "marketplace_order_items" USING btree ("marketplace_order_id");--> statement-breakpoint
CREATE INDEX "marketplace_shipment_items_shipment_id_idx" ON "marketplace_shipment_items" USING btree ("shipment_id");--> statement-breakpoint
CREATE INDEX "marketplace_shipments_marketplace_order_id_idx" ON "marketplace_shipments" USING btree ("marketplace_order_id");--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_status_events_order_id_idx" ON "order_status_events" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_email_lower_idx" ON "orders" USING btree (lower("email"));--> statement-breakpoint
CREATE INDEX "payment_attempts_user_id_idx" ON "payment_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payment_attempts_email_idx" ON "payment_attempts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "product_edit_events_product_id_idx" ON "product_edit_events" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "refund_events_order_id_idx" ON "refund_events" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "shipment_items_shipment_id_idx" ON "shipment_items" USING btree ("shipment_id");--> statement-breakpoint
CREATE INDEX "shipments_order_id_idx" ON "shipments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "store_credit_events_user_id_idx" ON "store_credit_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "store_credit_events_order_id_idx" ON "store_credit_events" USING btree ("order_id");