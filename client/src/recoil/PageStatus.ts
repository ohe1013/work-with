import { atom } from "recoil";
import { PageEnum } from "../enum/page";

export const pageAtom = atom<PageEnum>({
  key: "pageAtom",
  default: PageEnum.HOME,
});
