import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppointDoctors from '../AppointDoctors';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AppointDoctors Component', () => {
  const mockData = {
    firstName: 'John',
    lastName: 'Doe',
    doctorDepartment: 'Cardiology',
    startTime: '10:00 AM'
  };

  const mockOnClick = jest.fn();

  test('renders doctor information correctly', () => {
    renderWithRouter(<AppointDoctors data={mockData} onClick={mockOnClick} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
  });
}); 