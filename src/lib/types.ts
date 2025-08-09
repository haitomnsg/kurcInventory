export type Component = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  status: 'Available' | 'Borrowed';
  condition: 'New' | 'Good' | 'Fair' | 'Poor';
  imageUrl: string;
  borrowedBy?: string;
  borrowDate?: string;
  expectedReturnDate?: string;
  description: string;
  aiHint: string;
};

export type Log = {
  id: string;
  componentName: string;
  userName: string;
  action: 'Borrowed' | 'Returned';
  timestamp: string;
};

export type User = {
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar: string;
};
