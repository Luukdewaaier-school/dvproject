import React from 'react';

import {store} from 'statorgfc';
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from 'recharts';

export default class DistributionPie extends React.Component {

    constructor(props) {
        super(props);

        store.connectComponentState(this, ['data'])
    }

    render() {
        return (
            <div className="col-lg-3">
                <h3>Income per time window</h3>

                <BarChart width={window.innerWidth / 4 - 15} height={window.innerHeight / 2 - 10} data={this.state.data.invoiceDistribution}
                          margin={{top: 5, right: 0, left: 0, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Bar dataKey="value" fill="#8884d8"/>
                </BarChart>
            </div>
        )
    }
}