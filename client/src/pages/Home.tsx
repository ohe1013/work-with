import Panel from "../components/common/Panel";
import BaseMap from "../components/map/BaseMap";

export default function Home(): JSX.Element {
  return (
    <section className="relative h-full min-h-[calc(100vh-126px)] w-full overflow-hidden rounded-[32px] md:min-h-[calc(100vh-108px)]">
      <article className="relative h-full min-h-[inherit] overflow-hidden rounded-[32px]">
        <div className="absolute inset-0">
          <BaseMap></BaseMap>
        </div>

        <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[290px] md:left-6 md:top-6">
          <Panel className="space-y-2 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Home map
            </p>
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-900">
              지금 가능한 운동 메이트를 지도에서 확인하세요
            </h2>
            <p className="text-sm leading-6 text-slate-500">
              가까운 장소를 중심으로 가볍게 비교하고, 필요한 연결만 시작할 수
              있도록 구성했습니다.
            </p>
          </Panel>
        </div>
      </article>
    </section>
  );
}
