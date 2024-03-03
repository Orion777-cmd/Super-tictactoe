import "./signup.styles.scss";
import Input from "../input/input.component";
import Button from "../button/button.component";

const SignupComponent = () => {
    return (
        <div className="form sign-up">
            <h2>Create your Account</h2>
            <Input label="Name" type="text" name="userName" value="" onChange={() => {}} />
            <Input label="Email" type="email" name="email" value="" onChange={() => {}} />
            <Input label="Password" type="password" name="password" value="" onChange={() => {}} />
            <Button label="Sign Up" onClick={() => {}} />
        </div>
    )
}


export default SignupComponent;