namespace KakaoSearch {
  export interface Suggest {
    items: {
      category: string;
      highlighted: Array<unknown>;
      items: string;
      key: string;
      score: number;
    };
    success: {
      q: string;
      rq: string;
      items: Array<KakaoSearch.Suggest.items>;
    };
    error: {
      request: string;
      message: string;
      status: number;
    };
  }
}
export default KakaoSearch;
