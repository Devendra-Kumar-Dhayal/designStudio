// usePressedKeys.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import usePressedKeys from './usePressedKeys';

describe('usePressedKeys', () => {
  it('should handle key events correctly', () => {
    const { result } = renderHook(() => usePressedKeys());

    act(() => {
      const keyDownEvent = new KeyboardEvent('keydown', { key: 'A' });
      window.dispatchEvent(keyDownEvent);
    });

    expect(result.current.has('A')).toBeTruthy();

    act(() => {
      const keyUpEvent = new KeyboardEvent('keyup', { key: 'A' });
      window.dispatchEvent(keyUpEvent);
    });

    expect(result.current.has('A')).toBeFalsy();
  });
});
