import axios from "axios";
export async function getKakaoSuggest(keyword: string) {
  const res = await axios.get(
    "/api/v1/kakao/search/?service=local-suggest&q=" + keyword
  );
  return res;
}
