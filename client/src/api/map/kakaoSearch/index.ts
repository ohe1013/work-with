export async function getKakaoSuggest(keyword: string) {
    const res = await fetch("http://localhost:3000/kakao/get/search?keyword=" + keyword, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const json = await res.json();
    console.log(json);
}
