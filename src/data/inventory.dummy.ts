import { dummyCompanies } from "./companies.dummy";
import {
  inventoryItemsSchema,
  type InventoryCategory,
  type InventoryItem,
} from "./inventory.schema";

const [vertexCapital, rapidRoute, peakStorage] = dummyCompanies;

type ItemDraft = {
  sku: string;
  name: string;
  description: string;
  quantity: number;
  category: InventoryCategory;
};

const toCompanyItems = (company: (typeof dummyCompanies)[number], drafts: ItemDraft[]) =>
  drafts.map((draft, index) => ({
    id: `${company.id}-item-${index + 1}`,
    ...draft,
    companyId: company.id,
    companyName: company.name,
  }));

const rapidRouteItems: ItemDraft[] = [
  {
    sku: "RR-PAL-001",
    name: "Euro pallet 120x80",
    description: "Reusable wooden euro pallet for outbound mixed loads.",
    quantity: 148,
    category: "Packaging",
  },
  {
    sku: "RR-BOX-014",
    name: "Carton box 40x30x25",
    description: "Double-wall carton for spare parts and small goods.",
    quantity: 620,
    category: "Packaging",
  },
  {
    sku: "RR-TAPE-008",
    name: "Packing tape 48mm",
    description: "Clear acrylic packing tape, 66 m roll.",
    quantity: 240,
    category: "Consumables",
  },
  {
    sku: "RR-FLM-003",
    name: "Stretch film 500mm",
    description: "Hand stretch film for pallet wrapping.",
    quantity: 86,
    category: "Packaging",
  },
  {
    sku: "RR-LBL-021",
    name: "Shipping label 100x150",
    description: "Thermal shipping labels for last-mile parcels.",
    quantity: 1800,
    category: "Consumables",
  },
  {
    sku: "RR-GLV-004",
    name: "Work gloves L",
    description: "Cut-resistant gloves for warehouse handling.",
    quantity: 74,
    category: "Safety",
  },
  {
    sku: "RR-HLM-002",
    name: "Safety helmet",
    description: "Adjustable helmet for dock and yard operations.",
    quantity: 32,
    category: "Safety",
  },
  {
    sku: "RR-SCN-001",
    name: "Handheld barcode scanner",
    description: "USB barcode scanner for inbound checks.",
    quantity: 11,
    category: "Equipment",
  },
  {
    sku: "RR-JCK-006",
    name: "Pallet jack 2.5t",
    description: "Manual pallet jack for warehouse aisles.",
    quantity: 7,
    category: "Equipment",
  },
  {
    sku: "RR-FLT-009",
    name: "Forklift filter kit",
    description: "Replacement air and oil filter kit for electric forklifts.",
    quantity: 18,
    category: "Spare parts",
  },
  {
    sku: "RR-WHL-012",
    name: "Pallet jack wheel",
    description: "Nylon steering wheel for standard pallet jacks.",
    quantity: 26,
    category: "Spare parts",
  },
  {
    sku: "RR-WRP-005",
    name: "Bubble wrap 1m",
    description: "Protective wrap for fragile outbound goods.",
    quantity: 54,
    category: "Packaging",
  },
  {
    sku: "RR-STR-017",
    name: "PP strapping 12mm",
    description: "Polypropylene strapping for carton bundles.",
    quantity: 39,
    category: "Packaging",
  },
  {
    sku: "RR-MRK-011",
    name: "Marker black",
    description: "Permanent markers for crate labeling.",
    quantity: 95,
    category: "Consumables",
  },
  {
    sku: "RR-BAT-015",
    name: "Scanner battery pack",
    description: "Spare lithium battery for handheld scanners.",
    quantity: 22,
    category: "Spare parts",
  },
  {
    sku: "RR-BIN-019",
    name: "Plastic storage bin 40L",
    description: "Stackable bin for picking locations.",
    quantity: 64,
    category: "Equipment",
  },
  {
    sku: "RR-SHT-010",
    name: "Hi-vis vest",
    description: "High-visibility vest, size universal.",
    quantity: 41,
    category: "Safety",
  },
  {
    sku: "RR-TAP-022",
    name: "Floor marking tape",
    description: "Yellow/black hazard tape for aisle marking.",
    quantity: 28,
    category: "Safety",
  },
  {
    sku: "RR-CLP-016",
    name: "Cable clip pack",
    description: "Cable management clips for scanner docks.",
    quantity: 120,
    category: "Consumables",
  },
  {
    sku: "RR-NET-007",
    name: "Cargo net 2x3m",
    description: "Load-securing net for van deliveries.",
    quantity: 15,
    category: "Equipment",
  },
  {
    sku: "RR-OIL-018",
    name: "Hydraulic oil 5L",
    description: "Hydraulic oil for pallet jacks and lifts.",
    quantity: 19,
    category: "Consumables",
  },
  {
    sku: "RR-SEAL-013",
    name: "Security seal",
    description: "Numbered plastic seals for trailer doors.",
    quantity: 410,
    category: "Safety",
  },
  {
    sku: "RR-COR-020",
    name: "Corner protector",
    description: "Cardboard edge protectors for strapped pallets.",
    quantity: 210,
    category: "Packaging",
  },
  {
    sku: "RR-MAT-023",
    name: "Anti-slip mat",
    description: "Rubber mat for pallet deck grip.",
    quantity: 36,
    category: "Equipment",
  },
];

