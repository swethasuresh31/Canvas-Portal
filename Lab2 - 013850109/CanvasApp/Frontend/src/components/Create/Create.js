import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class Create extends Component {
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            book_id : "",
            title : "",
            author : "",
            redirectvar: "",
        }
        //Bind the handlers to this class
        this.bookidChangeHandler = this.bookidChangeHandler.bind(this);
        this.titleChangeHandler = this.titleChangeHandler.bind(this);
        this.authorChangeHandler = this.authorChangeHandler.bind(this);
        this.submitCreate = this.submitCreate.bind(this);
    }

     //book_id change handler to update state variable with the text entered by the user
     bookidChangeHandler = (e) => {
        this.setState({
            book_id : e.target.value,
            errorMsg : ''
        })
    }
    //title change handler to update state variable with the text entered by the user
    titleChangeHandler = (e) => {
        this.setState({
            title : e.target.value,
            errorMsg : ''
        })
    }
    //author change handler to update state variable with the text entered by the user
    authorChangeHandler = (e) => {
        this.setState({
            author : e.target.value,
            errorMsg : ''
        })
    }

    validate = () => {
        if(this.state.book_id === '') {
            this.setState({ errorMsg: '*Book Id cannot be empty' })
            return false;
        }
        
        if(this.state.title === '') {
            this.setState({ errorMsg: '*Book Title cannot be empty' })
            return false;
        }
        
        if(this.state.author === '') {
            this.setState({ errorMsg: '*Author cannot be empty' })
            return false;
        }
        
        return true;
    }
     //submit Login handler to send a request to the node backend
     submitCreate = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();

        if(!this.validate()) return;
        
        this.setState({ errorMsg: '' })

        const data = {
            id : this.state.book_id,
            title : this.state.title,
            author : this.state.author
        }
        
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.put('http://localhost:3001/book',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        redirectVar : <Redirect to="/home" />
                    })
                }else{
                    this.setState({
                        redirectVar : ''
                    })
                }
            })
            .catch(err => {
                this.setState({
                    redirectVar : '',
                    errorMsg: '*Book ID already exists!'
                })
                
            })
    }


    render() {
        //redirect based on successful login
       let redirectVar1 = null;
        if (!cookie.load('cookie')) {
            redirectVar1 = <Redirect to="/login" />
        }
        return (
            <div>
                {redirectVar1}
                {this.state.redirectVar}
                <div>
                    <br />
                    <div class="container">
                        <form action="http://127.0.0.1:3000/create" method="post">
                            <div style={{ width: '30%' }} class="form-group">
                                <input type="text" class="form-control" name="book_id" onChange = {this.bookidChangeHandler} placeholder="Book ID" />
                            </div>
                            <br />
                            <div style={{ width: '30%' }} class="form-group">
                                <input type="text" class="form-control" name="title" onChange = {this.titleChangeHandler} placeholder="Book Title" />
                            </div>
                            <br />
                            <div style={{ width: '30%' }} class="form-group">
                                <input type="text" class="form-control" name="author" onChange = {this.authorChangeHandler} placeholder="Book Author" />
                            </div>
                            <br />
                            <div className="error-msg">{this.state.errorMsg}</div><br />
                            
                            <div style={{ width: '30%' }}>
                                <button class="btn btn-success" onClick = {this.submitCreate} type="submit">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Create;