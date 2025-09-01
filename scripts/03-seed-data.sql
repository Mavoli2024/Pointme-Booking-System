-- Seed data for PointMe Platform

-- Insert service categories
INSERT INTO public.service_categories (name, description, icon) VALUES
  ('Beauty & Wellness', 'Hair, nails, spa, and wellness services', '💄'),
  ('Health & Medical', 'Medical consultations, therapy, and health services', '🏥'),
  ('Automotive', 'Car maintenance, repair, and detailing services', '🚗'),
  ('Home Services', 'Cleaning, maintenance, and repair services', '🏠'),
  ('Professional Services', 'Legal, accounting, consulting, and business services', '💼'),
  ('Education & Training', 'Tutoring, courses, and skill development', '📚'),
  ('Food & Catering', 'Restaurant reservations, catering, and food services', '🍽️'),
  ('Fitness & Sports', 'Personal training, sports coaching, and fitness classes', '💪')
ON CONFLICT (name) DO NOTHING;

-- Adding comprehensive test data for all tables
-- Insert test users
INSERT INTO public.users (id, email, name, phone, role, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'john.customer@example.com', 'John Customer', '+27123456789', 'customer', NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'jane.customer@example.com', 'Jane Smith', '+27123456790', 'customer', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'mike.business@example.com', 'Mike Business', '+27123456791', 'business', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', 'sarah.business@example.com', 'Sarah Wilson', '+27123456792', 'business', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', 'admin@pointme.co.za', 'Admin User', '+27123456793', 'admin', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert test businesses
INSERT INTO public.businesses (id, owner_id, name, description, address, phone, email, category, status, created_at) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Elite Hair Salon', 'Premium hair styling and beauty services', '123 Main Street, Cape Town', '+27214567890', 'info@elitehair.co.za', 'Beauty & Wellness', 'approved', NOW()),
  ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'QuickFix Auto', 'Professional automotive repair and maintenance', '456 Workshop Ave, Johannesburg', '+27115678901', 'contact@quickfix.co.za', 'Automotive', 'approved', NOW()),
  ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Mayeni Services', 'Professional home and office cleaning', '789 Service Road, Durban', '+27315678902', 'hello@mayeni.co.za', 'Home Services', 'pending', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert test services
INSERT INTO public.services (id, business_id, name, description, price, duration, category_id, availability, created_at) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Hair Cut & Style', 'Professional haircut with styling', 350.00, 60, (SELECT id FROM service_categories WHERE name = 'Beauty & Wellness'), '{"2025-01-27": ["09:00", "10:00", "11:00", "14:00", "15:00"], "2025-01-28": ["09:00", "10:00", "11:00", "14:00", "15:00"]}', NOW()),
  ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'Hair Color Treatment', 'Full hair coloring service', 650.00, 120, (SELECT id FROM service_categories WHERE name = 'Beauty & Wellness'), '{"2025-01-27": ["09:00", "11:00", "14:00"], "2025-01-28": ["09:00", "11:00", "14:00"]}', NOW()),
  ('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', 'Car Service', 'Complete vehicle maintenance service', 850.00, 180, (SELECT id FROM service_categories WHERE name = 'Automotive'), '{"2025-01-27": ["08:00", "10:00", "13:00"], "2025-01-28": ["08:00", "10:00", "13:00"]}', NOW()),
  ('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440003', 'Office Cleaning', 'Professional office cleaning service', 450.00, 120, (SELECT id FROM service_categories WHERE name = 'Home Services'), '{"2025-01-27": ["08:00", "10:00", "14:00"], "2025-01-28": ["08:00", "10:00", "14:00"]}', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert test bookings
INSERT INTO public.bookings (id, customer_id, service_id, business_id, booking_date, booking_time, status, total_amount, payment_method, customer_name, customer_email, customer_phone, created_at) VALUES
  ('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '2025-01-28', '10:00', 'confirmed', 350.00, 'cash', 'John Customer', 'john.customer@example.com', '+27123456789', NOW()),
  ('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', '2025-01-29', '10:00', 'pending', 850.00, 'payfast', 'Jane Smith', 'jane.customer@example.com', '+27123456790', NOW()),
  ('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440003', '2025-01-30', '14:00', 'completed', 450.00, 'cash', 'John Customer', 'john.customer@example.com', '+27123456789', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert test reviews
INSERT INTO public.reviews (id, booking_id, customer_id, business_id, rating, comment, created_at) VALUES
  ('950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003', 5, 'Excellent service! Very professional and thorough cleaning.', NOW()),
  ('950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 4, 'Great haircut, very happy with the result!', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert test notifications
INSERT INTO public.notifications (id, user_id, title, message, type, read, created_at) VALUES
  ('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Booking Confirmed', 'Your booking for Hair Cut & Style has been confirmed for Jan 28, 2025 at 10:00 AM', 'booking', false, NOW()),
  ('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'New Booking Request', 'You have a new booking request for Office Cleaning', 'booking', false, NOW()),
  ('a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'New Business Registration', 'Mayeni Services has submitted a business registration for approval', 'business_registration', false, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert test support tickets
INSERT INTO public.support_tickets (id, user_id, subject, message, status, priority, created_at) VALUES
  ('b50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Payment Issue', 'I had trouble processing my payment for the car service booking', 'open', 'high', NOW()),
  ('b50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Profile Update Request', 'Need help updating my business profile information', 'in_progress', 'medium', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert test payments
INSERT INTO public.payments (id, booking_id, amount, currency, method, status, transaction_id, created_at) VALUES
  ('c50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 350.00, 'ZAR', 'cash', 'completed', 'CASH_001', NOW()),
  ('c50e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', 850.00, 'ZAR', 'payfast', 'pending', 'PF_12345', NOW()),
  ('c50e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440003', 450.00, 'ZAR', 'cash', 'completed', 'CASH_002', NOW())
ON CONFLICT (id) DO NOTHING;
