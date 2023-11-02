import axios from "axios";
export async function fetchWorkWithList(id: string) {
  console.log(id);
  //여기서 해당 id로 조회하도록 함
  const res = await axios.get("./testData.json");
  return res;
}
