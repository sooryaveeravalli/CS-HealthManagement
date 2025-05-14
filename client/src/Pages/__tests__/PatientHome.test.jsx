import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PatientHome from '../PatientHome';
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

// Mock localStorage
const mockPatient = {
  firstName: 'John',
  lastName: 'Doe',
  _id: '123'
};

describe('PatientHome Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'patient') {
        return JSON.stringify(mockPatient);
      }
      return null;
    });
  });

  test('renders patient home page with user name', async () => {
    axios.get.mockResolvedValue({ data: { appointments: [] } });
    render(<PatientHome />);
    
    await waitFor(() => {
      expect(screen.getByText(/Hi, John Doe/i)).toBeInTheDocument();
    });
  });

  test('renders appointments count', async () => {
    axios.get.mockResolvedValue({ data: { appointments: [] } });
    render(<PatientHome />);
    
    await waitFor(() => {
      const appointmentsText = screen.getByText(/Appointments Scheduled : 0/i);
      expect(appointmentsText).toBeInTheDocument();
    });
  });

  test('renders quick actions section', async () => {
    axios.get.mockResolvedValue({ data: { appointments: [] } });
    render(<PatientHome />);
    
    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Book Appointment')).toBeInTheDocument();
      expect(screen.getByText('My Appointments')).toBeInTheDocument();
    });
  });

  test('handles API error and sets empty appointments', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));
    render(<PatientHome />);
    
    await waitFor(() => {
      expect(screen.getByText('No appointments found')).toBeInTheDocument();
    });
  });

  test('displays upcoming appointments count correctly', async () => {
    const mockAppointments = [
      {
        _id: '1',
        patientId: '123',
        appointment_date: new Date().toISOString(),
        status: 'Booked',
        doctor: {
          firstName: 'Jane',
          lastName: 'Smith',
          gender: 'Female'
        },
        department: 'Cardiology',
        appointment_time: '10:00 AM'
      }
    ];
    
    axios.get.mockResolvedValue({ data: { appointments: mockAppointments } });
    render(<PatientHome />);
    
    await waitFor(() => {
      expect(screen.getByText(/Appointments Scheduled : 1/i)).toBeInTheDocument();
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
    });
  });

  test('filters out cancelled appointments from count', async () => {
    const mockAppointments = [
      {
        _id: '1',
        patientId: '123',
        appointment_date: new Date().toISOString(),
        status: 'Cancelled',
        doctor: {
          firstName: 'Jane',
          lastName: 'Smith',
          gender: 'Female'
        },
        department: 'Cardiology',
        appointment_time: '10:00 AM'
      }
    ];
    
    axios.get.mockResolvedValue({ data: { appointments: mockAppointments } });
    render(<PatientHome />);
    
    await waitFor(() => {
      expect(screen.getByText(/Appointments Scheduled : 0/i)).toBeInTheDocument();
    });
  });
}); 