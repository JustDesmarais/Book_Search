import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

//import { getMe, deleteBook } from '../utils/API';
//import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { REMOVE_BOOK } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const [ removeBook, { error }] = useMutation(REMOVE_BOOK);
  const { loading, data } = useQuery(QUERY_ME);

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;
  
  useEffect(() => {
    const getUserData = async() => {
      try {
        if (!data) {
          return;
        }
        setUserData(data.me);
      } catch(err) {
        console.log(err);
      }
    };
    getUserData();
  }, [data]);
  /**useEffect(() => {
    const getUserData = async () => {
      try {
        //const token = Auth.loggedIn() ? Auth.getToken() : null;

        //if (!token) {
        //  return false;
        //}

        //const response = await getMe(token);

        //if (!response.ok) {
        //  throw new Error('something went wrong!');
        //}
        if (!data) {
          return;
        }

        setUserData(data.me);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [data, userDataLength]);*/

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    //const token = Auth.loggedIn() ? Auth.getToken() : null;

    //if (!token) {
    //  return false;
    //}
    console.log(bookId);
    try {
      const { data } = await removeBook({
        variables: { bookId: bookId }
      });

      //if (!response.ok) {
      //  throw new Error('something went wrong!');
      //}

      //const updatedUser = await response.json();
      await setUserData({ ...userData, bookCount: data.removeBook.bookCount, savedBooks: data.removeBook.savedBooks });
      // upon success, remove book's id from localStorage
      await removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid="true" className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
