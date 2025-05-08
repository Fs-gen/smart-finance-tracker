import { Home, Car, ShoppingCart, Lightbulb, Shield, HeartPulse, PiggyBank, Smile, Film, HelpCircle, Briefcase as BriefcaseBusiness, DollarSign, TrendingUp, Gift, Landmark, DivideIcon as LucideIcon } from 'lucide-react';

export const categoryIcons: Record<string, LucideIcon> = {
  housing: Home,
  transportation: Car,
  food: ShoppingCart,
  utilities: Lightbulb,
  insurance: Shield,
  healthcare: HeartPulse,
  savings: PiggyBank,
  personal: Smile,
  entertainment: Film,
  salary: DollarSign,
  business: BriefcaseBusiness,
  investment: TrendingUp,
  gift: Gift,
  other: HelpCircle,
};

export const categoryList = [
  'housing',
  'transportation',
  'food',
  'utilities',
  'insurance',
  'healthcare',
  'savings',
  'personal',
  'entertainment',
  'salary',
  'business',
  'investment',
  'gift',
  'other',
];