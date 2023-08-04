import { atom } from "recoil";

interface userType {
    type: "admin" | "user" | "guest";
}
export const userAtom = atom<userType>({
    key: "userAtom",
});
