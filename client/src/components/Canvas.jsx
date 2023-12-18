import React, { useRef } from "react";
import useOnDraw from "../hooks/useOnDraw";

const Canvas = ({width,height}) => {
  const setCanvasRef = useOnDraw(onDraw);

  function onDraw(ctx, point,prevPoint) {
    drawLine(prevPoint,point,ctx,"black",5)
  }

  function drawLine(
    start,
    end,
    ctx,
    color,
    width,
  ){
    start = start ?? end;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath()
    ctx.arc(end.x,end.y,width/2,0,2*Math.PI)
    ctx.fill()
  }
  return (
    <canvas
      width={width}
      height={height}
      className="border border-black "
      ref={setCanvasRef}
    />
  );
};

export default Canvas;
