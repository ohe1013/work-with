import { getSuggestList } from "@/service/search/kakaoSearch";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function SuggestList({
  keyword,
  selectSuggest,
  activeSuggestList,
}: {
  keyword: string;
  selectSuggest: (keyword: string) => void;
  activeSuggestList: boolean;
}) {
  const { data: suggestList } = useSuspenseQuery({
    queryKey: ["suggestlist", keyword],
    queryFn: () => getSuggestList({ keyword, itemSize: 10 }),
  });

  if (!activeSuggestList || suggestList.length === 0) {
    return null;
  }

  return (
    <div className="px-4 pb-2">
      <ul className="flex gap-2 overflow-x-auto pb-1">
        {suggestList.map((suggestItem) => (
          <li key={suggestItem.key}>
            <button
              type="button"
              onClick={() => selectSuggest(suggestItem.key)}
              className="whitespace-nowrap rounded-full bg-[rgba(14,116,144,0.08)] px-3 py-2 text-sm font-medium text-[rgb(var(--color-accent))] transition hover:bg-[rgba(14,116,144,0.14)]"
            >
              {suggestItem.key}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
