import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as EmailValidator from "email-validator";
import { loginAction } from "../../store/action/authAction";
import { Tokens } from "../../constants";
import { createBrowserHistory } from "history";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const history = createBrowserHistory();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem(Tokens.ADMIN);

  const [loginInputs, setLoginInputs] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (token) {
      history.push(window.location.pathname);
    }
  }, []);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleValidation = () => {
    let errorss = {};
    let isValid = false;
    if (!EmailValidator.validate(loginInputs["email"])) {
      if (!loginInputs["email"]) {
        errorss["email"] = "Email is required";
      } else {
        errorss["email"] = "Enter valid email address";
      }
    } else if (!loginInputs["password"]) {
      errorss["password"] = "Password is required";
    } else {
      isValid = true;
    }
    setErrors(errorss);
    setLoading(false);
    return isValid;
  };

  const prepareFormData = (loginInputs) => {
    return {
      email: loginInputs.email,
      password: loginInputs.password,
      language_code: localStorage.getItem("updated_language"),
    };
  };

  const onLogin = async (e) => {
    e.preventDefault();
    const valid = handleValidation();
    if (valid) {
      setLoading(true);
      dispatch(loginAction(prepareFormData(loginInputs), navigate, setLoading));
      const dataBlank = {
        email: "",
        password: "",
      };
      setLoginInputs(dataBlank);
    }
  };

  const handleChange = (e) => {
    e.persist();
    setLoginInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value,
    }));
    setErrors("");
  };

  return (
    <div
      className="content d-flex flex-column flex-column-fluid"
      style={{ backgroundColor: "#FFF" }}
    >
      <div className="d-flex flex-wrap flex-column-fluid">
        <div className="d-flex flex-column flex-column-fluid align-items-center justify-content-center p-4">
          <div className="bg-theme-white rounded-15 shadow-lg width-540 px-5 px-sm-7 py-10 mx-auto">
            <h1
              className="text-center mb-7"
              style={{ fontWeight: "600", color: "#6571FF" }}
            >
              Login
            </h1>
            <form>
              <div className="mb-sm-7 mb-4">
                <label className="form-label">Email</label>
                <span className="required" />
                <input
                  required
                  value={loginInputs.email}
                  className="form-control"
                  type="text"
                  name="email"
                  autoComplete="off"
                  placeholder="Email"
                  onChange={(e) => handleChange(e)}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                  {errors["email"] ? errors["email"] : null}
                </span>
              </div>

              <div className="mb-sm-7 mb-4">
                <label className="form-label">Password</label>
                <span className="required" />
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="off"
                  required
                  value={loginInputs.password}
                  onChange={(e) => handleChange(e)}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                  {errors["password"] ? errors["password"] : null}
                </span>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="btn w-100"
                  style={{ backgroundColor: "#6571FF", color: "#fff" }}
                  onClick={(e) => onLogin(e)}
                >
                  {loading ? (
                    <span className="d-block">Loading...</span>
                  ) : (
                    <span>Login</span>
                  )}
                </button>
              </div>
              <div className="mt-5 text-center">
                Don't have an account?{" "}
                <Link style={{ color: "#6571FF" }} to="/registration">
                  Sign Up{" "}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
