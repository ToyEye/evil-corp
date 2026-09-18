export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  companies: {
    all: ["companies"] as const,
    detail: (id: string) => ["companies", id] as const,
  },
  users: {
    all: ["users"] as const,
  },
  clients: {
    all: ["clients"] as const,
  },
  inventory: {
    all: ["inventory"] as const,
  },
  suppliers: {
    all: ["suppliers"] as const,
  },
  orders: {
    all: ["orders"] as const,
    detail: (id: string) => ["orders", id] as const,
  },
  deliveries: {
    all: ["deliveries"] as const,
    detail: (id: string) => ["deliveries", id] as const,
  },
  vehicles: {
    all: ["vehicles"] as const,
  },
  routes: {
    all: ["routes"] as const,
  },
  restock: {
    all: ["restock"] as const,
  },
  invoices: {
    all: ["invoices"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
  },
  activity: {
    all: ["activity"] as const,
  },
  support: {
    threads: ["support", "threads"] as const,
    messages: (threadId: string) =>
      ["support", "threads", threadId, "messages"] as const,
  },
  permissions: {
    all: ["permissions"] as const,
  },
  joinRequests: {
    all: ["join-requests"] as const,
  },
} as const;
