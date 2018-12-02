import React from 'react';

import moment from 'moment';
import {store} from 'statorgfc';
import {LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend} from 'recharts';

const data = [
    {
        "name": "01-08-18",
        "value": 76200
    },
    {
        "name": "01-08-19",
        "value": 76200
    },
    {
        "name": "01-08-20",
        "value": 76200
    },
    {
        "name": "01-08-21",
        "value": 76200
    },
    {
        "name": "01-01-18",
        "value": 129693
    },
    {
        "name": "01-04-18",
        "value": 129693
    },
    {
        "name": "01-07-18",
        "value": 129693
    },
    {
        "name": "01-10-18",
        "value": 129693
    },
    {
        "name": "01-01-19",
        "value": 129693
    },
    {
        "name": "01-04-19",
        "value": 129693
    },
    {
        "name": "01-07-19",
        "value": 129693
    },
    {
        "name": "01-10-19",
        "value": 129693
    },
    {
        "name": "01-01-20",
        "value": 129693
    },
    {
        "name": "01-04-20",
        "value": 129693
    },
    {
        "name": "01-07-20",
        "value": 129693
    },
    {
        "name": "01-10-20",
        "value": 129693
    },
    {
        "name": "01-01-21",
        "value": 129693
    },
    {
        "name": "01-04-21",
        "value": 129693
    },
    {
        "name": "01-07-21",
        "value": 129693
    }
];

export default class IncomeTime extends React.Component {
    render() {
        return (
            <div className="col-lg-12">
                <h1>linechart</h1>
                <LineChart width={1850} height={400} data={data}
                           margin={{top: 20, right: 50, left: 20, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend />
                    {/*<ReferenceLine x={moment.now().format('d MMM YYYY')} stroke="red" label="Max PV PAGE"/>*/}
                    {/*<ReferenceLine y={9800} label="Max" stroke="red"/>*/}
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    {/*<Line type="monotone" dataKey="uv" stroke="#82ca9d" />*/}
                </LineChart>
            </div>
        )
    }
}