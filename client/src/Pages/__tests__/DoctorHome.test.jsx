import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import DoctorHome from '../DoctorHome';
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
  user: { role: 'doctor' },
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
const mockDoctor = {
  firstName: 'John',
  lastName: 'Smith',
  _id: '123',
  doctorDepartment: 'Cardiology',
  gender: 'Male'
};

describe('DoctorHome Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'doctor') {
        return JSON.stringify(mockDoctor);
      }
      return null;
    });
    // Mock successful API response by default
    axios.get.mockResolvedValue({ data: { appointments: [] } });
  });

  test('renders doctor home page with user name', async () => {
    let component;
    await act(async () => {
      component = render(<DoctorHome />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Hi, Dr. John Smith/i)).toBeInTheDocument();
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
    });
  });

  test('renders appointments count', async () => {
    let component;
    await act(async () => {
      component = render(<DoctorHome />);
    });
    
    await waitFor(() => {
      const appointmentsText = screen.getByText(/Appointments Scheduled : 0/i);
      expect(appointmentsText).toBeInTheDocument();
    });
  });

  test('renders quick actions section', async () => {
    let component;
    await act(async () => {
      component = render(<DoctorHome />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Manage Shifts')).toBeInTheDocument();
      expect(screen.getByText('View Appointments')).toBeInTheDocument();
    });
  });

  test('handles API error and sets empty appointments', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));
    let component;
    await act(async () => {
      component = render(<DoctorHome />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('No appointments found')).toBeInTheDocument();
    });
  });

  test('counts appointments correctly for different dates', async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const mockAppointments = [
      {
        _id: '1',
        doctorId: '123',
        appointment_date: today.toISOString(),
        status: 'Booked',
        firstName: 'Jane',
        lastName: 'Doe',
        patientGender: 'Female',
        appointment_time: '10:00 AM',
        doctor: {
          firstName: 'John',
          lastName: 'Smith'
        }
      },
      {
        _id: '2',
        doctorId: '123',
        appointment_date: tomorrow.toISOString(),
        status: 'Booked',
        firstName: 'John',
        lastName: 'Smith',
        patientGender: 'Male',
        appointment_time: '11:00 AM',
        doctor: {
          firstName: 'John',
          lastName: 'Smith'
        }
      },
      {
        _id: '3',
        doctorId: '123',
        appointment_date: today.toISOString(),
        status: 'Cancelled',
        firstName: 'Alice',
        lastName: 'Johnson',
        patientGender: 'Female',
        appointment_time: '2:00 PM',
        doctor: {
          firstName: 'John',
          lastName: 'Smith'
        }
      }
    ];
    
    axios.get.mockResolvedValueOnce({ data: { appointments: mockAppointments } });
    
    let component;
    await act(async () => {
      component = render(<DoctorHome />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Appointments Scheduled : 2/i)).toBeInTheDocument();
    });
  });
}); 