import { Outlet } from "react-router-dom";

import Wrapper from "../../assets/wrappers/SharedLayout";
import { BigSideBar, SmallSideBar, NavBar } from "../../components";

const SharedLayout = () => {
  return (
    <Wrapper>
      <main className="dashboard">
        <BigSideBar />
        <SmallSideBar />
        <div>
          <NavBar />

          <div className="dashboard-page">
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  );
};
export default SharedLayout;
