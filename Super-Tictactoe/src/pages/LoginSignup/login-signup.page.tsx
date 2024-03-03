
import './LoginForm.css';
import {useState} from 'react';
import SignupComponent from "../../components/signup/signup.component";
import LoginComponent from "../../components/login/login.component";

const LoginSignupForm = () => {

    const [isSignUp, setIsSignUp] = useState(false);
    const toggleForm = () =>  {
        setIsSignUp(!isSignUp);
    }

    
        return (
            <div>
                <div className="cont">
                    <LoginComponent />
                    <div className="sub-cont">
                        <div className="img">
                            <div className="img__text m--up">
                                <h3>Don't have an account? Please Sign up!</h3>
                            </div>
                            <div className="img__text m--in">
                                <h3>If you already have an account, just sign in.</h3>
                            </div>
                            <div className="img__btn" onClick={toggleForm}>
                                <span className="m--up">Sign Up</span>
                                <span className="m--in">Sign In</span>
                            </div>
                        </div>
                        <SignupComponent />
                    </div>
                </div>
            </div>
        );
    
}

export default LoginSignupForm;
