import rough from "roughjs/bundled/rough.esm";
import { highlightNearbyElements } from "./positionFunctions";
import { fixedWidth } from "./constants";

const generator = rough.generator();

const drawArrow = (roughCanvas, fromX, fromY, toX, toY, color, element) => {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);

  // Arrowhead length
  let arrowLength = (Math.abs(dx) + Math.abs(dy)) / 30;
  if (arrowLength < 5) arrowLength = 5;

  let x1, y1, x2, y2;
  //TODO: only for one arrow at the moment
  if (element.arrow[0] === toX) {
    x1 = toX - arrowLength * Math.cos(angle - Math.PI / 6);
    y1 = toY - arrowLength * Math.sin(angle - Math.PI / 6);
    x2 = toX - arrowLength * Math.cos(angle + Math.PI / 6);
    y2 = toY - arrowLength * Math.sin(angle + Math.PI / 6);
  } else {
  }

  // Arrowhead points

  // Draw line
  roughCanvas.draw(element.roughElement);
  const l1 = generator.line(x1, y1, toX, toY, {
    roughness: 0,
    stroke: element.roughElement.stroke,
    fill: element.roughElement.fill,
  });
  const l2 = generator.line(x2, y2, toX, toY, {
    roughness: 0,
    stroke: element.roughElement.stroke,
    fill: element.roughElement.fill,
  });
  // context.strokeStyle = color;

  // Draw arrowhead
  roughCanvas.draw(l1);
  roughCanvas.draw(l2);
};

export const drawElement = (context, roughCanvas, element, selectedIndex) => {
  const text = element?.options?.meta?.common?.label ?? "";

  switch (element?.type) {
    case "line":
      drawArrow(
        roughCanvas,
        element.x1,
        element.y1,
        element.x2,
        element.y2,
        element.roughElement.options.stroke,
        element
      );
      break;
    case "rectangle":
      roughCanvas.draw(element.roughElement);
      if (element.id === selectedIndex) {
        highlightNearbyElements(element);
      }

      

      if(!!text){
        const textWidth = context.measureText(text).width;
        const x = element.x1 + (element.width - textWidth) / 2 - 30;
        const y = element.y1 + element.height / 2;
        const elementWidth = Math.abs(element.y1 - element.y2);
        
        context.font = "24px sans-serif";
        context.textAlign="center"
        context.fillText(
          text,
          element.x1 +(elementWidth/2)  ,
          element.y1 + elementWidth / 2+5,
          fixedWidth-20
        );
      }
      break;

    case "circle":
      roughCanvas.draw(element.roughElement);
      if (element.id === selectedIndex) {
        highlightNearbyElements(element);
      }
      if (!!text) {
        const textWidth = context.measureText(text).width;
        const x = element.x1 + (element.width - textWidth) / 2 - 30;
        const y = element.y1 + element.height / 2;
        const elementWidth = Math.abs(element.y1 - element.y2);

        context.font = "24px sans-serif";
        context.textAlign = "center";
        context.fillText(
          text,
          element.x1 +5,
          element.y1 +10,
          fixedWidth - 20
        );
      }

      break;
    case "kafka":
      roughCanvas.draw(element.roughElement);
      context.font = "24px sans-serif";
      context.fillText(element.text, element.x1 - 26, element.y1 + 10);
      if (element.id === selectedIndex) {
        highlightNearbyElements(element);
      }
      break;
    case "boomi":
      roughCanvas.draw(element.roughElement);
      context.font = "24px sans-serif";
      context.fillText(element.text, element.x1 - 26, element.y1 + 10);
      if (element.id === selectedIndex) {
        highlightNearbyElements(element);
      }
      break;
    case "pencil":
      context.beginPath();
      context.moveTo(element.points[0].x, element.points[0].y);
      for (let i = 1; i < element.points.length; i++) {
        context.lineTo(element.points[i].x, element.points[i].y);
      }
      context.stroke();
      break;
    case "text":
      context.font = "24px sans-serif";
      context.fillText(element.text, element.x1, element.y1);
      break;
    default:
    // throw new Error(`Type not recognized: ${element.type}`);
  }
};
