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

  const handleClick = (keyword: string) => {
    selectSuggest(keyword);
  };
  if (suggestList.length === 0) {
    return null;
  }
  return (
    <div
      className={
        "block top-21.5 bg-white w-full z-10 shadow-md border-gray-800"
      }
    >
      {activeSuggestList && (
        <ul>
          {suggestList.map((suggestItem) => (
            <li key={suggestItem.key}>
              <button
                onClick={() => handleClick(suggestItem.key)}
                className="flex items-center w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none"
              >
                <div className="text-left rtl:text-right">
                  <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">
                    {suggestItem.key}
                  </h1>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
