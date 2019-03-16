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

export default class FacultyFilesLanding extends Component {

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

    handleCreateFolder = (key) => {
        this.setState(state => {
            state.files = state.files.concat([{
                key: key,
            }])
            return state
        })
    }
    handleCreateFiles = (files, prefix) => {
        this.setState(state => {
            const newFiles = files.map((file) => {
                let newKey = prefix
                if (prefix !== '' && prefix.substring(prefix.length - 1, prefix.length) !== '/') {
                    newKey += '/'
                }
                newKey += file.name
                return {
                    key: newKey,
                    size: file.size,
                    modified: +Moment(),
                }
            })

            const uniqueNewFiles = []
            newFiles.map((newFile) => {
                let exists = false
                state.files.map((existingFile) => {
                    if (existingFile.key === newFile.key) {
                        exists = true
                    }
                })
                if (!exists) {
                    uniqueNewFiles.push(newFile)
                }
            })
            state.files = state.files.concat(uniqueNewFiles)
            return state
        })
    }
    handleRenameFolder = (oldKey, newKey) => {
        this.setState(state => {
            const newFiles = []
            state.files.map((file) => {
                if (file.key.substr(0, oldKey.length) === oldKey) {
                    newFiles.push({
                        ...file,
                        key: file.key.replace(oldKey, newKey),
                        modified: +Moment(),
                    })
                } else {
                    newFiles.push(file)
                }
            })
            state.files = newFiles
            return state
        })
    }
    handleRenameFile = (oldKey, newKey) => {
        this.setState(state => {
            const newFiles = []
            state.files.map((file) => {
                if (file.key === oldKey) {
                    newFiles.push({
                        ...file,
                        key: newKey,
                        modified: +Moment(),
                    })
                } else {
                    newFiles.push(file)
                }
            })
            state.files = newFiles
            return state
        })
    }
    handleDeleteFolder = (folderKey) => {
        this.setState(state => {
            const newFiles = []
            state.files.map((file) => {
                if (file.key.substr(0, folderKey.length) !== folderKey) {
                    newFiles.push(file)
                }
            })
            state.files = newFiles
            return state
        })
    }
    handleDeleteFile = (fileKey) => {
        this.setState(state => {
            const newFiles = []
            state.files.map((file) => {
                if (file.key !== fileKey) {
                    newFiles.push(file)
                }
            })
            state.files = newFiles
            return state
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