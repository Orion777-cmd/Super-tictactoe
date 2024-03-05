import "./login.styles.css";
import Input from "../input/input.component";
import Button from "../button/button.component";
import MainLogo from "../../../public/mainLogo.svg"

const LoginComponent = () => {
    return (
        <div className="login-container">
            <img src={MainLogo} alt="Main Logo" height={150} />
            <h2>Are you Read to play game?</h2>
            <Input label="Email" type="email" name="email" value="" onChange={() => {}} />
            <Input label="Password" type="password" name="password" value="" onChange={() => {}} />
       
            <div className="button-container">
                <Button label="Login" onClick={() => {}} />
            </div>
        </div>
    )
}


export default LoginComponent;