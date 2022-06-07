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
