import './RangeSlider.css'

type RangeSliderProps = {
    min: number
    max: number
    step?: number
    value: [from: number, to: number]
    onChange: (value: RangeSliderProps['value']) => void
}

export default function RangeSlider (props: RangeSliderProps) {
    const onChange = (range: RangeSliderProps['value']) => {
        if (range[0] > range[1]) range[1] = range[0]
        else if (range[1] < range[0]) range[0] = range[1]
        props.onChange(range)
    }

    return (
        <span className='RangeSlider'>
            <input
                type='range'
                min={props.min}
                max={props.max}
                step={props.step || 1}
                value={props.value[0]}
                onChange={(evt) => onChange([Number(evt.target.value), props.value[1]])}
            />
            <input
                type='range'
                min={props.min}
                max={props.max}
                step={props.step || 1}
                value={props.value[1]}
                onChange={(evt) => onChange([props.value[0], Number(evt.target.value)])}
            />
        </span>
    )
}