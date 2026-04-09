# API Contracts

Last updated: 2026-04-09

## Purpose

- Record the request-response shapes that are actually implemented right now.
- Keep search, auth, and posting contracts aligned across `client` and `server`.
- Make the remaining M5 polish work start from stable contracts instead of guessed shapes.

## Scope notes

- This file documents the current implemented contracts, not aspirational future routes.
- Search is split across:
  - a server-side Kakao suggest proxy for quick query suggestions
  - a client-side Kakao Maps JS SDK search that normalizes map results into app markers
- Auth and work-with posting/detail routes are app-owned server contracts.

## Search contracts

### `GET /kakao/get/search`

Purpose
- Proxy Kakao suggest data for the search suggestion chips used before a full map search runs.

Query
```json
{
  "keyword": "서울숲"
}
```

Response `200`
- The server currently relays Kakao's payload with minimal shaping.
- The client only depends on the `items` array and reads `key` for suggestion text.

```json
{
  "q": "서울숲",
  "rq": "서울숲",
  "items": [
    {
      "category": "place",
      "highlighted": [],
      "items": "서울숲",
      "key": "서울숲",
      "score": 123.45
    }
  ]
}
```

Error `500`
```json
{
  "message": "string"
}
```

Current client usage
- `client/src/service/search/kakaoSearch.ts` slices `items` and uses `item.key`.
- No app-owned normalization layer exists yet for this suggest route.

### Client-owned map discovery normalization

Purpose
- Convert Kakao Maps JS SDK place results into the stable marker shape used by the map, side panel, and detail card trigger.

Runtime source
- `kakao.maps.services.Places().keywordSearch(...)`
- Not an Express route yet.

Normalized marker shape
```json
{
  "id": "123456789",
  "content": "서울숲",
  "position": {
    "lat": 37.5444,
    "lng": 127.0374
  },
  "place_url": "https://place.map.kakao.com/123456789",
  "category_name": "공원",
  "phone": "02-000-0000",
  "address_name": "서울 성동구 성수동1가"
}
```

Discovery state shape
```json
{
  "phase": "idle | loading | results | empty | error",
  "keyword": "서울숲",
  "resultCount": 3,
  "errorMessage": "optional string"
}
```

Notes
- Pagination still comes directly from Kakao Maps SDK pagination objects.
- Search result items are not yet served by an app-owned `/api/search/places` route.

## Auth contract

### `POST /api/login`

Purpose
- Authenticate against the current demo credential set and return the session shape persisted by the frontend.

Request
```json
{
  "email": "test123@naver.com",
  "password": "test123"
}
```

Response `200`
```json
{
  "token": "jwt-token",
  "expiresIn": 3600,
  "user": {
    "email": "test123@naver.com",
    "role": "user",
    "displayName": "워크위드 메이트"
  }
}
```

Error `400`
```json
{
  "message": "이메일과 비밀번호를 모두 입력해 주세요."
}
```

Error `401`
```json
{
  "message": "이메일 또는 비밀번호가 올바르지 않아요."
}
```

Client persistence
```json
{
  "storageKey": "work-with.auth.session",
  "value": {
    "token": "jwt-token",
    "expiresIn": 3600,
    "user": {
      "email": "test123@naver.com",
      "role": "user",
      "displayName": "워크위드 메이트"
    }
  }
}
```

Current constraints
- The credential set is fixed demo data from environment variables or defaults.
- There is no `GET /api/auth/me` route yet.
- The session token is stored client-side, but there is no protected ownership flow wired to work-with posting yet.

## Work-with posting and detail contracts

### Shared item shape

```json
{
  "id": "string",
  "locationId": "string | null",
  "title": "서울숲 러닝 메이트 구해요",
  "workoutType": "러닝 | 헬스 | 농구 | 클라이밍 | 요가 | 기타",
  "level": "초급 | 중급 | 고급",
  "createdAt": "2026-04-09T02:30:00.000Z",
  "dueAt": "2026-04-09T06:30:00.000Z",
  "scheduledAt": "2026-04-09T08:30:00.000Z",
  "maxCount": 4,
  "currentCount": 2,
  "placeName": "서울숲",
  "placeDetail": "메인 산책로 입구 앞",
  "note": "5km 정도 가볍게 뛰고 스트레칭까지 마무리할 분을 찾고 있어요."
}
```

### `GET /api/work-with/locations/:locationId`

Purpose
- Fetch the work-with items shown in the map detail card for a selected place.

Path params
```json
{
  "locationId": "place-123"
}
```

Optional query
```json
{
  "placeName": "서울숲"
}
```

Response `200`
```json
{
  "locationId": "place-123",
  "items": [
    {
      "id": "place-123-demo-running",
      "locationId": "place-123",
      "title": "서울숲 러닝 메이트 구해요",
      "workoutType": "러닝",
      "level": "중급",
      "createdAt": "2026-04-09T02:30:00.000Z",
      "dueAt": "2026-04-09T06:30:00.000Z",
      "scheduledAt": "2026-04-09T08:30:00.000Z",
      "maxCount": 4,
      "currentCount": 2,
      "placeName": "서울숲",
      "placeDetail": "메인 산책로 입구 앞",
      "note": "5km 정도 가볍게 뛰고 스트레칭까지 마무리할 분을 찾고 있어요."
    }
  ]
}
```

Current behavior notes
- If in-memory stored items match `locationId`, the route returns those items.
- If no stored item matches `locationId` but `placeName` matches, the route returns those place-name matches.
- If nothing matches, the route returns demo seed items for the requested place so the UI still has comparison-ready detail cards.

### `POST /api/work-with`

Purpose
- Persist a new work-with posting from `/regist` into the current in-memory server store.

Request
```json
{
  "locationId": null,
  "workoutType": "러닝",
  "placeName": "서울숲",
  "placeDetail": "메인 산책로 입구 앞",
  "date": "2026-04-10",
  "time": "19:00",
  "level": "중급",
  "maxCount": 3,
  "note": "5km 정도 가볍게 달리고 싶어요"
}
```

Response `201`
```json
{
  "item": {
    "id": "generated-uuid",
    "locationId": null,
    "title": "서울숲 러닝 메이트 구해요",
    "workoutType": "러닝",
    "level": "중급",
    "createdAt": "2026-04-09T02:30:00.000Z",
    "dueAt": "2026-04-10T08:00:00.000Z",
    "scheduledAt": "2026-04-10T10:00:00.000Z",
    "maxCount": 3,
    "currentCount": 1,
    "placeName": "서울숲",
    "placeDetail": "메인 산책로 입구 앞",
    "note": "5km 정도 가볍게 달리고 싶어요"
  }
}
```

Representative error `400`
```json
{
  "message": "운동 종류, 장소, 날짜, 시간, 모집 조건을 모두 입력해 주세요."
}
```

Other implemented validation errors
- `지원하지 않는 운동 종류예요.`
- `지원하지 않는 운동 수준이에요.`
- `최대 인원은 2명 이상 12명 이하로 입력해 주세요.`
- `날짜와 시간을 다시 확인해 주세요.`
- `현재 이후 일정으로 모집해 주세요.`

Current constraints
- Storage is in-memory only and resets when the Node server restarts.
- No authenticated owner is attached to the posting yet.
- `locationId` is optional because `/regist` is not yet hard-bound to a selected map place.

## Contract summary

- Search suggestions use a thin server proxy and still depend on Kakao's payload shape.
- Map discovery results are normalized client-side into stable marker and discovery-state shapes.
- Auth now has a stable demo login contract and one persisted session shape.
- Work-with detail and posting now share explicit app-owned request-response contracts across client, server, and tests.
