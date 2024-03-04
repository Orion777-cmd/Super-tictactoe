
import './App.css'
import {
  RouterProvider , 
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Link
} from "react-router-dom";

//pages
import GamePage from "./pages/gamepage/game.page";
import LoginSignupPage from "./pages/LoginSignup/login-signup.page";
import HomePage from "./pages/homepage/homepage";
import CreatePage from "./pages/createRoomPage/createroom.page";
import JoinPage from "./pages/joinRoomPage/joinroom.page";

// DO NOT FORGET TO ADD JOHN MAYERS SONG X 0 TO THE PROJECT

// add protection layout
//loading 
//modal 
function App() {
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<HomePage />} />
        <Route
          path="login-signup"
          element={<LoginSignupPage />}
          // action={}
        />

        <Route
          path="game/:roomId"
          element={<GamePage />}
          
        />

        <Route
          path="create-room"
          element={<CreatePage />}
          // action={}
        />

        <Route
          path="join-room"
          element={<JoinPage />}
          // action={}
        />

        {/* <Route element={<ProtectionLayout />}>
          <Route path="create" element={<CreatePage />} />
          <Route path="join" element={<JoinPage />}  action={}/>
          <Route path="join/:roomId" action={} element={<JoinPage/>} action/>
          <Route path="game/:roomId" element={<GamePage />} />
        </Route> */}

      </Route>
    )
  )
  return (
    <div className='app-container'>
      <RouterProvider router={router} />
    </div>
  )
  
}

export default App
