import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory } from "react-router-dom";

const Register = () => {

  const history = useHistory();
  let userData = {
    loading:false,
    username: '',
    password: '',
    confirmPassword:''
  }
  const { enqueueSnackbar } = useSnackbar();


  const [formData, setFormData] = useState(userData);


  const userNameHandler = (event) => {
    setFormData((prevState) => {
      return { ...prevState, username: event.target.value };
  })
 
  }

  const passwordHandler = (event) => {
    setFormData((prevState) => { return { ...prevState, password: event.target.value }; }
    )
  }

  const confirmPasswordHandler = (event) => {
    setFormData((prevState) => {
      return { ...prevState, confirmPassword: event.target.value };
 
    }
    )
  }



  //function for validating response from the api
  const validateResponse = (response, errored) => {
 

    if (response.status !== 201 && !response.data.message) {
 
      enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON.',{variant:"warning" ,autoHideDuration:3000});
      return false;
    }
 
 
     if (!response.data.success  && response.data.message) {
 
      enqueueSnackbar(response.data.message,{variant:"warning" ,autoHideDuration:3000});
        return false;
 
    }
    return true;

  }


  //performing api call
  const performApiCall = async (formdata) => {
    //let take and response object
    let response = {};
    //and a const
    let errored = false;

    //update loading state to true
    setFormData((prevState) => {
      return { ...prevState, loading: true };
    });
    //make post request to axios
    try {

      response = await axios.post(`${config.endpoint}/auth/register`,{
           username: formData.username,
           password: formData.password

     })
      }catch (error) {
         errored = true;
         response = error.response;
    }

    //now again set loading state to false
    setFormData((prevState) => {
      return { ...prevState, loading: false };
    });

//checking response of api and return response
    if (validateResponse(response, errored)) {
      return response;
    }
 

  }

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  const validateInput = (data) => {

    //if username is empty field
    if (!data.username) {
      enqueueSnackbar('Username is a required field',{variant:"warning" ,autoHideDuration:3000});
      return false;
    }

    //if username length is less than 6 character

    if (data.username.length < 6) {
      enqueueSnackbar('Username must be at least 6 characters',{variant:"warning" ,autoHideDuration:3000});
      return false;
    }

    //username feild must be 32 characte
    if (data.username.length > 32) {
      enqueueSnackbar('Username must be at most 32 characters',{variant:"warning" ,autoHideDuration:3000});
      return false;
    }

    //password field is required
    if (!data.password) {
      enqueueSnackbar('Password is a required field',{variant:"warning" ,autoHideDuration:3000});
      return false;
    }
 
    //password length must be greater than 6 length
    if (data.password.length < 6) {
      enqueueSnackbar('Password must be at least 6 characters',{variant:"warning" ,autoHideDuration:3000});
      return false;
    }

    //password length must not be greater than 32
    if (data.password.length > 32) {
      enqueueSnackbar('Password must be at most 32 characters',{variant:"warning" ,autoHideDuration:3000});
      return false;
    }

    //password and confirm password must be equal
    if (data.password !== data.confirmPassword) {
      enqueueSnackbar('Passwords do not match',{variant:"warning" ,autoHideDuration:3000});
      return false;
    }

    return true;
  };

  const register = async (formData) => {

    if (validateInput(formData)) {

      //call perform api call function for post request
      let  response = await performApiCall(formData);

      //if response is true set username ,password and confirm password to null again
      if (response) {

        setFormData({
          username: '',
          password: '',
          confirmPassword: ''
        });
        //display registerd successfully meassage
        enqueueSnackbar('Registered successfully',{variant:"success" ,autoHideDuration:5000});
        history.push("/login");
 

      }
 
    }

  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={formData.username}
            onChange={userNameHandler}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={passwordHandler}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={confirmPasswordHandler}
          />
          {formData.loading ? <Box display="flex" flexDirection="row" justifyContent="center"> <CircularProgress /> </Box> : <Button className="button" variant="contained" onClick={()=>register(formData)}>
            Register Now
           </Button>}
 
          <p className="secondary-action">
            Already have an account?{" "}
             <Link className="link" to="/login">
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
