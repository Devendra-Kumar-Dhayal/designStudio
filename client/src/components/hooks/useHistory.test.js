import { renderHook, act } from '@testing-library/react-hooks';
import useHistory from './useHistory'; // adjust the path accordingly

describe('useHistory', () => {
  it('should initialize with the provided initial state', () => {
    const initialState = { value: 0 };
    const { result } = renderHook(() => useHistory(initialState));

    expect(result.current[0]).toEqual(initialState);
  });

  it('should update state using setState function', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useHistory({ value: 0 }));

    act(() => {
      result.current[1]((prev) => ({ value: prev.value + 1 }));
    });

    await waitForNextUpdate();

    expect(result.current[0]).toEqual({ value: 1 });
  });

  it('undo and redo', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useHistory({ value: 0 }));

    act(() => {
      result.current[1]((prev) => ({ value: prev.value + 1 }));
    });

    await waitForNextUpdate();

    act(() => {
        result.current[1]((prev) => ({ value: prev.value + 1 }));
      });
  
    await waitForNextUpdate();

    act(() => {
        result.current[1]((prev) => ({ value: prev.value - 1 }));
      });
  
    await waitForNextUpdate();
    expect(result.current[0]).toEqual({ value: 1 });
  });
  
});
