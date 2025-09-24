import "./login.styles.css";
import Input from "../input/input.component";
import Button from "../button/button.component";
import { useAuth } from "../../state/authContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginComponentProps {
  showToast: (msg: string, status?: string) => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ showToast }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      showToast("Login successful!", "success");
      setTimeout(() => navigate("/"), 1000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <img src="./mainLogo.svg" alt="Main Logo" height={150} />
      <div className="input-outer-container">
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
          label={loading ? "Logging in..." : "Login"}
          onClick={handleLogin}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default LoginComponent;
