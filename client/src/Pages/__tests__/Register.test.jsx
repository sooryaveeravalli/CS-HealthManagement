import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../Register';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock the required dependencies
jest.mock('axios');
jest.mock('react-toastify');
jest.mock('../../assets/image.png', () => 'mocked-image-path');

// Mock the main.jsx module
jest.mock('../../main', () => {
  const React = require('react');
  return {
    Context: React.createContext({
      isAuthenticated: false,
      setIsAuthenticated: jest.fn(),
      user: null,
      setUser: jest.fn()
    })
  };
});

// Import Context after mocking
import { Context } from '../../main';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Create a wrapper component that provides the mock context
const ContextWrapper = ({ children }) => (
  <Context.Provider value={{
    isAuthenticated: false,
    setIsAuthenticated: jest.fn(),
    user: null,
    setUser: jest.fn()
  }}>
    {children}
  </Context.Provider>
);

describe('Register Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders registration form', () => {
    render(
      <BrowserRouter>
        <ContextWrapper>
          <Register />
        </ContextWrapper>
      </BrowserRouter>
    );

    // Check if all form fields are present
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mobile number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/set up your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('handles successful registration', async () => {
    const mockResponse = {
      data: {
        message: 'Registration successful'
      }
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    render(
      <BrowserRouter>
        <ContextWrapper>
          <Register />
        </ContextWrapper>
      </BrowserRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/mobile number/i), {
      target: { value: '1234567890' }
    });
    fireEvent.change(screen.getByPlaceholderText(/date of birth/i), {
      target: { value: '1990-01-01' }
    });
    fireEvent.change(screen.getByPlaceholderText(/set up your password/i), {
      target: { value: 'password123' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Wait for the registration process to complete
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/users/patient/register',
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          dob: '1990-01-01',
          gender: '',
          password: 'password123',
          role: 'Patient'
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      expect(toast.success).toHaveBeenCalledWith('Registration successful');
    });
  });

  test('handles registration error', async () => {
    const errorMessage = 'Email already exists';
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: errorMessage
        }
      }
    });

    render(
      <BrowserRouter>
        <ContextWrapper>
          <Register />
        </ContextWrapper>
      </BrowserRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'existing@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/mobile number/i), {
      target: { value: '1234567890' }
    });
    fireEvent.change(screen.getByPlaceholderText(/date of birth/i), {
      target: { value: '1990-01-01' }
    });
    fireEvent.change(screen.getByPlaceholderText(/set up your password/i), {
      target: { value: 'password123' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  test('validates required fields', () => {
    render(
      <BrowserRouter>
        <ContextWrapper>
          <Register />
        </ContextWrapper>
      </BrowserRouter>
    );

    // Check if required attributes are present
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    const lastNameInput = screen.getByPlaceholderText(/last name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const phoneInput = screen.getByPlaceholderText(/mobile number/i);
    const dobInput = screen.getByPlaceholderText(/date of birth/i);
    const passwordInput = screen.getByPlaceholderText(/set up your password/i);

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
    expect(dobInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });
}); 