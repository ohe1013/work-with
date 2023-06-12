import axios from "axios";

const apiUrl = "/api/v1/vworld";

const fetchVworldSearchResult = async (params: any) => {
    const result = await axios.get(apiUrl, { params });
    const data = await result.data;
    return data;
};

export { fetchVworldSearchResult };
