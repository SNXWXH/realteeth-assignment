# **날씨 웹앱 구현 과제**

React + TypeScript + Tanstack Query 기반의 날씨 정보 제공 웹 애플리케이션입니다.

## **사용한 기술 스택**

| 구분                         | 라이브러리           | 버전    |
| ---------------------------- | -------------------- | ------- |
| **Core**                     | React                | 19.2.0  |
|                              | TypeScript           | 5.9.3   |
|                              | Vite                 | 7.3.1   |
| **라우팅**                   | React Router         | 7.13.0  |
| **상태 관리 및 데이터 페칭** | TanStack React Query | 5.90.21 |
|                              | Axios                | 1.13.5  |
| **스타일링**                 | Tailwind CSS         | 4.1.18  |
|                              | React Icons          | 5.5.0   |

### **외부 API**

- OpenWeatherMap API: 날씨 데이터
- Air Korea API: 대기질 데이터
- IP Geolocation API: IP 기반 위치 정보
- OpenStreetMap Nominatim API: 지오코딩/역지오코딩

## **프로젝트 구조**

```
src/
├── app/                           # 애플리케이션 진입점
│   ├── App.tsx                   # 라우터 설정
│   ├── providers/                # 전역 Provider 설정
│   ├── styles/                   # 전역 스타일
│   └── index.ts
├── pages/                         # 페이지 컴포넌트
│   ├── main/                     # 메인 대시보드
│   │   └── ui/                   # 페이지 UI
│   └── city-detail/              # 도시 상세 정보
│       └── ui/                   # 페이지 UI
├── features/                      # 기능 모듈 (비즈니스 로직)
│   ├── location-detection/       # 현재 위치 감지
│   │   └── model/                # React Query 훅
│   ├── location-search/          # 위치 검색
│   │   ├── api/                  # Nominatim API
│   │   ├── model/                # 검색 로직
│   │   └── ui/                   # 검색 입력 UI
│   ├── weather-data/             # 날씨 데이터
│   │   └── model/                # React Query 훅
│   └── favorite-management/      # 즐겨찾기 관리
│       ├── model/                # 즐겨찾기 상태 관리
│       └── ui/                   # 즐겨찾기 버튼
├── widgets/                       # 재사용 UI 위젯 (조합 컴포넌트)
│   ├── current-weather/          # 현재 날씨 카드
│   ├── weather-details/          # 날씨 상세 정보
│   ├── hourly-forecast/          # 시간별 예보
│   ├── weekly-forecast/          # 주간 예보
│   ├── sun-info/                 # 일출/일몰 정보
│   ├── air-quality/              # 대기질 정보
│   ├── favorite-cities/          # 즐겨찾기 도시 목록
│   └── layout/                   # 레이아웃 컴포넌트
└── shared/                        # 공유 리소스
    ├── api/                      # API 클라이언트
    ├── config/                   # 설정 파일
    ├── data/                     # 정적 데이터
    ├── hooks/                    # 공용 React 훅
    ├── lib/                      # 유틸리티 함수
    │   ├── air-quality/          # 대기질 유틸
    │   ├── date/                 # 날짜 포맷팅
    │   └── weather/              # 날씨 아이콘 등
    └── ui/                       # 기본 UI 컴포넌트
        ├── Button/
        ├── Card/
        └── Input/
```

## **구현한 기능**

### **1. 날씨 정보 조회**

- 현재 날씨: 온도, 체감 온도, 최고/최저 기온
- 시간별 예보: 24시간 시간대별 날씨 및 강수 확률
- 주간 예보: 7일간의 일별 예보
- 부가 정보: 일출/일몰 시간, 습도, 풍속

### **2. 대기질 정보 조회**

- 통합 대기질 지수(KHAI)
- 미세/초미세먼지 수치
- 대기질 등급: 좋음/보통/나쁨/매우나쁨

### **3. 위치 검색**

- 동/읍/면 단위 한국 행정 구역 자동완성 검색
- OpenStreetMap Nominatim API 기반 지오코딩
- 검색한 위치의 상세 날씨 정보 조회
- 위치 정보 수집 (Hybrid Geolocation)
  1. 1차 시도: Browser Geolocation API (높은 정확도, 사용자 권한 필요)
  2. 2차 시도: IP Geolocation API (중간 정확도, 권한 불필요)
  3. Reverse Geocoding: 좌표를 주소로 변환하여 도시명 추출

