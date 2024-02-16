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

const data = [
  {
    name: "Fun to use",
    uv: 41
  },
  {
    name: "Price point",
    uv: 20,
  },
  {
    name: "High quality",
    uv: 17,
  },
  {
    name: "Multifunctional product",
    uv: 8,
  },
  {
    name: "Fast delivery",
    uv: 3,
  },
  {
    name: "Other",
    uv: 11,
  },
];

const valueAccessor = attribute => ({ payload }) => {
    return payload[attribute] + '%';
  };

function CustomLabel(props) {
    return (
        <g>
        <text x={props.x} y={props.y} dominantBaseline="middle"  fill={props.fill} dx={props.width+5} dy={props.height/2}>
            {props.value}
        </text>
        </g>
    );
};

function BarGraph() {
  return (
    <ResponsiveContainer height={300} width="100%">
        <BarChart data={data} layout="vertical">
            <XAxis type="number"/>
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Bar dataKey="uv" fill="#252f3f" label>
                <LabelList content={<CustomLabel />} valueAccessor={valueAccessor("uv")} />
                {data.map((item, index) => { return <Cell key={index} fill="#252f3f"/>;})}
            </Bar>
        </BarChart>
    </ResponsiveContainer>

  );
}

export default BarGraph;
