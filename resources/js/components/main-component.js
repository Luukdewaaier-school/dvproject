import ReactDOM from 'react-dom';
import React, {Component} from 'react';

import ax from 'axios';
import {store} from 'statorgfc';

import Filters from './partials/filters';
import IncomePie from './partials/income-pie';
import IncomeTime from './partials/income-time';
import DistributionPie from './partials/distribution-pie';

import '../../css/app.css';

store.initialize({
    date: {
        from: '1/1/2018',
        to: '12/31/2020'
    },
    data: {
        almostFinished: [],
        invoiced: 0,
        notInvoiced: 0,
        invoiceDistribution: {},
        clientDistribution: {}
    }
});

export default class MainComponent extends Component {

    constructor(props) {
        super(props);

        store.connectComponentState(this, ['date'])
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        ax.get('/data?from=' + this.state.date.from.replace(/\//g, '-') + '&to=' + this.state.date.to.replace(/\//g, '-'))
            .then(response => {
                store.set({data: response.data});
            })
            .catch(response => {
                console.log(response);
            })
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row custom-row">
                    <Filters getNewData={this.getData.bind(this)}/>
                    <IncomePie/>
                    <DistributionPie/>
                </div>
                <div>
                    <IncomeTime/>
                </div>
            </div>
        );
    }
}

if (document.getElementById('react-app')) {
    ReactDOM.render(<MainComponent/>, document.getElementById('react-app'));
}
