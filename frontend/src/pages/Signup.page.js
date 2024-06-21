import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/user.context";

const Signup = () => {
  // Destructure the emailPasswordSignup function from the useUser context
  const { emailPasswordSignup } = useUser();
  const navigate = useNavigate();

  // Define state to manage form inputs
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Regular expression for basic email pattern validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handler to update form state on input change
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  // Function to navigate to the login page after successful signup
  const redirectNow = () => {
    navigate('/Login');
  }

  // Handler for form submission
  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Check if passwords match
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Check if the email is valid
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      // Call the emailPasswordSignup function to create a new user
      const user = await emailPasswordSignup(form.email, form.password, form.username);
      if (user) {
        redirectNow(); // Redirect to login page on successful signup
      }
    } catch (error) {
      alert(error); // Display any errors that occur during signup
    }
  };

  // Render the signup form
  return (
    <form style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "auto" }}>
      <h1>Signup</h1>
      <TextField
        label="Username"
        type="text"
        variant="outlined"
        name="username"
        value={form.username}
        onInput={onFormInputChange}
        style={{ marginBottom: "1rem" }}
      />
      <TextField
        label="Email"
        type="email"
        variant="outlined"
        name="email"
        value={form.email}
        onInput={onFormInputChange}
        style={{ marginBottom: "1rem" }}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        name="password"
        value={form.password}
        onInput={onFormInputChange}
        style={{ marginBottom: "1rem" }}
      />
      <TextField
        label="Confirm Password"
        type="password"
        variant="outlined"
        name="confirmPassword"
        value={form.confirmPassword}
        onInput={onFormInputChange}
        style={{ marginBottom: "1rem" }}
      />
      <Button variant="contained" color="primary" onClick={onSubmit}>
        Signup
      </Button>
      <p style={{ color: '#d32f2f', fontSize: '0.8rem', marginTop: '20px', textAlign: 'center' }}>
        Do not enter your actual credentials. Enter fake but memorable credentials. For example, email: admin@gmail.com, username=admin, password=admin. The above example credentials are already in use.
      </p>
    </form>
  );
}

export default Signup;
