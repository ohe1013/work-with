import { AxiosError } from "axios";
import { fetchWorkWithList } from "../../api/map/workWith";
import WorkWith from "../../api/map/workWith/model";

const getWorkWithList = async (
  id: string
): Promise<Array<WorkWith.LocItem["item"]>> => {
  await new Promise((res) => {
    setTimeout(() => res(1), (Math.random() * 1000) >> 0);
  });
  try {
    const kakaoSuggestRes = await fetchWorkWithList(id);
    const { items } = kakaoSuggestRes.data;
    return items;
  } catch (error) {
    if (error instanceof AxiosError) console.log("axios 에러발생", error);
    else console.log("error발생", error);
    return [];
  }
};

export { getWorkWithList };