### **4. 즐겨찾기 관리**

- 최대 6개 도시 저장 (localStorage 기반)
- 메인 페이지에서 즐겨찾기 도시의 실시간 날씨 확인
- 도시명 별칭 수정
- 즐겨찾기 도시 클릭 시 상세 정보 페이지로 이동

## **기술적 의사결정 및 이유**

### **Feature-Sliced Design (FSD) 아키텍처**

프로젝트를 명확한 계층으로 분리하여 확장성과 유지보수성을 높였습니다.

- `app`: 애플리케이션 진입점 및 전역 설정
- `pages`: 라우팅 대상 페이지 컴포넌트
- `features`: 독립적인 비즈니스 로직 (검색, 즐겨찾기)
- `widgets`: 재사용 가능한 조합 UI 컴포넌트
- `shared`: 공유 리소스 (API, hooks, utils, UI)

⇒ ESLint Boundaries 플러그인을 통해 계층 간 의존성 규칙을 강제하여 아키텍처 일관성을 유지하였습니다.

### **React Query 기반 상태 관리**

서버 상태 관리를 위해 React Query를 도입하였습니다.

- 데이터 페칭: `useWeatherQuery`, `useAirQualityQuery`, `useLocationQuery`
- 자동 캐싱: staleTime/gcTime 설정으로 불필요한 API 호출 방지
- 에러 처리 및 재시도: 네트워크 불안정 상황에서도 안정적인 동작
- **캐싱 전략**:
  - 날씨 데이터: staleTime 10분, gcTime 30분
  - 대기질 데이터: staleTime 30분, gcTime 60분
  - 위치 데이터: staleTime 60분, gcTime 120분

### **API 에러 처리 및 사용자 피드백**

API 호출 실패 시 사용자에게 명확한 피드백을 제공합니다.

- `429 Rate Limit`: "API 호출이 너무 많습니다. 잠시 후 다시 시도해주세요."
- `500+ Server Error`: "서비스가 일시적으로 불안정합니다..."
- `Network Error`: "네트워크 연결을 확인해주세요."

### **Hybrid Geolocation 구현**

사용자 경험을 최적화하기 위해 2단계 위치 수집 방식을 구현했습니다.

1. Browser Geolocation API: 높은 정확도를 제공하지만 권한 필요
2. IP Geolocation API: 권한 거부 시 중간 정확도로 대체

⇒ 이를 통해 권한 거부 상황에서도 기본 기능을 제공할 수 있습니다.

### **LocalStorage 기반 즐겨찾기**

sessionStorage와 DB를 비교했을 때 단순한 키-값 구조의 소규모 데이터 저장이 목적이었기 때문에 localStorage를 선택했습니다.

- 페이지 새로고침 시에도 즐겨찾기 유지
- 최대 6개 제한으로 UI/UX 일관성 확보

## **프로젝트 실행 방법**

- 배포된 서버: [realteeth-assignment-delta.vercel.app](https://realteeth-assignment-delta.vercel.app/)

### **1. 환경 변수 설정**

프로젝트 루트에 `.env` 파일을 생성하고 다음 API 키를 설정합니다.

| API                                                                                    | 설명                   |
| -------------------------------------------------------------------------------------- | ---------------------- |
| [**IPGeolocation.io**](https://ipgeolocation.io/)                                      | IP 기반 위치 조회      |
| [**OpenWeather**](https://www.notion.so/HTTPS-97faef5a0d59427ca9a4f97694965de1?pvs=21) | 현재 날씨 및 예보 조회 |
| [**공공데이터포털 (에어코리아)**](https://www.data.go.kr/data/15073861/openapi.do)     | 미세먼지 정보 조회     |

```
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key
VITE_AIR_KOREA_API_KEY=your_air_korea_service_key
VITE_GEOLOCATION_API_KEY=your_ipgeolocation_api_key
```

### **2. 의존성 설치**

```bash
npm install
```

### **3. 개발 서버 실행**

```bash
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:5173`으로 접속합니다.

### **4. 빌드**

```bash
npm run build
```
