import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Panel from "../components/common/Panel";
import { PageEnum } from "../enum/page";

const pageCopy: Record<
  PageEnum,
  { eyebrow: string; title: string; helper: string }
> = {
  [PageEnum.HOME]: {
    eyebrow: "지도 기반 탐색",
    title: "근처 운동 메이트를 지도로 빠르게 비교해보세요",
    helper: "지도 먼저 보고 가볍게 연결하는 흐름을 유지합니다.",
  },
  [PageEnum.FIND]: {
    eyebrow: "조건 기반 탐색",
    title: "운동 종류와 시간대를 먼저 좁혀보세요",
    helper: "필터를 고른 뒤 지도와 결과 목록을 같은 흐름으로 비교합니다.",
  },
  [PageEnum.REGIST]: {
    eyebrow: "가벼운 모집 등록",
    title: "부담 없이 쓰고 제출 전에 한 번 더 확인합니다",
    helper: "운동 종류, 장소, 시간, 모집 조건을 단계별로 정리합니다.",
  },
  [PageEnum.AUTH]: {
    eyebrow: "신뢰와 요청",
    title: "필요할 때만 간단하게 로그인합니다",
    helper: "가벼운 로그인 후 바로 탐색과 요청 흐름으로 이어집니다.",
  },
  [PageEnum.COMMUNITY]: {
    eyebrow: "워크위드",
    title: "가볍고 명확한 운동 메이트 연결",
    helper: "지도 중심 탐색과 낮은 부담의 요청 경험을 유지합니다.",
  },
};

export default function Header({
  currentPage,
}: {
  currentPage: PageEnum;
}) {
  const copy = pageCopy[currentPage] ?? pageCopy[PageEnum.HOME];

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 md:px-4 md:pt-4">
      <Panel
        tone="default"
        className="mx-auto flex max-w-[1520px] items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4"
      >
        <div className="min-w-0">
          <Link to="/" className="inline-flex max-w-full items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-[16px] bg-[rgb(var(--color-accent))] text-sm font-bold tracking-[0.18em] text-white">
              WW
            </span>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {copy.eyebrow}
              </p>

              <h1 className="truncate text-base font-semibold tracking-[-0.03em] text-slate-950 md:text-lg">
                {copy.title}
              </h1>
              <p className="hidden text-sm leading-6 text-slate-500 lg:block">
                {copy.helper}
              </p>
            </div>
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/find">
            <Button variant="ghost" fullWidth={false} size="sm">
              찾기
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" fullWidth={false} size="sm">
              로그인
            </Button>
          </Link>
          <Link to="/regist">
            <Button fullWidth={false} size="sm">
              등록
            </Button>
          </Link>
        </div>
      </Panel>
    </header>
  );
}
