
import './App.css'
import BigXO from "./components/BigXO/bigXo.component";
import GamePage from "./pages/gamepage/game.page";
import LoginSignupPage from "./pages/LoginSignup/login-signup.page";
// import XO from "./components/XO/xo.component";


// DO NOT FORGET TO ADD JOHN MAYERS SONG X 0 TO THE PROJECT

// add protection layout
//loading 
//modal 
function App() {
  
  return (
    <div className="container">
      <LoginSignupPage />
    </div>
  )
}

export default App
