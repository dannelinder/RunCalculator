import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Accessibility - Race Predictor live region', () => {
  test('Predicted times live region updates and has aria-live="polite"', () => {
    render(<App />);
    // Enter a valid time to trigger predictions
    const timeInput = screen.getAllByLabelText(/Race time \(hh:mm:ss\)/i)[0] as HTMLInputElement;
    fireEvent.change(timeInput, { target: { value: '50:00' } });
    const liveRegion = screen.getByText(/Predicted times:/i).closest('.result');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');

    // Capture Marathon prediction before changing k
    const before = screen.getByText(/^Marathon:/i).textContent;
    const kSlider = screen.getByLabelText(/Effort factor/i) as HTMLInputElement;
    fireEvent.change(kSlider, { target: { value: '1.08' } });
    const after = screen.getByText(/^Marathon:/i).textContent;
    expect(before).not.toEqual(after);
  });
});