import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import rough from "roughjs/bundled/rough.esm";
import {
  attachLineToShape,
  attachLineToShapeCircle,
} from "../utils/attachShapes";
import createElement from "../utils/createElement";
import { drawElement } from "../utils/drawElement";
import { BASEURL, cn } from "../utils/functions";
import { getElementAtPosition } from "../utils/positionFunctions";
import { GoCopy } from "react-icons/go";
import {
  Card,
  CardBody,
  Input,
  Modal,
  ModalContent,
  Tab,
  Tabs,
  code,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import {
  codeFlask,
  codeGo,
  codeGoHandler,
  codeJava,
  codeJavaScript,
  codeNode,
  codePython,
  codeReact,
  codeSpring,
} from "../utils/codestub";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";


const codeLanguage = [
  {
    language: "javascript",
    support: "javascript",
    code: codeJavaScript,
  },
  {
    language: "python",
    support: "python",
    code: codePython,
  },
  {
    language: "java",
    support: "java",
    code: codeJava,
  },
  {
    language: "go",
    support: "go",
    code: codeGo,
  },
  {
    language: "react",
    code: codeReact,
    support: "jsx",
  },
];
const codeLanguageBoomi = [
  {
    language: "node",
    support: "javascript",
    code: codeNode,
  },
  {
    language: "python",
    support: "python",
    code: codeFlask,
  },
  {
    language: "java",
    support: "java",
    code: codeSpring,
  },
  {
    language: "go",
    support: "go",
    code: codeGoHandler,
  },
 
];

function calculateDistance(x1, y1, x2, y2) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

  return distance;
}

function findElement(arr, label1) {
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];

    // If the element is not in the hash table, add it to the uniqueArray
    if (element.type !== "line") {
      if (element.options.meta.common.label === label1) {
        return element;
      }
    }
  }
}
function removeRepeatingValues(arr) {
  const seen = {};
  const uniqueArray = [];
  const collisionFreeArray = [];
  // rendering queue

  for (let i = 0; i < arr.length; i++) {
    let element = arr[i];

    // If the element is not in the hash table, add it to the uniqueArray
    if (element.type !== "line") {
      if (!seen[element.options.meta.common.label]) {
        uniqueArray.push(element);
        seen[element.options.meta.common.label] = true;
      }
    }
  }

  //node collision removal
  const spacing = 600; // spcae between the two elements

  for (let i = 0; i < uniqueArray.length - 1; i++) {
    for (let j = i + 1; j < uniqueArray.length; j++) {
      let element1 = uniqueArray[i];
      let element2 = uniqueArray[j];
      if (element1.type === "rectangle") {
        if (element2.type === "rectangle") {
          // removing collsion between reactangle and reactangle
          let dist = calculateDistance(
            (element1.x1 + element1.x2) / 2,
            (element1.y1 + element1.y2) / 2,
            (element2.x1 + element2.x2) / 2,
            (element2.y1 + element2.y2) / 2
          );
          if (dist < spacing) {
            let ratio = spacing / dist;
            let newCord = [
              (element1.x1 + element1.x2) / 2 +
                ratio *
                  ((element2.x1 + element2.x2) / 2 -
                    (element1.x1 + element1.x2) / 2),
              (element1.y1 + element1.y2) / 2 +
                ratio *
                  ((element2.y1 + element2.y2) / 2 -
                    (element1.y1 + element1.y2) / 2),
            ];
            element2.x1 = newCord[0] - 100;
            element2.y1 = newCord[1] - 100;
            element2.x2 = newCord[0] + 100;
            element2.y2 = newCord[1] + 100;
          }
        } else {
          let dist = calculateDistance(
            (element1.x1 + element1.x2) / 2, // removing collsion between reactangle and any circle
            (element1.y1 + element1.y2) / 2,
            element2.x1,
            element2.y1
          );
          if (dist < spacing) {
            let ratio = spacing / dist;
            let newCord = [
              (element1.x1 + element1.x2) / 2 +
                ratio * (element2.x1 - (element1.x1 + element1.x2) / 2),
              (element1.y1 + element1.y2) / 2 +
                ratio * (element2.y1 - (element1.y1 + element1.y2) / 2),
            ];
            element2.x1 = newCord[0];
            element2.y1 = newCord[1];
          }
        }
      } else {
        if (element2.type === "rectangle") {
          let dist = calculateDistance(
            // removing collsion between circle and rectangle
            element1.x1,
            element1.y1,
            (element2.x1 + element2.x2) / 2,
            (element2.y1 + element2.y2) / 2
          );
          if (dist < spacing) {
            let ratio = spacing / dist;
            let newCord = [
              element1.x1 +
                ratio * ((element2.x1 + element2.x2) / 2 - element1.x1),
              element1.y1 +
                ratio * ((element2.y1 + element2.y2) / 2 - element1.y1),
            ];
            element2.x1 = newCord[0] - 100;
            element2.y1 = newCord[1] - 100;
            element2.x2 = newCord[0] + 100;
            element2.y2 = newCord[1] + 100;
          }
        } else {
          let dist = calculateDistance(
            element1.x1, // removing collsion between any circle and any circle
            element1.y1,
            element2.x1,
            element2.y1
          );
          if (dist < spacing) {
            let ratio = spacing / dist;
            let newCord = [
              element1.x1 + ratio * (element2.x1 - element1.x1),
              element1.y1 + ratio * (element2.y1 - element1.y1),
            ];
            element2.x1 = newCord[0];
            element2.y1 = newCord[1];
          }
        }
      }
    }
  }

  for (let i = 0; i < arr.length; i++) {
    let element = arr[i];

    // If the element is not in the hash table, add it to the uniqueArray
    if (element.type === "line") {
      if (!seen[element.options.meta.common.label]) {
        for (let j = 0; j < 2; j++) {
          var ele = findElement(uniqueArray, element.options.depending[j].name);
          if (ele.type === "rectangle") {
            const { x, y } = attachLineToShape(
              ele,
              element,
              element.options.depending[j].start
            );
            if (element.options.depending[j].start) {
              element = {
                ...element,
                x1: x,
                y1: y,
              };
            } else {
              element = {
                ...element,
                x2: x,
                y2: y,
              };
            }
          } else {
            const { x, y } = attachLineToShapeCircle(
              ele,
              element,
              element.options.depending[j].start
            );
            if (element.options.depending[j].start) {
              // element.x1 = x;
              // element.y1 = y;
              element = {
                ...element,
                x1: x,
                y1: y,
              };
            } else {
              // element.x2 = x;
              // element.y2 = y;
              element = {
                ...element,
                x2: x,
                y2: y,
              };
            }
          }
        }
        uniqueArray.push(element);
        seen[element.options.meta.common.label] = true;
      }
    }
  }

  return uniqueArray;
}

