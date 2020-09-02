import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders get button', () => {
  const { getByText } = render(<App />);
  const buttonElement = getByText(/get/i);
  expect(buttonElement).toBeInTheDocument();
});
