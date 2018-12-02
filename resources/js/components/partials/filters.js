import React from 'react';

import {store} from 'statorgfc';
import DateRangePicker from 'react-daterange-picker'
import 'react-daterange-picker/dist/css/react-calendar.css' // For some basic styling. (OPTIONAL)

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

export default class Filters extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dates: null
        };

        store.connectComponentState(this, ['date', 'data'])
    }

    handleChange(e) {
        console.log(e);
        // this.props.getNewData();
    }

    render() {
        return (
            <div className="col-lg-4">
                <div className="row">
                    <div className="col-lg-12">

                        {/*<DateRangePicker*/}
                            {/*onSelect={this.handleChange}*/}
                            {/*value={this.state.dates}*/}
                        {/*/>*/}

                        {/*<DateRangePicker startDate={this.state.date.from} endDate={this.state.date.to} onChange={this.handleChange.bind(this)}>*/}
                            {/*<button className="btn btn-outline-primary picker-button">{this.state.date.from} tot {this.state.date.to}</button>*/}
                        {/*</DateRangePicker>*/}
                    </div>
                </div>
                <div className="row finished-row">
                    <div className="col-lg-12">
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th scope="col">Client id</th>
                                <th scope="col">Website</th>
                                <th scope="col">Afgelopen op</th>
                            </tr>
                            </thead>
                            <tbody>
                        {this.state.data.almostFinished.map((item, key) => {
                            return (
                                <tr key={key}>
                                    <th scope="row">{item.client_id}</th>
                                    <td>{item.name}</td>
                                    <td>{item.expiration.split(' ')[0]}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        gefactureerd: €{this.state.data.invoiced.toLocaleString("nl-NL", {minimumFractionDigits: 2})}
                    </div>
                    <div className="col-lg-6">
                        nog factureren: €{this.state.data.notInvoiced.toLocaleString("nl-NL", {minimumFractionDigits: 2})}
                    </div>
                </div>
            </div>
        )
    }
}