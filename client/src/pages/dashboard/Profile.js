import { useState } from "react";
import { FormRow, Alert } from "../../components";
import { useAppContext } from "../../context/AppContext";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

const Profile = () => {
  const { user, showAlert, displayAlert, updateUser, isLoading } =
    useAppContext();

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [location, setLocation] = useState(user?.location);
  const [lastName, setLastName] = useState(user?.lastName);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !lastName || !location) {
      displayAlert();
      return;
    }
    updateUser({ name, lastName, email, location });
  };

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>Profile</h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            type={"text"}
            name={"name"}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <FormRow
            type={"text"}
            name={"lastName"}
            labelText={"last name"}
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
          <FormRow
            type={"email"}
            name={"email"}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <FormRow
            type={"location"}
            name={"location"}
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          />
          <button className="btn btn-block" type="submit" disabled={isLoading}>
            {isLoading ? "Please wait..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};
export default Profile;
