import { atom } from "recoil";

interface userType {
  type: "admin" | "user" | "guest";
  token: string;
}
export const userAtom = atom<userType>({
  key: "userAtom",
  default: {
    type: "user",
    token: "",
  },
});
