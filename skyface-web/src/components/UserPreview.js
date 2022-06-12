import "../styles/users-preview.css";

export const UserPreview = ({ user }) => {
  var username = user.username;
  var picture = user.picture;
  console.log(user);
  return (
    // <div className="user-preview">
    <a href={`/users/${user.username}`} className="user-preview">
      <img
        src={picture || require("../img/default-profile-pic.png")}
        alt="user"
        className="user-preview-picture"
      />
      <div className="user-preview-username">{username}</div>
    </a>
    // </div>
  );
};
