import "./signup.styles.css";
import Input from "../input/input.component";
import Button from "../button/button.component";
import {useState} from "react";
import {useAuth} from "../../state/authContext";


const SignupComponent = () => {
    const {signup} = useAuth();
    console.log("signup: ", signup);
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    };

    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }
    
    const handleSignup = async () => {
        try{
            await signup(email, password, username)
        }catch(err: any){
            console.log(err)
        }
    }
    return (
        <div className="signup-container">
            <img src="./mainLogo.svg" alt="Main Logo" height={150} />
            <h2>Create your Account</h2>
            <Input label="Name" type="text" name="userName" value={username} onChange={handleUsername} />
            <Input label="Email" type="email" name="email" value={email} onChange={handleEmail} />
            <Input label="Password" type="password" name="password" value={password} onChange={handlePassword} />
            <div className="button-container">
                <Button label="Sign Up" onClick={handleSignup} />
            </div>
        </div>
    )
}


export default SignupComponent;