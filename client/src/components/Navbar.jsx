import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logoImage from '../assets/download.png';
import { useState, useEffect } from 'react';

function Navbars() {
  const customStyle = {
    color: 'black', 
    display: 'flex',
    alignItems: 'center', 
  };

  const imageStyle = {
    marginRight: '15px',
    marginLeft:'-40px'
  };


  const buttonStyle = {
    // Add any additional styles you want for the button to match the text
    marginLeft: '0px', 
    marginBottom:'15px',
    padding: '0px 10px', // Adjust the padding as needed
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  };

  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = async () => {
    // Your login logic here, and update loggedInUser accordingly
    // For example, after a successful login:
    window.location.href = 'http://localhost:3200/api/user/signin';  };

    const checkIfUserLoggedIn = async () => {
      try {
        const response = await fetch('http://localhost:3200/api/user/checkLoggedIn', {
          credentials: 'include', // Include cookies in the request
        });
  
        if (response.ok) {
          const data = await response.json();
          setLoggedInUser(data.user);
        } else {
          setLoggedInUser(null);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      checkIfUserLoggedIn();
      const urlParams = new URLSearchParams(window.location.search);
      const usernameParam = urlParams.get('username');
  
      if (usernameParam) {
        setLoggedInUser({ name: usernameParam });
      }
    }, []);
    

  return (
    <Navbar bg="body-tertiary" variant="dark">
      <Container>
        <Navbar.Brand href="#home" style={customStyle}>
          <img
            alt="Logo"
            src={logoImage}
            width="30"
            height="30"
            className="d-inline-block align-top mr-2"
            style={imageStyle}
          />
          Syncscribe
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          {loggedInUser ? (
            // Content to display when the user is logged in
            <Navbar.Text style={customStyle}>
              <p>Hello: {loggedInUser.name}</p>
            </Navbar.Text>
          ) : (
            // Content to display when the user is not logged in
            <>
              <Navbar.Text style={customStyle}>
<p id="greeting" className="mt-3">Hello: Guest</p>

              </Navbar.Text>
              <button onClick={handleLogin} style={buttonStyle}>Login</button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbars;
