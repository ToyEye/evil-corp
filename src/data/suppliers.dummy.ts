import { dummyCompanies } from "./companies.dummy";
import { suppliersSchema, type Supplier, type SupplierType } from "./suppliers.schema";

const [, rapidRoute, peakStorage] = dummyCompanies;

type SupplierDraft = {
  name: string;
  type: SupplierType;
  addedAt: string;
  description: string;
  doesNotSupply: string;
  notes: string;
};

const toCompanySuppliers = (
  company: (typeof dummyCompanies)[number],
  drafts: SupplierDraft[],
) =>
  drafts.map((draft, index) => ({
    id: `${company.id}-supplier-${index + 1}`,
    ...draft,
    companyId: company.id,
    companyName: company.name,
  }));

const rapidRouteSuppliers: SupplierDraft[] = [
  {
    name: "Nordic Pallet Works",
    type: "Manufacturer",
    addedAt: "2022-03-14",
    description: "Primary source of euro pallets and timber dunnage for outbound lanes.",
    doesNotSupply: "Plastic pallets, temperature-controlled containers",
    notes: "Lead time 5 days. Prefers full-truck orders on Tuesdays.",
  },
  {
    name: "Apex Stretch Films",
    type: "Distributor",
    addedAt: "2021-11-02",
    description: "Hand and machine stretch film for RapidRoute wrapping lines.",
    doesNotSupply: "Shrink hoods, paper wrapping",
    notes: "Volume rebate after 40 rolls per month.",
  },
  {
    name: "Harbor Label Co",
    type: "Manufacturer",
    addedAt: "2023-01-20",
    description: "Thermal shipping labels and location barcodes.",
    doesNotSupply: "RFID tags, metal asset plates",
    notes: "Can print overnight for urgent waves.",
  },
  {
    name: "Summit Safety Gear",
    type: "Wholesaler",
    addedAt: "2020-08-09",
    description: "PPE for dock, yard, and warehouse teams.",
    doesNotSupply: "Fire suppression systems, first-aid training",
    notes: "Size XL gloves often backordered in winter.",
  },
  {
    name: "VoltScan Devices",
    type: "Distributor",
    addedAt: "2022-06-30",
    description: "Handheld scanners, batteries, and charging docks.",
    doesNotSupply: "Printers, warehouse management software",
    notes: "On-site swap for failed units within 24 hours.",
  },
  {
    name: "Ridgeway Hydraulics",
    type: "Service",
    addedAt: "2019-04-18",
    description: "Maintenance and spare parts for pallet jacks and lifts.",
    doesNotSupply: "Electric forklifts, charging stations",
    notes: "Quarterly inspection contract in place.",
  },
  {
    name: "Coastline Cartons",
    type: "Manufacturer",
    addedAt: "2021-02-11",
    description: "Double-wall cartons and archive boxes for mixed SKUs.",
    doesNotSupply: "Custom printed retail packaging",
    notes: "Minimum order 200 units per size.",
  },
  {
    name: "BlueLane Carriers",
    type: "Carrier",
    addedAt: "2018-09-05",
    description: "Line-haul partner for inbound supplier collections.",
    doesNotSupply: "Last-mile parcels, air freight",
    notes: "Cutoff 16:00 for next-day dock arrival.",
  },
  {
    name: "Kite Strapping Ltd",
    type: "Distributor",
    addedAt: "2023-07-12",
    description: "PP strapping, buckles, and corner protectors.",
    doesNotSupply: "Steel banding, automated strappers",
    notes: "Holds buffer stock in their local depot.",
  },
  {
    name: "Oak & Nylon Wheels",
    type: "Manufacturer",
    addedAt: "2020-12-01",
    description: "Replacement wheels and tillers for warehouse equipment.",
    doesNotSupply: "Complete pallet jacks, batteries",
    notes: "Compatible with most 2.5t jacks in the fleet.",
  },
  {
    name: "Frostline Consumables",
    type: "Wholesaler",
    addedAt: "2024-02-27",
    description: "Tape, markers, cable ties, and other packing consumables.",
    doesNotSupply: "Hazardous chemicals, food-grade liners",
    notes: "Weekly van round every Thursday morning.",
  },
  {
    name: "DockGuard Seals",
    type: "Manufacturer",
    addedAt: "2022-10-08",
    description: "Numbered security seals for trailer doors.",
    doesNotSupply: "Electronic locks, GPS trackers",
    notes: "Serial ranges reserved per depot.",
  },
  {
    name: "Helix Cargo Nets",
    type: "Distributor",
    addedAt: "2021-05-19",
    description: "Load-securing nets and anti-slip mats for vans.",
    doesNotSupply: "Trailer curtains, load bars",
    notes: "Repair service available for damaged nets.",
  },
  {
    name: "Pinebox Dunnage",
    type: "Wholesaler",
    addedAt: "2023-09-03",
    description: "Void fill, bubble wrap, and edge board for fragile freight.",
    doesNotSupply: "Crate building, custom foam inserts",
    notes: "Can stage seasonal peaks two weeks ahead.",
  },
];

