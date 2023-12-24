import rough from "roughjs/bundled/rough.esm";
import { fixedWidth, threshold } from "./constants";

const generator = rough.generator();

export const highlightNearbyElements = (element) => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const roughCanvas = rough.canvas(canvas);
  if (element.type === "rectangle") {
    const h = Math.abs(element.y1 - element.y2);
    const w = Math.abs(element.x1 - element.x2);

    const g = generator.rectangle(
      element.x1 - 4,
      element.y1 - 4,
      w + 8,
      h + 8,
      {
        stroke: "rgba(37, 37, 37, 0.5)",
        roughness: 0,
        strokeWidth: 5,
      }
    );
    roughCanvas.draw(g);
  }
  if (element.type === "circle") {
    try {
      const g = roughCanvas.circle(
        element.x1,
        element.y1,
        fixedWidth + (threshold - 2),
        {
          stroke: "rgba(37, 37, 37, 0.5)",
          roughness: 0,
          strokeWidth: 5,
        }
      );
      roughCanvas.draw(g);
    } catch (error) {
    }
  }
};


export const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

export const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? "inside" : null;
};

export const positionWithinElement = (x, y, element) => {
  if (!element && !element.type) return;
  const { type, x1, x2, y1, y2 } = element;
  switch (type) {
    case "line":
      const on = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, "start");
      const end = nearPoint(x, y, x2, y2, "end");
      return start || end || on;
    case "rectangle":
      const topLeft = nearPoint(x, y, x1, y1, "tl");
      const topRight = nearPoint(x, y, x2, y1, "tr");
      const bottomLeft = nearPoint(x, y, x1, y2, "bl");
      const bottomRight = nearPoint(x, y, x2, y2, "br");
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    case "circle":
      return Math.pow(x - x1, 2) +
        Math.pow(y - y1, 2) -
        Math.pow(fixedWidth / 2 + threshold, 2) <=
        0
        ? "inside"
        : null;
    case "pencil":
      const betweenAnyPoint = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1];
        if (!nextPoint) return false;
        return (
          onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null
        );
      });
      return betweenAnyPoint ? "inside" : null;
    case "text":
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
    default:
      console.log(`Type not recognised: ${type}`);
  }
};

export const nearEuclidean = (x, y, x1, y1, x2, y2) => {
  return (
    x >= x1 - threshold &&
    x <= x2 + threshold &&
    y >= y1 - threshold &&
    y <= y2 + threshold
  );
};


export const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const getElementAtPosition = (x, y, elements) => {
  return elements
    ?.map((element) => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find((element) => element.position !== null);
};



export  function detectShapesNearLineEndpoint(x, y, elements,setSelectedIndex) {
   const shapesNearEndpoint = [];
   const elementsType = new Set();
   //TODO: this set ain't working
   elementsType.add("rectangle");
   elementsType.add("circle");

   elements?.map((element) => {
     if (!element && !element.type) return false;

     if (element.type === "rectangle") {
       const { type, x1, x2, y1, y2 } = element;

       if (nearEuclidean(x, y, x1, y1, x2, y2, threshold)) {
         shapesNearEndpoint.push(element.id);
       }
       return true;
     } else if (element.type === "circle") {
       const { type, x1, x2, y1, y2 } = element;
       if (
         Math.pow(x - x1, 2) +
           Math.pow(y - y1, 2) -
           Math.pow(fixedWidth / 2 + threshold, 2) <=
         0
       ) {
         shapesNearEndpoint.push(element.id);
       }
       return true;
     } else return false;
   });

   let minDistance = Number.MAX_VALUE;
   let index = -1;
   if (shapesNearEndpoint.length === 0) {
     setSelectedIndex(null);
     return;
   }

   shapesNearEndpoint.map((id) => {
     const { x1, x2, y1, y2 } = elements[id];
     const xc = (x1 + x2) / 2;
     const yc = (y1 + y2) / 2;

     const distance = Math.sqrt(Math.pow(x - xc, 2) + Math.pow(y - yc, 2));
     if (distance < minDistance) {
       minDistance = distance;
       index = id;
     }
   });

   if (index === -1) {
     setSelectedIndex(null);
     return;
   }
   setSelectedIndex(index);

   return shapesNearEndpoint;
 }