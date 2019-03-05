import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class Delete extends Component {

    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            book_id : "",
            redirectVar: ""
        }
        //Bind the handlers to this class
        this.bookidChangeHandler = this.bookidChangeHandler.bind(this);
        this.submitDelete = this.submitDelete.bind(this);
    }

    //book_id change handler to update state variable with the text entered by the user
    bookidChangeHandler = (e) => {
        this.setState({
            book_id : e.target.value,
            errorMsg : ''
        })
    }

    validate = () => {
        if(this.state.book_id === '') {
            this.setState({ errorMsg: '*Book Id cannot be empty' })
            return false;
        }
      
        return true;
    }

     //submit Login handler to send a request to the node backend
     submitDelete = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();

        if(!this.validate()) return;
        
        this.setState({ errorMsg: '' })

        let bookId = this.state.book_id;           
        
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.delete('http://localhost:3001/book/'+bookId)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        redirectVar : <Redirect to="/home" />
                    })
                }else{
                    this.setState({
                        redirectVar : '',
                    })
                }
            })
            .catch(err => {
                this.setState({
                    redirectVar : '',
                    errorMsg: '*Invalid Book ID!'
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
                <div class="container">
                    <form>
                        <div style={{ width: "50%", float: "left" }} class="form-group">
                            <input type="text" class="form-control" name="book_id" onChange = {this.bookidChangeHandler} placeholder="Delete a Book by Book ID" />
                        </div>
                        <div style={{ width: "50%", float: "right" }}>
                        <button class="btn btn-success"  type="submit" onClick = {this.submitDelete} >Delete</button>
                        </div>
                        <div className="error-msg">{this.state.errorMsg}</div><br />
                    </form>
                </div>
            </div>
        )
    }
}

export default Delete;