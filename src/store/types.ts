import { useDispatch } from "react-redux";
import type store from "./store";

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