const peakStorageSuppliers: SupplierDraft[] = [
  {
    name: "Alpine Rack Systems",
    type: "Manufacturer",
    addedAt: "2019-06-21",
    description: "Pallet rack beams, uprights, and anchor hardware.",
    doesNotSupply: "Mezzanine floors, automated cranes",
    notes: "Site survey required before beam replacements.",
  },
  {
    name: "Polar Bin Works",
    type: "Manufacturer",
    addedAt: "2021-01-15",
    description: "Open-front shelf bins for small-parts picking.",
    doesNotSupply: "Plastic pallets, roll cages",
    notes: "Colour-coded batches available on request.",
  },
  {
    name: "Northwind Labels",
    type: "Distributor",
    addedAt: "2022-04-04",
    description: "Aisle, rack, and level barcode location labels.",
    doesNotSupply: "Floor paint, hanging aisle signs",
    notes: "Cold-storage adhesive variant in stock.",
  },
  {
    name: "Glacier PPE",
    type: "Wholesaler",
    addedAt: "2020-11-28",
    description: "Insulated gloves and cold-zone garments.",
    doesNotSupply: "Heated clothing, respiratory gear",
    notes: "Exchange policy for unused sealed packs.",
  },
  {
    name: "WrapMaster Films",
    type: "Distributor",
    addedAt: "2023-03-09",
    description: "Machine-grade stretch film for automatic wrappers.",
    doesNotSupply: "Hand film, paper interleave",
    notes: "Compatible with the two Peak wrappers on dock 4.",
  },
  {
    name: "RingScan Tech",
    type: "Service",
    addedAt: "2022-08-16",
    description: "Wearable scanners and firmware support for pickers.",
    doesNotSupply: "Desktop computers, Wi-Fi infrastructure",
    notes: "Loaner units during repairs.",
  },
  {
    name: "Bayline Dock Parts",
    type: "Manufacturer",
    addedAt: "2018-02-07",
    description: "Rubber dock bumpers and leveller wear parts.",
    doesNotSupply: "Full dock levellers, shelter canopies",
    notes: "Install team books two weeks out.",
  },
  {
    name: "Archive Carton Mills",
    type: "Manufacturer",
    addedAt: "2021-09-22",
    description: "Lidded cartons for long-term storage accounts.",
    doesNotSupply: "Retail display boxes, mailers",
    notes: "Recycled board option at a small premium.",
  },
  {
    name: "Bolt & Anchor Co",
    type: "Wholesaler",
    addedAt: "2020-05-13",
    description: "Rack bolts, clips, and floor anchors.",
    doesNotSupply: "Structural steel, welding services",
    notes: "Keeps Peak’s standard kit on standing order.",
  },
  {
    name: "LaneMark Tapes",
    type: "Distributor",
    addedAt: "2024-01-08",
    description: "Floor marking tape for pedestrian and forklift lanes.",
    doesNotSupply: "Epoxy flooring, anti-static mats",
    notes: "Blue pedestrian tape is the site standard.",
  },
  {
    name: "VentFilter Nordic",
    type: "Service",
    addedAt: "2019-10-30",
    description: "Replacement filters and servicing for warehouse fans.",
    doesNotSupply: "HVAC design, refrigeration plant",
    notes: "Filter change every 90 days in chilled halls.",
  },
  {
    name: "TieFast Nylon",
    type: "Wholesaler",
    addedAt: "2023-05-17",
    description: "Cable ties and return-bundling consumables.",
    doesNotSupply: "Metal strapping, stretch film",
    notes: "300 mm black ties are the default SKU.",
  },
  {
    name: "ColdChain Carriers",
    type: "Carrier",
    addedAt: "2017-12-12",
    description: "Temperature-controlled inbound collections for Peak.",
    doesNotSupply: "Ambient groupage, courier envelopes",
    notes: "Reefer set-point must be confirmed 4 hours ahead.",
  },
];

export const dummySuppliers: Supplier[] = suppliersSchema.parse([
  ...toCompanySuppliers(rapidRoute, rapidRouteSuppliers),
  ...toCompanySuppliers(peakStorage, peakStorageSuppliers),
]);
