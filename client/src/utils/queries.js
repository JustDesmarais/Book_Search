import { gql } from '@apollo/client';

export const QUERY_USER = gql`
 query user($userId: ID!) {
    user(userId: $userId) {
      _id
      username
      bookCount
      savedBooks {
        bookId
        authors
        description
        image
        link
        title
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      bookCount
      savedBooks {
        bookId
        authors
        description
        image
        link
        title
      }
    }
  }
`;