import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Avatar, Text, Table } from '@instructure/ui-elements'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { IconAssignmentLine } from '@instructure/ui-icons'
import Moment from 'moment'
import FileBrowser, { Icons } from 'react-keyed-file-browser'
import 'react-keyed-file-browser/dist/react-keyed-file-browser.css';



var mount = document.querySelectorAll('div.browser-mount');
const cookies = new Cookies();

export default class FacultyFilesLanding extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            redirectVar: '',
            assignments: [],
            files: []
        }
        this.fileInput=React.createRef();
        this.onSubmit = this.onSubmit.bind(this);
        this.fileSelectHandler = this.fileSelectHandler.bind(this);
    }

    fileSelectHandler(fileKey) {
        setTimeout(() => {
            axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
            const response = {
              file: 'http://localhost:3001/files/' + this.props.parentProps.match.params.courseUid + '/' + encodeURI(fileKey.key),
            };
            window.open(response.file,'_blank');
            window.focus();
          }, 100);
    }

    componentWillMount() {
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        axios.get('http://localhost:3001/files/' + this.props.parentProps.match.params.courseUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ files: response.data })
            })
    }

    onSubmit(e) {
        e.preventDefault();
        console.log(this.fileInput.current.files[0])
        if(this.fileInput.current.files[0] !== undefined) {
            console.log(this.fileInput.current.files[0])
        let filename=this.props.parentProps.match.params.courseUid + '_' + this.fileInput.current.files[0].name;
        console.log(filename)
        let data = new FormData();
        data.append('file', this.fileInput.current.files[0], filename)
        console.log(data)
        //adds the assignment based on information entered
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        axios.post('http://localhost:3001/files/' + this.props.parentProps.match.params.courseUid, data)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    if (response.status === 200) {
                        this.setState({
                            files: response.data
                        })
                    }
            })
        } else {
            this.setState({
                errorMsg: 'Please select file to submit'
            })
        }
    }

    render() {
        return (
            <div class="col border m-3 py-5">
                {this.state.redirectVar}
                <div className="row">
                    <div className="col">
                        <FileBrowser
                            files={this.state.files}
                            icons={Icons.FontAwesome(4)}

                            onSelectFile={this.fileSelectHandler}
                            detailRenderer={() => null}
                        />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col">
                        <input type="file" name="assignmentFile" id="assignmentFile" ref={this.fileInput}></input>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button type="button" class="btn btn-primary btn-md my-2" style={{ backgroundColor: '#0055a2' }} onClick={this.onSubmit} >Add File</button>
                    </div>
                </div>
            </div>
        );
    }
}