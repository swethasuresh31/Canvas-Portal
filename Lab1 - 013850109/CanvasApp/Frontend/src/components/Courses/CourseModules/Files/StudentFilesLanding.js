import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Avatar, Text, Table } from '@instructure/ui-elements'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { IconAssignmentLine } from '@instructure/ui-icons'
import Moment from 'moment'
import FileBrowser, {Icons} from 'react-keyed-file-browser'
import 'react-keyed-file-browser/dist/react-keyed-file-browser.css';



var mount = document.querySelectorAll('div.browser-mount');
const cookies = new Cookies();

export default class StudentFilesLanding extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            redirectVar: '',
            assignments: [],
            files: []
        }
    }

    componentWillMount() {
        axios.get('http://localhost:3001/files/' + this.props.parentProps.match.params.courseUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ files: response.data })
            })
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

                            onCreateFolder={this.handleCreateFolder}
                            onCreateFiles={this.handleCreateFiles}
                            onMoveFolder={this.handleRenameFolder}
                            onMoveFile={this.handleRenameFile}
                            onRenameFolder={this.handleRenameFolder}
                            onRenameFile={this.handleRenameFile}
                            onDeleteFolder={this.handleDeleteFolder}
                            onDeleteFile={this.handleDeleteFile}
                        />
                    </div>
                </div>
            </div>
        );
    }
}