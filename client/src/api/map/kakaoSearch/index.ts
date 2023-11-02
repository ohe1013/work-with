import axios from "axios";
export async function fetchKakaoSuggest(keyword: string) {
  const res = await axios.get(
    "https://map.kakao.com/api/dapi/suggest/hub?service=local-suggest&q=" +
      keyword
  );
  return res;
}
