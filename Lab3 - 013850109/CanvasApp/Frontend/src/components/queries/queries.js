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
                phone_number
                about_me
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

    const profile = gql`
    query profile($username: String){
        profile(username: $username){
            userData{
                email_id
                first_name
                last_name
                role
                is_student
                phone_number
                about_me
                city
                country
                company
                school
                hometown
                languages
                gender
            }
        }
    }
`
    const courses = gql`
    query courses($username: String, $isStudent: Int){
        courses(username: $username, isStudent: $isStudent){
            courses{
                course_instructor,
                course_dept_code,
                course_id,
                course_name,
                course_dept,
                course_desc,
                course_room,
                total_enrollment,
                course_capacity,
                total_waitlist,
                waitlist_capacity,
                course_term,
                course_syllabus,
                course_dayandtime,
                is_waitlist
            }
        }
    }
`
// export { getAuthorsQuery, getBooksQuery };
export { login, profile, courses };