import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders get button', () => {
  const { getByText } = render(<App />);
  const titleElement = getByText(/Yorkie CodePair/i);
  expect(titleElement).toBeInTheDocument();
});
