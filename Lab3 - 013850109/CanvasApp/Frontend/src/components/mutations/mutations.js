
import { gql } from 'apollo-boost';

// const addBookMutation = gql`
//     mutation AddBook($name: String, $genre: String, $authorId: ID){
//         addBook(name: $name, genre: $genre, authorId: $authorId){
//             name
//             id
//         }
//     }
// `;

const loginMutation = gql`
  mutation LoginMutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
        emailId
    }
  }
`;

const signup = gql`
mutation Signup($firstName: String, $lastName: String, $emailId: String, $password: String, $role: String){
    signup(firstName: $firstName, lastName: $lastName, emailId: $emailId, password: $password, role: $role){
        success  
        duplicateUser      
    }
}`

export {loginMutation, signup};