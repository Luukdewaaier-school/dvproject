import React from 'react';

import {store} from 'statorgfc';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';


export default class Filters extends React.Component {

    constructor(props) {
        super(props);

        store.connectComponentState(this, ['date', 'data'])
    }

    handleChange(val, date) {
        console.log(val, date);
        let dates = this.state.date;
        dates[date] = val;

        store.set({date: dates});
        this.props.getNewData();
    }

    render() {
        return (
            <div className="col-lg-4">
                <div className="row">
                    <div className="col-lg-5">
                        <DatePicker
                            selected={this.state.date.from}
                            onChange={(val) => { this.handleChange(val, 'from') }}
                            dropdownMode="select"
                            placeholderText={this.props.placeholderText}
                            dateFormat="d MMMM yyyy"
                            className="form-control"
                        />
                    </div>
                    <div className="col-lg-2">
                        to
                    </div>
                    <div className="col-lg-5">
                        <DatePicker
                            selected={this.state.date.to}
                            onChange={(val) => { this.handleChange(val, 'to') }}
                            dropdownMode="select"
                            placeholderText={this.props.placeholderText}
                            dateFormat="d MMMM yyyy"
                            className="form-control"
                        />
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