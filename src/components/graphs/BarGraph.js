import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    YAxis,
    LabelList
} from "recharts";
import { useEffect, useState, useRef } from "react";


const valueAccessor = attribute => ({ payload }) => {
    return payload[attribute];
};

function CustomLabel(props) {
    return (
        <g>
            <text x={props.x} y={props.y} dominantBaseline="middle" fill={props.fill} dx={props.width + 5} dy={props.height / 2}>
                {props.value}
            </text>
        </g>
    );
};

function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        let pl = payload[0].payload
        let label_list = [<p className="label">{pl.name}</p>]
        for (let k in pl) {
            if (k !== 'name') {
                label_list.push(<p className="label">{`${k} : ${pl[k]}`}</p>)
            }
        }
        return (
            <div className="custom-tooltip">
                {label_list.map(i => i)}
            </div>
        );
    }

    return null;
};

function getWidth() {
    const yAxesWidth = document.getElementsByClassName('recharts-cartesian-axis recharts-yAxis');
    let yAxisWidth = 10;
    for (var i = 1; i < yAxesWidth.length; i++) {
        let ywidth = (yAxesWidth[i])?.getBBox().width??0
        yAxisWidth = yAxisWidth > ywidth ? yAxisWidth : ywidth;
    }
    return yAxisWidth
}



function BarGraph({ data, fill }) {
    const [width, setWidth] = useState(1)

    useEffect(() => {

        setWidth(getWidth())
    }, [data]);

    if (data === undefined) {
        return "loading"
    }
    return (
        <ResponsiveContainer height={300} width="100%" >
            <BarChart data={data} layout="vertical">
                <XAxis type="number"/>
                <YAxis type="category" dataKey="name" width={width}/>
                <Tooltip content={<CustomTooltip/>}
                wrapperStyle={{ backgroundColor: "white", borderStyle: "ridge", paddingLeft: "10px", paddingRight: "10px" }} />
                <Bar dataKey="frequency" fill={fill}>
                    <LabelList content={<CustomLabel />} valueAccessor={valueAccessor("frequency")} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>

    );
}

export default BarGraph;
