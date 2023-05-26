import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/AppContext";

const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};

const Register = () => {
  const [values, setValues] = useState(initialState);

  const { user, showAlert, isLoading, displayAlert, registerUser, loginUser } =
    useAppContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setValues((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleToggle = () => {
    setValues((prev) => {
      return {
        ...prev,
        isMember: !prev.isMember,
      };
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { email, password, name, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    const currentUser = { name, email, password };
    if (isMember) {
      loginUser(currentUser);
    } else {
      registerUser(currentUser);
    }
  };
  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={handleFormSubmit}>
        <Logo />
        <h3>{values.isMember ? "Log in" : "Register"}</h3>
        {showAlert && <Alert />}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            labelText="Name"
            value={values.name}
            onChange={handleChange}
          />
        )}
        <FormRow
          type="email"
          name="email"
          labelText="Email"
          value={values.email}
          onChange={handleChange}
        />
        <FormRow
          type="password"
          name="password"
          labelText="Password"
          value={values.password}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          submit
        </button>
        <p>
          {values.isMember ? "Not a member?" : "Already a member?"}
          <button type="button" className="member-btn" onClick={handleToggle}>
            {values.isMember ? "Register" : "Log in"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};
export default Register;
