import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import Backdrop from '@mui/material/Backdrop';

const Login = () => {
  const navigate = useNavigate();
  const authorizedUsers = [
      "karlmarx9193@gmail.com",
      "brian.mina17@gmail.com",
      "lawstudiesteacher@gmail.com",
      // "504@gmail.com",
  ]
  const responseGoogle = (response) => {
    console.log(response);
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    localStorage.setItem('user', JSON.stringify(userObject));
    const { name, sub, picture, email } = userObject;
    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture,
      email: email,
    };
    console.log(doc);
    if (authorizedUsers.includes(email.toLowerCase())) {
      navigate('/', { replace: true });
    } else {
      alert("unauthorized access")
    }
    // client.createIfNotExists(doc).then(() => {
    //   navigate('/', { replace: true });
    // });
    // if (userObject)

  }

  return (
// TODO: put this back in
              // <GoogleOAuthProvider
              //     clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
              //     clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
              // >
      <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
          // onClick={handleClose}
      >
                <GoogleLogin
                    // render={(renderProps) => (
                    //     <button
                    //         type="button"
                    //         className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                    //         onClick={renderProps.onClick}
                    //         disabled={renderProps.disabled}
                    //     >
                    //       {/*<FcGoogle className="mr-4" /> */}
                    //       Sign in with google
                    //     </button>
                    // )}
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy="single_host_origin"
                        useOneTap
                    size={"large"}
                    shape={"circle"}
                />
      </Backdrop>
              // </GoogleOAuthProvider>
      

  )
}

export default Login