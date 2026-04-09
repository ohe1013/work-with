import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Panel from "../components/common/Panel";
import { PageEnum } from "../enum/page";

const pageCopy: Record<PageEnum, { eyebrow: string; title: string }> = {
  [PageEnum.HOME]: {
    eyebrow: "Map-first discovery",
    title: "근처 운동 메이트를 빠르게 찾아보세요",
  },
  [PageEnum.FIND]: {
    eyebrow: "Focused search",
    title: "조건 중심으로 맞는 운동 메이트를 찾으세요",
  },
  [PageEnum.REGIST]: {
    eyebrow: "Lightweight posting",
    title: "부담 없이 오늘의 모집을 올리세요",
  },
  [PageEnum.AUTH]: {
    eyebrow: "Trust & access",
    title: "필요한 순간에만 가볍게 로그인하세요",
  },
  [PageEnum.COMMUNITY]: {
    eyebrow: "Workout partner",
    title: "가볍고 명확한 연결을 유지하세요",
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
      <Panel className="flex items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        <div className="min-w-0">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgb(var(--color-accent))] text-sm font-bold tracking-[0.2em] text-white">
              WW
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {copy.eyebrow}
              </p>
              <h1 className="truncate text-base font-semibold tracking-[-0.03em] text-slate-900 md:text-lg">
                {copy.title}
              </h1>
            </div>
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/find">
            <Button variant="ghost" fullWidth={false} size="sm">
              찾기
            </Button>
          </Link>
          <Link to="/regist">
            <Button variant="secondary" fullWidth={false} size="sm">
              등록
            </Button>
          </Link>
          <Link to="/login">
            <Button fullWidth={false} size="sm">
              로그인
            </Button>
          </Link>
        </div>
      </Panel>
    </header>
  );
}
