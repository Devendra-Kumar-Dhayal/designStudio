export const validateElements = (elements) => {
  console.log(elements);
  // const notValidated = []

  const isValid = elements.every((element) => {
    return !!(element?.options?.meta?.common?.label ?? "");
  });

  return isValid;
};
