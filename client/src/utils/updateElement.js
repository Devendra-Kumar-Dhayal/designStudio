import { fixedHeight, fixedWidth } from "./constants";
import createElement from "./createElement";

const updateElement = async (
  elementsToUpdate,
  elements,
  setElements,
  selectedColor,
  overwrite = true
) => {
  if (!elements) return;

  const elementsCopy = [...elements];

  elementsToUpdate.map((element) => {
    const { id, x1, y1, x2, y2, type, options } = element;
    console.log(element, element.roughElement);
    switch (type) {
      case "line":
        const cel = createElement(
          id,
          x1,
          y1,
          x2,
          y2,
          type,
          selectedColor,
          options
        );
        let objectl = {
          ...cel,
          options,
        };
        elementsCopy[id] = objectl;
        break;
      case "rectangle":
        let ce = createElement(
          id,
          x1,
          y1,
          x1 + fixedWidth,
          y1 + fixedHeight,
          type,
          element?.roughElement?.options?.fill ?? selectedColor,
          options
        );
        let object = {
          ...ce,
          options,
        };

        elementsCopy[id] = object;
        break;
      case "circle":
        let cec = createElement(
          id,
          x1,
          y1,
          x1 + fixedWidth,
          y1 + fixedHeight,
          type,
          element?.roughElement?.options?.fill ?? selectedColor,
          options
        );
        let objectc = {
          ...cec,
          options,
        };
        elementsCopy[id] = objectc;
        break;
      case "kafka":
        let cek = createElement(
          id,
          x1,
          y1,
          x1 + fixedWidth,
          y1 + fixedHeight,
          type,
          element?.roughElement?.options?.fill ?? selectedColor,
          options
        );
        let objectk = {
          ...cek,
          options,
        };
        elementsCopy[id] = objectk;
        break;
      case "boomi":
        let ceb = createElement(
          id,
          x1,
          y1,
          x1 + fixedWidth,
          y1 + fixedHeight,
          type,
          element?.roughElement?.options?.fill ?? selectedColor,
          options
        );
        let objectb = {
          ...ceb,
          options,
        };
        elementsCopy[id] = objectb;
        break;
      case "pencil":
        elementsCopy[id].points = [
          ...elementsCopy[id].points,
          { x: x2, y: y2 },
        ];
        break;
      case "text":
        const textWidth = document
          .getElementById("canvas")
          .getContext("2d")
          .measureText(options.text).width;
        const textHeight = 24;
        elementsCopy[id] = {
          ...createElement(
            id,
            x1,
            y1,
            x1 + textWidth,
            y1 + textHeight,
            type,
            selectedColor
          ),
          text: options.text,
        };
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
  });

  setElements(elementsCopy, overwrite);
};

export default updateElement;
