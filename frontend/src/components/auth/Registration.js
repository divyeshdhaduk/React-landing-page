import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as EmailValidator from "email-validator";
import { registerAction } from "../../store/action/authAction";
import { Tokens } from "../../constants";
import { createBrowserHistory } from "history";
import user from "../../assets/images/avatar.png";

const ImagePicker = (props) => {
  const { imagePreviewUrl, handleImageChange, imageTitle, avtarName, user } =
    props;
  let fileInput = React.createRef();

  return (
    <div className="col-12">
      <label className="form-label mb-4">
        {imageTitle ? imageTitle : "Change Logo"}:
      </label>
      <div className="d-block">
        <div className="image-picker">
          <div
            className={`image previewImage imagePreviewUrl ${
              imagePreviewUrl
                ? null
                : "d-flex justify-content-center align-items-center"
            }`}
          >
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl ? imagePreviewUrl : null}
                alt="img"
                width={75}
                height={100}
                className="image image-circle image-mini h-100"
              />
            ) : avtarName ? (
              <span className="custom-user-avatar w-100 h-100">
                {avtarName}
              </span>
            ) : (
              <img
                src={user ? user : null}
                alt="img"
                width={75}
                height={75}
                className="image image-circle image-mini h-100"
              />
            )}
            <span className="picker-edit rounded-circle text-gray-500 fs-small cursor-pointer">
              <input
                className="upload-file"
                title={`${imageTitle ? imageTitle : "Change logo"}`}
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={(e) => handleImageChange(e)}
                ref={fileInput}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Regitration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const history = createBrowserHistory();
  const { frontSetting } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem(Tokens.ADMIN);

  const [registerInputs, setRegisterInputs] = useState({
    image: "",
    first_name: "",
    last_name: "",
    store_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (token) {
      history.push(window.location.pathname);
    }
  }, []);

  const [errors, setErrors] = useState({
    image: "",
    first_name: "",
    last_name: "",
    store_name: "",
    email: "",
    password: "",
  });

  const handleValidation = () => {
    let errorss = {};
    let isValid = false;
    if (!registerInputs["first_name"]) {
      errorss["first_name"] = "Please enter valid first name";
    } else if (!registerInputs["last_name"]) {
      errorss["last_name"] = "Please enter valid last name";
    } else if (!registerInputs["store_name"]) {
      errorss["store_name"] = "Please enter valid store name";
    } else if (!EmailValidator.validate(registerInputs["email"])) {
      if (!registerInputs["email"]) {
        errorss["email"] = "Please enter valid email";
      } else {
        errorss["email"] = "Please enter valid email address";
      }
    } else if (!registerInputs["password"]) {
      errorss["password"] = "Please enter valid password";
    } else if (!registerInputs["confirm_password"]) {
      errorss["confirm_password"] = "Please enter valid confirm password";
    } else if (
      registerInputs["password"] !== registerInputs["confirm_password"]
    ) {
      errorss["confirm_password"] =
        "Password and confirm password should be same";
    } else {
      isValid = true;
    }
    setErrors(errorss);
    setLoading(false);
    return isValid;
  };

  const prepareFormData = (registerInputs) => {
    return {
      image: registerInputs.image,
      first_name: registerInputs.first_name,
      last_name: registerInputs.last_name,
      store_name: registerInputs.store_name,
      email: registerInputs.email,
      password: registerInputs.password,
      language_code: localStorage.getItem("updated_language"),
    };
  };

  const onLogin = async (e) => {
    e.preventDefault();
    const valid = handleValidation();
    if (valid) {
      setLoading(true);
      dispatch(
        registerAction(prepareFormData(registerInputs), navigate, setLoading)
      );
      const dataBlank = {
        image: "",
        first_name: "",
        last_name: "",
        store_name: "",
        email: "",
        password: "",
        confirm_password: "",
      };
      setRegisterInputs(dataBlank);
    }
  };

  const handleChange = (e) => {
    e.persist();
    setRegisterInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value,
    }));
    setErrors("");
  };

  const handleImageChanges = (e) => {
    e.preventDefault();
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "image/jpeg" || file.type === "image/png") {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          setRegisterInputs({ ...registerInputs, image: fileReader.result });
        };
        fileReader.readAsDataURL(file);
        setErrors("");
      }
    }
  };

  return (
    <div
      className="content d-flex flex-column flex-column-fluid"
      style={{ backgroundColor: "#FFF" }}
    >
      <div className="d-flex flex-wrap flex-column-fluid">
        <div className="d-flex flex-column flex-column-fluid align-items-center justify-content-center p-4">
          <div
            className="bg-theme-white rounded-15 width-540 shadow-lg  px-5 px-sm-7 py-10 mx-auto"
            style={{ marginTop: "5%" }}
          >
            <h1
              className="text-center mb-10"
              style={{ fontWeight: "600", color: "#6571FF" }}
            >
              Sign Up
            </h1>
            <form>
              <div
                className="row mb-3"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div className="col-md-3">
                  <ImagePicker
                    user={user}
                    isCreate={true}
                    imageTitle={"Store Logo"}
                    imagePreviewUrl={registerInputs.image}
                    handleImageChange={handleImageChanges}
                  />
                </div>

                <div className="col-md-9">
                  <div className="row">
                    <div className="col-md-6">
                      {/* <div className="col-md-12 mb-4"> */}
                      <label className="form-label">First Name:</label>
                      <span className="required" />
                      <input
                        placeholder="Enter First Name"
                        required
                        value={registerInputs.first_name}
                        className="form-control"
                        type="text"
                        name="first_name"
                        autoComplete="off"
                        onChange={(e) => handleChange(e)}
                      />
                      <span className="text-danger d-block fw-400 fs-small mt-2">
                        {errors["first_name"] ? errors["first_name"] : null}
                      </span>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Last Name:</label>
                      <span className="required" />
                      <input
                        placeholder="Enter Last Name"
                        required
                        value={registerInputs.last_name}
                        className="form-control"
                        type="text"
                        name="last_name"
                        autoComplete="off"
                        onChange={(e) => handleChange(e)}
                      />
                      <span className="text-danger d-block fw-400 fs-small mt-2">
                        {errors["last_name"] ? errors["last_name"] : null}
                      </span>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Store Name:</label>
                      <span className="required" />
                      <input
                        placeholder="Enter Store Name"
                        required
                        value={registerInputs.store_name}
                        className="form-control"
                        type="text"
                        name="store_name"
                        autoComplete="off"
                        onChange={(e) => handleChange(e)}
                      />
                      <span className="text-danger d-block fw-400 fs-small mt-2">
                        {errors["store_name"] ? errors["store_name"] : null}
                      </span>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email:</label>
                      <span className="required" />
                      <input
                        placeholder="Enter Email"
                        required
                        value={registerInputs.email}
                        className="form-control"
                        type="email"
                        name="email"
                        autoComplete="off"
                        onChange={(e) => handleChange(e)}
                      />
                      <span className="text-danger d-block fw-400 fs-small mt-2">
                        {errors["email"] ? errors["email"] : null}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">
                    Password:
                    <span className="required" />
                  </label>

                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="off"
                    required
                    value={registerInputs.password}
                    onChange={(e) => handleChange(e)}
                  />
                  <span className="text-danger d-block fw-400 fs-small mt-2">
                    {errors["password"] ? errors["password"] : null}
                  </span>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Confirm Password:
                    <span className="required" />
                  </label>

                  <input
                    className="form-control"
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm password"
                    autoComplete="off"
                    required
                    value={registerInputs.confirm_password}
                    onChange={(e) => handleChange(e)}
                  />
                  <span className="text-danger d-block fw-400 fs-small mt-2">
                    {errors["confirm_password"]
                      ? errors["confirm_password"]
                      : null}
                  </span>
                </div>
              </div>

              <div className="text-center mt-5">
                <button
                  type="submit"
                  className="btn w-100"
                  style={{ backgroundColor: "#6571FF", color: "#fff" }}
                  onClick={(e) => onLogin(e)}
                >
                  {loading ? (
                    <span className="d-block">Please wait...</span>
                  ) : (
                    <span>Register</span>
                  )}
                </button>
              </div>

              <div className="mt-5 text-center">
                Allready have an account?{" "}
                <Link style={{ color: "#6571FF" }} to="/login">
                  Sign In{" "}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regitration;
