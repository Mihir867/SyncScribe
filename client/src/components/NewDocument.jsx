// src/components/TwoBigCardsLayout.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {  useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";

function NewDocument() {
  const navigate = useNavigate();

  const titleStyle = {
    fontSize: '34px', // Apply font size 34
  };

  const listStyle = {
    fontSize: '23px',
    marginTop: '20px',
  };
  const buttonStyle = {
    fontSize: '20px',
    marginTop: '20px',
  };

  const createNewDocument = () => {
    const newDocumentId = uuidv4();

    navigate(`/editor/${newDocumentId}`);
  };

  const updateExistingDocument = () => {
    navigate('/update');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center h-100" style={{  marginTop:"40px"}}>
      <Card className="m-2" style={{ width: '50%' , backgroundColor: '#E1F0DA', height :'500px'}}>
        <Card.Body>
          <Card.Title style={titleStyle} >Create a New Document</Card.Title>
          <Card.Text >
          <ul style={listStyle}>
              <li>You can start by creating a new Document, just proceed with Start a new document.</li>
              <li>Upon creation, you will receive a unique document ID.</li>
              <li>Copy this ID and share it with others to grant access to the document.</li>
              <li>Proceed by clicking the "Create" button below.</li>
            </ul>
          </Card.Text>
          
            <Button variant="primary" style={buttonStyle} onClick={createNewDocument}>Create</Button>
        </Card.Body>
      </Card>

      <Card className="m-2" style={{ width: '50%' , backgroundColor: '#E1F0DA', height :'500px'}}>
        <Card.Body>
          <Card.Title style={titleStyle} > Update a existing document</Card.Title>
          <Card.Text >
          <ul style={listStyle}>
          <li>Retrieve the existing document using its unique document ID.</li>
              <li>Make the necessary updates or edits to the document content.</li>
              <li>Save the changes to update the document with the new information.</li>
              <li>Ensure that others with access to the document ID can view the updated content.</li>
            </ul>
          </Card.Text>
          <Button variant="primary" style={buttonStyle} onClick={updateExistingDocument}>Update</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default NewDocument;
