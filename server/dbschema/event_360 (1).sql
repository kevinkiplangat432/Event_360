CREATE TABLE "roles" (
  "id" int PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL,
  "created_at" timestamp
);

CREATE TABLE "users" (
  "id" int PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "phone" varchar,
  "password_hash" varchar NOT NULL,
  "role_id" int NOT NULL,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp
);

CREATE TABLE "events" (
  "id" int PRIMARY KEY,
  "organizer_id" int NOT NULL,
  "title" varchar NOT NULL,
  "description" text,
  "venue" varchar,
  "start_time" timestamp NOT NULL,
  "end_time" timestamp NOT NULL,
  "status" varchar NOT NULL,
  "created_at" timestamp
);

CREATE TABLE "event_approvals" (
  "id" int PRIMARY KEY,
  "event_id" int NOT NULL,
  "admin_id" int NOT NULL,
  "status" varchar NOT NULL,
  "comment" text,
  "decided_at" timestamp
);

CREATE TABLE "orders" (
  "id" int PRIMARY KEY,
  "user_id" int NOT NULL,
  "event_id" int NOT NULL,
  "total_amount" numeric NOT NULL,
  "payment_status" varchar NOT NULL,
  "created_at" timestamp
);

CREATE TABLE "payments" (
  "id" int PRIMARY KEY,
  "order_id" int NOT NULL,
  "provider" varchar,
  "provider_ref" varchar,
  "status" varchar,
  "raw_payload" json,
  "created_at" timestamp
);

CREATE TABLE "event_registrations" (
  "id" int PRIMARY KEY,
  "user_id" int NOT NULL,
  "event_id" int NOT NULL,
  "quantity" int NOT NULL,
  "registered_at" timestamp
);

CREATE TABLE "tickets" (
  "id" int PRIMARY KEY,
  "order_id" int NOT NULL,
  "code" varchar UNIQUE NOT NULL,
  "status" varchar,
  "checked_in_at" timestamp
);

CREATE INDEX ON "users" ("email");

CREATE INDEX ON "users" ("username");

ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

ALTER TABLE "events" ADD FOREIGN KEY ("organizer_id") REFERENCES "users" ("id");

ALTER TABLE "event_approvals" ADD FOREIGN KEY ("event_id") REFERENCES "events" ("id");

ALTER TABLE "event_approvals" ADD FOREIGN KEY ("admin_id") REFERENCES "users" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("event_id") REFERENCES "events" ("id");

ALTER TABLE "payments" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "tickets" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "event_registrations" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "event_registrations" ADD FOREIGN KEY ("event_id") REFERENCES "events" ("id");
