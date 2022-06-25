import "../styles/loader.css";

export const CombineLoader = () => {
  return (
    <div className="loader-container">
      <div className="combine">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export const MeetupLoader = () => {
  return (
    <div className="loader-container" style={{ marginTop: "8%" }}>
      <div className="meetup">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export const CloudLoader = () => {
  return (
    <div class="showbox">
      <div class="loader">
        <div class="cloud"></div>
        <div class="cloud"></div>
        <div class="cloud"></div>
        <div class="cloud"></div>
        <div class="cloud"></div>
      </div>
    </div>
  );
};

export const CloudsRainLoader = () => {
  return (
    <div>
      <ul class="centered-clouds">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div class="centered-clouds-rain">
        <span>loading</span>
        <span>loading</span>
        <span>loading</span>
        <span>loading</span>
        <span>loading</span>
        <span>loading</span>
      </div>
      <div class="centered-clouds-rain"></div>
    </div>
  );
};

export const SkyCloudLoader = () => {
  return (
    <div className="cloud-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="7.87722 9.61948 33.01 16.88"
      >
        <path
          d="M 12 26 H 37 C 42 26 41 20 37 20 C 38 18 37 15 33 16 C 32 8 15 8 14 17 C 8 16 6 25 12 26"
          className="cloud-back"
        />
        <path
          d="M 12 26 H 37 C 42 26 41 20 37 20 C 38 18 37 15 33 16 C 32 8 15 8 14 17 C 8 16 6 25 12 26"
          className="cloud-front"
        />
      </svg>
    </div>
  );
};
