import KakaoSearch from "../../../api/map/kakaoSearch/model";

export default function SuggestList({
  suggestList,
  setKeyword,
}: {
  suggestList: KakaoSearch.Suggest["success"]["items"];
  setKeyword: (val: string) => void;
}) {
  const handleClick = (val) => {
    console.log(val);
    setKeyword(val);
  };
  return (
    <div className={"block"}>
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
    </div>
  );
}
