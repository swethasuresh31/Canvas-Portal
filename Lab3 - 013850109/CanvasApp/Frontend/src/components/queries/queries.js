import { gql } from 'apollo-boost';

// const getAuthorsQuery = gql`
//     {
//         authors {
//             name
//             id
//         }
//     }
// `;

const login = gql`
query login($username: String, $password: String){
        login(username: $username, password: $password){
            result
            userData{
                email_id
                first_name
                last_name
                role
                is_student
                phoneNo
                aboutMe
                city
                country
                company
                school
                hometown
                languages
                gender
            }
        }
    }`

// export { getAuthorsQuery, getBooksQuery };
export { login };