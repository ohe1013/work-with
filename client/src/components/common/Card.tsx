import { Roadview } from "react-kakao-maps-sdk";

export default function Card({
    title,
    position,
}: {
    id: string;
    title: string;
    position: { lat: number; lng: number };
}) {
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
                    <p className="font-normal text-gray-700 mb-3 dark:text-gray-400">
                        안녕하세요:) 오늘은 상체운동을 하는 날 입니다. 가슴, 이두쪽 파트너 운동하실
                        분 구합니다.
                    </p>
                    <p className="font-normal text-gray-700 mb-3 dark:text-gray-400">
                        시간 7:00~10:00
                    </p>
                    <p className="font-normal text-gray-700 mb-3 dark:text-gray-400">
                        신청인원 10/20
                    </p>
                    <a
                        href="#"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        신청하기
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