const Project = () => {
  const navigate = useNavigate();
  const [isDesigner, setisDesigner] = useState(true);
  const [elements, setElements] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [finalElements, setFinalElements] = useState();
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  // const [wid, setWid] = useState(null);
  const [action, setAction] = useState("none");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState(null);

  const getMouseCoordinates = (event) => {
    const clientX = event.clientX - panOffset.x;
    const clientY = event.clientY - panOffset.y;
    return { clientX, clientY };
  };
  console.log(elements)
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

  useEffect(() => {
    getUser();

    const searchParams = new URLSearchParams(window.location.search);
  
    const projectId = searchParams.get("pid");
    const wid = searchParams.get("wid")
    if (projectId) {
      setProjectId(projectId);
      const fetchWorkspaceData = async () => {
        try {
          const response = await axios.get(
            `${BASEURL}/api/projectsubmit/${projectId}`,
            {
              withCredentials: true,
            }
          );

          const arr = [];
          // console.log(response.data)

          if(wid){
            // workspaceId;
            response.data.forEach((element) => {
              element.workspaces.forEach((workspace) => {
                if(workspace.workspaceId === wid){
                  arr.push(workspace.meta);
                }
              });
            });
          }
          else{

            response.data.forEach((element) => {
              element.workspaces.forEach((workspace) => {
                arr.push(workspace.meta);
              });
            });
          }


          setFinalElements(removeRepeatingValues(arr));
        } catch (error) {
          console.error("Error fetching workspace data:", error);
        }
      };

      fetchWorkspaceData();
    }
  }, []);

  console.log("finalElements", finalElements);

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
        if (action === "panning") return;
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
  }, [ elements]);

  useLayoutEffect(() => {
    if (!finalElements) return;
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const roughCanvas = rough.canvas(canvas);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(panOffset.x, panOffset.y);
    const gridSize = 20;
    const canvasWidth = canvas.width * 100;
    const canvasHeight = canvas.height * 100;

    context.beginPath();
    context.strokeStyle = "rgba(0, 0, 0, 0.1)";

    // Vertical lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      context.moveTo(x, 0);
      context.lineTo(x, canvasHeight);
    }

    // Horizontal lines
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      context.moveTo(0, y);
      context.lineTo(canvasWidth, y);
    }

    context.stroke();

    finalElements?.map((element) => {
      try {
        const updatedElement = createElement(
          element.id,
          element.x1,
          element.y1,
          element.x2,
          element.y2,
          element.type,
          element.roughElement.options.fill,
          element.options
        );
        drawElement(context, roughCanvas, updatedElement, "none");
      } catch (error) {
        console.log("error", error);
      }
    });
    context.restore();
  }, [finalElements, panOffset]);

  const handleDoubleClick = (event) => {
    const { clientX, clientY } = getMouseCoordinates(event);
    const element = getElementAtPosition(clientX, clientY, finalElements);
    onOpenChange();
    setSelectedElement(element, element);
  };

  const bool = selectedElement?.options?.connected?.some(
    (ele) => ele.type === "kafka"
  );
  const boolBoomi = selectedElement?.options?.connected?.some(
    (ele) => ele.type === "boomi"
  );

  const handleMouseMove = (event)=>{
    // if (action === "panning") {
    //   const deltaX = clientX - startPanMousePosition.x;
    //   const deltaY = clientY - startPanMousePosition.y;
    //   setPanOffset({
    //     x: panOffset.x + deltaX,
    //     y: panOffset.y + deltaY,
    //   });
    //   document.body.style.cursor = "grab ";
    //   return;
    // }
  }
  // console.log(bool);

  return (
    <>
      <div className="fixed top-5 left-5 z-50 items-center gap-2 flex flex-col justify-center bg-gray-300 rounded-lg p-2">
        <button
          className={cn(
            " bg-white p-1 w-full text-xs flex justify-center flex-col rounded-lg items-center text-black"
          )}
          onClick={() => {
            navigate(-1);
          }}
        >
          <IoArrowBackCircleOutline className="w-5  h-5 " />
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        scrollBehavior="inside"
        // className={"overflow-scroll"}
      >
        <ModalContent>
          <div className="w-full rounded-lg border border-gray-400 flex flex-col gap-2 shadow-sm py-4 px-6">
            <h1 className="text-base font-bold">Meta</h1>
            <div className="flex flex-col gap-4">
              {selectedElement?.options?.meta?.common &&
                Object.entries(selectedElement?.options?.meta?.common).map(
                  ([key, value]) => (
                    <div className="w-full flex gap-2">
                      <h2 className="text-white bg-slate-600 p-2 w-1/5 rounded-lg border-white outline-2 outline-slate-600">
                        {key.toUpperCase()}:
                      </h2>
                      <p className="w-4/5 bg-gray-300 p-2 rounded-lg">
                        {value}
                      </p>
                    </div>
                  )
                )}
            </div>

            {selectedElement?.options?.meta?.other &&
              Object.entries(selectedElement?.options?.meta?.other).map(
                ([key, value]) => (
                  <div className="w-full flex gap-2">
                    <h2 className="text-white bg-slate-600 p-2 w-1/5 rounded-lg border-white outline-2 outline-slate-600">
                      {key}
                    </h2>
                    <p className="w-4/5 bg-gray-300 p-2 rounded-lg">{value}</p>
                  </div>
                )
              )}
            <Tabs aria-label="Options">
              {bool && (
                <Tab
                  key="kafka"
                  title="kafka"
                  className="flex w-full flex-col overflow-y-hidden h-1/2"
                >
                  <Tabs aria-label="Options">
                    {codeLanguage.map((code) => (
                      <Tab
                        key={code.language}
                        title={code.language}
                        className="relative"
                      >
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(code.code);
                          }}
                          className="absolute top-10 right-5 z-50"
                        >
                          <GoCopy />
                        </Button>
                        <Card>
                          <SyntaxHighlighter
                            language={code.support}
                            style={darcula}
                            className="!max-h-[550px]"
                          >
                            {code.code}
                          </SyntaxHighlighter>
                        </Card>
                      </Tab>
                    ))}
                  </Tabs>
                </Tab>
              )}
              {boolBoomi && (
                <Tab
                  key="boomi"
                  title="boomi"
                  className="flex w-full flex-col overflow-y-hidden h-1/2"
                >
                  <Tabs aria-label="Options">
                    {codeLanguageBoomi.map((code) => (
                      <Tab
                        key={code.language}
                        title={code.language}
                        className="relative"
                      >
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(code.code);
                          }}
                          className="absolute top-10 right-5 z-50"
                        >
                          <GoCopy />
                        </Button>
                        <Card>
                          <SyntaxHighlighter
                            language={code.support}
                            style={darcula}
                            className="!max-h-[550px]"
                          >
                            {code.code}
                          </SyntaxHighlighter>
                        </Card>
                      </Tab>
                    ))}
                  </Tabs>
                </Tab>
              )}
            </Tabs>
          </div>
        </ModalContent>
      </Modal>

      <canvas
        id="canvas"
        width={canvasSize.width}
        height={canvasSize.height}
        onDoubleClick={handleDoubleClick}
        // onMouseDown={handleMouseDown}
        // onMouseMove={handleMouseMove}
        // onMouseUp={handleMouseUp}
        style={{ position: "absolute", zIndex: 1 }}
      >
        Canvas
      </canvas>
    </>
  );
};

export default Project;
