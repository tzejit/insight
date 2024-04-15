import React from "react";
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    YAxis,
    LabelList
} from "recharts";


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

const yAxis = document.getElementsByClassName('recharts-cartesian-axis recharts-yAxis')[0];
const yAxisWidth = (yAxis)?.getBBox().width;

function BarGraph({ data }) {
    console.log(data)
    if (data === undefined) {
        return "loading"
    }
    return (
        <ResponsiveContainer height={300} width="100%">
            <BarChart data={data} layout="vertical" >
                <XAxis type="number"/>
                <YAxis type="category" dataKey="name" width={yAxisWidth}/>
                <Tooltip content={<CustomTooltip/>}
                wrapperStyle={{ backgroundColor: "white", borderStyle: "ridge", paddingLeft: "10px", paddingRight: "10px" }} />
                <Bar dataKey="frequency" fill="#252f3f">
                    <LabelList content={<CustomLabel />} valueAccessor={valueAccessor("frequency")} />
                    {data.map((_, index) => { return <Cell key={index} fill="#252f3f" />; })}
                </Bar>
            </BarChart>
        </ResponsiveContainer>

    );
}

export default BarGraph;
