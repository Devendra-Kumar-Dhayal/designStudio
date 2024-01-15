import axios from "axios";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { BASEURL, cn } from "../utils/functions";
import { useNavigate } from "react-router-dom";
import rough from "roughjs/bundled/rough.esm";
import { drawElement } from "../utils/drawElement";



const Project = () => {
  const navigate = useNavigate();
  const [isDesigner, setisDesigner] = useState(true);
  const [elements, setElements] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 });

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

          console.log("response",response,response.data);
          const arr = []

          response.data.forEach(element=>{
            element.workspaces.forEach(workspace=>{
              arr.push(workspace.meta)
            })
          })
          console.log(arr)
          setElements(arr);
          // if (response.data && response.data.elements) {
          //   setElements(response.data.elements);
          // }
        } catch (error) {
          console.error("Error fetching workspace data:", error);
        }
      };

      fetchWorkspaceData();
    }
  }, []);
  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const roughCanvas = rough.canvas(canvas);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(panOffset.x, panOffset.y);

    elements?.map((element) => {
      drawElement(context, roughCanvas, element, "none");
    });
    context.restore();
  }, [elements, panOffset]);
  return (
    <canvas
      id="canvas"
      width={canvasSize.width}
      height={canvasSize.height}
      // onMouseDown={handleMouseDown}
      // onMouseMove={handleMouseMove}
      // onMouseUp={handleMouseUp}
      style={{ position: "absolute", zIndex: 1 }}
    >
      Canvas
    </canvas>
  );
}

export default Project