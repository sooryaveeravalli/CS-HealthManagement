import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Logindoctor from '../logindoctor';
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

describe('Doctor Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(
      <BrowserRouter>
        <ContextWrapper>
          <Logindoctor />
        </ContextWrapper>
      </BrowserRouter>
    );

    // Basic check if the component renders
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    const mockResponse = {
      data: {
        message: 'Login successful',
        user: { id: 1, email: 'doctor@example.com' }
      }
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    render(
      <BrowserRouter>
        <ContextWrapper>
          <Logindoctor />
        </ContextWrapper>
      </BrowserRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'doctor@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for the login process to complete
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/users/login',
        {
          email: 'doctor@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          role: 'Doctor'
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      expect(toast.success).toHaveBeenCalledWith('Login successful');
      expect(mockNavigate).toHaveBeenCalledWith('/doctor-home');
    });
  });

  test('handles login error', async () => {
    const errorMessage = 'Invalid credentials';
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
          <Logindoctor />
        </ContextWrapper>
      </BrowserRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'doctor@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpassword' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  test('validates required fields', () => {
    render(
      <BrowserRouter>
        <ContextWrapper>
          <Logindoctor />
        </ContextWrapper>
      </BrowserRouter>
    );

    // Check if required attributes are present
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
}); 