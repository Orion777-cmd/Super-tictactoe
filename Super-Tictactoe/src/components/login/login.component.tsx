import "./login.styles.css";
import Input from "../input/input.component";
import Button from "../button/button.component";

const LoginComponent = () => {
    return (
        <div className="login-container">
            <h2>Welcome</h2>
            <Input label="Email" type="email" name="email" value="" onChange={() => {}} />
            <Input label="Password" type="password" name="password" value="" onChange={() => {}} />
            <p className="forgot-pass">Forgot password?</p>
            <Button label="Login" onClick={() => {}} />
        </div>
    )
}


export default LoginComponent;