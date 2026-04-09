import { useRecoilValue } from "recoil";
import Panel from "../components/common/Panel";
import BaseMap from "../components/map/BaseMap";
import { MapDiscoveryAtom, MapInfoAtom, MapMarkersAtom } from "../recoil/map";

export default function Home(): JSX.Element {
  const discoveryState = useRecoilValue(MapDiscoveryAtom);
  const markers = useRecoilValue(MapMarkersAtom);
  const selectedMarker = useRecoilValue(MapInfoAtom);
  const guideItems = selectedMarker
    ? [
        {
          title: `${selectedMarker.content} 선택됨`,
          description:
            selectedMarker.address_name ??
            "선택한 장소 기준으로 열린 모집 현황이 패널 상단에 고정됐어요.",
        },
        {
          title: `${markers.length}곳 비교 가능`,
          description:
            "아래 후보를 누르면 같은 흐름에서 다른 장소 모집으로 바로 전환할 수 있어요.",
        },
        {
          title: "부담 없는 다음 단계",
          description:
            "열린 모집만 가볍게 확인한 뒤, 맞는 세션이 있으면 요청으로 넘어가면 됩니다.",
        },
      ]
    : discoveryState.phase === "loading"
      ? [
          {
            title: `${discoveryState.keyword || "주변 장소"} 검색 중`,
            description:
              "지도와 패널이 같은 타이밍에 갱신되도록 결과를 정리하고 있어요.",
          },
          {
            title: "곧 비교 후보가 열립니다",
            description:
              "마커와 카드가 준비되면 장소별 모집 브리프를 바로 열 수 있어요.",
          },
          {
            title: "탐색 흐름 유지",
            description:
              "같은 화면에서 검색, 선택, 상세 비교가 끊기지 않도록 연결됩니다.",
          },
        ]
      : discoveryState.phase === "empty"
        ? [
            {
              title: "검색 범위를 조금 넓혀보세요",
              description:
                "공원 이름 대신 동네나 큰 시설명으로 다시 검색하면 결과가 더 잘 잡힐 수 있어요.",
            },
            {
              title: "다른 운동 장소로 전환",
              description:
                "체육관, 공원, 운동장처럼 비슷한 목적의 장소를 연달아 비교해보세요.",
            },
            {
              title: "홈 탐색은 그대로 유지됩니다",
              description:
                "새 검색어를 넣어도 지도 중심 탐색과 상세 비교 흐름은 같은 패널에서 이어집니다.",
            },
          ]
        : discoveryState.phase === "error"
          ? [
              {
                title: "같은 키워드로 다시 시도",
                description:
                  "일시적인 문제일 수 있으니 검색 패널에서 한 번 더 불러와 보세요.",
              },
              {
                title: "다른 장소 이름으로 전환",
                description:
                  "주요 공원, 체육관, 운동장 이름으로 바꾸면 결과가 더 안정적으로 열릴 수 있어요.",
              },
              {
                title: "흐름은 그대로 복구됩니다",
                description:
                  "홈에서 다시 검색해도 지도와 비교 패널 구조는 바뀌지 않습니다.",
              },
            ]
          : markers.length > 0
            ? [
                {
                  title: `${markers.length}곳 비교 준비 완료`,
                  description:
                    "검색 결과 카드와 지도 마커가 같은 목록으로 묶여 있어 빠르게 오갈 수 있어요.",
                },
                {
                  title: "장소를 하나 고르면 상세가 열립니다",
                  description:
                    "선택한 장소의 모집 브리프가 시트 상단에 고정돼 비교가 쉬워집니다.",
                },
                {
                  title: "필요한 연결만 확인",
                  description:
                    "운동 메이트 모집 수와 남은 자리만 보고 부담 없이 다음 단계를 판단할 수 있어요.",
                },
              ]
            : [
                {
                  title: "장소부터 빠르게 찾기",
                  description:
                    "공원이나 체육관 이름으로 검색해 홈 탐색 범위를 먼저 좁혀보세요.",
                },
                {
                  title: "지도에서 바로 비교",
                  description:
                    "검색 결과가 열리면 마커와 카드 중 편한 쪽을 눌러 같은 장소를 고를 수 있어요.",
                },
                {
                  title: "선택 후 모집 흐름 확인",
                  description:
                    "장소를 하나 고르면 그 근처에서 열려 있는 운동 메이트 모집 브리프가 이어집니다.",
                },
              ];
  const markerSummary =
    discoveryState.phase === "loading"
      ? `${discoveryState.keyword || "주변 장소"} 검색 중`
      : discoveryState.phase === "empty"
        ? "조건을 다시 조정해보세요"
        : discoveryState.phase === "error"
          ? "검색 재시도 필요"
          : markers.length > 0
            ? `${markers.length}곳 비교 가능`
            : "검색 전";
  const homeDescription =
    discoveryState.phase === "loading"
      ? `${discoveryState.keyword || "주변 장소"} 주변 결과를 정리하고 있어요. 지도와 패널이 같은 타이밍에 갱신됩니다.`
      : discoveryState.phase === "empty"
        ? `${discoveryState.keyword || "이번 검색"} 주변에는 비교할 장소가 아직 없었어요. 다른 공원이나 체육관 이름으로 다시 찾아보세요.`
        : discoveryState.phase === "error"
          ? "검색 결과를 불러오지 못했어요. 같은 키워드로 다시 시도하거나 다른 장소를 입력해 주세요."
          : "장소를 검색하고, 마커나 결과 카드를 눌러 주변 모집 흐름을 바로 확인할 수 있도록 홈 화면의 위계를 정리했습니다.";
  const selectedSummary =
    selectedMarker?.content ??
    (discoveryState.phase === "loading"
      ? `${discoveryState.keyword || "검색 결과"} 준비 중`
      : discoveryState.phase === "empty"
        ? "다른 장소를 찾아보세요"
        : discoveryState.phase === "error"
          ? "검색 다시 시도 필요"
          : "미리보기 대기 중");
  const selectedDetail =
    selectedMarker?.address_name ??
    (discoveryState.phase === "loading"
      ? "결과가 준비되면 마커와 카드가 같은 선택 흐름으로 이어집니다."
      : discoveryState.phase === "empty"
        ? "조건을 조금 넓혀서 다시 검색하면 바로 비교를 이어갈 수 있어요."
        : discoveryState.phase === "error"
          ? "검색 패널에서 다시 시도하면 홈 탐색 흐름을 그대로 이어갑니다."
          : "마커나 결과 카드를 누르면 즉시 비교할 수 있어요.");

  return (
    <section className="relative h-full min-h-[calc(100vh-126px)] w-full overflow-hidden rounded-[32px] md:min-h-[calc(100vh-108px)]">
      <article className="relative h-full min-h-[inherit] overflow-hidden rounded-[32px]">
        <div className="absolute inset-0">
          <BaseMap></BaseMap>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.24),_transparent_42%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/18 via-slate-950/6 to-transparent md:h-36" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/20 via-slate-950/8 to-transparent md:h-44" />

        <div className="pointer-events-none absolute inset-x-4 top-4 z-10 md:inset-x-auto md:left-6 md:top-6 md:w-[420px]">
          <Panel tone="soft" className="space-y-4 px-4 py-4 md:px-5 md:py-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[rgba(14,116,144,0.12)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-accent))]">
                홈 지도 탐색
              </span>
              <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {markerSummary}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-900 md:text-[1.75rem] md:leading-[1.2]">
                운동 메이트를 지도 위에서 빠르게 비교하세요
              </h2>
              <p className="text-sm leading-6 text-slate-600 md:text-[15px]">
                {homeDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[22px] bg-white/72 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  탐색 상태
                </p>
                <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {markerSummary}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  검색 패널은 한 번의 탭으로 다시 열 수 있어요.
                </p>
              </div>

              <div className="rounded-[22px] bg-white/72 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  현재 선택
                </p>
                <p className="mt-2 truncate text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {selectedSummary}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {selectedDetail}
                </p>
              </div>
            </div>
          </Panel>
        </div>

        <div className="pointer-events-none absolute bottom-6 right-6 z-10 hidden w-[310px] lg:block">
          <Panel tone="strong" className="space-y-3 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              홈 탐색 포인트
            </p>
            <div className="space-y-3 text-sm leading-6 text-slate-600">
              {guideItems.map((item, index) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/88 text-xs font-semibold text-[rgb(var(--color-accent))]">
                    {index + 1}
                  </span>
                  <div className="space-y-0.5">
                    <p className="font-semibold tracking-[-0.02em] text-slate-900">
                      {item.title}
                    </p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </article>
    </section>
  );
}
