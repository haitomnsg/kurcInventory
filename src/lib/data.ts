
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
    totalQuantity: 15,
    availableQuantity: 15,
    condition: 'Good',
    description: 'Standard Arduino board for various robotics projects.',
    aiHint: 'arduino microcontroller',
  },
  {
    id: '2',
    name: 'Raspberry Pi 4',
    category: 'SBC',
    totalQuantity: 8,
    availableQuantity: 8,
    condition: 'New',
    description: 'A tiny, dual-display, desktop computer and robot brain.',
    aiHint: 'raspberry pi',
  },
  {
    id: '3',
    name: 'Servo Motor SG90',
    category: 'Motor',
    totalQuantity: 30,
    availableQuantity: 20,
    condition: 'Good',
    description: 'Tiny and lightweight with high output power.',
    aiHint: 'servo motor',
  },
  {
    id: '4',
    name: 'Ultrasonic Sensor HC-SR04',
    category: 'Sensor',
    totalQuantity: 25,
    availableQuantity: 25,
    condition: 'Fair',
    description: 'Provides 2cm - 400cm non-contact measurement function.',
    aiHint: 'ultrasonic sensor',
  },
  {
    id: '5',
    name: 'DC Motor',
    category: 'Motor',
    totalQuantity: 20,
    availableQuantity: 15,
    condition: 'Good',
    description: 'A standard DC motor for wheels and other moving parts.',
    aiHint: 'dc motor',
  },
  {
    id: '6',
    name: 'Jumper Wires Pack',
    category: 'Wiring',
    totalQuantity: 50,
    availableQuantity: 50,
    condition: 'New',
    description: 'Male-to-male, male-to-female, and female-to-female jumper wires.',
    aiHint: 'jumper wires',
  },
];

export const mockLogs: Log[] = [
    // This data is now illustrative as real data comes from Firestore.
    // The structure reflects the updated `Log` type.
];
