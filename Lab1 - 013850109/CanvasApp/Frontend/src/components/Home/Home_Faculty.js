import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class Home_Faculty extends Component {
    constructor(){
        super();
        this.state = {  
            books : []
        }
    }  
    //get the books data from backend  
    // componentDidMount(){
    //     axios.get('http://localhost:3001/book')
    //             .then((response) => {
    //             //update the state with the response data
    //             this.setState({
    //                 books : this.state.books.concat(response.data) 
    //             });
    //         });
    // }

    render(){
        //iterate over books to create a table row
        // let details = this.state.books.map(book => {
        //     return(
        //         <tr>
        //             <td>{book.id}</td>
        //             <td>{book.title}</td>
        //             <td>{book.author}</td>
        //         </tr>
        //     )
        // })
        //if not logged in go to login page
        let redirectVar = null;
        if(!cookie.load('cookieF')){
            redirectVar = <Redirect to= "/login"/>
        }
        return(
            <div>
                {redirectVar}
                <div class="container">
                    <h2>I am a faculty</h2>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Book ID</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/*Display the Tbale row based on data recieved*/}
                               
                            </tbody>
                        </table>
                </div> 
            </div> 
        )
    }
}
//export Home Component
export default Home_Faculty;