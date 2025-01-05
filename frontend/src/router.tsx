import {createBrowserRouter} from "react-router-dom";
import LoginPage from "./LoginPage.tsx";
import ConcertsList from "./ConcertsList.tsx";
import ConcertDetailsPage from "./ConcertDetailsPage.tsx";

export const router = createBrowserRouter([{path: "/login", Component: LoginPage}, {path: "/", Component: ConcertsList}, {path:"/concerts/:concertId", Component: ConcertDetailsPage}])