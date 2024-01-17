import { renderHook, act } from '@testing-library/react-hooks';
import useDebounce from './useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  it('should debounce the value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 1000 },
      }
    );

    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated', delay: 1000 });

    // Advance time by 500ms (less than delay)
    act(() => jest.advanceTimersByTime(500));
    expect(result.current).toBe('initial');

    // Advance time by another 600ms (total 1100ms, more than delay)
    act(() => jest.advanceTimersByTime(600));
    expect(result.current).toBe('updated');
  });

  it('should clear the timeout on unmount', () => {
    const { result, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 1000 },
      }
    );

    expect(result.current).toBe('initial');

    // Unmount the component
    unmount();

    // Advance time by 1100ms (more than delay)
    act(() => jest.advanceTimersByTime(1100));

    // The value should still be 'initial' as the timeout is cleared on unmount
    expect(result.current).toBe('initial');
  });
});
