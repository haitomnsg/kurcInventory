
export type Component = {
  id?: string;
  name: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  condition: 'New' | 'Good' | 'Fair' | 'Poor';
  description: string;
  aiHint: string;
};

export type Log = {
  id?: string;
  componentId: string;
  componentName: string;
  userName: string;
  contactNumber?: string;
  quantity: number;
  status: 'Borrowed' | 'Returned';
  timestamp: string;
  purpose?: string;
  expectedReturnDate?: string;
  remarks?: string;
};

export type User = {
  id?: string;
  name: string;
  email: string;
  role: 'admin';
  avatar: string;
};

export type Category = {
    id?: string;
    name: string;
}
