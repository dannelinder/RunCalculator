import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Accessibility - aria-live regions', () => {
  test('Pace result live region updates and has aria-live="polite"', () => {
    render(<App />);
    const dist = screen.getAllByLabelText(/Distance \(km\)/i)[0] as HTMLInputElement;
    fireEvent.change(dist, { target: { value: '10,0' } });
    const time = screen.getAllByLabelText(/Time for pace/i)[0] as HTMLInputElement;
    fireEvent.change(time, { target: { value: '50:00' } });
    fireEvent.click(screen.getByRole('button', { name: /Calculate Pace/i }));
    const liveRegion = screen.getByText(/Pace:/i).closest('.result');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveTextContent('Pace: 5:00 min/km');
  });

  test('Error message uses role="alert" and aria-live="polite"', () => {
    render(<App />);
    // Switch to km to enforce comma rule; enter period to trigger message
    fireEvent.click(screen.getByRole('button', { name: 'km' }));
    const dist = screen.getAllByLabelText(/Distance \(km\)/i)[0] as HTMLInputElement;
    fireEvent.change(dist, { target: { value: '10.0' } });
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
    expect(alert).toHaveTextContent(/use ',' as the decimal separator/i);
  });
});