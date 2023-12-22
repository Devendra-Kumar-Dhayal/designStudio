import React, { useEffect, useLayoutEffect, useRef, useState } from "react";






import jsPlumb from '@jsplumb/browser-ui';

const Workspace = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      jsPlumb.ready(function () {
        // Initialize jsPlumb
        const instance = jsPlumb.getInstance({
          Container: editorRef.current,
          Connector: ['Bezier', { curviness: 150 }],
        });

        // Make elements draggable
        instance.draggable(document.querySelectorAll('.box'), {
          grid: [20, 20],
        });

        // Connect elements
        instance.connect({ source: 'box1', target: 'box2' });
      });
    }
  }, []);

  return (
    <div>
      <div id="editor" ref={editorRef}>
        <div id="box1" className="box" style={{ left: '50px', top: '50px' }}>
          Box 1
        </div>
        <div id="box2" className="box" style={{ left: '200px', top: '100px' }}>
          Box 2
        </div>
      </div>
    </div>
  );
};

export default Workspace;



