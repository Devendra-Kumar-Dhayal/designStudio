import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'

const WorkSpace = () => {
  return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw />
		</div>
	)
}

export default WorkSpace;
