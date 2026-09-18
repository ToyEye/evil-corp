import { dummyCompanies } from "./companies.dummy";
import { clientsSchema, type Client } from "./clients.schema";

const [, rapidRoute, peakStorage] = dummyCompanies;

const dummyClientsData: Client[] = [
  {
    id: "client-rr-1",
    name: "Marta Kovacs",
    phone: "+36 30 555 0188",
    email: "marta.kovacs@northgate.hu",
    addedAt: "2025-11-04",
    note: "Prefers morning drop-offs at the warehouse gate, not the office.",
    addresses: [
      { id: "addr-rr-1a", line: "Northgate Logistics, Dock 4, 1087 Budapest", lat: 47.4981, lng: 19.0817 },
      { id: "addr-rr-1b", line: "Kovacs Retail Hub, Vaci ut 45, 1134 Budapest", lat: 47.5132, lng: 19.0494 },
    ],
    companyId: rapidRoute.id,
    companyName: rapidRoute.name,
  },
  {
    id: "client-rr-2",
    name: "James Whitfield",
    phone: "+44 7700 900214",
    email: "james.whitfield@whitfieldgoods.co.uk",
    addedAt: "2026-02-18",
    note: "Call before arrival. Security needs the delivery number.",
    addresses: [
      { id: "addr-rr-2a", line: "Whitfield Goods, Unit 12 Saxon Park, Birmingham B6 7EU", lat: 52.4862, lng: -1.8904 },
    ],
    companyId: rapidRoute.id,
    companyName: rapidRoute.name,
  },
  {
    id: "client-rr-3",
    name: "Sofia Almeida",
    phone: "+351 912 440 118",
    email: "sofia.almeida@almeidafresh.pt",
    addedAt: "2026-06-01",
    note: "",
    addresses: [
      { id: "addr-rr-3a", line: "Almeida Fresh, Rua do Comercio 22, 1990 Lisbon", lat: 38.7223, lng: -9.1393 },
      { id: "addr-rr-3b", line: "Cold store B, Parque Tejo, 2685 Sacavem", lat: 38.7947, lng: -9.1053 },
    ],
    companyId: rapidRoute.id,
    companyName: rapidRoute.name,
  },
  {
    id: "client-ps-1",
    name: "Elena Rossi",
    phone: "+39 347 120 8844",
    email: "elena.rossi@rossistorage.it",
    addedAt: "2025-09-14",
    note: "Chilled zone access only with a Peak escort.",
    addresses: [
      { id: "addr-ps-1a", line: "Rossi Storage, Via Emilia 80, 40026 Imola", lat: 44.3592, lng: 11.7131 },
      { id: "addr-ps-1b", line: "Rossi Cross-dock, Via dell'Industria 3, 40127 Bologna", lat: 44.4949, lng: 11.3426 },
    ],
    companyId: peakStorage.id,
    companyName: peakStorage.name,
  },
  {
    id: "client-ps-2",
    name: "Tom Becker",
    phone: "+49 171 555 6621",
    email: "tom.becker@beckerparts.de",
    addedAt: "2026-01-22",
    note: "Leave pallets against the north wall unless a storekeeper is present.",
    addresses: [
      { id: "addr-ps-2a", line: "Becker Parts GmbH, Industriestrasse 16, 70565 Stuttgart", lat: 48.7758, lng: 9.1829 },
    ],
    companyId: peakStorage.id,
    companyName: peakStorage.name,
  },
];

export const dummyClients = clientsSchema.parse(dummyClientsData);
