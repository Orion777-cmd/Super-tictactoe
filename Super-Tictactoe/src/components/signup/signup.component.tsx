import "./signup.styles.css";
import Input from "../input/input.component";
import Button from "../button/button.component";
import MainLogo from "../../../public/mainLogo.svg"

const SignupComponent = () => {
    return (
        <div className="signup-container">
            <img src={MainLogo} alt="Main Logo" height={150} />
            <h2>Create your Account</h2>
            <Input label="Name" type="text" name="userName" value="" onChange={() => {}} />
            <Input label="Email" type="email" name="email" value="" onChange={() => {}} />
            <Input label="Password" type="password" name="password" value="" onChange={() => {}} />
            <Button label="Sign Up" onClick={() => {}} />
        </div>
    )
}


export default SignupComponent;