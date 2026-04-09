import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Regist from "./Regist";

describe("Regist", () => {
  test("shows validation-gated summary and success flow", () => {
    render(
      <MemoryRouter>
        <Regist />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: "제출 전 요약 보기" })
    ).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "러닝" }));
    fireEvent.change(screen.getByLabelText("장소 이름"), {
      target: { value: "서울숲" },
    });
    fireEvent.change(screen.getByLabelText("날짜"), {
      target: { value: "2026-04-10" },
    });
    fireEvent.change(screen.getByLabelText("시간"), {
      target: { value: "19:00" },
    });
    fireEvent.click(screen.getByRole("button", { name: "중급" }));
    fireEvent.click(screen.getByRole("button", { name: "3" }));

    const previewButton = screen.getByRole("button", {
      name: "제출 전 요약 보기",
    });
    expect(previewButton).toBeEnabled();

    fireEvent.click(previewButton);

    expect(
      screen.getByText("지금 이 내용으로 모집을 올릴 수 있어요")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "이 내용으로 모집 등록하기" })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "이 내용으로 모집 등록하기" })
    );

    expect(screen.getByText("오늘의 모집 초안이 준비됐어요")).toBeInTheDocument();
    expect(screen.getByText("서울숲")).toBeInTheDocument();
  });
});
