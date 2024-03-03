
import './LoginForm.css';
import {useState} from 'react';
import SignupComponent from "../../components/signup/signup.component";
import LoginComponent from "../../components/login/login.component";

const LoginSignupForm = () => {

    const [isSignUp, setIsSignUp] = useState(true);
    const toggleForm = () =>  {
        console.log("isSignup: ", isSignUp);
        setIsSignUp(!isSignUp);
    }

    
        return (
            <div>
                <div className="cont">
                    <div className="login-container sign-in">
                        <LoginComponent />
                    </div>
                    
                    <div className="sub-cont">
                        <div className="img">
                            {
                            isSignUp &&  
                            <div className="img__text m--up">
                                <h3>Don't have an account? Please Sign up!</h3>
                            </div>}
                            {
                            !isSignUp &&
                                <div className="img__text m--in">
                                <h3>If you already have an account, just Login.</h3>
                            </div>}
                            <div className={`img__btn ${isSignUp? "s--signup": ""}`} >
                                <span className="m--up" onClick={toggleForm}>Sign Up</span>
                                {!isSignUp &&<span className="m--in" onClick={toggleForm}>Login</span>}
                            </div>
                        </div>
                        <div className={`signup-container signup`}>
                            <SignupComponent />
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    
}

export default LoginSignupForm;
