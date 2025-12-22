-- Create tracked_items table
CREATE TABLE public.tracked_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  item_number TEXT,
  purchase_price DECIMAL(10,2) NOT NULL,
  current_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  purchase_date DATE NOT NULL,
  store_location TEXT,
  receipt_number TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create price_history table
CREATE TABLE public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracked_item_id UUID NOT NULL REFERENCES public.tracked_items(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tracked_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for tracked_items
CREATE POLICY "Users can view their own tracked items" 
ON public.tracked_items FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tracked items" 
ON public.tracked_items FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracked items" 
ON public.tracked_items FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tracked items" 
ON public.tracked_items FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for price_history (through tracked_items ownership)
CREATE POLICY "Users can view price history for their items" 
ON public.price_history FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.tracked_items 
  WHERE tracked_items.id = price_history.tracked_item_id 
  AND tracked_items.user_id = auth.uid()
));

CREATE POLICY "Users can create price history for their items" 
ON public.price_history FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.tracked_items 
  WHERE tracked_items.id = price_history.tracked_item_id 
  AND tracked_items.user_id = auth.uid()
));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for tracked_items
CREATE TRIGGER update_tracked_items_updated_at
BEFORE UPDATE ON public.tracked_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_tracked_items_user_id ON public.tracked_items(user_id);
CREATE INDEX idx_price_history_tracked_item_id ON public.price_history(tracked_item_id);
CREATE INDEX idx_price_history_recorded_at ON public.price_history(recorded_at);