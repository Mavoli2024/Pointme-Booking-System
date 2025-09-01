iimage.png 
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables in the correct order (dependencies first)

-- 1. Users table (no dependencies)
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  role character varying NOT NULL DEFAULT 'customer'::character varying CHECK (role::text = ANY (ARRAY['customer'::character varying, 'business_owner'::character varying, 'admin'::character varying]::text[])),
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  phone character varying,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- 2. Service categories table (no dependencies)
CREATE TABLE public.service_categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL UNIQUE,
  description text,
  icon character varying,
  color character varying DEFAULT '#3B82F6'::character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_categories_pkey PRIMARY KEY (id)
);

-- 3. Businesses table (depends on users and service_categories)
CREATE TABLE public.businesses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  owner_id uuid,
  name character varying NOT NULL,
  description text,
  address text,
  city character varying,
  state character varying,
  postal_code character varying,
  country character varying DEFAULT 'South Africa'::character varying,
  phone character varying,
  email character varying,
  website character varying,
  category_id uuid,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying]::text[])),
  operating_hours jsonb,
  latitude numeric,
  longitude numeric,
  logo_url text,
  banner_url text,
  rating numeric DEFAULT 0,
  total_reviews integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT businesses_pkey PRIMARY KEY (id),
  CONSTRAINT businesses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.service_categories(id),
  CONSTRAINT businesses_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id)
);

-- 4. Services table (depends on businesses and service_categories)
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  business_id uuid,
  name character varying NOT NULL,
  description text,
  price numeric NOT NULL,
  duration integer,
  category_id uuid,
  is_active boolean DEFAULT true,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT services_pkey PRIMARY KEY (id),
  CONSTRAINT services_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.service_categories(id),
  CONSTRAINT services_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id)
);

-- 5. Bookings table (depends on users, businesses, and services)
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  customer_id uuid,
  business_id uuid,
  service_id uuid,
  booking_date date NOT NULL,
  booking_time time without time zone NOT NULL,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'confirmed'::character varying, 'completed'::character varying, 'cancelled'::character varying, 'no_show'::character varying]::text[])),
  payment_status character varying DEFAULT 'pending'::character varying CHECK (payment_status::text = ANY (ARRAY['pending'::character varying, 'paid'::character varying, 'refunded'::character varying, 'failed'::character varying]::text[])),
  total_amount numeric NOT NULL,
  commission_amount numeric DEFAULT 0,
  notes text,
  customer_notes text,
  business_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id),
  CONSTRAINT bookings_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id),
  CONSTRAINT bookings_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id)
);

-- 6. Payments table (depends on bookings)
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  booking_id uuid,
  amount numeric NOT NULL,
  payment_method character varying DEFAULT 'cash'::character varying,
  transaction_id character varying,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'completed'::character varying, 'failed'::character varying, 'refunded'::character varying]::text[])),
  payment_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id)
);

-- 7. Commissions table (depends on bookings and businesses)
CREATE TABLE public.commissions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  booking_id uuid,
  business_id uuid,
  amount numeric NOT NULL,
  percentage numeric DEFAULT 5.00,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'paid'::character varying, 'cancelled'::character varying]::text[])),
  payment_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT commissions_pkey PRIMARY KEY (id),
  CONSTRAINT commissions_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id),
  CONSTRAINT commissions_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id)
);

-- 8. Reviews table (depends on users, businesses, and bookings)
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  customer_id uuid,
  business_id uuid,
  booking_id uuid,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id),
  CONSTRAINT reviews_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id),
  CONSTRAINT reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id)
);

-- 9. Notifications table (depends on users)
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  title character varying NOT NULL,
  message text NOT NULL,
  type character varying DEFAULT 'info'::character varying CHECK (type::text = ANY (ARRAY['info'::character varying, 'success'::character varying, 'warning'::character varying, 'error'::character varying]::text[])),
  read boolean DEFAULT false,
  data jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- 10. Business hours table (depends on businesses)
CREATE TABLE public.business_hours (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  business_id uuid,
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time time without time zone,
  close_time time without time zone,
  is_closed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT business_hours_pkey PRIMARY KEY (id),
  CONSTRAINT business_hours_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id)
);

-- 11. Business documents table (depends on businesses and users)
CREATE TABLE public.business_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  business_id uuid,
  document_type character varying NOT NULL,
  document_url text NOT NULL,
  document_name character varying,
  verification_status character varying DEFAULT 'pending'::character varying CHECK (verification_status::text = ANY (ARRAY['pending'::character varying, 'verified'::character varying, 'rejected'::character varying]::text[])),
  verified_by uuid,
  verified_at timestamp with time zone,
  rejection_reason text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT business_documents_pkey PRIMARY KEY (id),
  CONSTRAINT business_documents_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id),
  CONSTRAINT business_documents_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id)
);

-- 12. Availability slots table (depends on businesses and services)
CREATE TABLE public.availability_slots (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  business_id uuid,
  service_id uuid,
  date date NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  is_available boolean DEFAULT true,
  max_bookings integer DEFAULT 1,
  current_bookings integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT availability_slots_pkey PRIMARY KEY (id),
  CONSTRAINT availability_slots_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id),
  CONSTRAINT availability_slots_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id)
);

-- 13. Service images table (depends on services)
CREATE TABLE public.service_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  service_id uuid,
  image_url text NOT NULL,
  alt_text character varying,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_images_pkey PRIMARY KEY (id),
  CONSTRAINT service_images_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id)
);

