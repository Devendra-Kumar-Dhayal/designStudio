import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.esm";
import getStroke from "perfect-freehand";
import { FiArrowUpRight } from "react-icons/fi";
import { cn } from "../utils/functions";
import { TbRectangleFilled, TbCircle } from "react-icons/tb";
import { LuPencil } from "react-icons/lu";
import { CiText } from "react-icons/ci";
import { LuTextCursor } from "react-icons/lu";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosUndo } from "react-icons/io";
import { IoIosRedo } from "react-icons/io";
import { BsFillCursorFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { MdUndo } from "react-icons/md";
import { MdDataObject } from "react-icons/md";
import Modal from "../components/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const generator = rough.generator();

const threshold = 10;
const fixedWidth = 200;
const fixedHeight = 200;

const color = ["#FF0000", "#FFFFFF", "#000000", "#00FF00", "#0000FF"];

const Draw = [
  {
    type: "line",
    icon: FiArrowUpRight,
  },
  {
    type: "selection",
    icon: BsFillCursorFill,
  },
  {
    type: "deletion",
    icon: MdDelete,
  },
  {
    type: "rectangle",
    icon: TbRectangleFilled,
  },
  {
    type: "circle",
    icon: TbCircle,
  },
  {
    type: "pencil",
    icon: LuPencil,
  },
  {
    type: "text",
    icon: CiText,
  },
];

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
            })
          : generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
              roughness: 0,
              fill: color,
              stroke: color === "#000000" ? "#818181" : "#000000",
              fillStyle: "solid",
              strokeWidth: 2,
            });
      return { id, x1, y1, x2, y2, type, roughElement, arrow: [x2], options };
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
    case "pencil":
      return { id, type, points: [{ x: x1, y: y1 }] };
    case "text":
      return { id, type, x1, y1, x2, y2, text: "" };
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};

const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? "inside" : null;
};

const positionWithinElement = (x, y, element) => {
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
      throw new Error(`Type not recognised: ${type}`);
  }
};

const nearEuclidean = (x, y, x1, y1, x2, y2) => {
  return (
    x >= x1 - threshold &&
    x <= x2 + threshold &&
    y >= y1 - threshold &&
    y <= y2 + threshold
  );
};

const highlightNearbyElements = (element) => {
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
      console.log("first", error);
    }
  }
};

const clearHighlightedElements = (elements) => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  elements.forEach((element) => {
    if (element.type === "rectangle") {
      context.clearRect(
        element.x - 3,
        element.y - 3,
        element.width + 6,
        element.height + 6
      );
    }
  });
};

const attachLineToShape = (shape, line, start) => {
  const { x1, y1, x2, y2 } = shape;
  const { x1: lx1, y1: ly1, x2: lx2, y2: ly2 } = line;
  // Calculate the x3, y3 based on the 'start' parameter
  const shapeCenterX = (x1 + x2) / 2;
  const shapeCenterY = (y1 + y2) / 2;
  const x3 = start ? lx2 : lx1;
  const y3 = start ? ly2 : ly1;

  // Calculate the slope of the line
  const m = (shapeCenterY - y3) / (shapeCenterX - x3);

  // Calculate the y-intercept of the line
  const c = y3 - m * x3;
  // Check if the line is vertical
  if (!isFinite(m)) {
    // Vertical line case (x = constant)
    const x = x3;
    const y = y3 - y1 < y3 - y2 ? y3 - y1 : y3 - y2;
    return { x, y };
  }
  if (m === 0) {
    const x = x3 - x1 < x3 - x2 ? x3 - x1 : x3 - x2;
    const y = y3;
    return { x, y };
  }
  const arr = [{ x: x1 }, { x: x2 }, { y: y1 }, { y: y2 }];
  let min = Number.MAX_VALUE;
  let coordinate;
  arr.map((item) => {
    const x = item.x || (item.y - c) / m;
    const y = item.y || m * x + c;
    const distance =
      Math.sqrt(Math.pow(x - x3, 2) + Math.pow(y - y3, 2)) +
      Math.sqrt(Math.pow(x - shapeCenterX, 2) + Math.pow(y - shapeCenterY, 2));
    if (distance < min) {
      min = distance;
      coordinate = { x, y };
    }
  });

  // Calculate intersection point with the line segment

  return coordinate;

  // Return null if there is no intersection within the line segment
  // return { x: intersectionX, y: intersectionY };
};
const attachLineToShapeCircle = (shape, line, start) => {
  const { x1, y1, x2, y2 } = shape; // Circle's coordinates
  const { x1: lx1, y1: ly1, x2: lx2, y2: ly2 } = line;

  // Calculate the circle's center coordinates

  // Calculate the other end of the line coordinates
  const x3 = start ? lx2 : lx1;
  const y3 = start ? ly2 : ly1;

  // Calculate the slope of the line passing through the circle's center and the other end of the line
  let distance = Math.sqrt(Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2));

  // Calculate unit vector along the line
  let unitVector = [(x3 - x1) / distance, (y3 - y1) / distance];

  // Calculate point on the circle
  let intersectionX = x1 + (fixedWidth / 2) * unitVector[0];
  let intersectionY = y1 + (fixedWidth / 2) * unitVector[1];

  return { x: intersectionX, y: intersectionY };
};

