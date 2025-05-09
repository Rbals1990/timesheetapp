import "./App.css";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { RouterProvider } from "react-router/dom";

//components
import Contact from "./Components/Contact";
import DetailOverview from "./Components/DetailOverview";
import Home from "./Components/Home";
import HourRegistration from "./Components/HourRegistration";
import Login from "./Components/Login";
import NotFound from "./Components/NotFound";
import PasswordReset from "./Components/PasswordReset";
import Profile from "./Components/Profile";
import Register from "./Components/Register";
import WeeklyOverview from "./Components/WeeklyOverview";

//layout
import BasicLayout from "./Layout/BasicLayout";

//router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<BasicLayout />}>
      <Route index element={<Home />} />
      <Route path="contact" element={<Contact />} />
      <Route path="details" element={<DetailOverview />} />
      <Route path="newregistration" element={<HourRegistration />} />
      <Route path="passwordreset" element={<PasswordReset />} />
      <Route path="profile" element={<Profile />} />
      <Route path="register" element={<Register />} />
      <Route path="weeklyoverview" element={<WeeklyOverview />} />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
