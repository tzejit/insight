import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    YAxis,
    LabelList
} from "recharts";


const valueAccessor = () => ({ payload }) => {
    return payload.positive + payload.neutral + payload.negative;
};

function CustomLabel(props) {
    return (
        <g>
            <text x={props.x} y={props.y}  textAnchor="middle" fill={props.fill} dx={props.width / 2 } dy={-5}>
                {props.value}
            </text>
        </g>
    );
};



function StackedBarGraph({ data }) {
    if (data === undefined) {
        return "loading"
    }
    return (
        <ResponsiveContainer height={300} width="100%">
            <BarChart data={data}  margin={{ top: 20 }}>
                <XAxis dataKey="topic" />
                <YAxis/>
                <Tooltip />
                <Bar dataKey="negative" stackId="a" fill="#FAA0A0"/>
                <Bar dataKey="neutral"  stackId="a" fill="#252f3f"/>
                <Bar dataKey="positive" stackId="a" fill="#b8d8be">
                <LabelList content={<CustomLabel />} valueAccessor={valueAccessor()} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>

    );
}

export default StackedBarGraph;
