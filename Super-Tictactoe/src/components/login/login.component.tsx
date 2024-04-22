import "./login.styles.css";
import Input from "../input/input.component";
import Button from "../button/button.component";
import {useAuth} from "../../state/authContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [email, setEmail]  = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const handleEmail  = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleLogin = async () => {
        try {
          await login(email, password);
          navigate('/')
         
        } catch (error) {
        
          console.error('Login error:', error);
        }
      };
    return (
        <div className="login-container">
            <img src="./mainLogo.svg" alt="Main Logo" height={150} />
            <h2>Are you Read to play game?</h2>
            <Input label="Email" type="email" name="email" value={email} onChange={handleEmail} />
            <Input label="Password" type="password" name="password" value={password} onChange={handlePassword} />
       
            <div className="button-container">
                <Button label="Login" onClick={handleLogin} />
            </div>
        </div>
    )
}


export default LoginComponent;