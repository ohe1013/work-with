import axios from "axios";
export async function fetchKakaoSuggest(keyword: string) {
  const res = await axios.get("http://localhost:3000/kakao/get/search", {
    params: {
      keyword,
    },
  });
  return res;
}
