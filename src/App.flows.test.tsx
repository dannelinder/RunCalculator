import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App flows', () => {
  test('unit toggle switches placeholders', () => {
    render(<App />);
    expect(screen.getByText('km')).toBeInTheDocument();
    expect(screen.getByText('mile')).toBeInTheDocument();

    // Distance placeholder should show km format initially
    const distInput = screen.getAllByLabelText(/Distance \(km\)/i)[0] as HTMLInputElement;
    expect(distInput.placeholder).toMatch(/e\.g\. 5,0/);

    // Switch to mile
    fireEvent.click(screen.getByRole('button', { name: 'mile' }));
    const distInputMile = screen.getAllByLabelText(/Distance \(mile\)/i)[0] as HTMLInputElement;
    expect(distInputMile.placeholder).toMatch(/e\.g\. 3\.1/);
  });

  test('Calculate Pace: 10 km in 50:00 -> 5:00 min/km', () => {
    render(<App />);
    const dist = screen.getAllByLabelText(/Distance \(km\)/i)[0] as HTMLInputElement;
    fireEvent.change(dist, { target: { value: '10,0' } });
    const time = screen.getAllByLabelText(/^Time$/i)[0] as HTMLInputElement;
    fireEvent.change(time, { target: { value: '50:00' } });
    fireEvent.click(screen.getByRole('button', { name: /Calculate Pace/i }));
    expect(screen.getByText(/Pace: 5:00 min\/km/i)).toBeInTheDocument();
  });

  test('Convert km/h to min/km: 12,0 -> 5:00', () => {
    render(<App />);
    const speed = screen.getByLabelText(/km\/h|mile\/h/i) as HTMLInputElement;
    fireEvent.change(speed, { target: { value: '12,0' } });
    fireEvent.click(screen.getByRole('button', { name: /Convert to min\/km/i }));
    expect(screen.getByText(/5:00 min\/km/i)).toBeInTheDocument();
  });

  test('Race Predictor with k slider updates output', () => {
    render(<App />);
    // Set race-from time
    const timeInput = screen.getAllByLabelText(/Time/i).find(el => (el as HTMLInputElement).id === 'race-from-time') as HTMLInputElement;
    fireEvent.change(timeInput, { target: { value: '50:00' } });
    // Ensure list renders
    expect(screen.getByText(/Predicted times:/i)).toBeInTheDocument();
    const kSlider = screen.getByLabelText(/Effort factor/i) as HTMLInputElement;
    const before = screen.getByText(/^Marathon:/i).textContent;
    fireEvent.change(kSlider, { target: { value: '1.08' } });
    const after = screen.getByText(/^Marathon:/i).textContent;
    expect(before).not.toEqual(after);
  });
});