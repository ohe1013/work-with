import axios from "axios";
export async function fetchKakaoSuggest(keyword: string) {
  const res = await axios.get("/api/v1/kakao/search", {
    params: {
      service: "local-suggest",
      q: keyword,
    },
  });
  return res;
}
