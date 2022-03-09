import {DragEventHandler, DragEvent, useState, useRef} from 'react'
import './App.css'

function App() {
    const [ videoSrc, setVideoSrc ] = useState('')
    const videoRef = useRef<HTMLVideoElement | null>(null)

    const dragStartRef = useRef({ x: 0, y: 0 })
    const isDraggingRef = useRef(false)

    const receiveVideoDrop: DragEventHandler = (evt: DragEvent) => {
        evt.preventDefault()

        if (!evt.dataTransfer.items) return

        const file = evt.dataTransfer.items[0].getAsFile()
        setVideoSrc(URL.createObjectURL(file))
    }

    const videoReady = () => {
        const video = videoRef.current
        console.log('Video Ready!', video)
    }

    const startDrag = (evt) => {

    }

    return (
        <div className="App">
            {
                !videoSrc && (
                    <div
                        onDrop={receiveVideoDrop}
                        onDragOver={(evt) => evt.preventDefault()}
                        className='DropTarget'
                    >
                        Drop Video Here
                    </div>
                )
            }
            {
                videoSrc && (
                    <div className='VideoEditor'>
                        <div className='VideoContainer'>
                            <video
                                ref={videoRef}
                                onLoadedData={videoReady}
                                src={videoSrc}
                                controls={true}
                            />
                            <div className='VideoContainerPanel'>
                                <div
                                    className='VideoCropControl'
                                >
                                    {/*<div className='Handle__top' />*/}
                                    {/*<div className='Handle__left' />*/}
                                    {/*<div className='Handle__bottom' />*/}
                                    {/*<div className='Handle__right' />*/}
                                </div>
                            </div>
                        </div>
                        <div className='EditorControls'>
                            <button>800x600</button>
                            <button>1600x1200</button>
                            <button className='--primary'>Export .mp4</button>
                            <button className='--primary'>Export .gif</button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default App
