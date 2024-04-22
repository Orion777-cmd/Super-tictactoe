
import './loginForm.css';
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
                <div className={`cont ${isSignUp? "s--signup": ""}`}>
                    <div className="login-container sign-in">
                        <LoginComponent />
                    </div>
                    
                    <div className="sub-cont">
                        <div className="img">
                            {
                            !isSignUp ?  
                            <div className="img__text m--up">
                                <h3>Don't have an account? Please Sign up!</h3>
                            </div>
                            
                            :
                                <div className="img__text m--in">
                                <h3>If you already have an account, just Login.</h3>
                            </div>}
                            <div className={`img__btn `} onClick={toggleForm} >
                                <span className="m--up" >Login</span> 
                                <span className="m--in" >Sign Up</span>
                            </div>
                        </div>
                        <div className={`signup-container signup`}>
                            <SignupComponent toggleForm={toggleForm}/>
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    
}

export default LoginSignupForm;
