import axios, { AxiosError } from "axios";
import type {
  CreateWorkWithRequest,
  CreateWorkWithResponse,
  WorkWithErrorResponse,
  WorkWithLocationResponse,
} from "@/types/workWith";

const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.port === "5173" ? "http://localhost:3000" : "";
};

const baseUrl = getBaseUrl();

class WorkWithApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "WorkWithApiError";
    this.status = status;
  }
}

const buildApiError = (error: unknown, fallbackMessage: string) => {
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 500;
    const payload = error.response?.data as WorkWithErrorResponse | undefined;

    if (payload?.message) {
      return new WorkWithApiError(payload.message, status);
    }

    return new WorkWithApiError(fallbackMessage, status);
  }

  if (error instanceof Error) {
    return new WorkWithApiError(error.message, 500);
  }

  return new WorkWithApiError(fallbackMessage, 500);
};

export async function fetchWorkWithList(
  locationId: string,
  placeName?: string
): Promise<WorkWithLocationResponse> {
  try {
    const response = await axios.get<WorkWithLocationResponse>(
      `${baseUrl}/api/work-with/locations/${encodeURIComponent(locationId)}`,
      {
        params: placeName?.trim() ? { placeName: placeName.trim() } : undefined,
      }
    );

    if (
      !Array.isArray(response.data.items) ||
      typeof response.data.locationId !== "string"
    ) {
      throw new WorkWithApiError("상세 모집 응답 형식이 올바르지 않아요.", 500);
    }

    return response.data;
  } catch (error) {
    throw buildApiError(error, "운동 메이트 목록을 불러오지 못했어요.");
  }
}

export async function createWorkWithPost(
  request: CreateWorkWithRequest
): Promise<CreateWorkWithResponse> {
  try {
    const response = await axios.post<CreateWorkWithResponse>(
      `${baseUrl}/api/work-with`,
      request
    );

    if (
      typeof response.data !== "object" ||
      response.data === null ||
      !("item" in response.data) ||
      typeof response.data.item !== "object" ||
      response.data.item === null
    ) {
      throw new WorkWithApiError("등록 응답 형식이 올바르지 않아요.", 500);
    }

    return response.data;
  } catch (error) {
    throw buildApiError(error, "운동 메이트 등록을 저장하지 못했어요.");
  }
}

export { WorkWithApiError };
