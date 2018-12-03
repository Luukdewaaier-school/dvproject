import React from 'react';

import axios from 'axios';
import {store} from 'statorgfc';
import {LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend} from 'recharts';

export default class IncomeTime extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data2: [],
            domain: true,
            hosting: true,
            search: true,
            cloudflare: true,
            service: true,
            print: true
        };

        store.connectComponentState(this, ['date', 'data'])
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        axios.get('/data/line?from=' + this.state.date.from.replace(/\//g, '-') + '&to=' + this.state.date.to.replace(/\//g, '-'))
            .then(response => {
                this.setState({data2: response.data});
            })
            .catch(response => {
                console.log(response);
            })
    }

    render() {
        return (
            <div className="row custom-row justify-content-center">
                <div className="col-lg-12">
                    <h3>Income over time</h3>
                    <LineChart width={window.innerWidth - 50} height={360} data={this.state.data2}
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
                <div className="col-lg-2">
                    <input type="checkbox" checked={this.state.domain} name="domain"/>
                    <label htmlFor="domain">&nbsp;&nbsp;Domein</label>
                </div>
                <div className="col-lg-2">
                    <input type="checkbox" checked={this.state.hosting} name="hosting"/>
                    <label htmlFor="hosting">&nbsp;&nbsp;Magento hosting</label>
                </div>
                <div className="col-lg-2">
                    <input type="checkbox" checked={this.state.search} name="search"/>
                    <label htmlFor="search">&nbsp;&nbsp;Search server</label>
                </div>
                <div className="col-lg-2">
                    <input type="checkbox" checked={this.state.cloudflare} name="cloudflare"/>
                    <label htmlFor="cloudflare">&nbsp;&nbsp;Cloudflare</label>
                </div>
                <div className="col-lg-2">
                    <input type="checkbox" checked={this.state.service} name="service"/>
                    <label htmlFor="service">&nbsp;&nbsp;Magento onderhoud</label>
                </div>
                <div className="col-lg-2">
                    <input type="checkbox" checked={this.state.print} name="print"/>
                    <label htmlFor="print">&nbsp;&nbsp;Auto printen</label>
                </div>
            </div>
        )
    }
}