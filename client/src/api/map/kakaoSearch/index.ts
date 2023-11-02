import axios from "axios";
export async function fetchKakaoSuggest(keyword: string) {
  const res = await axios.get(
    "/api/v1/kakao/search/?service=local-suggest&q=" + keyword
  );
  return res;
}
