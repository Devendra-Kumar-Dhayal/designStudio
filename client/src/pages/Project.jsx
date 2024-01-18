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
import { Input, Modal, ModalContent, useDisclosure } from "@nextui-org/react";

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
  // rendering queue

  for (let i = 0; i < arr.length; i++) {
    let element = arr[i];

    // If the element is not in the hash table, add it to the uniqueArray
    if (element.type !== "line") {
      console.log(element.type);
      if (!seen[element.options.meta.common.label]) {
        uniqueArray.push(element);
        seen[element.options.meta.common.label] = true;
      }
    }
  }
  for (let i = 0; i < arr.length; i++) {
    let element = arr[i];

    // If the element is not in the hash table, add it to the uniqueArray
    if (element.type === "line") {
      if (!seen[element.options.meta.common.label]) {
        console.log(element.options.depending[0].name);
        console.log(element.options.depending[1].name);
        for (let j = 0; j < 2; j++) {
          var ele = findElement(uniqueArray, element.options.depending[j].name);
          console.log("ele", ele, ele.type);
          if (ele.type === "rectangle") {
            const { x, y } = attachLineToShape(
              ele,
              element,
              element.options.depending[j].start
            );
            console.log(element.x1, element.y1, x, y);
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
            console.log(element.x1, element.y1, x, y);
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState(null);

  const getMouseCoordinates = (event) => {
    const clientX = event.clientX - panOffset.x;
    const clientY = event.clientY - panOffset.y;
    return { clientX, clientY };
  };

  console.log(selectedElement)

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

          console.log("response", response, response.data);
          const arr = [];

          response.data.forEach((element) => {
            element.workspaces.forEach((workspace) => {
              arr.push(workspace.meta);
            });
          });
          console.log(arr);

          setFinalElements(removeRepeatingValues(arr));
        } catch (error) {
          console.error("Error fetching workspace data:", error);
        }
      };

      fetchWorkspaceData();
    }
  }, []);

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

  // console.log(selectedId);

  const handleDoubleClick = (event) => {
    // console.log("mouse down", event);
    const { clientX, clientY } = getMouseCoordinates(event);
    const element = getElementAtPosition(clientX, clientY, finalElements);
    // console.log(element);
    onOpenChange()
    setSelectedElement(element,element);
  };

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
        // classes={"p-4 flex flex-col gap-4"}
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
