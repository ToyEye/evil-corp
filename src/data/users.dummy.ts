import { usersSchema, type User } from "./users.schema";

export const dummyCompanies = [
  { id: "company-1", name: "Vertex Capital" },
  { id: "company-2", name: "RapidRoute Logistics" },
  { id: "company-3", name: "Peak Storage" },
] as const;

const [vertexCapital, rapidRoute, peakStorage] = dummyCompanies;

const dummyUsersData: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@vertexcapital.com",
    role: "admin",
    companyName: vertexCapital.name,
    companyId: vertexCapital.id,
  },
  {
    id: "2",
    name: "Amelia Grant",
    email: "amelia.grant@vertexcapital.com",
    role: "SEO",
    companyName: vertexCapital.name,
    companyId: vertexCapital.id,
  },
  {
    id: "3",
    name: "Noah Ellison",
    email: "noah.ellison@vertexcapital.com",
    role: "Accountant",
    companyName: vertexCapital.name,
    companyId: vertexCapital.id,
  },
  {
    id: "4",
    name: "Chloe Hart",
    email: "chloe.hart@vertexcapital.com",
    role: "Staff",
    companyName: vertexCapital.name,
    companyId: vertexCapital.id,
  },
  {
    id: "5",
    name: "Liam Brooks",
    email: "liam.brooks@rapidroute.com",
    role: "driver",
    companyName: rapidRoute.name,
    companyId: rapidRoute.id,
  },
  {
    id: "6",
    name: "Sofia Alvarez",
    email: "sofia.alvarez@rapidroute.com",
    role: "Storekeeper",
    companyName: rapidRoute.name,
    companyId: rapidRoute.id,
  },
  {
    id: "7",
    name: "Ethan Park",
    email: "ethan.park@rapidroute.com",
    role: "SEO",
    companyName: rapidRoute.name,
    companyId: rapidRoute.id,
  },
  {
    id: "8",
    name: "Maya Singh",
    email: "maya.singh@rapidroute.com",
    role: "Accountant",
    companyName: rapidRoute.name,
    companyId: rapidRoute.id,
  },
  {
    id: "9",
    name: "Owen Blake",
    email: "owen.blake@rapidroute.com",
    role: "Staff",
    companyName: rapidRoute.name,
    companyId: rapidRoute.id,
  },
  {
    id: "10",
    name: "Yuki Tanaka",
    email: "yuki.tanaka@peakstorage.com",
    role: "driver",
    companyName: peakStorage.name,
    companyId: peakStorage.id,
  },
  {
    id: "11",
    name: "Nina Kowalski",
    email: "nina.kowalski@peakstorage.com",
    role: "Storekeeper",
    companyName: peakStorage.name,
    companyId: peakStorage.id,
  },
  {
    id: "12",
    name: "Claire Dubois",
    email: "claire.dubois@peakstorage.com",
    role: "SEO",
    companyName: peakStorage.name,
    companyId: peakStorage.id,
  },
  {
    id: "13",
    name: "Robert Klein",
    email: "robert.klein@peakstorage.com",
    role: "Accountant",
    companyName: peakStorage.name,
    companyId: peakStorage.id,
  },
  {
    id: "14",
    name: "Priya Nair",
    email: "priya.nair@peakstorage.com",
    role: "Staff",
    companyName: peakStorage.name,
    companyId: peakStorage.id,
  },
];

export const dummyUsers = usersSchema.parse(dummyUsersData);

export const getCompanyNameForUser = (user: {
  id?: string;
  email?: string;
  companyName?: string;
}) => {
  if (user.companyName) {
    return user.companyName;
  }

  return (
    dummyUsers.find((dummy) => dummy.id === user.id || dummy.email === user.email)
      ?.companyName ?? dummyUsers[0].companyName
  );
};
