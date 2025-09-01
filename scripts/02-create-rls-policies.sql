-- Row Level Security Policies for PointMe Platform

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view basic user info" ON public.users
  FOR SELECT USING (true);

-- Businesses policies
CREATE POLICY "Anyone can view approved businesses" ON public.businesses
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Business owners can view their own business" ON public.businesses
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Business owners can update their own business" ON public.businesses
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can create businesses" ON public.businesses
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Service categories policies (public read)
CREATE POLICY "Anyone can view service categories" ON public.service_categories
  FOR SELECT USING (true);

-- Services policies
CREATE POLICY "Anyone can view active services from approved businesses" ON public.services
  FOR SELECT USING (
    status = 'active' AND 
    business_id IN (SELECT id FROM public.businesses WHERE status = 'approved')
  );

CREATE POLICY "Business owners can manage their services" ON public.services
  FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );

-- Bookings policies
CREATE POLICY "Customers can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Business owners can view bookings for their services" ON public.bookings
  FOR SELECT USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );

CREATE POLICY "Customers can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Business owners can update bookings for their services" ON public.bookings
  FOR UPDATE USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Customers can create reviews for their completed bookings" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id AND
    booking_id IN (
      SELECT id FROM public.bookings 
      WHERE customer_id = auth.uid() AND status = 'completed'
    )
  );

-- Payments policies
CREATE POLICY "Customers can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Business owners can view payments for their services" ON public.payments
  FOR SELECT USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Support tickets policies
CREATE POLICY "Users can view their own support tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create support tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Business hours policies
CREATE POLICY "Anyone can view business hours" ON public.business_hours
  FOR SELECT USING (true);

CREATE POLICY "Business owners can manage their business hours" ON public.business_hours
  FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );
