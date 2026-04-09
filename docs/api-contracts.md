# API Contracts

## 1. 목적
프런트와 서버가 같은 목표를 보면서 작업할 수 있도록
**현재 상태**와 **가까운 미래의 목표 계약**을 함께 기록한다.

## 2. 현재 확인된 서버 계약
### `GET /kakao/get/search`
- Query:
  - `keyword`: string
- 역할:
  - Kakao 지도 검색 제안 API 프록시
- 현재 기대 결과:
  - 외부 응답을 거의 그대로 반환
- 현재 문제:
  - 응답 shape가 앱 관점에서 정리되어 있지 않을 수 있음
  - 에러 응답도 일관성이 약함

## 3. 현재 인증 상태
- 인증 관련 흔적은 있으나 아직 완료 상태가 아님
- 로그인 화면은 존재하지만, 백엔드 auth contract는 안정화되지 않음
- 따라서 M4 전까지는 인증을 "구현 진행 중"으로 본다

## 4. 목표 계약 초안
아래는 제품 골자를 유지한 상태에서 가까운 미래에 맞춰야 할 계약 초안이다.

### Auth
#### `POST /api/auth/login`
Request
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

Response 200
```json
{
  "accessToken": "jwt-or-session-token",
  "user": {
    "id": "string",
    "email": "user@example.com",
    "nickname": "string"
  }
}
```

Error
```json
{
  "message": "이메일 또는 비밀번호를 확인해주세요."
}
```

#### `GET /api/auth/me`
Response 200
```json
{
  "user": {
    "id": "string",
    "email": "user@example.com",
    "nickname": "string"
  }
}
```

### Workout posts
#### `GET /api/posts`
Query examples
- `sport`
- `region`
- `date`
- `timeRange`
- `level`
- `page`

Response 200
```json
{
  "items": [
    {
      "id": "string",
      "title": "하체 같이 하실 분",
      "sport": "헬스",
      "placeName": "string",
      "coordinates": {
        "lat": 0,
        "lng": 0
      },
      "scheduledAt": "2026-04-08T18:00:00+09:00",
      "level": "BEGINNER",
      "note": "string",
      "expiresAt": "2026-04-08T20:00:00+09:00"
    }
  ],
  "pageInfo": {
    "page": 1,
    "hasNext": false
  }
}
```

#### `POST /api/posts`
Request
```json
{
  "title": "등 운동 같이 하실 분",
  "sport": "헬스",
  "placeName": "강남구청역 인근 헬스장",
  "coordinates": {
    "lat": 37.0,
    "lng": 127.0
  },
  "scheduledAt": "2026-04-08T19:00:00+09:00",
  "level": "INTERMEDIATE",
  "note": "1시간 정도 예정",
  "expiresAt": "2026-04-08T18:30:00+09:00"
}
```

Response 201
```json
{
  "item": {
    "id": "string"
  }
}
```

### Search adapter
#### `GET /api/search/places`
- 내부적으로 Kakao 검색을 감싸는 앱 전용 계약
- 프런트는 장기적으로 `/kakao/get/search`보다 이 계약을 우선 사용한다

Response 200
```json
{
  "items": [
    {
      "id": "string",
      "name": "장소명",
      "address": "string",
      "coordinates": {
        "lat": 0,
        "lng": 0
      }
    }
  ]
}
```

## 5. 계약 원칙
- 프런트는 외부 API 원문에 직접 의존하지 않는다.
- 서버는 앱 관점의 안정된 shape를 제공한다.
- 모든 주요 응답에는 최소한 `message` 또는 명시적 data key가 있어야 한다.
- 시간은 ISO 문자열로 통일한다.
- 좌표는 `{ lat, lng }` 객체 형태로 통일한다.

## 6. 비목표
- 현재 단계에서 채팅, 소셜 피드, 랭킹 시스템 계약은 정의하지 않는다.
