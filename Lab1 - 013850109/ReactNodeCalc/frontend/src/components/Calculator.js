import React, { Component } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import axios from 'axios';


const options = [
    'add', 'subtract', 'multiply', 'divide'
]

class Calculator extends Component {
    constructor() {
        super()
        this.state = {
            left: '',
            right: '',
            op: options[0],
            result: ''
        }
        this.onChange = this.onChange.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSelect(e) {
        this.setState({ op: e.value })
    }

    onSubmit(e) {
        e.preventDefault()

        const data = {
            left: this.state.left,
            right: this.state.right
        }
        const operation = this.state.op;

        console.log(data.left + " : " + operation);
        axios.post(operation, data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    let res = response.data.result
                    if (res === null) res = 'NaN'
                    this.setState({
                        result: res
                    })
                } else {
                    this.setState({
                        result: "error"
                    })
                }
            });

    }

    render() {
        return (
            <div>
                <div className="jumbotron jumbotron-fluid">
                    <h1>Calculator</h1><br />
                    <p className="lead">Enter left number, choose operation, enter right number and click on "Calculate"</p>
                </div>
                <div className="d-flex justify-content-center">
                    <div>
                        <form noValidate onSubmit={this.onSubmit}>
                            <input type="number" className="form-control" name="left" value={this.state.left} onChange={this.onChange} required /> <br />
                            <Dropdown className="dropdown" name="op" options={options} onChange={this.onSelect} value={this.state.op} /> <br />
                            <input type="number" className="form-control" name="right" value={this.state.right} onChange={this.onChange} required /> <br />
                            <input className="btn btn-primary" value="Calculate" type="submit" /><br />
                            <br /><p className="font-weight-normal">Result:</p>{this.state.result}
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Calculator