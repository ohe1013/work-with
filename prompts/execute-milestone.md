# Codex Execute Prompt

아래 문서를 먼저 읽어라.
- @AGENTS.md
- @docs/product-invariants.md
- @docs/toss-inspired-ui-spec.md
- @docs/user-flows.md
- @docs/milestones.md
- @docs/api-contracts.md
- @progress/current.md

Goal
- `progress/current.md`의 Immediate next task 또는 가장 위 미완료 항목 하나만 구현한다.

Constraints
- 제품 골자 변경 금지
- 지도 경험 삭제 금지
- 활성 마일스톤 바깥 작업 금지
- 새 기능을 임의로 확장하지 말 것
- 구현 전후로 `progress/current.md`를 갱신할 것

Required process
1. 이번 반복에서 처리할 항목 1개를 선택한다.
2. 수정할 파일 후보를 먼저 정리한다.
3. 구현한다.
4. 관련 검증을 실행한다.
5. 실패 시 수정 후 다시 검증한다.
6. 결과를 `progress/current.md`에 반영한다.

Output format
- What changed
- Files changed
- Validation result
- Remaining risk
- Updated next task
