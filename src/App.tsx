import "./App.css";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

//pages
import GamePage from "./pages/gamepage/game.page";
import LoginSignupPage from "./pages/LoginSignup/login-signup.page";
import HomePage from "./pages/homepage/homepage";
import CreatePage from "./pages/createRoomPage/createroom.page";
import JoinPage from "./pages/joinRoomPage/joinroom.page";
import Dashboard from "./pages/dashboard/dashboard.page";
import GameHistory from "./pages/gameHistory/gameHistory.page";
import Leaderboard from "./pages/leaderboard/leaderboard.page";
import Achievements from "./pages/achievements/achievements.page";

// Theme provider
import { ThemeProvider } from "./context/themeContext";

// Notification provider
import { NotificationProvider } from "./context/NotificationContext";
import NotificationSystem from "./components/NotificationSystem/NotificationSystem";

// Timeout provider
import { TimeoutProvider } from "./context/TimeoutContext";

// Connection and error handling
import ConnectionStatus from "./components/ConnectionStatus/ConnectionStatus";

// Error boundaries
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import GameErrorBoundary from "./components/GameErrorBoundary/GameErrorBoundary";

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
          element={
            <GameErrorBoundary>
              <GamePage />
            </GameErrorBoundary>
          }
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

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="game-history" element={<GameHistory />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="achievements" element={<Achievements />} />

        {/* Catch-all route for SPA routing */}
        <Route path="*" element={<HomePage />} />

        {/* <Route element={<ProtectionLayout />}>
          <Route path="create" element={<CreatePage />} />
          <Route path="join" element={<JoinPage />}  action={}/>
          <Route path="join/:roomId" action={} element={<JoinPage/>} action/>
          <Route path="game/:roomId" element={<GamePage />} />
        </Route> */}
      </Route>
    )
  );
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <TimeoutProvider>
            <div className="app-container">
              <ConnectionStatus />
              <RouterProvider router={router} />
              <NotificationSystem />
            </div>
          </TimeoutProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
