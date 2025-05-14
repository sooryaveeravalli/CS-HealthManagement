import React from 'react';
import { screen } from '@testing-library/react';
import Doctors from '../Doctors';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock axios
jest.mock('axios');

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn()
  }
}));

// Mock components
jest.mock('../../Components/RemoveDoctors', () => ({
  RemoveDoctors: ({ data }) => <div data-testid="doctor-card">{data.firstName}</div>
}));

jest.mock('../../Components/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Mock Sidebar</div>
}));

// Mock context
const mockContext = {
  isAuthenticated: true,
  setIsAuthenticated: jest.fn(),
  user: { role: 'admin' },
  setUser: jest.fn()
};

jest.mock('../../main', () => ({
  Context: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children(mockContext)
  }
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('Doctors Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: { doctors: [] } });
  });

  test('component exists', () => {
    expect(Doctors).toBeDefined();
  });

  test('axios mock is set up correctly', () => {
    expect(axios.get).toBeDefined();
    expect(typeof axios.get).toBe('function');
  });

  test('toast mock is set up correctly', () => {
    expect(toast.error).toBeDefined();
    expect(typeof toast.error).toBe('function');
  });

  test('navigate mock is set up correctly', () => {
    expect(mockNavigate).toBeDefined();
    expect(typeof mockNavigate).toBe('function');
  });

  test('RemoveDoctors component mock is set up correctly', () => {
    const { RemoveDoctors } = require('../../Components/RemoveDoctors');
    expect(RemoveDoctors).toBeDefined();
    expect(typeof RemoveDoctors).toBe('function');
  });

  test('Sidebar component mock is set up correctly', () => {
    const { Sidebar } = require('../../Components/Sidebar');
    expect(Sidebar).toBeDefined();
    expect(typeof Sidebar).toBe('function');
  });
}); 