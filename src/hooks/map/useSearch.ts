import { fetchVworldSearchResult } from "../../api/map/vworld";

const searchVworld = async (params: any) => {
    const result = await fetchVworldSearchResult(params);
    return result;
};

export { searchVworld };
