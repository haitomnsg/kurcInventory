
import type { Component, Log, User, Category } from './types';

export const mockUsers: { [key: string]: User } = {
  admin: {
    name: 'Admin User',
    email: 'admin@kurc.edu.np',
    role: 'admin',
    avatar: 'https://placehold.co/40x40.png',
  },
};

export const mockCategories: Category[] = [
  { id: '1', name: 'Microcontroller' },
  { id: '2', name: 'SBC' },
  { id: '3', name: 'Motor' },
  { id: '4', name: 'Sensor' },
  { id: '5', name: 'Wiring' },
];

export const mockComponents: Component[] = [
  {
    id: '1',
    name: 'Arduino Uno',
    category: 'Microcontroller',
    quantity: 15,
    status: 'Available',
    condition: 'Good',
    imageUrl: 'https://placehold.co/100x100.png',
    description: 'Standard Arduino board for various robotics projects.',
    aiHint: 'arduino microcontroller',
  },
  {
    id: '2',
    name: 'Raspberry Pi 4',
    category: 'SBC',
    quantity: 8,
    status: 'Available',
    condition: 'New',
    imageUrl: 'https://placehold.co/100x100.png',
    description: 'A tiny, dual-display, desktop computer and robot brain.',
    aiHint: 'raspberry pi',
  },
  {
    id: '3',
    name: 'Servo Motor SG90',
    category: 'Motor',
    quantity: 30,
    status: 'Borrowed',
    borrowedBy: 'Jane Doe',
    expectedReturnDate: '2024-08-15',
    condition: 'Good',
    imageUrl: 'https://placehold.co/100x100.png',
    description: 'Tiny and lightweight with high output power.',
    aiHint: 'servo motor',
  },
  {
    id: '4',
    name: 'Ultrasonic Sensor HC-SR04',
    category: 'Sensor',
    quantity: 25,
    status: 'Available',
    condition: 'Fair',
    imageUrl: 'https://placehold.co/100x100.png',
    description: 'Provides 2cm - 400cm non-contact measurement function.',
    aiHint: 'ultrasonic sensor',
  },
  {
    id: '5',
    name: 'DC Motor',
    category: 'Motor',
    quantity: 20,
    status: 'Borrowed',
    borrowedBy: 'John Smith',
    expectedReturnDate: '2024-08-10',
    condition: 'Good',
    imageUrl: 'https://placehold.co/100x100.png',
    description: 'A standard DC motor for wheels and other moving parts.',
    aiHint: 'dc motor',
  },
  {
    id: '6',
    name: 'Jumper Wires Pack',
    category: 'Wiring',
    quantity: 50,
    status: 'Available',
    condition: 'New',
    imageUrl: 'https://placehold.co/100x100.png',
    description: 'Male-to-male, male-to-female, and female-to-female jumper wires.',
    aiHint: 'jumper wires',
  },
];

export const mockLogs: Log[] = [
  {
    id: '1',
    componentName: 'Servo Motor SG90',
    userName: 'Jane Doe',
    action: 'Borrowed',
    timestamp: '2024-07-28T10:00:00Z',
  },
  {
    id: '2',
    componentName: 'Arduino Uno',
    userName: 'John Smith',
    action: 'Returned',
    timestamp: '2024-07-27T15:30:00Z',
  },
  {
    id: '3',
    componentName: 'DC Motor',
    userName: 'John Smith',
    action: 'Borrowed',
    timestamp: '2024-07-26T11:00:00Z',
  },
  {
    id: '4',
    componentName: 'Raspberry Pi 4',
    userName: 'Alice Johnson',
    action: 'Returned',
    timestamp: '2024-07-25T09:00:00Z',
  },
];
