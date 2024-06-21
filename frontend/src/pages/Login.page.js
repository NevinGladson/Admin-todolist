import { Button, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser, UserContext } from "../contexts/user.context";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // User-management context to get & set the user details here
  //  const { user, fetchUser, emailPasswordLogin } = useContext(UserContext);
  const { user, fetchUser, emailPasswordLogin } = useUser();
  // React's "useState" hook keeps track of the form values.
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  // This function will be called whenever the user edits the form.
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  // This function will redirect the user to the main admin page once the authentication is done.
  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/");
  }

  // Loading user to keep them logged in during page refreshes
  const loadUser = async () => {
    if (!user) {
      const fetchedUser = await fetchUser();
      if (fetchedUser) {
        // Redirecting them once fetched.
        redirectNow();
      }
    }
  }

  // This useEffect will run only once when the component is mounted and checks if user is logged in or not
  useEffect(() => {
    loadUser(); 
  }, []);

  // This function gets fired when the user clicks on the "Login" button.
  const onSubmit = async (event) => {
    try {
      // Passing user details to our emailPasswordLogin function imported from our realm/authentication.js to validate the user credentials
      const user = await emailPasswordLogin(form.email, form.password);
      if (user) {
        redirectNow();
      }
    } catch (error) {
      if (error.statusCode === 401) {
        alert("Invalid username/password. Try again!");
      } else {
        alert(error);
      }

    }
  };

  return <form style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "auto" }}>
    <h1>Login</h1>
    <TextField
      label="Username or Email"
      type="email"
      variant="outlined"
      name="email"
      value={form.email}
      onChange={onFormInputChange}
      style={{ marginBottom: "1rem" }} />
    <TextField
      label="Password"
      type="password"
      variant="outlined"
      name="password"
      value={form.password}
      onChange={onFormInputChange}
      style={{ marginBottom: "1rem" }} />
    <Button variant="contained" color="primary" onClick={onSubmit}>
      Login
    </Button>
    <p style={{ color: '#d32f2f', fontSize: '0.8rem', marginTop: '20px', textAlign: 'center' }}>
      *Disclaimer: You can use the following credentials <br /> username: admin, password=admin. Creating new admins is only allowed post Login
    </p>

  </form>
}

export default Login;