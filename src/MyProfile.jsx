import "./MyProfile.css";
import Profile from "./Profile.jpg?url";

const MyProfile = () => {
  return (
    <div className="Background">
      <div className="MainMyProfile">
        <div className="Gradient"></div>
        <img src={Profile} alt="" className="MyProfileImage" />
        <h1 className="NameId">Saeed_rbh</h1>
        <h1 className="MyDescription">
          Be Creative And Keep Your Circle Small
        </h1>
        <div className="MyFollowersFollowings">
          <div className="MyFollow">
            <h1>followed Me</h1>
            <h2>259</h2>
          </div>
          <div className="MyFollow">
            <h1>I am following</h1>
            <h2>259</h2>
          </div>
        </div>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.instagram.com/saeed_rbh"
        >
          {" "}
          Instagram Page
        </a>
      </div>
    </div>
  );
};

export default MyProfile;