const updateLinePositionWithShapeMovement = (
  shapeId,
  newCoordinates,
  lines
) => {
  // Find the lines connected to the moved shape
  const linesToUpdate = lines.filter(
    (line) => line.startShapeId === shapeId || line.endShapeId === shapeId
  );

  // Update the endpoints of these lines based on the new shape coordinates

  //TODO: update this again
  linesToUpdate.forEach((line) => {
    if (line.startShapeId === shapeId) {
      line.startX = newCoordinates.x;
      line.startY = newCoordinates.y;
    }
    if (line.endShapeId === shapeId) {
      line.endX = newCoordinates.x;
      line.endY = newCoordinates.y;
    }
  });

  // Return the updated lines array
  return lines;
};

const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x, y, elements) => {
  return elements
    ?.map((element) => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find((element) => element.position !== null);
};

const adjustElementCoordinates = (element) => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === "rectangle") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

const cursorForPosition = (position) => {
  switch (position) {
    case "tl":
    case "br":
    case "start":
    case "end":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    default:
      return "move";
  }
};

const resizedCoordinates = (clientX, clientY, position, coordinates) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case "tl":
    case "start":
      return { x1: clientX, y1: clientY, x2, y2 };
    case "tr":
      return { x1, y1: clientY, x2: clientX, y2 };
    case "bl":
      return { x1: clientX, y1, x2, y2: clientY };
    case "br":
    case "end":
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return null; //should not really get here...
  }
};

const useHistory = (initialState) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action, overwrite = false) => {
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
  };

  const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
  const redo = () =>
    index < history.length - 1 && setIndex((prevState) => prevState + 1);

  return [history[index], setState, undo, redo];
};

const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

const adjustmentRequired = (type) => ["line", "rectangle"].includes(type);

