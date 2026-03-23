import { render, screen } from '@testing-library/react';
import App from './App';

test('renders landing page', () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /Turn Waste into Value/i })
  ).toBeInTheDocument();
});
