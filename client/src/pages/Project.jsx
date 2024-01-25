import {
  Button,
  Card,
  Modal,
  ModalContent,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { GoCopy } from "react-icons/go";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import rough from "roughjs/bundled/rough.esm";
import createElement from "../utils/createElement";
import { drawElement } from "../utils/drawElement";
import { BASEURL, cn } from "../utils/functions";
import { getElementAtPosition } from "../utils/positionFunctions";

import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
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
import { removeRepeatingValues } from "../utils/nodeFilterUpdater";

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

const Project = () => {
  const navigate = useNavigate();
  const [isDesigner, setisDesigner] = useState(true);
  const [projectId, setProjectId] = useState("");
  const [finalElements, setFinalElements] = useState();
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [action, setAction] = useState("none");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState(null);

  const getMouseCoordinates = (event) => {
    const clientX = event.clientX - panOffset.x;
    const clientY = event.clientY - panOffset.y;
    return { clientX, clientY };
  };
  // console.log(elements);
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
    const wid = searchParams.get("wid");
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

          if (wid) {
            // workspaceId;
            response.data.forEach((element) => {
              element.workspaces.forEach((workspace) => {
                console.log(workspace);
                if (workspace.workspaceId._id === wid) {
                  arr.push({
                    ...workspace.meta,
                    currentWorkspace: workspace.workspaceId.meta.common,
                  });
                }
              });
            });
          } else {
            console.log(response.data);

            response.data.forEach((element) => {
              element.workspaces.forEach((workspace) => {
                arr.push({
                  ...workspace.meta,
                  currentWorkspace: workspace.workspaceId.meta.common,
                });
              });
            });
          }
          console.log("arr", arr);

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
  }, [finalElements]);

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
    for (let x = -4*canvasWidth; x <= 4*canvasWidth; x += gridSize) {
      context.moveTo(x, -4*canvasHeight);
      context.lineTo(x, 4*canvasHeight);
    }

    // Horizontal lines
    for (let y = -4*canvasHeight; y <= 4*canvasHeight; y += gridSize) {
      context.moveTo(-4*canvasWidth, y);
      context.lineTo(4*canvasWidth, y);
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

  const handleMouseMove = (event) => {
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
  };
  console.log(selectedElement);

  return (
    <>
      <div className="fixed top-5 left-5 z-50 items-center gap-2 flex flex-col justify-center bg-gray-300 rounded-lg p-2">
        <button
          className={cn(
            " bg-white p-1 w-full text-xs flex justify-center flex-col rounded-lg items-center text-black"
          )}
          onClick={() => {
            navigate("/");

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
            <h1 className="text-base font-bold">Meta Data</h1>
            <Tabs aria-label="Workspaces">
              {selectedElement?.diff.map((work) => {
                const bool = work?.meta?.connected?.some(
                  (ele) => ele.type === "kafka"
                );
                const boolBoomi = work?.meta?.connected?.some(
                  (ele) => ele.type === "boomi"
                );
                return (
                  <Tab
                    key={work.label}
                    title={work.label}
                    className="flex w-full flex-col overflow-y-hidden h-1/2"
                  >
                    {work.label}
                    {work?.meta?.meta?.other &&
                      Object.entries(work?.meta?.meta?.other).map(
                        ([key, value]) => (
                          <div className="w-full flex gap-2">
                            <h2 className="text-white bg-slate-600 p-2 w-1/5 rounded-lg border-white outline-2 outline-slate-600">
                              {key}
                            </h2>
                            <p className="w-4/5 bg-gray-300 p-2 rounded-lg">
                              {value}
                            </p>
                          </div>
                        )
                      )}

                    <Tabs aria-label="Options" className="mt-4">
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
                  </Tab>
                );
              })}
            </Tabs>
            {/* <div className="flex flex-col gap-4">
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
              )} */}
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