const usePressedKeys = () => {
  const [pressedKeys, setPressedKeys] = useState(new Set());

  useEffect(() => {
    const handleKeyDown = (event) => {
      setPressedKeys((prevKeys) => new Set(prevKeys).add(event.key));
    };

    const handleKeyUp = (event) => {
      setPressedKeys((prevKeys) => {
        const updatedKeys = new Set(prevKeys);
        updatedKeys.delete(event.key);
        return updatedKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return pressedKeys;
};

const WorkSpace = () => {
  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState("none");
  const [selectedColor, setselectedColor] = useState(color[0]);
  const [tool, setTool] = useState("selection");
  const [selectedElement, setSelectedElement] = useState(null);
  const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdFormeta, setSelectedIdFormeta] = useState();
  const [meta, setMeta] = useState({});
  const [startPanMousePosition, setStartPanMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
	const [wid, setWid] = useState(null); 
  const textAreaRef = useRef();
  const pressedKeys = usePressedKeys();
  const navigate = useNavigate();

  

  
  const drawElement = (context, roughCanvas, element) => {
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

        break;
      case "circle":
        roughCanvas.draw(element.roughElement);
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


	 const getUser = async () => {
     try {
       const user = await axios.get(`http://localhost:5000/api/auth/user/me`, {
         withCredentials: true,
       });
       if (!user) navigate("/login");
     } catch (error) {
       console.log(error);
       navigate("/login");
     }
   };

  useEffect(() => {
    // Function to extract wid from URL search params

    getUser();

    const searchParams = new URLSearchParams(window.location.search);
    const workspaceId = searchParams.get("wid");
    if (workspaceId) {
      setWid(workspaceId);
			 const fetchWorkspaceData = async () => {
         try {
           const response = await axios.get(
             `http://localhost:5000/api/workspaces/${workspaceId}`,
             {
               withCredentials: true,
             }
           );
					 console.log("resp",response)
           if (response.data && response.data.elements) {
             setElements(response.data.elements);
           }
         } catch (error) {
           console.error("Error fetching workspace data:", error);
         }
       };

       fetchWorkspaceData();
    }
  }, []);
	
	useEffect(() => {
    // PUT request to update elements whenever 'elements' state changes
		if(!wid) return;
    const updateWorkspace = async () => {
      if (wid) {
        try {
          await axios.put(
            `http://localhost:5000/api/workspaces/${wid}`,
            {
              elements: elements,
            },
            {
              withCredentials: true,
            }
          );
        } catch (error) {
          console.error("Error updating elements:", error);
        }
      }
    };

    // Trigger PUT request when 'elements' state changes
    updateWorkspace();
  }, [elements, wid]);


  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const roughCanvas = rough.canvas(canvas);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(panOffset.x, panOffset.y);
    

    elements?.map((element) => {
      if (action === "writing" && selectedElement.id === element.id) return;
      drawElement(context, roughCanvas, element);
    });
    context.restore();
  }, [elements, action, selectedElement, panOffset]);

  useEffect(() => {
    const undoRedoFunction = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  const handleDoubleClick = (event) => {
    if (tool !== "selection") return;
    console.log("second", tool);
    const { clientX, clientY } = getMouseCoordinates(event);
    console.log("isopen", elements, clientX, clientY);
    const element = getElementAtPosition(clientX, clientY, elements);

    if (element) {
      setIsOpen(true);
      setSelectedIdFormeta(element.id);
      setMeta(element.options?.meta ?? { Name: "" });
    }
  };

  useEffect(() => {
    const panFunction = (event) => {
      if (event.ctrlKey) {
        event.preventDefault();

        // Change canvas zoom based on wheel delta
        const zoomFactor = 1 + event.deltaY * 0.01; // Adjust the zoom factor as needed
        // Adjust canvas width and height accordingly
        const newCanvasWidth = window.innerWidth * zoomFactor;
        const newCanvasHeight = window.innerHeight * zoomFactor;

        // You might need to adjust the center point for zooming
        const canvasCenterX = window.innerWidth / 2;
        const canvasCenterY = window.innerHeight / 2;
        const offsetX = (canvasCenterX - panOffset.x) * (zoomFactor - 1);
        const offsetY = (canvasCenterY - panOffset.y) * (zoomFactor - 1);

        setPanOffset((prevState) => ({
          x: prevState.x - offsetX,
          y: prevState.y - offsetY,
        }));
        // Update canvas size
        setCanvasSize({ width: newCanvasWidth, height: newCanvasHeight });
      } else if (event.shiftKey) {
        setPanOffset((prevState) => ({
          x: prevState.x - event.deltaY,
          y: prevState.y,
        }));
      } else {
        setPanOffset((prevState) => ({
          x: prevState.x,
          y: prevState.y - event.deltaY,
        }));
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === " ") {
        if (action === "pannig") return;
        document.body.style.cursor = "grab";
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === " ") {
        document.body.style.cursor = "default";
      }
    };

    const handleResize = (event) => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", panFunction);
    document.addEventListener("dblclick", handleDoubleClick);
    //TODO: esc key drawing stop
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        // Check if drawing is in progress
        // if (isDrawing) {
        //   // Reset drawing flag and any other necessary cleanup
        //   isDrawing = false;
        //   // Additional code for canceling the drawing operation...
        //   // For example, clearing the canvas or resetting variables.
        // }
      }
    });

    return () => {
      window.removeEventListener("wheel", panFunction);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [tool]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "writing") {
      setTimeout(() => {
        textArea.focus();
        textArea.value = selectedElement.text;
      }, 0);
    }
  }, [action, selectedElement]);

  const handleClear = () => {
    setElements([]);
    localStorage.removeItem("canvasElements");
  };

  const updateElement = async (elementsToUpdate) => {
    const elementsCopy = [...elements];

    elementsToUpdate.map((element) => {
      const { id, x1, y1, x2, y2, type, options } = element;
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
            selectedColor,
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
            selectedColor,
            options
          );
          let objectc = {
            ...cec,
            options,
          };
          elementsCopy[id] = objectc;
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
    localStorage.setItem("canvasElements", JSON.stringify(elementsCopy));
		

    setElements(elementsCopy, true);
  };

  const getMouseCoordinates = (event) => {
    const clientX = event.clientX - panOffset.x;
    const clientY = event.clientY - panOffset.y;
    return { clientX, clientY };
  };

  const handleMouseDown = (event) => {
    if (action === "writing") return;

    const { clientX, clientY } = getMouseCoordinates(event);

    if (event.button === 1 || pressedKeys.has(" ")) {
      setAction("panning");
      setStartPanMousePosition({ x: clientX, y: clientY });
      document.body.style.cursor = "grab";

      return;
    }

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        if (element.type === "pencil") {
          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
        } else {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
        }
        setElements((prevState) => prevState);

        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else if (tool === "deletion") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        if (element.position === "inside") {
          const temp = elements.filter((el) => el.id !== element.id);
          setElements([...temp]);
          localStorage.setItem("canvasElements", JSON.stringify(temp));
        }
      }
    } else if (tool === "meta") return;
    else {
      const id = elements.length;
      const element = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool,
        selectedColor
      );
      setElements((prevState) => [...prevState, element]);
      localStorage.setItem(
        "canvasElements",
        JSON.stringify([...elements, element])
      );

      setSelectedElement(element);

      setAction(tool === "text" ? "writing" : "drawing");
    }
  };
  function detectShapesNearLineEndpoint(x, y, elements) {
    const shapesNearEndpoint = [];
    const elementsType = new Set();
    //TODO: this set ain't working
    elementsType.add("rectangle");
    elementsType.add("circle");

    elements.map((element) => {
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

  const handleMouseMove = (event) => {
    const { clientX, clientY } = getMouseCoordinates(event);

    if (action === "panning") {
      const deltaX = clientX - startPanMousePosition.x;
      const deltaY = clientY - startPanMousePosition.y;
      setPanOffset({
        x: panOffset.x + deltaX,
        y: panOffset.y + deltaY,
      });
      document.body.style.cursor = "grab ";
      return;
    }

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      event.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1, type } = elements[index];
      updateElement([
        {
          id: index,
          x1,
          y1,
          x2: clientX,
          y2: clientY,
          type,
          tool,
          options: {},
        },
      ]);
    } else if (action === "moving") {
      if (selectedElement.type === "pencil") {
        const newPoints = selectedElement.points.map((_, index) => ({
          x: clientX - selectedElement.xOffsets[index],
          y: clientY - selectedElement.yOffsets[index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id] = {
          ...elementsCopy[selectedElement.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else if (selectedElement.type === "rectangle") {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY, options } =
          selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        let elementsToUpdate = [
          {
            id,
            x1: newX1,
            y1: newY1,
            x2: newX1 + width,
            y2: newY1 + height,
            type,
            options,
          },
        ];
        if (options?.depends) {
          options.depends.map((item) => {
            const line = elements[item.element];
            const { x, y } = attachLineToShape(elements[id], line, item.start);
            let updated = {
              id: item.element,
              x1: line.x1,
              y1: line.y1,
              x2: x,
              y2: y,
              type: elements[item.element].type,
              options: elements[item.element].options,
            };
            if (item.start) {
              updated = {
                ...updated,
                x1: x,
                y1: y,
                x2: line.x2,
                y2: line.y2,
              };
            }
            elementsToUpdate.push(updated);
          });
        }
        updateElement(elementsToUpdate);
      } else if (selectedElement.type === "circle") {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY, options } =
          selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        let elementsToUpdate = [
          {
            id,
            x1: newX1,
            y1: newY1,
            x2: x2,
            y2: newY1 + height,
            type,
            options,
          },
        ];
        if (options?.depends) {
          options.depends.map((item) => {
            const line = elements[item.element];
            const { x, y } = attachLineToShapeCircle(
              elements[id],
              line,
              item.start
            );
            let updated = {
              id: item.element,
              x1: line.x1,
              y1: line.y1,
              x2: x,
              y2: y,
              type: elements[item.element].type,
              options: elements[item.element].options,
            };
            if (item.start) {
              updated = {
                ...updated,
                x1: x,
                y1: y,
                x2: line.x2,
                y2: line.y2,
              };
            }
            elementsToUpdate.push(updated);
          });
        }
        updateElement(elementsToUpdate);
      } else {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        //TODO; options for line
        let options = type === "text" ? { text: selectedElement.text } : {};
        updateElement([
          {
            id,
            x1: newX1,
            y1: newY1,
            x2: newX1 + width,
            y2: newY1 + height,
            type,
            options,
          },
        ]);
      }
    } else if (action === "resizing") {
      const { id, type, position, ...coordinates } = selectedElement;

      const { x1, y1, x2, y2 } = resizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );

      if (type === "line") {
        detectShapesNearLineEndpoint(clientX, clientY, elements);
        // highlightNearbyElements(elements, shapesNearEndpoint);
        // c
        // const updatedLines = updateLinePositionWithShapeMovement(
        //   updatedCoordinates.endShapeId,
        //   updatedCoordinates,
        //   elements
        // );
        // setElements(updatedLines, true);
      }

      // const shapeNearEndpoint =detectShapesNearLineEndpoint(clientX, clientY, elements);

      updateElement([{ id, x1, y1, x2, y2, type, options: {} }]);
    }
  };

  const handleMouseUp = (event) => {
    const { clientX, clientY } = getMouseCoordinates(event);
    if (selectedElement) {
      if (
        selectedElement.type === "text" &&
        clientX - selectedElement.offsetX === selectedElement.x1 &&
        clientY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction("writing");
        return;
      }

      const index = selectedElement.id;
      const { id, type } = elements[index];
      if (action === "drawing" && adjustmentRequired(type)) {
        const { x1, y1, x2, y2 } = elements[index];
        updateElement([{ id, x1, y1, x2, y2, type, options: {} }]);
      }
      if (action === "resizing" && adjustmentRequired(type)) {
        const { x1, y1, x2, y2 } = elements[index];

        if (selectedIndex === null) {
          setAction("none");
          updateElement([elements[index]]);
          return;
        }

        if (elements[selectedIndex].type === "circle") {
          if (
            selectedIndex !== null &&
            Math.pow(clientX - elements[selectedIndex].x1, 2) +
              Math.pow(clientY - elements[selectedIndex].y1, 2) -
              Math.pow(fixedWidth / 2 + threshold, 2) <=
              0
          ) {
            const start = clientX === x1;
            const updatedCoordinates = attachLineToShapeCircle(
              elements[selectedIndex],
              elements[index],
              start
            );
            //TODO: opt in drawing

            const opt = {
              depending: [
                {
                  element: selectedIndex,
                  start,
                },
              ],
            };
            const depends = elements[selectedIndex]?.options?.depends
              ? elements[selectedIndex].options.depends.filter(
                  (item) => item.element !== id
                )
              : [];
            depends.push({
              element: id,
              start,
            });

            const rect = {
              id: selectedIndex,
              x1: elements[selectedIndex].x1,
              y1: elements[selectedIndex].y1,
              x2: elements[selectedIndex].x2,
              y2: elements[selectedIndex].y2,
              type: elements[selectedIndex].type,
              options: {
                ...elements[selectedIndex].options,
                depends,
              },
            };
            if (start) {
              updateElement([
                {
                  id,
                  x1: updatedCoordinates.x,
                  y1: updatedCoordinates.y,
                  x2,
                  y2,
                  type,
                  options: opt,
                },
                rect,
              ]);
            } else {
              updateElement([
                {
                  id,
                  x1,
                  y1,
                  x2: updatedCoordinates.x,
                  y2: updatedCoordinates.y,
                  type,
                  options: opt,
                },
                rect,
              ]);
            }
            setSelectedIndex(null);
            setAction("none");
          }
        }
        if (elements[selectedIndex].type === "rectangle") {
          if (
            selectedIndex !== null &&
            nearEuclidean(
              clientX,
              clientY,
              elements[selectedIndex].x1,
              elements[selectedIndex].y1,
              elements[selectedIndex].x2,
              elements[selectedIndex].y2
            )
          ) {
            const start = clientX === x1;
            const updatedCoordinates = attachLineToShape(
              elements[selectedIndex],
              elements[index],
              start
            );
            //TODO: opt in drawing

            const opt = {
              depending: [
                {
                  element: selectedIndex,
                  start,
                },
              ],
            };
            const depends = elements[selectedIndex].options.depends
              ? elements[selectedIndex].options.depends.filter(
                  (item) => item.element !== id
                )
              : [];
            depends.push({
              element: id,
              start,
            });

            const rect = {
              id: selectedIndex,
              x1: elements[selectedIndex].x1,
              y1: elements[selectedIndex].y1,
              x2: elements[selectedIndex].x2,
              y2: elements[selectedIndex].y2,
              type: elements[selectedIndex].type,
              options: {
                ...elements[selectedIndex].options,
                depends,
              },
            };
            if (start) {
              updateElement([
                {
                  id,
                  x1: updatedCoordinates.x,
                  y1: updatedCoordinates.y,
                  x2,
                  y2,
                  type,
                  options: opt,
                },
                rect,
              ]);
            } else {
              updateElement([
                {
                  id,
                  x1,
                  y1,
                  x2: updatedCoordinates.x,
                  y2: updatedCoordinates.y,
                  type,
                  options: opt,
                },
                rect,
              ]);
            }
            setSelectedIndex(null);
            setAction("none");
          }
        }
      }
    }

    if (action === "writing") return;
    if (action === "panning") {
      setAction("none");
      setSelectedElement(null);

      // Reset cursor style
      document.body.style.cursor = "default";
      return;
    }

    setAction("none");
    setSelectedElement(null);
  };

  const handleBlur = (event) => {
    const { id, x1, y1, type } = selectedElement;
    setAction("none");
    setSelectedElement(null);
    updateElement([
      {
        id,
        x1,
        y1,
        x2: null,
        y2: null,
        type,
        options: { text: event.target.value },
      },
    ]);
  };

  return (
    <div>
      <div className="fixed top-5 left-5 z-50 items-center gap-2 flex flex-col justify-center bg-gray-300 rounded-lg p-2">
        {Draw.map((item, index) => {
          return (
            <button
              className={cn(
                " bg-white p-1 w-full text-xs flex justify-center flex-col rounded-lg items-center text-black",
                tool === item.type && "bg-blue-600 text-white"
              )}
              onClick={() => setTool(item.type)}
              key={index}
            >
              <item.icon className="w-5  h-5 " />
            </button>
          );
        })}
      </div>
      <div className="fixed top-5 right-5 z-50 items-center gap-2 flex flex-col justify-center bg-gray-300 rounded-lg p-2">
        {color.map((item, index) => {
          return (
            <button
              className={cn(
                " bg-white p-1 w-10 h-10  text-xs flex justify-center flex-col rounded-lg items-center text-black border border-black",
                selectedColor === item && "border-2 border-blue-600",
                `bg-[${item}]`
              )}
              onClick={() => setselectedColor(item)}
              key={index}
              style={{ backgroundColor: item }}
            ></button>
          );
        })}
      </div>
      <div
        style={{ position: "fixed", zIndex: 2, bottom: 0, padding: 10 }}
        className="w-fit flex gap-3"
      >
        <button onClick={undo} className="p-2 bg-gray-200 rounded-lg">
          <IoIosUndo />
        </button>
        <button onClick={redo} className="p-2 bg-gray-200 rounded-lg">
          <IoIosRedo />
        </button>
        <button onClick={handleClear} className="p-2 bg-gray-200 rounded-lg">
          Clear
        </button>
      </div>
      {action === "writing" ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: "fixed",
            top: selectedElement.y1 - 2 + panOffset.y,
            left: selectedElement.x1 + panOffset.x,
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: "auto",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
            zIndex: 2,
          }}
        />
      ) : null}

      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        classes={"p-4 flex flex-col gap-4"}
      >
        {"helloooo" + meta}
        {Object.entries(meta).map((key, value) => {
          <div className="w-full flex gap-3">
            <h2 className="text-white bg-slate-600 rounded-lg border-white outline-2 outline-slate-600">
              {key}
              {"hello"}
            </h2>
          </div>;
        })}
      </Modal>
      <canvas
        id="canvas"
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ position: "absolute", zIndex: 1 }}
      >
        Canvas
      </canvas>
    </div>
  );
};

export default WorkSpace;
