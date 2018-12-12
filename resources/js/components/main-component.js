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
        from: new Date(2018, 0, 1),
        to: new Date(2020, 11, 30)
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
        let from = this.state.date.from.getMonth() + '-' + this.state.date.from.getDate() + '-' + this.state.date.from.getFullYear();
        let to = this.state.date.to.getMonth() + '-' + this.state.date.to.getDate() + '-' + this.state.date.to.getFullYear();

        ax.get('/data?from=' + from + '&to=' + to)
            .then(response => {
                store.set({data: response.data});
            })
            .catch(response => {
                console.log(response);
            });

        this.child.getData();
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
                    <IncomeTime onRef={ref => (this.child = ref)}/>
                </div>
            </div>
        );
    }
}

if (document.getElementById('react-app')) {
    ReactDOM.render(<MainComponent/>, document.getElementById('react-app'));
}
