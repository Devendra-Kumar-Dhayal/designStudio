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
import { attachLineToShape,attachLineToShapeCircle } from "../utils/attachShapes";
function findElement(arr, label1){
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];

    // If the element is not in the hash table, add it to the uniqueArray
    if(element.type!='line'){
      if (element.options.meta.common.label===label1) {
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
    if(element.type!=='line'){
      
      console.log(element.type);
      if (!seen[element.options.meta.common.label]) {
        uniqueArray.push(element);
        seen[element.options.meta.common.label] = true;
      }
    }
    console.log("unique array" , uniqueArray);
  }
  console.log("unique array" , uniqueArray);
  for (let i = 0; i < arr.length; i++) {
    let element = arr[i];

    // If the element is not in the hash table, add it to the uniqueArray
    if(element.type==='line'){
      if (!seen[element.options.meta.common.label]) {

        console.log(element.options.depending[0].name);
        console.log(element.options.depending[1].name);
        for ( let j = 0; j <2 ; j++){

          var ele = findElement(uniqueArray,element.options.depending[j].name);
          console.log("ele", ele , ele.type);
          if (ele.type=='rectangle'){
            const {x,y} = attachLineToShape(ele,element,element.options.depending[j].start);
            console.log(element.x1,element.y1,x,y);
            if(element.options.depending[j].start){
              element = {
                ...element,
                x1:x,
                y1:y,
              }
              console.log("element1",element)
              
            }
            else{
              element = {
                ...element,
                x2:x,
                y2:y,
              }
              console.log("element2",)
            }
            console.log("updated 1 ",element.x1,element.y1,x,y);
          }
          else{
            const {x,y} = attachLineToShapeCircle(ele,element,element.options.depending[j].start);
            console.log(element.x1,element.y1,x,y);
            if(element.options.depending[j].start){
              // element.x1 = x;
              // element.y1 = y;
              element = {
                ...element,
                x1:x,
                y1:y,
              }
              console.log("element3")
              console.log("updated 2 ",element.x1,element.y1,x,y);

            }
            else{
              // element.x2 = x;
              // element.y2 = y;
              element = {
                ...element,
                x2:x,
                y2:y,
              }
              console.log("element4")
              console.log("updated 2 ",element.x2,element.y2,x,y);
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
  const [finalElements,setFinalElements] = useState()
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
          // ----------------
          // console.log(arr[0].options.meta.common.label);
          // const arr1 = [];
          // arr1.push(arr[0])
          // setElements(arr1);

      // ----------------
      // debugger
          setFinalElements(removeRepeatingValues(arr));
          // debugger
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
  console.log("data for debug",finalElements);
  useLayoutEffect(() => {
    if(!finalElements) return;
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const roughCanvas = rough.canvas(canvas);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(panOffset.x, panOffset.y);

    finalElements?.map((element) => {
      drawElement(context, roughCanvas, element, "none");
    });
    context.restore();
  }, [finalElements, panOffset]);
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