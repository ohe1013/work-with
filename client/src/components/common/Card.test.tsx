import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import Card from "./Card";

function renderCard() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <Card
        id="place-1"
        title="서울숲"
        position={{ lat: 37.5444, lng: 127.0374 }}
      />
    </QueryClientProvider>
  );
}

describe("Card", () => {
  test("renders location detail data from the work-with api", async () => {
    renderCard();

    expect(
      await screen.findByText("서울숲 러닝 메이트 구해요")
    ).toBeInTheDocument();
    expect(
      screen.getByText("5km 정도 가볍게 뛰고 마무리 스트레칭까지 할 예정이에요.")
    ).toBeInTheDocument();
    expect(screen.getByText("열린 모집")).toBeInTheDocument();
  });
});
