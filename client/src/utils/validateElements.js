export const validateElements = (elements) => {
  console.log(elements);
  // const notValidated = []

  const isValid = elements.every((element) => {
    return !!(element?.options?.meta?.common?.label ?? "");
  });

  return isValid;
};

export const connectLinesProperly = (elements) => {
  const lines = elements.filter((element) => element.type === "line");
  let elementsCopy = [...elements];

  lines.forEach((line) => {
    if (line?.options?.depending && line.options.depending.length === 2) {
      const depending = line.options.depending;

      // Add a check for the existence of depending array
      if (depending && depending.length === 2) {
        const [{ element: firstId }, { element: secondId }] = depending;

        const firstElement = elementsCopy[firstId];
        const secondElement = elementsCopy[secondId];

        try {
          elementsCopy[firstId] = {
            ...firstElement,
            options: {
              ...firstElement.options,
              connected: [
                ...(firstElement?.options?.connected ?? []),
                {
                  element: secondElement?.options?.meta?.common?.label,
                  type: secondElement.type,
                  id: secondElement.id,

                },
              ],
            },
          };

          elementsCopy[secondId] = {
            ...secondElement,
            options: {
              ...secondElement.options,
              connected: [
                ...(secondElement.options?.connected ?? []),
                {
                  element: firstElement?.options?.meta?.common?.label,
                  type: firstElement.type,
                  id: firstElement.id,
                },
              ],
            },
          };

        } catch (error) {
          console.log(error);
        }
      }
    }
  });


  return elementsCopy;
};
