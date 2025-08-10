
export type Component = {
  id?: string;
  name: string;
  category: string;
  quantity: number;
  status: 'Available' | 'Borrowed';
  condition: 'New' | 'Good' | 'Fair' | 'Poor';
  imageUrl?: string;
  borrowedBy?: string;
  borrowDate?: string;
  expectedReturnDate?: string;
  description: string;
  aiHint: string;
};

export type Log = {
  id?: string;
  componentName: string;
  userName: string;
  contactNumber?: string;
  status: 'Borrowed' | 'Returned';
  timestamp: string;
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
