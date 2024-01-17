import rough from "roughjs/bundled/rough.esm";
import { fixedHeight, fixedWidth, threshold } from "./constants";

const generator = rough.generator();

const createElement = (id, x1, y1, x2, y2, type, color, options) => {
  switch (type) {
    case "line":
    case "rectangle":
      let roughElement =
        type === "line"
          ? generator.line(x1, y1, x2, y2, {
              roughness: 0,
              fill: color,
              stroke: color === "#000000" ? "#818181" : "#000000",
              fillStyle: "solid",
              strokeWidth:3,
              
            })
          : generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
              roughness: 0,
              fill: color,
              stroke: color === "#000000" ? "#818181" : "#000000",
              fillStyle: "solid",
              strokeWidth: 2,
            });
      const object= { id, x1, y1, x2, y2, type, roughElement, arrow: [x2], options };
     
      return object
    case "circle":
      let roughElementCirle = generator.circle(x1, y1, fixedWidth, {
        roughness: 0,
        fill: color,
        stroke: color === "#000000" ? "#818181" : "#000000",
        fillStyle: "solid",
        strokeWidth: 2,
      });
      return {
        id,
        x1,
        y1,
        x2: x1 + fixedWidth / 2,
        y2: y1 + fixedHeight / 2,
        type,
        roughElement: roughElementCirle,
        arrow: [x2],
        options,
      };
    case "kafka":
      let roughElementKafka = generator.circle(x1, y1, fixedWidth, {
        roughness: 0,
        fill: color,
        stroke: color === "#000000" ? "#818181" : "#000000",
        fillStyle: "solid",
        
        strokeWidth: 2,
      });
      return {
        id,
        x1,
        y1,
        x2: x1 + fixedWidth / 2,
        y2: y1 + fixedHeight / 2,
        type,
        text:"Kafka",
        roughElement: roughElementKafka,
        arrow: [x2],
        options,
      };
    case "boomi":
      let roughElementBoomi = generator.circle(x1, y1, fixedWidth, {
        roughness: 0,
        fill: color,
        stroke: color === "#000000" ? "#818181" : "#000000",
        fillStyle: "solid",
        
        strokeWidth: 2,
      });
      return {
        id,
        x1,
        y1,
        x2: x1 + fixedWidth / 2,
        y2: y1 + fixedHeight / 2,
        type,
        text:"Boomi",
        roughElement: roughElementBoomi,
        arrow: [x2],
        options,
      };
    case "pencil":
      return { id, type, points: [{ x: x1, y: y1 }] };
    case "text":
      return { id, type, x1, y1, x2, y2, text: "" };
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};

export default createElement;
