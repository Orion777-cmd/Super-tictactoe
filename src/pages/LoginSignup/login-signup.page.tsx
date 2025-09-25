import "./loginForm.css";
import { useState } from "react";
import SignupComponent from "../../components/signup/signup.component";
import LoginComponent from "../../components/login/login.component";
import ToastPopups from "../../components/toast/toast.component";

const LoginSignupForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastStatus, setToastStatus] = useState("success"); // 'success' | 'error' | 'warning' | 'neutral'

  const showToast = (msg: string, status: string = "success") => {
    setToastMsg(msg);
    setToastStatus(status);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="auth-page">
      <ToastPopups status={toastStatus} toast={toast}>
        {toastMsg}
      </ToastPopups>
      <div className={`cont ${isSignUp ? "s--signup" : ""}`}>
        <div className="login-container sign-in">
          <LoginComponent showToast={showToast} />
        </div>

        <div className="sub-cont">
          <div className="img">
            {!isSignUp ? (
              <div className="img__text m--up">
                <h3>Don't have an account? Please Sign up!</h3>
              </div>
            ) : (
              <div className="img__text m--in">
                <h3>If you already have an account, just Login.</h3>
              </div>
            )}
            <div className={`img__btn `} onClick={toggleForm}>
              <span className="m--up">Login</span>
              <span className="m--in">Sign Up</span>
            </div>
          </div>
          <div className={`signup-container signup`}>
            <SignupComponent toggleForm={toggleForm} showToast={showToast} />
          </div>
        </div>
      </div>
      <div className="mobile-auth">
        {isSignUp ? (
          <SignupComponent toggleForm={toggleForm} showToast={showToast} />
        ) : (
          <LoginComponent showToast={showToast} />
        )}
        <div
          className="button-container"
          style={{ width: "100%", textAlign: "center" }}
        >
          <button className="buttton" onClick={toggleForm}>
            {isSignUp ? "Have an account? Login" : "Need an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupForm;
