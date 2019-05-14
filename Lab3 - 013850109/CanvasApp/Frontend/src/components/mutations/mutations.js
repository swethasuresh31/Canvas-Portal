
import { gql } from 'apollo-boost';

// const addBookMutation = gql`
//     mutation AddBook($name: String, $genre: String, $authorId: ID){
//         addBook(name: $name, genre: $genre, authorId: $authorId){
//             name
//             id
//         }
//     }
// `;

const signup = gql`
mutation Signup($firstName: String, $lastName: String, $emailId: String, $password: String, $role: String){
    signup(firstName: $firstName, lastName: $lastName, emailId: $emailId, password: $password, role: $role){
        success  
        duplicateUser      
    }
}`

const updateProfile = gql`
    mutation updateProfile($username: String $first_name: String, $last_name: String, $phone_number: String, $about_me: String, $country: String, $city: String, $gender:String, $school: String, $hometown: String, $language: String, $company: String){
        updateProfile(username:$username,first_name:$first_name,last_name:$last_name, phone_number:$phone_number, about_me: $about_me, country:$country, city: $city, gender: $gender, school:$school, hometown: $hometown, language: $language, company: $company){
            success
        }
    }
`

const createCourse = gql`
    mutation createCourse(
        $username: String,
        $course_instructor: String,
          $course_dept_code: String,
          $course_id: Int,
            $course_name: String,
            $course_dept: String,
              $course_desc: String,
              $course_room:String,
                $course_capacity: Int,
                $waitlist_capacity: Int,
                  $course_term: String,
                  $course_syllabus: String,
                    $course_dayandtime: String){
      createCourse(
        username: $username,
        course_instructor: $course_instructor,
        course_dept_code: $course_dept_code,
        course_id: $course_id,
        course_name: $course_name,
        course_dept: $course_dept,
        course_desc: $course_desc,
        course_room: $course_room,
        course_capacity: $course_capacity,
        waitlist_capacity: $waitlist_capacity,
        course_term: $course_term,
        course_syllabus: $course_syllabus,
        course_dayandtime: $course_dayandtime
      ){
            success
        }
    }
`

export { signup, updateProfile, createCourse };