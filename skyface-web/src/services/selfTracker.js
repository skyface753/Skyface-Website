import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import config from "../credentials";
import apiService from "./api-service";
import browserSignature from "browser-signature";
import { AuthContext } from "../App";

import { getCookieConsentValue } from "react-cookie-consent";

//console.log();

export const UseSelfTracker = () => {
  const { state, dispatch } = useContext(AuthContext);
  const location = useLocation();
  const signature = browserSignature();
  const analyticEnabled = getCookieConsentValue();
  useEffect(() => {
    if (analyticEnabled !== "false") {
      //console.log("analytic enabled");
      apiService(
        "api/self-tracker",
        {
          USER: state.user ? state.user._id : null,
          TOKEN: config.SELF_TRACKING_TOKEN,
          LOCATION: {
            HOST: window.location.host,
            PATH: location.pathname + location.search,
            URL: window.location.href,
          },

          SIGNATURE: signature,
        },
        true
      );
    } else {
      //console.log("analytic disabled");
    }
  }, [location]);
};
