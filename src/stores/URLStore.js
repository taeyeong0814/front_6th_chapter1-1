import { createObservable } from "./observable.js";
import { getFullPath, getAppPath } from "../utils/pathUtils.js";

// 함수형 URLStore
function createURLStore() {
  // 옵저버 패턴 생성
  const observable = createObservable();

  // URL 파라미터 읽기
  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      category1: params.get("category1") || "",
      category2: params.get("category2") || "",
      search: params.get("search") || "",
      sort: params.get("sort") || "price_asc",
      limit: parseInt(params.get("limit")) || 20,
      page: parseInt(params.get("current")) || 1,
    };
  }

  // URL 파라미터 업데이트
  function updateURL(newParams) {
    const url = new URL(window.location);

    // 기존 파라미터 제거
    url.searchParams.delete("category1");
    url.searchParams.delete("category2");
    url.searchParams.delete("search");
    url.searchParams.delete("sort");
    url.searchParams.delete("limit");
    url.searchParams.delete("current");

    // 새 파라미터 추가 (값이 있을 때만)
    if (newParams.category1) url.searchParams.set("category1", newParams.category1);
    if (newParams.category2) url.searchParams.set("category2", newParams.category2);
    if (newParams.search) url.searchParams.set("search", newParams.search);
    if (newParams.sort && newParams.sort !== "price_asc") url.searchParams.set("sort", newParams.sort);
    if (newParams.limit) url.searchParams.set("limit", newParams.limit.toString());
    if (newParams.page && newParams.page !== 1) url.searchParams.set("current", newParams.page.toString());

    // 베이스 경로를 포함한 전체 URL로 변경
    const fullUrl = getFullPath(getAppPath(url.pathname)) + url.search;
    window.history.pushState({}, "", fullUrl);
    observable.notify();
  }

  // URL 초기화 (홈으로)
  function resetURL() {
    const url = new URL(window.location);

    // 모든 파라미터 제거
    url.searchParams.delete("category1");
    url.searchParams.delete("category2");
    url.searchParams.delete("search");
    url.searchParams.delete("sort");
    url.searchParams.delete("limit");
    url.searchParams.delete("current");

    window.history.pushState({}, "", getFullPath(getAppPath(url.pathname)));
    observable.notify();
  }

  // 공개 API 반환
  return {
    subscribe: observable.subscribe,
    getQueryParams,
    updateURL,
    resetURL,
  };
}

export const urlStore = createURLStore();
