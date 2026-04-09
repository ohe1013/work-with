# Apply Guide

이 번들은 `ohe1013/work-with` 레포에 아래 파일들을 새로 추가하기 위한 문서 번들입니다.

## 추가 순서
1. 루트에 `AGENTS.md` 추가
2. `client/AGENTS.md`, `server/AGENTS.md` 추가
3. `docs/`, `progress/`, `prompts/` 폴더 통째로 추가
4. 커밋 메시지 예시:
   - `docs: add codex operating guide and milestone plan`

## 그 다음 바로 할 작업
1. `progress/current.md` 기준으로 root 검증 스크립트 정리
2. 디자인 토큰과 공통 UI 프리미티브 정리
3. 홈/찾기/등록/로그인 흐름 순차 구현

## 추천 커밋 단위
- Commit 1: docs + agents + prompts
- Commit 2: root scripts + README dev runbook
- Commit 3: design system
- Commit 4: home/map
- Commit 5: find/regist
- Commit 6: auth/api
