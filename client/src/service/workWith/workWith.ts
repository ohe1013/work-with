import {
  createWorkWithPost,
  fetchWorkWithList,
} from "../../api/map/workWith";
import type { CreateWorkWithRequest, WorkWithItem } from "../../types/workWith";

const getWorkWithList = async (
  id: string,
  placeName?: string
): Promise<WorkWithItem[]> => {
  const response = await fetchWorkWithList(id, placeName);
  return response.items;
};

const registerWorkWith = async (
  request: CreateWorkWithRequest
): Promise<WorkWithItem> => {
  const response = await createWorkWithPost(request);
  return response.item;
};

export { getWorkWithList, registerWorkWith };
