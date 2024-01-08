import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BsFillCursorFill } from "react-icons/bs";
import { CiText } from "react-icons/ci";
import { FiArrowUpRight } from "react-icons/fi";
import { IoIosRedo, IoIosUndo } from "react-icons/io";
import { LuPencil } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { TbCircle, TbRectangleFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import rough from "roughjs/bundled/rough.esm";
import Modal from "../components/Modal";
import useHistory from "../components/hooks/useHistory";
import usePressedKeys from "../components/hooks/usePressedKeys";
import {
  attachLineToShape,
  attachLineToShapeCircle,
} from "../utils/attachShapes";
import { fixedWidth, threshold } from "../utils/constants";
import createElement from "../utils/createElement";
import { drawElement } from "../utils/drawElement";
import { BASEURL, cn } from "../utils/functions";
import {
  detectShapesNearLineEndpoint,
  getElementAtPosition,
  nearEuclidean,
} from "../utils/positionFunctions";
import updateElement from "../utils/updateElement";
import useDebounce from "../components/hooks/useDebounce";
import { set } from "lodash";
import { IconKafka,IconBoomi,IconApp_C,IconApp_R } from "./Icons";

const color = ["#FF0000", "#FFFFFF", "#000000", "#00FF00", "#0000FF"];

const SammpleObject = {
  label: "",
  description: "",
  owner: "",
};

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
    icon: IconApp_R,
  },
  {
    type: "circle",
    icon: IconApp_C,
  },
  {
    type: "kafka",
    icon: IconKafka,
  },
  {
    type: "boomi",
    icon: IconBoomi,
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

const adjustmentRequired = (type) =>
  ["line", "rectangle", "circle", "kafka", "boomi"].includes(type);

const WorkSpace = () => {
  // const [elements, setElements, undo, redo] = useHistory([]);
  const [elements, setElements] = useState([]);
  const debouncedElements = useDebounce(elements, 1000);
  const [action, setAction] = useState("none");
  const [selectedColor, setselectedColor] = useState(color[0]);
  const [tool, setTool] = useState("selection");
  const [selectedElement, setSelectedElement] = useState(null);
  const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdFormeta, setSelectedIdFormeta] = useState();
  const [meta, setMeta] = useState({});
  const [isDesigner, setisDesigner] = useState(true);
  const [key, setkey] = useState("");
  const [value, setValue] = useState("");
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

  const getUser = async () => {
    try {
      const user = await axios.get(`${BASEURL}/api/auth/user/me`, {
        withCredentials: true,
      });
      if (!user) navigate("/login");
      if (user.data.user.role !== "designer") {
        setisDesigner(false);
      }
    } catch (error) {
      navigate("/login");
    }
  };

  const handleSave = async () => {
    const elementsCopy = [...elements];

    elementsCopy[selectedIdFormeta] = {
      ...elementsCopy[selectedIdFormeta],
      options: {
        ...elementsCopy[selectedIdFormeta].options,
        meta,
      },
    };
    setElements(elementsCopy, true);
  };
  const handleDiscard = async () => {
    setMeta(elements[selectedIdFormeta].options?.meta || {});
  };

  useEffect(() => {
    getUser();

    const searchParams = new URLSearchParams(window.location.search);
    const workspaceId = searchParams.get("wid");
    if (workspaceId) {
      setWid(workspaceId);
      const fetchWorkspaceData = async () => {
        try {
          const response = await axios.get(
            `${BASEURL}/api/workspaces/${workspaceId}`,
            {
              withCredentials: true,
            }
          );
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
    if (!wid) return;
    const updateWorkspace = async () => {
      if (wid) {
        try {
          await axios.put(
            `${BASEURL}/api/workspaces/${wid}`,
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
    updateWorkspace();

    // Trigger PUT request when 'elements' state changes
  }, [debouncedElements, wid]);

  useEffect(() => {
    document.addEventListener("dblclick", handleDoubleClick);

    return () => {
      document.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [elements]);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const roughCanvas = rough.canvas(canvas);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(panOffset.x, panOffset.y);

    elements?.map((element) => {
      if (action === "writing" && selectedElement.id === element.id) return;
      drawElement(context, roughCanvas, element, selectedIndex);
    });
    context.restore();
  }, [elements, action, selectedElement, panOffset]);

  const handleDoubleClick = (event) => {
    if (tool !== "selection") return;

    const { clientX, clientY } = getMouseCoordinates(event);
    const element = getElementAtPosition(clientX, clientY, elements);

    if (element) {
      setIsOpen(true);
      setSelectedIdFormeta(element.id);
      setMeta(element.options?.meta || { common: { ...SammpleObject } });
    }
  };

  // useEffect(() => {
  //   const undoRedoFunction = (event) => {
  //     if ((event.metaKey || event.ctrlKey) && event.key === "z") {
  //       if (event.shiftKey) {
  //         redo();
  //       } else {
  //         undo();
  //       }
  //     }
  //   };

  //   document.addEventListener("keydown", undoRedoFunction);
  //   return () => {
  //     document.removeEventListener("keydown", undoRedoFunction);
  //   };
  // }, [undo, redo]);

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
    };
  }, [tool, elements]);

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

        // setElements((prevState) => prevState);

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
      updateElement(
        [
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
        ],
        elements,
        setElements,
        selectedColor
      );
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
      } else if (selectedElement.type === "line") {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY, options } =
          selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        const elementsDepending = options.depending;
        let elementsToUpdate = [
          {
            id,
            x1: newX1,
            y1: newY1,
            x2: newX1 + width,
            y2: newY1 + height,
            type,
            options: {
              ...options,
              depending: [],
            },
          },
        ];
        if (elementsDepending) {
          elementsDepending.forEach((item) => {
            const element = elements[item.element];
            const options = element.options;
            const depends = options.depends;
            const obj = {
              ...element,
              options: {
                ...element.options,
                depends: depends.filter((dep) => dep.element !== id),
              },
            };
            elementsToUpdate.push(obj);
          });
        }
        updateElement(
          elementsToUpdate,
          elements,
          setElements,
          selectedColor,
          false
        );
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
            const line = elements[item?.element];
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

        updateElement(
          elementsToUpdate,
          elements,
          setElements,
          selectedColor,
          false
        );
      } else if (selectedElement.type === "circle"||selectedElement.type === "kafka"||selectedElement.type === "boomi") {
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
            const line = elements[item?.element];
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
        updateElement(
          elementsToUpdate,
          elements,
          setElements,
          selectedColor,
          false
        );
      } else {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        //TODO; options for line
        let options = type === "text" ? { text: selectedElement.text } : {};
        updateElement(
          [
            {
              id,
              x1: newX1,
              y1: newY1,
              x2: newX1 + width,
              y2: newY1 + height,
              type,
              options,
            },
          ],
          elements,
          setElements,
          selectedColor
        );
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
        detectShapesNearLineEndpoint(
          clientX,
          clientY,
          elements,
          setSelectedIndex
        );
      }

      updateElement(
        [{ id, x1, y1, x2, y2, type, options: selectedElement.options }],
        elements,
        setElements,
        selectedColor
      );
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

      const index = selectedElement?.id;
      if (!elements || index === elements.length) {
        return;
      }
      const { id, type } = elements[index];
      if (action === "drawing" && adjustmentRequired(type)) {
        const { x1, y1, x2, y2 } = elements[index];
        updateElement(
          [{ id, x1, y1, x2, y2, type, options: {} }],
          elements,
          setElements,
          selectedColor
        );
      }
      if (action === "resizing" && adjustmentRequired(type)) {
        const { x1, y1, x2, y2 } = elements[index];

        if (selectedIndex === null) {
          setAction("none");
          updateElement(
            [elements[index]],
            elements,
            setElements,
            selectedColor
          );
          return;
        }

        if (
          elements[selectedIndex].type === "circle" ||
          elements[selectedIndex].type === "kafka" ||
          elements[selectedIndex].type === "boomi"
        ) {
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

            const depending = elements[index].options?.depending ?? [];

            const opt = {
              depending: [
                ...depending,
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
              updateElement(
                [
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
                ],
                elements,
                setElements,
                selectedColor
              );
            } else {
              updateElement(
                [
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
                ],
                elements,
                setElements,
                selectedColor
              );
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

            const depending = elements[index].options?.depending ?? [];

            const opt = {
              depending: [
                ...depending,
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
              updateElement(
                [
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
                ],
                elements,
                setElements,
                selectedColor
              );
            } else {
              updateElement(
                [
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
                ],
                elements,
                setElements,
                selectedColor
              );
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
    updateElement(
      [
        {
          id,
          x1,
          y1,
          x2: null,
          y2: null,
          type,
          options: { text: event.target.value },
        },
      ],
      elements,
      setElements,
      selectedColor
    );
  };

  return (
    <div>
      <div className="fixed top-5 left-5 z-50 items-center gap-2 flex flex-col justify-center bg-gray-300 rounded-lg p-2">
        {isDesigner &&
          Draw.map((item, index) => {
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
        {isDesigner &&
          color.map((item, index) => {
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
        {/* <button onClick={undo} className="p-2 bg-gray-200 w-fit rounded-lg">
          <IoIosUndo />
        </button>
        <button onClick={redo} className="p-2 bg-gray-200 w-fit rounded-lg">
          <IoIosRedo />
        </button> */}
        <button
          onClick={handleClear}
          className="p-2 bg-gray-200 w-fit rounded-lg"
        >
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
        <div className="w-full rounded-lg border border-gray-400 flex flex-col gap-2 shadow-sm py-4 px-6">
          <h1 className="text-base font-bold">Add</h1>
          <div className="flex flex-col gap-4">
            {meta.common &&
              Object.entries(meta?.common).map(([key, value]) => (
                <div className="w-full flex gap-2">
                  <h2 className="text-white bg-slate-600 p-2 w-1/5 rounded-lg border-white outline-2 outline-slate-600">
                    {key.toUpperCase()}:
                  </h2>
                  <input
                    value={value}
                    placeholder={`${key}`}
                    onChange={(e) => {
                      setMeta((prevState) => ({
                        ...prevState,
                        common: {
                          ...prevState.common,
                          [key]: e.target.value,
                        },
                      }));
                    }}
                    className="w-4/5 p-5 bg-gray-300  rounded-lg"
                  />
                </div>
              ))}
          </div>
          <div className="flex flex-row gap-4">
            <input
              type="text"
              placeholder="Key"
              className="w-1/3 rounded-lg border border-gray-400 p-4"
              value={key}
              onChange={(e) => setkey(e.target.value)}
            />
            <input
              type="text"
              placeholder="Value"
              className="w-2/3 rounded-lg border border-gray-400 p-4"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white rounded-lg p-2"
              onClick={() => {
                setMeta((prevState) => ({
                  ...prevState,
                  other: {
                    [key]: value,
                  },
                }));
                setkey("");
                setValue("");
              }}
            >
              Add
            </button>
          </div>
        </div>
        {meta.other &&
          Object.entries(meta?.other).map(([key, value]) => (
            <div className="w-full flex gap-2">
              <h2 className="text-white bg-slate-600 p-2 w-1/5 rounded-lg border-white outline-2 outline-slate-600">
                {key}
              </h2>
              <p className="w-4/5 bg-gray-300 p-2 rounded-lg">{value}</p>
            </div>
          ))}

        <div className="flex flex-row gap-3">
          <button
            onClick={handleSave}
            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Save
          </button>
          <button
            onClick={handleDiscard}
            className="p-2 bg-red-500 hover:bg-red-600 rounded-lg"
          >
            Discard
          </button>
        </div>
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
