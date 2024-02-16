import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LabelList
} from "recharts";

const data = [
  {
    name: "Total # reviews",
    uv: 61581, // uv is the part of the graph we want to show
    pv: 0
  },
  {
    name: "Kindle 5",
    uv: 12448,
  },
  {
    name: "Kindle 2",
    uv: 9372,
  },
  {
    name: "Kindle 3",
    uv: 8746,
  },
  {
    name: "Kindle 7",
    uv: 5685,
  },
  {
    name: "Kindle 8",
    uv: 5583,
  },
  {
    name: "Kindle 1",
    uv: 4378,
  },
  {
    name: "Kindle 4",
    uv: 3927,
  },
  {
    name: "Kindle 6",
    uv: 3208,
  },  
  {
    name: "Kindle 9",
    uv: 2876,
  },
  {
    name: "Kindle 10",
    uv: 1987,
  },
  {
    name: "Remaining Kindle",
    uv: 3362,
  },
];

const processed_data = [data[0]]
const reference_lines = []

let sub = 0

for (let i = 1; i < data.length; i++) {
    let data_temp = data[i];
    data_temp.pv = data[0].uv - data[i].uv - sub
    sub += data_temp.uv
    processed_data.push(data_temp);
    reference_lines.push(<ReferenceLine stroke="#252f3f" strokeDasharray="3 3"
    segment={[{x: data_temp.name, y:data_temp.uv + data_temp.pv}, {x: data[i-1].name, y:data_temp.uv + data_temp.pv}]}/>)
}

const valueAccessor = attribute => ({ payload }) => {
    return payload[attribute];
  };

function CustomLabel(props) {
    return (
      <g>
        {/* <rect
          x={props.x + props.width/2-25}
          y={props.y + props.height/2-15}
          fill='#252f3f'
          width={50}
          height={20}
        /> */}
        <text x={props.x} y={props.y} textAnchor="middle" fill={props.fill} dx={props.width/2} dy={-5}>
            {props.value}
        </text>
      </g>
    );
  };

function Waterfall() {
  return (
    <ResponsiveContainer height={300} width="100%">
        <BarChart data={processed_data}>
            <XAxis dataKey="name"/>
            {reference_lines}
            <Tooltip />
            <Bar dataKey="pv" stackId="a" fill="transparent" />
            <Bar dataKey="uv" stackId="a" fill="#252f3f">
                <LabelList content={<CustomLabel />} valueAccessor={valueAccessor("uv")} />
                {processed_data.map((item, index) => { return <Cell key={index} fill="#252f3f"/>;})}
            </Bar>
        </BarChart>
    </ResponsiveContainer>

  );
}

export default Waterfall;
