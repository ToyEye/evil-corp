import { useSelector } from "react-redux";

import { ClientDashboard } from "../components/Dashboard/ClientDashboard";
import { PlatformDashboard } from "../components/Dashboard/PlatformDashboard";
import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { isPlatformUser } from "../data/companies.dummy";
import { selectUser } from "../store/auth/auth.slice";
import { selectCompanies } from "../store/companies/companies.slice";

const Dashboard = () => {
  const user = useSelector(selectUser);
  const companies = useSelector(selectCompanies);
  const companyName =
    companies.find((company) => company.id === user?.companyId)?.name ??
    user?.companyName ??
    "";

  return (
    <PrivateLayout>
      {isPlatformUser(user) ? (
        <PlatformDashboard />
      ) : (
        <ClientDashboard
          companyId={user?.companyId ?? ""}
          companyName={companyName}
        />
      )}
    </PrivateLayout>
  );
};

export default Dashboard;