-- 14. Service ratings table (depends on bookings, services, and users)
CREATE TABLE public.service_ratings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  booking_id uuid,
  service_id uuid,
  customer_id uuid,
  provider_id uuid,
  overall_rating integer CHECK (overall_rating >= 1 AND overall_rating <= 5),
  quality_rating integer CHECK (quality_rating >= 1 AND quality_rating <= 5),
  timeliness_rating integer CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  communication_rating integer CHECK (communication_rating >= 1 AND communication_rating <= 5),
  value_rating integer CHECK (value_rating >= 1 AND value_rating <= 5),
  review_text text,
  would_recommend boolean,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_ratings_pkey PRIMARY KEY (id),
  CONSTRAINT service_ratings_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id),
  CONSTRAINT service_ratings_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.users(id),
  CONSTRAINT service_ratings_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id),
  CONSTRAINT service_ratings_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id)
);

-- 15. Favorites table (depends on users and services)
CREATE TABLE public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  service_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT favorites_pkey PRIMARY KEY (id),
  CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT favorites_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id)
);

-- 16. Promo codes table (depends on users)
CREATE TABLE public.promo_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code character varying NOT NULL UNIQUE,
  description text,
  discount_type character varying CHECK (discount_type::text = ANY (ARRAY['percentage'::character varying, 'fixed_amount'::character varying]::text[])),
  discount_value numeric NOT NULL,
  min_order_amount numeric DEFAULT 0,
  max_uses integer,
  current_uses integer DEFAULT 0,
  valid_from timestamp with time zone DEFAULT now(),
  valid_until timestamp with time zone,
  is_active boolean DEFAULT true,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT promo_codes_pkey PRIMARY KEY (id),
  CONSTRAINT promo_codes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);

-- 17. Disputes table (depends on bookings and users)
CREATE TABLE public.disputes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  booking_id uuid,
  complainant_id uuid,
  respondent_id uuid,
  reason character varying NOT NULL,
  description text NOT NULL,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'investigating'::character varying, 'resolved'::character varying, 'dismissed'::character varying]::text[])),
  resolution text,
  created_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone,
  resolved_by uuid,
  CONSTRAINT disputes_pkey PRIMARY KEY (id),
  CONSTRAINT disputes_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id),
  CONSTRAINT disputes_complainant_id_fkey FOREIGN KEY (complainant_id) REFERENCES public.users(id),
  CONSTRAINT disputes_respondent_id_fkey FOREIGN KEY (respondent_id) REFERENCES public.users(id),
  CONSTRAINT disputes_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES public.users(id)
);

-- 18. Support tickets table (depends on users)
CREATE TABLE public.support_tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  subject character varying NOT NULL,
  description text NOT NULL,
  status character varying DEFAULT 'open'::character varying CHECK (status::text = ANY (ARRAY['open'::character varying, 'in_progress'::character varying, 'resolved'::character varying, 'closed'::character varying]::text[])),
  priority character varying DEFAULT 'medium'::character varying CHECK (priority::text = ANY (ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying]::text[])),
  category character varying DEFAULT 'general'::character varying,
  assigned_to uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone,
  CONSTRAINT support_tickets_pkey PRIMARY KEY (id),
  CONSTRAINT support_tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT support_tickets_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id)
);

-- 19. User sessions table (depends on users)
CREATE TABLE public.user_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  session_token text NOT NULL UNIQUE,
  ip_address inet,
  user_agent text,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  last_accessed timestamp with time zone DEFAULT now(),
  CONSTRAINT user_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- 20. Audit logs table (depends on users)
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  action character varying NOT NULL,
  table_name character varying,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Insert default service categories
INSERT INTO public.service_categories (name, description, icon, color) VALUES
('Home Cleaning', 'Professional home cleaning services', 'home', '#3B82F6'),
('Beauty & Wellness', 'Hair, makeup, and wellness services', 'heart', '#EC4899'),
('Home Repairs', 'Plumbing, electrical, and general repairs', 'wrench', '#F59E0B'),
('Transportation', 'Delivery and transportation services', 'truck', '#10B981'),
('Education', 'Tutoring and educational services', 'book', '#8B5CF6'),
('Technology', 'IT support and technical services', 'computer', '#6366F1'),
('Events', 'Event planning and catering services', 'calendar', '#EF4444'),
('Health & Fitness', 'Personal training and health services', 'activity', '#06B6D4');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_businesses_status ON public.businesses(status);
CREATE INDEX idx_businesses_owner_id ON public.businesses(owner_id);
CREATE INDEX idx_services_business_id ON public.services(business_id);
CREATE INDEX idx_services_category_id ON public.services(category_id);
CREATE INDEX idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX idx_bookings_business_id ON public.bookings(business_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX idx_reviews_business_id ON public.reviews(business_id);
CREATE INDEX idx_reviews_customer_id ON public.reviews(customer_id);
CREATE INDEX idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX idx_commissions_business_id ON public.commissions(business_id);
CREATE INDEX idx_commissions_booking_id ON public.commissions(booking_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_availability_slots_business_id ON public.availability_slots(business_id);
CREATE INDEX idx_availability_slots_date ON public.availability_slots(date);
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_service_id ON public.favorites(service_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Businesses are viewable by all" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Business owners can update their business" ON public.businesses FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Business owners can insert their business" ON public.businesses FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Services are viewable by all" ON public.services FOR SELECT USING (true);
CREATE POLICY "Business owners can manage their services" ON public.services FOR ALL USING (auth.uid() IN (SELECT owner_id FROM public.businesses WHERE id = business_id));

CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = customer_id OR auth.uid() IN (SELECT owner_id FROM public.businesses WHERE id = business_id));
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() IN (SELECT owner_id FROM public.businesses WHERE id = business_id));

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
