import axios from "axios";

const apiUrl = "/api/v1/vworld";

type VworldSearchParams = Record<
  string,
  string | number | boolean | null | undefined
>;

const fetchVworldSearchResult = async (params: VworldSearchParams) => {
  const result = await axios.get(apiUrl, { params });
  const data = await result.data;
  return data;
};

export { fetchVworldSearchResult };
