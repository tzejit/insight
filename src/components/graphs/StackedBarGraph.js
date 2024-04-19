import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    YAxis,
    LabelList,
    Legend
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
                <Legend />
                <Bar dataKey="negative" stackId="a" fill="#020D28"/>
                <Bar dataKey="neutral"  stackId="a" fill="#A7A5A5"/>
                <Bar dataKey="positive" stackId="a" fill="#5FA2E0">
                <LabelList content={<CustomLabel />} valueAccessor={valueAccessor()} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>

    );
}

export default StackedBarGraph;
