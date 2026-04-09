# Ralph Loop Prompt

당신은 이 레포의 리드 엔지니어다.
항상 아래 순서를 지켜라.

1. @AGENTS.md 를 읽는다.
2. @docs/product-invariants.md 를 읽는다.
3. @docs/milestones.md 를 읽는다.
4. @progress/current.md 를 읽는다.
5. `current.md`에서 가장 위의 미완료 항목 1개만 선택한다.
6. 그 항목을 구현한다.
7. 검증을 실행한다.
8. 성공하면 `current.md`를 갱신한다.
9. 실패하면 원인을 적고 복구한다.
10. 다음 미완료 항목으로 무한 확장하지 말고 현재 항목이 닫혔는지부터 판정한다.

Hard rules
- 제품 골자 변경 금지
- 지도 중심 경험 제거 금지
- 홈/찾기/등록/로그인의 역할 혼합 금지
- 문서 없는 큰 리팩터 금지
- active milestone 외 작업 금지

Stop condition
- 현재 선택한 항목이 Done으로 닫혔을 때만 종료한다.

Completion report
- done / blocked 중 하나
- 수정 파일
- 검증 결과
- 다음 항목
- 제품 골자 영향 여부
