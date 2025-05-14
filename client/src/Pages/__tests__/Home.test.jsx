import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

// Mock the required dependencies
jest.mock('../../assets/image.png', () => 'mocked-image-path');

// Mock components with named exports
jest.mock('../../Components/Navbar', () => ({
  Navbar: () => (
    <nav>
      <a href="/login">login</a>
      <a href="/register">register</a>
    </nav>
  )
}));

jest.mock('../../Components/Department', () => ({
  Department: () => <div>Mock Department</div>
}));

jest.mock('../../Components/Message', () => ({
  __esModule: true,
  default: () => <div>Mock Message</div>
}));

jest.mock('../../Components/Footer', () => ({
  Footer: () => <div>Mock Footer</div>
}));

jest.mock('../../Components/ChatBubble', () => ({
  __esModule: true,
  default: () => <div>Mock ChatBubble</div>
}));

jest.mock('react-toastify', () => ({
  ToastContainer: () => <div>Mock ToastContainer</div>
}));

jest.mock('../../main', () => ({
  Context: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children({
      isAuthenticated: false,
      setIsAuthenticated: jest.fn(),
      user: null,
      setUser: jest.fn()
    })
  }
}));

describe('Home Component', () => {
  test('renders home page content', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/caresync/i)).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });
}); 