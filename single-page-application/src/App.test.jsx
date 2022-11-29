import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/What needs to be done?/i);
  expect(input).toBeInTheDocument();
});
