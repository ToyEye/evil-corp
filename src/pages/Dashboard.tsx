import { useSelector } from "react-redux";

import { ClientDashboard } from "../components/Dashboard/ClientDashboard";
import { PlatformDashboard } from "../components/Dashboard/PlatformDashboard";
import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { isPlatformUser } from "../data/companies.dummy";
import { selectUser } from "../store/auth/auth.slice";

const Dashboard = () => {
  const user = useSelector(selectUser);

  return (
    <PrivateLayout>
      {isPlatformUser(user) ? (
        <PlatformDashboard />
      ) : (
        <ClientDashboard
          companyId={user?.companyId ?? ""}
          companyName={user?.companyName ?? ""}
        />
      )}
    </PrivateLayout>
  );
};

export default Dashboard;
