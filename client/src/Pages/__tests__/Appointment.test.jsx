import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import Appointment from '../Appointment';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock Navbar component
jest.mock('../../Components/Navbar', () => ({
  Navbar: () => <div>Mock Navbar</div>
}));

// Mock context
const mockContext = {
  isAuthenticated: true,
  setIsAuthenticated: jest.fn(),
  user: { role: 'patient' },
  setUser: jest.fn()
};

// Mock the main module
jest.mock('../../main', () => ({
  Context: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children(mockContext)
  }
}));

// Mock useContext
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => mockContext
}));

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  Link: ({ children }) => <div>{children}</div>
}));

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('Appointment Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock patient in localStorage by default
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'patient') {
        return JSON.stringify({ _id: '123', firstName: 'John', lastName: 'Doe' });
      }
      return null;
    });
  });

  test('renders patient appointments view', async () => {
    const mockAppointments = [
      {
        _id: '1',
        appointment_date: new Date().toISOString(),
        status: 'Booked',
        reason: 'Checkup',
        appointment_time: '10:00 AM',
        doctor: {
          firstName: 'Dr',
          lastName: 'Smith',
          gender: 'Male',
          avatar: { url: null }
        },
        department: 'General'
      }
    ];

    axios.get.mockResolvedValueOnce({ data: { appointments: mockAppointments } });
    
    render(<Appointment />);
    
    await waitFor(() => {
      expect(screen.getByText('My Appointments')).toBeInTheDocument();
      expect(screen.getByText(/Doctor:.*Dr.*Smith/)).toBeInTheDocument();
      expect(screen.getByText(/Reason:.*Checkup/)).toBeInTheDocument();
    });
  });

  test('renders doctor appointments view', async () => {
    // Mock doctor in localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'doctor') {
        return JSON.stringify({ _id: '123', firstName: 'Dr', lastName: 'Smith' });
      }
      return null;
    });

    const mockAppointments = [
      {
        _id: '1',
        appointment_date: new Date().toISOString(),
        status: 'Booked',
        firstName: 'John',
        lastName: 'Doe',
        reason: 'Checkup',
        appointment_time: '10:00 AM',
        patientGender: 'Male',
        doctor: {
          firstName: 'Dr',
          lastName: 'Smith',
          gender: 'Male',
          avatar: { url: null }
        },
        department: 'General'
      }
    ];

    axios.get.mockResolvedValueOnce({ data: { appointments: mockAppointments } });
    
    render(<Appointment />);
    
    await waitFor(() => {
      expect(screen.getByText('My Appointments')).toBeInTheDocument();
      expect(screen.getByText('Patient: John Doe')).toBeInTheDocument();
      expect(screen.getByText('Reason: Checkup')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    axios.get.mockRejectedValueOnce({ 
      response: { 
        data: { 
          message: 'Failed to fetch appointments' 
        } 
      } 
    });
    
    render(<Appointment />);
    
    await waitFor(() => {
      expect(screen.getByText('My Appointments')).toBeInTheDocument();
    });
  });

  test('displays no appointments message when empty', async () => {
    axios.get.mockResolvedValueOnce({ data: { appointments: [] } });
    
    render(<Appointment />);
    
    await waitFor(() => {
      expect(screen.getByText('No upcoming appointments')).toBeInTheDocument();
      expect(screen.getByText('No recent appointments')).toBeInTheDocument();
    });
  });
}); 