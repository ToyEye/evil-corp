import { dummyCompanies } from "./companies.dummy";
import {
  supportMessagesSchema,
  supportThreadsSchema,
  type SupportMessage,
  type SupportThread,
} from "./support.schema";
import { dummyUsers } from "./users.dummy";

const [, rapidRoute, peakStorage] = dummyCompanies;
const lena = dummyUsers.find((user) => user.id === "21");
const owen = dummyUsers.find((user) => user.id === "9");
const priya = dummyUsers.find((user) => user.id === "14");

if (!lena || !owen || !priya) {
  throw new Error("Support seed users are missing");
}

const dummySupportThreadsData: SupportThread[] = [
  {
    id: "support-thread-1",
    companyId: rapidRoute.id,
    companyName: rapidRoute.name,
    requesterId: owen.id,
    requesterName: owen.name,
    requesterRole: owen.role,
    supportLastReadAt: "2026-09-16T11:20:00.000Z",
    requesterLastReadAt: "2026-09-16T11:20:00.000Z",
    createdAt: "2026-09-16T10:12:00.000Z",
    updatedAt: "2026-09-16T11:18:00.000Z",
  },
  {
    id: "support-thread-2",
    companyId: peakStorage.id,
    companyName: peakStorage.name,
    requesterId: priya.id,
    requesterName: priya.name,
    requesterRole: priya.role,
    requesterLastReadAt: "2026-09-17T08:40:00.000Z",
    createdAt: "2026-09-17T08:40:00.000Z",
    updatedAt: "2026-09-17T08:40:00.000Z",
  },
];

const dummySupportMessagesData: SupportMessage[] = [
  {
    id: "support-msg-1",
    threadId: "support-thread-1",
    authorId: owen.id,
    authorName: owen.name,
    authorRole: owen.role,
    body: "City van 01 is at the RapidRoute gate but yesterday's dock code does not work. Can Support reset it so Liam can unload?",
    createdAt: "2026-09-16T10:12:00.000Z",
  },
  {
    id: "support-msg-2",
    threadId: "support-thread-1",
    authorId: lena.id,
    authorName: lena.name,
    authorRole: lena.role,
    body: "Reset the dock code and emailed it to Owen. If the gate is still closed, ask Marta at dock 4.",
    createdAt: "2026-09-16T11:18:00.000Z",
  },
  {
    id: "support-msg-3",
    threadId: "support-thread-2",
    authorId: priya.id,
    authorName: priya.name,
    authorRole: priya.role,
    body: "Peak Storage paid the last invoice, but warehouse still shows the order waiting for stock. Can you check the reservation?",
    createdAt: "2026-09-17T08:40:00.000Z",
  },
];

export const dummySupportThreads = supportThreadsSchema.parse(dummySupportThreadsData);
export const dummySupportMessages = supportMessagesSchema.parse(dummySupportMessagesData);
