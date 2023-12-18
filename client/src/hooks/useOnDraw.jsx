import React, { useEffect, useRef } from 'react'

const useOnDraw = (onDraw) => {
  const canvasRef = useRef(null);
  const isDrawingRef= useRef(false);



  const mouseMoveListnerRef  = useRef(null)
  const mouseDownListnerRef  = useRef(null)
  const mouseUpListnerRef  = useRef(null)
  const prevPointRef = useRef(null)



  useEffect(()=>{
    return ()=>{
      if(mouseMoveListnerRef.current){
        window.removeEventListener("mousemove",mouseMoveListnerRef.current)
        window.removeEventListener("mouseup",mouseUpListnerRef.current)
      }
    }
  },[])


  function setCanvasRef(ref){
    if(!ref) return;
    if(canvasRef.current){
      canvasRef.current.removeEventListener("mousedown",mouseDownListnerRef.current)
    }
    canvasRef.current = ref;
    initMouseMoveListener()
    isMouseUpDownListener();
  }

  function initMouseMoveListener(){
    const mouseMoveListener = (e) => {
      if(isDrawingRef.current){

        const point = computePointInCanvas(e.clientX,e.clientY)
        const ctx = canvasRef.current.getContext("2d")
        if(onDraw) onDraw(ctx,point,prevPointRef.current)
        prevPointRef.current = point
        console.log(point)
      }
    }
    mouseMoveListnerRef.current = mouseMoveListener;
    window.addEventListener("mousemove",mouseMoveListener)
  }


  function isMouseUpDownListener(){
    if(!canvasRef) return
    const listener = () => {
      isDrawingRef.current = true
    }
    const removeListener = () => {
      isDrawingRef.current = false
      prevPointRef.current=null
    }
    mouseDownListnerRef.current = listener;
    mouseUpListnerRef.current = removeListener;
    

    canvasRef.current.addEventListener("mousedown",listener)
    // mouse up is needed for window because if the user mouse up outside the canvas the drawing should stop but it doesnt if we come back to canvas
    window.addEventListener("mouseup",removeListener)
  }

  function computePointInCanvas(x,y){
    if(!canvasRef) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const canvasX = x - rect.left
    const canvasY = y - rect.top
    return {x:canvasX,y:canvasY}
  }

  return setCanvasRef
}

export default useOnDraw