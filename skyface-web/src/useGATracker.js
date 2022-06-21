import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import config from "./credentials";
const UseGaTracker = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!window.location.href.includes("localhost")) {
      ReactGA.initialize(config.GATrackingID);
    }
    // console.log("location", location);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      ReactGA.pageview(location.pathname + location.search);
    }
  }, [initialized, location]);
};

export default UseGaTracker;
