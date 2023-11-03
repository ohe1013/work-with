import { Roadview } from "react-kakao-maps-sdk";
import { getWorkWithList } from "../../service/workWith/workWith";
import WorkWith from "../../api/map/workWith/model";
import { useQuery } from "react-query";

const createTime = new Date().getTime();
//5초 후 사라지도록 세팅
function DetailCard({ option }: { option: WorkWith.LocItem["item"] }) {
    const endTime = createTime + option.dueTime;
    const currentTime = new Date().getTime();
    return endTime > currentTime ? (
        <div className="border-solid flex flex-col w-full border-2  my-2 rounded-xl p-1 ">
            <button className="  ">
                <p>
                    <span className="text-xl ">{option.title}</span>
                </p>
                <p>
                    <span className="text-sm ">
                        수준: {option.level} | 인원 : {option.currentCount}/{option.maxCount}
                    </span>
                </p>
                <p>
                    <span className="text-sm ">
                        지원마감: {new Date(endTime).toLocaleTimeString()}
                    </span>
                </p>
                <p>
                    <span className="text-sm ">운동시간: {option.workTime}</span>
                </p>
            </button>
        </div>
    ) : (
        <></>
    );
}

export default function Card({
    id,
    title,
    position,
}: {
    id: string;
    title: string;
    position: { lat: number; lng: number };
}) {
    const { data: workWithList, isLoading } = useQuery("workWith", () => getWorkWithList(id), {
        staleTime: 1000,
        cacheTime: 6000,
    });
    return (
        <div className="max-w-2xl  mx-auto">
            <div className="bg-white  shadow-md border border-gray-200 rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700">
                <Roadview
                    style={{ width: "100%", height: "200px" }}
                    position={{ lat: position.lat, lng: position.lng, radius: 50 }}
                ></Roadview>
                <div className="p-5 w-80">
                    <a href="#">
                        <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2 dark:text-white">
                            {title}
                        </h5>
                    </a>
                    {!isLoading ? (
                        workWithList?.map((workWith) => (
                            <DetailCard key={workWith.id} option={workWith}></DetailCard>
                        ))
                    ) : (
                        <h1>데이터를 빠르게 조회중...</h1>
                    )}
                    <a
                        href="#"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        새로등록 하기
                        <svg
                            className="-mr-1 ml-2 h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
