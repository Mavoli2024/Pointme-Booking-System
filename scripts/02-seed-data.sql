-- Insert admin user
INSERT INTO users (id, email, full_name, role, phone) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'admin@pointme.co.za', 'Admin User', 'admin', '+27123456789')
ON CONFLICT (email) DO NOTHING;

-- Insert sample customers
INSERT INTO users (id, email, full_name, role, phone) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@email.com', 'John Doe', 'customer', '+27123456790'),
('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@email.com', 'Jane Smith', 'customer', '+27123456791'),
('550e8400-e29b-41d4-a716-446655440003', 'mike.wilson@email.com', 'Mike Wilson', 'customer', '+27123456792')
ON CONFLICT (email) DO NOTHING;

-- Insert sample business owners
INSERT INTO users (id, email, full_name, role, phone) VALUES 
('550e8400-e29b-41d4-a716-446655440010', 'sarah@cleanpro.co.za', 'Sarah Johnson', 'business', '+27123456800'),
('550e8400-e29b-41d4-a716-446655440011', 'david@plumbfix.co.za', 'David Brown', 'business', '+27123456801'),
('550e8400-e29b-41d4-a716-446655440012', 'lisa@stylesalon.co.za', 'Lisa Davis', 'business', '+27123456802'),
('550e8400-e29b-41d4-a716-446655440013', 'tom@gardencare.co.za', 'Tom Miller', 'business', '+27123456803')
ON CONFLICT (email) DO NOTHING;

-- Insert sample businesses
INSERT INTO businesses (id, user_id, business_name, description, address, city, phone, status) VALUES 
('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440010', 'CleanPro Services', 'Professional home and office cleaning services', '123 Main Street, Sandton', 'Johannesburg', '+27123456800', 'approved'),
('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440011', 'PlumbFix Solutions', 'Expert plumbing repairs and installations', '456 Oak Avenue, Sea Point', 'Cape Town', '+27123456801', 'approved'),
('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440012', 'Style Hair Salon', 'Premium hair styling and beauty treatments', '789 Pine Road, Umhlanga', 'Durban', '+27123456802', 'approved'),
('660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440013', 'GardenCare Pro', 'Professional landscaping and garden maintenance', '321 Elm Street, Centurion', 'Pretoria', '+27123456803', 'pending')
ON CONFLICT (id) DO NOTHING;

-- Insert sample services
INSERT INTO services (id, business_id, title, description, category, price, duration, is_active) VALUES 
('770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440010', 'Deep House Cleaning', 'Complete deep cleaning service for your home', 'Cleaning', 450.00, 180, true),
('770e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440010', 'Office Cleaning', 'Professional office cleaning service', 'Cleaning', 320.00, 120, true),
('770e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440011', 'Emergency Plumbing', 'Quick response plumbing repairs', 'Plumbing', 280.00, 60, true),
('770e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440011', 'Bathroom Installation', 'Complete bathroom renovation and installation', 'Plumbing', 1200.00, 480, true),
('770e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440012', 'Hair Cut & Style', 'Professional haircut and styling', 'Beauty', 180.00, 60, true),
('770e8400-e29b-41d4-a716-446655440015', '660e8400-e29b-41d4-a716-446655440012', 'Hair Color Treatment', 'Professional hair coloring service', 'Beauty', 350.00, 120, true),
('770e8400-e29b-41d4-a716-446655440016', '660e8400-e29b-41d4-a716-446655440013', 'Lawn Maintenance', 'Regular lawn mowing and maintenance', 'Landscaping', 220.00, 90, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (id, customer_id, service_id, business_id, booking_date, booking_time, status, total_amount, commission_amount, customer_notes) VALUES 
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440010', '2024-01-15', '09:00:00', 'confirmed', 450.00, 22.50, 'Please focus on the kitchen and bathrooms'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440012', '2024-01-16', '14:30:00', 'completed', 180.00, 9.00, 'Looking for a modern style'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440011', '2024-01-17', '11:00:00', 'pending', 280.00, 14.00, 'Leaky faucet in main bathroom')
ON CONFLICT (id) DO NOTHING;

-- Insert sample payments
INSERT INTO payments (id, booking_id, amount, commission_amount, status, payment_method, transaction_id) VALUES 
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 450.00, 22.50, 'completed', 'Credit Card', 'TXN_001_2024'),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 180.00, 9.00, 'completed', 'EFT', 'TXN_002_2024'),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 280.00, 14.00, 'pending', 'Credit Card', 'TXN_003_2024')
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES 
('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Booking Confirmed', 'Your deep house cleaning service has been confirmed for January 15th at 9:00 AM', 'booking', false),
('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Service Completed', 'Your hair styling service has been completed. Please rate your experience.', 'booking', true),
('aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440010', 'New Booking Request', 'You have received a new booking request for deep house cleaning', 'booking', false),
('aa0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'New Business Application', 'GardenCare Pro has submitted a business application for review', 'system', false)
ON CONFLICT (id) DO NOTHING;
