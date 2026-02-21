-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    rating NUMERIC DEFAULT 5,
    stock INTEGER DEFAULT 0,
    has_discount BOOLEAN DEFAULT FALSE,
    discount_percent NUMERIC DEFAULT 0,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT, -- Redundant for ease of use
    image TEXT, -- Main image URL
    images TEXT[] DEFAULT '{}', -- Gallery image URLs
    payment_settings JSONB DEFAULT '{"visa": true, "wallet": true, "cash": true, "fawry": true}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_address TEXT,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'قيد التنفيذ', -- New, Shipped, Delivered, etc.
    items JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies for Categories
CREATE POLICY "Allow public read access for categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Allow admin full access for categories" ON public.categories
    ALL USING (auth.jwt() ->> 'email' = 'admin@shababy.com'); -- Update email as needed

-- Policies for Products
CREATE POLICY "Allow public read access for products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Allow admin full access for products" ON public.products
    ALL USING (auth.jwt() ->> 'email' = 'admin@shababy.com'); -- Update email as needed

-- Policies for Orders
CREATE POLICY "Allow public to create orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin full access for orders" ON public.orders
    ALL USING (auth.jwt() ->> 'email' = 'admin@shababy.com');

-- Policies for Messages
CREATE POLICY "Allow public to send messages" ON public.messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin full access for messages" ON public.messages
    ALL USING (auth.jwt() ->> 'email' = 'admin@shababy.com');
