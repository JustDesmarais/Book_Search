import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation userLogin($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
      token
      user {
        _id
        username
        bookCount
        savedBooks {
          authors
          bookId
          description
          image
          link
          title
        }
      }
    }
  }
`

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`

export const SAVE_BOOK = gql`
  mutation saveBook($bookId: String!, $description: String!, $title: String!, $authors: [String], $image: String, $link: String) {
    saveBook(bookId: $bookId, description: $description, title: $title, authors: $authors, image: $image, link: $link) {
      _id
      username
      email
      password
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
        _id
        username
        bookCount
        savedBooks {
          bookId
          authors
          description
          title
          image
          link
        }
      }
    }
`