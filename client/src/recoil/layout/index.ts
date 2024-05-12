import {atom} from "recoil";
import {ReactNode} from "react";

interface CachedLayout {
    [key:string] : ReactNode
}
export const CachedLayoutAtom = atom<CachedLayout>({
    key:'CachedLayoutAtom',
    default:{}
})
