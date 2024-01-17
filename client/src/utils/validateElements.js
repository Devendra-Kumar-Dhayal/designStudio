export const validateElements = (elements) => {
  console.log(elements);
  // const notValidated = []

  const isValid = elements.every((element) => {
    return !!(element?.options?.meta?.common?.label ?? "");
  });

  return isValid;
};


export const connectLinesProperly =(elements)=>{
  const lines = elements.filter((element) => element.type === "line");
  const notValidated = []

  lines.forEach((line) => {
    const { x1, y1, x2, y2 } = line;
    const found = lines.find((l) => {
      const { x1: x1_, y1: y1_, x2: x2_, y2: y2_ } = l;
      return (
        (x1 === x1_ && y1 === y1_ && x2 === x2_ && y2 === y2_) ||
        (x1 === x2_ && y1 === y2_ && x2 === x1_ && y2 === y1_)
      );
    });
    if (!found) {
      notValidated.push(line);
    }
  });

  return notValidated;
}
