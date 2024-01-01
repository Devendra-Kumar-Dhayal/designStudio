import { useState } from "react";
import debounce from "lodash/debounce";

const useHistory = (initialState) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  // Debounce the setState function
  const debouncedSetState = debounce((action, overwrite = false) => {
    console.log("debounce", action, overwrite);
    const newState =
      typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  }, 5); // Adjust debounce delay as needed (e.g., 300ms)

  const setState = (action, overwrite = false) => {
    debouncedSetState(action, overwrite);
  };

  const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
  const redo = () =>
    index < history.length - 1 && setIndex((prevState) => prevState + 1);

  return [history[index], setState, undo, redo];
};

export default useHistory;
