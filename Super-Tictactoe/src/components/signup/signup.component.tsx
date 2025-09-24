import "./signup.styles.css";
import Input from "../input/input.component";
import Button from "../button/button.component";
import { useState } from "react";
import { useAuth } from "../../state/authContext";

type SignupComponentProps = {
  toggleForm: () => void;
  showToast: (msg: string, status?: string) => void;
};
const SignupComponent: React.FC<SignupComponentProps> = ({
  toggleForm,
  showToast,
}) => {
  const { signup } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await signup(email, password, username);
      showToast(
        "Signup successful! Please check your email for confirmation and then login.",
        "success"
      );
      setTimeout(() => toggleForm(), 1200);
    } catch (err: any) {
      showToast(err?.message || "Signup failed", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="signup-container">
      <img src="./mainLogo.svg" alt="Main Logo" height={150} />
      <div className="input-outer-container">
        
        <Input
          label="Name"
          type="text"
          name="userName"
          value={username}
          onChange={handleUsername}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={handleEmail}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />
      </div>
      <div className="button-container">
        <Button
          label={loading ? "Signing up..." : "Sign Up"}
          onClick={handleSignup}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default SignupComponent;
