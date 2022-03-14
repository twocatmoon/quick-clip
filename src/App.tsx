import {DragEventHandler, DragEvent, useState, useRef, useEffect} from 'react'
import './App.css'
import RangeSlider from './components/RangeSlider'
import pkg from '../package.json'

function App() {
    const ref = useRef<HTMLDivElement | null>(null)

    /*
     * Editor state
     */

    const editorStateRef = useRef({
        crop: {
            x: 0,
            y: 0,
            width: 800,
            height: 600,
        },
        editorArea: {
            width: 800,
            height: 600
        },
        videoWidth: 800,
        videoHeight: 800,
    })

    const [ videoDuration, setVideoDuration ] = useState(0)
    const [ isPlaying, setIsPlaying ] = useState(false)

    const playPause = async () => {
        if (!videoRef.current) return

        const video = videoRef.current

        if (video && video.paused) {
            video.currentTime = trimRange[0] / 1000
            await video.play()
        }
        else {
            video && video.pause()
        }
    }

    const [ trimRange, setTrimRange ] = useState([ 5, 10 ])

    const onRangeChanged = (range: [number, number]) => {
        const video = videoRef.current
        video && video.pause()
        setTrimRange(range)
    }

    const [ cropSize, setCropSize ] = useState([ 0, 0 ])
    const [ cropPos, setCropPos ] = useState([ 0, 0 ])

    const calcCropScreenSize = () => {
        const {
            crop,
            videoWidth,
            videoHeight,
        } = editorStateRef.current

        const videoEl = videoRef.current!
        const videoBrect = videoEl.getBoundingClientRect()

        const cropWidth = crop.width * (videoBrect.width / videoWidth)
        const cropHeight = crop.height * (videoBrect.height / videoHeight)
        setCropSize([ cropWidth, cropHeight ])

        const cropPosX = crop.x * (videoBrect.width / videoWidth)
        const cropPosY = crop.y * (videoBrect.height / videoHeight)
        setCropPos([ cropPosX, cropPosY ])
    }

    const centerCrop = () => {
        const editorState = editorStateRef.current
        editorState.crop.x = (editorState.videoWidth / 2) - (editorState.crop.width / 2)
        editorState.crop.y = (editorState.videoHeight / 2) - (editorState.crop.height / 2)
    }

    const setCropPreset = (size: '800x600' | 'custom') => {
        const editorState = editorStateRef.current

        if (size === '800x600') {
            editorState.crop.width = 800
            editorState.crop.height = 600
        }

        if (size === 'custom') {
            editorState.crop.width = Number(prompt('Crop Width (px):')) || 800
            editorState.crop.height = Number(prompt('Crop Height (px):')) || 600
        }

        centerCrop()
        calcCropScreenSize()
    }

    /*
     * Video event handling
     */

    const [ videoSrc, setVideoSrc ] = useState('')
    const fileRef = useRef<File | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)

    const videoReady = () => {
        setVideoDuration(videoRef.current!.duration * 1000)
        setTrimRange([0, videoRef.current!.duration * 1000])
        resize(true)
    }

    const receiveVideoDrop: DragEventHandler = (evt: DragEvent) => {
        evt.preventDefault()

        if (!evt.dataTransfer.items) return

        const file = evt.dataTransfer.items[0].getAsFile()
        fileRef.current = file
        setVideoSrc(URL.createObjectURL(file))
    }

    const videoIntervalIntervalRef = useRef(0)
    clearInterval(videoIntervalIntervalRef.current)

    videoIntervalIntervalRef.current = setInterval(() => {
        if (!videoRef.current) return
        const video = videoRef.current!

        const el = document.querySelector('#currentTime')
        el.innerHTML = `${video.currentTime.toFixed(1)}/${(trimRange[1] / 1000).toFixed(1)}`

        if (video.paused) return

        if (video.currentTime * 1000 >= trimRange[1]) {
            video.currentTime = trimRange[0] / 1000
        }
    }, 1000 / 24)

    /*
     * Crop drag and resize
     */

    const dragStartRef = useRef({ x: 0, y: 0 })

    const startDrag = (evt) => {
        dragStartRef.current.x = evt.clientX
        dragStartRef.current.y = evt.clientY

        const containerEl = ref.current!.querySelector<HTMLDivElement>('.VideoContainer')
        const containerElBrect = containerEl.getBoundingClientRect()

        const cropEl = ref.current!.querySelector<HTMLDivElement>('.VideoCropControl')
        const cropElBrect = cropEl.getBoundingClientRect()

        const offsetX = containerElBrect.x + (evt.clientX - cropElBrect.x)
        const offsetY = containerElBrect.y + (evt.clientY - cropElBrect.y)

        const xy = (evt) => {
            let x = evt.clientX - offsetX
            if (x < 0) x = 0
            if (x > containerElBrect.width - cropElBrect.width) x = containerElBrect.width - cropElBrect.width

            let y = evt.clientY - offsetY
            if (y < 0) y = 0
            if (y > containerElBrect.height - cropElBrect.height) y = containerElBrect.height - cropElBrect.height

            return [ x, y ]
        }

        const dragMoveHandler = (evt) => {
            const [ x, y ] = xy(evt)

            cropEl.style.transform = `translate(${x}px, ${y}px)`
        }

        const dragStopHandler = (evt) => {
            const [ x, y ] = xy(evt)

            const editorState = editorStateRef.current!

            editorState.crop.x = x * (editorState.videoWidth / containerElBrect.width)
            editorState.crop.y = y * (editorState.videoHeight / containerElBrect.height)

            document.removeEventListener('mouseup', dragStopHandler)
            document.removeEventListener('mousemove', dragMoveHandler)
        }

        document.addEventListener('mouseup', dragStopHandler)
        document.addEventListener('mousemove', dragMoveHandler)
    }

    /*
     * Resize
     */

    const setTall = () => {
        const el = ref.current!.querySelector('.VideoEditor')
        el?.classList.remove('--wide')
        el?.classList.add('--tall')
    }

    const setWide = () => {
        const el = ref.current!.querySelector('.VideoEditor')
        el?.classList.remove('--tall')
        el?.classList.add('--wide')
    }

    const unsetSize = () => {
        const el = ref.current!.querySelector('.VideoEditor')
        el?.classList.remove('--tall')
        el?.classList.remove('--wide')
    }

    const resizeDebounceRef = useRef(0)

    const resize = (resizeImmediately?: boolean) => {
        const videoEl = videoRef.current
        if (!videoEl) return

        unsetSize()
        videoEl.pause()

        clearTimeout(resizeDebounceRef.current)

        resizeDebounceRef.current = setTimeout(() => {
            const videoAspectRatio = videoEl.videoHeight / videoEl.videoWidth

            const editorEl = ref.current!.querySelector('.VideoEditor')
            const editorBrect = editorEl.getBoundingClientRect()
            const editorAspectRatio = editorBrect.height / editorBrect.width

            const editorState = editorStateRef.current
            editorState.editorArea.width = editorBrect.width
            editorState.editorArea.height = editorBrect.height
            editorState.videoWidth = videoEl.videoWidth
            editorState.videoHeight = videoEl.videoHeight

            const containerEl = ref.current!.querySelector<HTMLDivElement>('.VideoContainer')

            if (videoAspectRatio < editorAspectRatio) {
                setWide()

                containerEl!.style.width = '100%'
                containerEl!.style.height = Math.round(editorBrect.width * videoAspectRatio) + 'px'
            } else {
                setTall()

                const reverseRatio = videoEl.videoWidth / videoEl.videoHeight
                containerEl!.style.width = Math.round(editorBrect.height * reverseRatio) + 'px'
                containerEl!.style.height = '100%'
            }

            centerCrop()
            calcCropScreenSize()
        }, resizeImmediately ? 0 : 200)
    }

    /*
     * Export
     */

    const copyToClipboard = async (text: string) => {
        window.focus()

        try {
            await navigator.clipboard.writeText(text)
        } catch (err) {
            console.log(err)
        }

        window.focus()
    }

    const msToTime = (s) => {
        function pad(n: number, z?: number) {
            z = z || 2
            return ('00' + n).slice(-z)
        }

        let ms = s % 1000
        s = (s - ms) / 1000
        let secs = s % 60
        s = (s - secs) / 60
        let mins = s % 60
        let hrs = (s - mins) / 60

        return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3)
    }

    const prepareExport = () => {
        // const output = prompt('Output file name:', 'clip')
        const output = 'clip' // TODO
        const input = fileRef.current!.name

        const from = msToTime(trimRange[0])
        const to = msToTime(trimRange[1])

        let { width, height, x, y } = editorStateRef.current.crop
        x = Math.round(x)
        if (x % 2 === 1) x--
        y = Math.round(y)
        if (y % 2 === 1) y--

        return [ input, output, width, height, x, y, from, to ]
    }

    const exportVideo = () => {
        const [ input, output, width, height, x, y, from, to ] = prepareExport()

        const cmd = `ffmpeg -y -i "${input}" -filter:v "crop=${width}:${height}:${x}:${y}" -vcodec libx264 -an -ss ${from} -to ${to} "${output}.mp4"`
        copyToClipboard(cmd)
        alert('Command copied to clipboard.')
        // prompt('FFMPEG Command Copied!', cmd)
    }

    const exportGif = () => {
        const [ input, output, width, height, x, y, from, to ] = prepareExport()

        const cmd = `ffmpeg -y -i "${input}" -filter:v "crop=${width}:${height}:${x}:${y},fps=24,scale=${Math.round(width / 2)}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 -an -ss ${from} -to ${to} "${output}.gif"`
        copyToClipboard(cmd)
        alert('Command copied to clipboard.')
        // prompt('FFMPEG Command:', cmd)
    }

    /*
     * Initialization
     */

    useEffect(() => {
        const handler = () => resize()
        window.addEventListener('resize', handler)

        return () => {
            window.removeEventListener('resize', handler)
        }
    }, [])

    return (
        <div
            ref={ref}
            className='App'
            onDrop={receiveVideoDrop}
            onDragOver={(evt) => evt.preventDefault()}
        >
            {
                !videoSrc && (
                    <div className='DropTarget'>
                        <p>Drop Video Here</p>
                        <p>
                            <small>
                                Quick Clip generates FFMPEG CLI commands from a drag-and-drop UI so you can easily crop, trim, and transcode video clips.
                            </small>
                        </p>
                        <p>
                            <small>
                                <strong>Quick Clip</strong> by <strong><a href='https://github.com/twocatmoon' target='_blank'>Two-Cat Moon</a></strong>
                                <br />
                                <a href='https://github.com/twocatmoon/quick-clip' target='_blank'>GitHub</a> &middot;&nbsp;
                                <a href='https://github.com/twocatmoon/quick-clip/issues' target='_blank'>Report Bug</a> &middot;&nbsp;
                                <a href='https://github.com/twocatmoon/quick-clip/issues' target='_blank'>Request Feature</a>
                            </small>
                        </p>
                        <p>
                            <small><code>v. {pkg.version}</code></small>
                        </p>
                    </div>
                )
            }
            {
                videoSrc && (
                    <div className='VideoEditor'>
                        <video
                            ref={videoRef}
                            onLoadedData={videoReady}
                            onPause={() => setIsPlaying(false)}
                            onPlay={() => setIsPlaying(true)}
                            src={videoSrc}
                            muted
                        />
                        <div className='VideoContainer'>
                            <div className='VideoContainerPanel'>
                                <div
                                    className='VideoCropControl'
                                    style={{
                                        width: `${cropSize[0]}px`,
                                        height: `${cropSize[1]}px`,
                                        transform: `translate(${cropPos[0]}px, ${cropPos[1]}px)`,
                                    }}
                                    onMouseDown={startDrag}
                                >
                                    <div className='CropInfo'>
                                        {Math.round(editorStateRef.current.crop.width)}px x&nbsp;
                                        {Math.round(editorStateRef.current.crop.height)}px
                                        (<span id='currentTime'>0.0/0.0</span>)
                                    </div>
                                    <div className='Handle__top' />
                                    <div className='Handle__left' />
                                    <div className='Handle__bottom' />
                                    <div className='Handle__right' />
                                </div>
                            </div>
                        </div>
                        <div className='EditorControls'>
                            <div className='EditorControlGroup'>
                                <button onClick={playPause}>
                                    {
                                        isPlaying
                                            ? 'Pause'
                                            : 'Play'
                                    }
                                </button>
                                <RangeSlider
                                    min={0}
                                    max={videoDuration}
                                    step={500}
                                    value={trimRange}
                                    onChange={onRangeChanged}
                                />
                                <input
                                    type='number'
                                    min={0}
                                    max={videoDuration}
                                    step={500}
                                    value={trimRange[0]}
                                    onChange={(evt) => onRangeChanged([Number(evt.target.value), trimRange[1]])}
                                />
                                <input
                                    type='number'
                                    min={0}
                                    max={videoDuration}
                                    step={500}
                                    value={trimRange[1]}
                                    onChange={(evt) => onRangeChanged([trimRange[0], Number(evt.target.value)])}
                                />
                            </div>

                            <div className='EditorControlGroup'>
                                <button onClick={() => setCropPreset('800x600')}>800x600</button>
                                <button onClick={() => setCropPreset('custom')}>Custom</button>
                            </div>

                            <div className='EditorControlGroup'>
                                <button className='--primary' onClick={exportVideo}>Export .mp4</button>
                                <button className='--primary' onClick={exportGif}>Export .gif</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default App
