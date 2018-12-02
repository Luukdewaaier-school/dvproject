import React from 'react';

import {store} from 'statorgfc';
import {PieChart, Pie, Tooltip} from 'recharts';

export default class IncomePie extends React.Component {

    constructor(props) {
        super(props);

        store.connectComponentState(this, ['data'])
    }

    render() {
        return (
            <div className="col-lg-4">
                <h1>Income per client</h1>
                <PieChart width={400} height={400}>
                    <Pie isAnimationActive={true} data={this.state.data.clientDistribution} cx={200} cy={150} outerRadius={140} fill="#8884d8" />
                    <Tooltip/>
                </PieChart>
            </div>
        )
    }
}