import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { StatsContainer, Loading } from "../../components";

const Stats = () => {
  const { showStats, isLoading } = useAppContext();
  useEffect(() => {
    showStats();
  }, []);

  if (isLoading) {
    return <Loading center />;
  }

  return (
    <>
      <StatsContainer />
    </>
  );
};

export default Stats;