const peakStorageItems: ItemDraft[] = [
  {
    sku: "PS-RCK-001",
    name: "Rack beam 2700mm",
    description: "Replacement beam for pallet racking.",
    quantity: 24,
    category: "Spare parts",
  },
  {
    sku: "PS-BIN-004",
    name: "Shelf bin 20L",
    description: "Open-front bin for small-parts picking.",
    quantity: 88,
    category: "Equipment",
  },
  {
    sku: "PS-LBL-009",
    name: "Location label",
    description: "Aisle-rack-level barcode labels.",
    quantity: 960,
    category: "Consumables",
  },
  {
    sku: "PS-GLV-002",
    name: "Cold storage gloves",
    description: "Insulated gloves for chilled warehouse zones.",
    quantity: 40,
    category: "Safety",
  },
  {
    sku: "PS-WRP-006",
    name: "Machine stretch film",
    description: "Machine-grade film for automatic wrappers.",
    quantity: 33,
    category: "Packaging",
  },
  {
    sku: "PS-SCN-003",
    name: "Wearable scanner",
    description: "Ring scanner for high-volume picking.",
    quantity: 9,
    category: "Equipment",
  },
  {
    sku: "PS-PAD-008",
    name: "Dock bumpers",
    description: "Rubber dock bumpers for loading bays.",
    quantity: 12,
    category: "Safety",
  },
  {
    sku: "PS-BOX-011",
    name: "Archive carton",
    description: "Lidded carton for long-term storage.",
    quantity: 150,
    category: "Packaging",
  },
  {
    sku: "PS-BLT-005",
    name: "Rack bolt set",
    description: "Anchor bolts for pallet rack uprights.",
    quantity: 70,
    category: "Spare parts",
  },
  {
    sku: "PS-TAP-010",
    name: "Aisle tape blue",
    description: "Blue floor tape for pedestrian lanes.",
    quantity: 21,
    category: "Safety",
  },
  {
    sku: "PS-FAN-007",
    name: "Warehouse fan filter",
    description: "Replacement filter for ventilation units.",
    quantity: 16,
    category: "Spare parts",
  },
  {
    sku: "PS-TIE-012",
    name: "Cable tie 300mm",
    description: "Nylon cable ties for bundling returns.",
    quantity: 500,
    category: "Consumables",
  },
];

const vertexItems: ItemDraft[] = [
  {
    sku: "VC-PAP-001",
    name: "Office paper A4",
    description: "Copy paper for HQ operations.",
    quantity: 80,
    category: "Consumables",
  },
  {
    sku: "VC-LBL-002",
    name: "Asset tag",
    description: "Asset tags for internal equipment.",
    quantity: 200,
    category: "Consumables",
  },
  {
    sku: "VC-KIT-003",
    name: "First aid kit",
    description: "Wall-mounted first aid kit for office floors.",
    quantity: 8,
    category: "Safety",
  },
  {
    sku: "VC-MON-004",
    name: "Monitor stand",
    description: "Adjustable stand for operations monitors.",
    quantity: 14,
    category: "Equipment",
  },
];

export const dummyInventoryItems: InventoryItem[] = inventoryItemsSchema.parse([
  ...toCompanyItems(rapidRoute, rapidRouteItems),
  ...toCompanyItems(peakStorage, peakStorageItems),
  ...toCompanyItems(vertexCapital, vertexItems),
]);
