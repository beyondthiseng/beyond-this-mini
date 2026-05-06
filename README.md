# Beyond This Management Mini — v1.0

> 이보다 더 영어교습소 전용 소규모 학원관리 웹앱

---

## 🚀 실행 방법

```bash
# 1. 의존성 설치 (최초 1회)
npm install

# 2. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 열면 바로 됩니다.

---

## 📦 빌드 (배포용)

```bash
npm run build
# dist/ 폴더가 생성됩니다
```

---

## 📁 폴더 구조

```
src/
├── types/index.ts          ← TypeScript 인터페이스 전체
├── data/
│   ├── storage.ts          ← localStorage 유틸 + 샘플 데이터
│   ├── levelTemplates.ts   ← 레벨별 Radar 영역 + 상수
│   └── questionBank.ts     ← 입학테스트 문제 DB
├── components/
│   ├── layout/Sidebar.tsx
│   └── ui/
│       ├── index.tsx       ← Badge, Btn, Card, Field, Tabs, Modal ...
│       └── RadarChart.tsx  ← SVG Radar Chart (React + print용 string 생성)
└── screens/
    ├── Dashboard.tsx
    ├── StudentList.tsx
    ├── StudentDetail.tsx
    ├── Marketing.tsx
    ├── AdmissionTest.tsx   ← 적응형 입학테스트 + 결과지 출력
    ├── LessonLog.tsx       ← 수업 기록
    ├── GradeManagement.tsx ← 성적 관리 + A4 성적표 출력
    └── PaymentManagement.tsx
```

---

## ✅ 구현된 기능

| 기능 | 내용 |
|------|------|
| 대시보드 | 통계 카드, 오늘 연락 필요, 미납, 상태별 현황 |
| 학생관리 | 추가/수정/상태변경/메모/연락관리 |
| 마케팅 | 문의~퇴원 학생 필터, 연락일 정렬, 문자 템플릿 5개 복사 |
| 입학테스트 | 적응형 2단계 알고리즘, 레벨별 문제 DB, 결과지 인쇄 |
| 수업기록 | 출석/지각/결석, 진도/숙제/반응/메모 |
| 성적관리 | 레벨별 6축 Radar Chart, 현재+기준 점수 비교, A4 성적표 출력 |
| 결제관리 | 월별 수강료, 납부 처리, 미납 필터 |
| 데이터 | localStorage 자동저장, JSON 전체 내보내기 |

---

## 🔒 보안 주의사항

- 현재 버전은 **로컬 전용**입니다. 공용 PC에서 사용하지 마세요.
- JSON 백업 파일에는 학부모 연락처가 포함됩니다. 안전한 폴더에 보관하세요.
- 외부 접근이 필요한 경우 Supabase + Row Level Security 추가 필요합니다.

---

## 🗺 향후 확장 로드맵

- [ ] IndexedDB로 저장소 전환 (대용량 데이터)
- [ ] Supabase 연동 (멀티 디바이스)
- [ ] 네이버 알림톡 / 카카오 알림 API 연동
- [ ] 반(그룹) 관리 기능
- [ ] 쪽지시험 점수 별도 입력

---

Made with ❤️ for 이보다 더 영어교습소
