import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { TLUiOverrides,Tldraw, track, useEditor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'

import CustomUi from "./customUI";


const WorkSpace = () => {
  return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw >
				<CustomUi></CustomUi>
			</Tldraw>
		</div>
	)
}

export default WorkSpace;
