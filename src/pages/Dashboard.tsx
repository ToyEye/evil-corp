import { useSelector } from "react-redux";

import { ClientDashboard } from "../components/Dashboard/ClientDashboard";
import { PlatformDashboard } from "../components/Dashboard/PlatformDashboard";
import { PrivateLayout } from "../components/PrivateLayout/PrivateLayout";
import { useCompaniesQuery } from "../hooks";
import { selectUser } from "../store/auth/auth.slice";
import { isPlatformUser } from "../utils/companyAccess";

const Dashboard = () => {
  const user = useSelector(selectUser);
  const { data: companiesData } = useCompaniesQuery();
  const companies = companiesData ?? [];
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
