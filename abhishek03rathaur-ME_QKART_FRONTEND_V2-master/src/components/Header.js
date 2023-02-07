import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack , Typography} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  
  const [username, setUserName] = useState('');

  useEffect(() => {
    setUserName(localStorage.getItem('username'));
  }, []);

  const claerStorage = () => {
    localStorage.clear();
    window.location.reload();
  }
  
 
  if (username) {
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>

        {children}
         
        <Stack direction="row" spacing={2}>

          <Avatar src="avatar.png" alt={username} />
          <Typography className="username-text" variant="h6">{username}</Typography>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button className="link" variant="text" onClick={claerStorage}>
              LOGOUT
            </Button>
          </Link>
                
        </Stack>

      </Box>
    )
  } else {
    return (

      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>

        {children}

        {
          hasHiddenAuthButtons ?
            
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button
                className="explore-button"
                startIcon={<ArrowBackIcon />}
                variant="text"
              >
                BACK TO EXPLORE

              </Button>
            </Link>

            : <Stack direction="row" spacing={2}>

              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button
                  className="link"
                  variant="text"
                >
                  LOGIN

                </Button>
              </Link>

              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button
                  className="button"

                  variant="contained"
                >
                  REGISTER
                  
                </Button>
              </Link>
            </Stack>
          
        }
      </Box>
    );

  }
};

export default Header;
