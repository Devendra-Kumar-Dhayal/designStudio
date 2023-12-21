import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { TLUiOverrides,Tldraw, track, useEditor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import './custom-ui.css'


const CustomUi = track(() => {
	const editor = useEditor()

	// useEffect(() => {
	// 	const handleKeyUp = (e) => {
	// 		switch (e.key) {
	// 			case 'Delete':
	// 			case 'Backspace': {
	// 				editor.deleteShapes(editor.getSelectedShapeIds())
	// 				break
	// 			}
	// 			case 'v': {
	// 				editor.setCurrentTool('select')
	// 				break
	// 			}
	// 			case 'e': {
	// 				editor.setCurrentTool('eraser')
	// 				break
	// 			}
			
	// 			case 'd': {
	// 				editor.setCurrentTool('draw')
	// 				break
	// 			}
	// 		}
	// 	}

	// 	window.addEventListener('keyup', handleKeyUp)
	// 	return () => {
	// 		window.removeEventListener('keyup', handleKeyUp)
	// 	}
	// })

	return (
		<div className="custom-layout">
			<div className="custom-toolbar">
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'select'}
					onClick={() => editor.setCurrentTool('select')}
				>
					Select
				</button>
				
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'eraser'}
					onClick={() => editor.setCurrentTool('eraser')}
				>
					Delete
				</button>
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'note'}
					onClick={() => editor.setCurrentTool('note')}
				>
					APP
				</button>
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'geo'}
					onClick={() => editor.setCurrentTool('geo')}
				>
					Frame
				</button>

			</div>
		</div>
	)
})
export default CustomUi;