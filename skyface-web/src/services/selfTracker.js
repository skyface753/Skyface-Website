import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import config from "../credentials";
import apiService from "./api-service";
import browserSignature from "browser-signature";
import { AuthContext } from "../App";

export const UseSelfTracker = () => {
  const { state, dispatch } = useContext(AuthContext);
  const location = useLocation();
  const signature = browserSignature();
  useEffect(() => {
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
  }, [location]);
};
