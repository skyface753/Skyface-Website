import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import config from "./credentials";
import { getCookieConsentValue } from "react-cookie-consent";
const UseGaTracker = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);
  const analyticEnabled = getCookieConsentValue();
  useEffect(() => {
    if (analyticEnabled === "true") {
      console.log("analytic enabled");
      if (!window.location.href.includes("localhost")) {
        ReactGA.initialize(config.GATrackingID);
      }
      // console.log("location", location);
      setInitialized(true);
    } else {
      console.log("analytic disabled");
    }
  }, []);

  useEffect(() => {
    if (initialized) {
      ReactGA.pageview(location.pathname + location.search);
    }
  }, [initialized, location]);
};

export default UseGaTracker;
