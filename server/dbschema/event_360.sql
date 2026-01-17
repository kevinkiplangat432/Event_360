Table roles {
  id int [pk]
  name varchar(50) [unique, not null]
  created_at datetime
}

Table users {
  id int [pk]
  username varchar(100) [unique, not null]
  email varchar(120) [unique, not null]
  phone varchar(20)
  password_hash varchar(255) [not null]
  role_id int [ref: > roles.id, default: 3, not null]
  is_active boolean [default: true]
  created_at datetime
  avatar_url varchar(255)
}

Table events {
  id int [pk]
  organizer_id int [ref: > users.id, not null]
  title varchar(200) [not null]
  description text
  venue varchar(200)
  address varchar(500)
  city varchar(100)
  country varchar(100)
  start_time datetime [not null]
  end_time datetime [not null]
  category varchar(100)
  status varchar(50) [default: 'pending']
  created_at datetime
  updated_at datetime
  poster_url varchar(255)
  banner_url varchar(255)
  capacity int
  is_public boolean [default: true]
}

Table event_approvals {
  id int [pk]
  event_id int [ref: > events.id, not null]
  admin_id int [ref: > users.id, not null]
  status varchar(50) [not null]
  comment text
  decided_at datetime
}

Table ticket_types {
  id int [pk]
  event_id int [ref: > events.id, not null]
  name varchar(100) [not null]
  description text
  price numeric(10,2) [not null]
  quantity_total int [not null]
  quantity_sold int [default: 0]
  sale_start datetime
  sale_end datetime
  access_level varchar(50) [default: 'general']
  is_active boolean [default: true]
  max_per_user int [default: 10]
}

Table orders {
  id int [pk]
  user_id int [ref: > users.id, not null]
  event_id int [ref: > events.id, not null]
  total_amount numeric(10,2) [not null]
  payment_status varchar(50) [default: 'pending']
  order_status varchar(50) [default: 'processing']
  created_at datetime
  updated_at datetime
  reference varchar(100) [unique]
}

Table order_items {
  id int [pk]
  order_id int [ref: > orders.id, not null]
  ticket_type_id int [ref: > ticket_types.id, not null]
  quantity int [not null]
  unit_price numeric(10,2) [not null]
  subtotal numeric(10,2) [not null]
}

Table payments {
  id int [pk]
  order_id int [ref: > orders.id, not null]
  provider varchar(50)
  provider_ref varchar(100)
  amount numeric(10,2)
  status varchar(50) [default: 'pending']
  raw_payload json
  created_at datetime
}

Table tickets {
  id int [pk]
  order_id int [ref: > orders.id, not null]
  ticket_type_id int [ref: > ticket_types.id, not null]
  code varchar(100) [unique, not null]
  qr_image_url varchar(255)
  status varchar(50) [default: 'valid']
  checked_in_at datetime
  created_at datetime
}

Table event_registrations {
  id int [pk]
  user_id int [ref: > users.id, not null]
  event_id int [ref: > events.id, not null]
  quantity int [not null]
  registration_type varchar(50) [default: 'general']
  notes text
  registered_at datetime
  updated_at datetime

  Indexes {
    (user_id, event_id) [unique]
  }
}

Table reviews {
  id int [pk]
  user_id int [ref: > users.id, not null]
  event_id int [ref: > events.id, not null]
  rating int [not null]
  comment text
  created_at datetime

  Indexes {
    (user_id, event_id) [unique]
  }
}

Table wishlists {
  id int [pk]
  user_id int [ref: > users.id, not null]
  event_id int [ref: > events.id, not null]
  created_at datetime

  Indexes {
    (user_id, event_id) [unique]
  }
}

Table notifications {
  id int [pk]
  user_id int [ref: > users.id, not null]
  title varchar(200) [not null]
  message text
  type varchar(50)
  is_read boolean [default: false]
  created_at datetime
}
