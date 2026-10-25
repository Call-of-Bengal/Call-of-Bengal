# Call of Bengal — public site

정적 GitHub Pages 웹사이트. 한국어 본문 아래 벵골어 병기.

## 배포

ZIP 압축을 풀고 **내용물 전체**를 GitHub 저장소 최상위에 올리세요. `assets/`, `data/` 폴더 구조를 유지해야 합니다. ZIP 자체를 업로드하지 마세요.

기존 저장소의 `stories/story-001.html`은 이전 버전의 **가상 예시 페이지**입니다. GitHub 저장소에서 직접 삭제하세요. 이번 배포 ZIP에는 포함하지 않았습니다.

## 민담 등록 (향후)

`data/stories.json`에 검증한 민담 기록을 추가하고, `stories/`에 실제 상세 HTML 페이지를 만든 후 `published: true`로 설정합니다. 다음은 **필드 구조만 보여주는 JSON 예시**이며 게시할 실데이터가 아닙니다.

```json
[
  {
    "title_ko": "검증된 한국어 제목",
    "title_bn": "যাচাই করা বাংলা নাম",
    "genre": "fantasy",
    "url": "stories/story-002.html",
    "summary_ko": "검증한 줄거리",
    "summary_bn": "যাচাই করা সারসংক্ষেপ",
    "collector_ko": "수집가",
    "collector_bn": "সংকলক",
    "tags": ["키워드"],
    "published": false
  }
]
```

장르 키: `fantasy`, `horror`, `romance`, `moral`.

## 검색엔진

각 페이지에 메타 설명, OG 제목/설명, SVG 파비콘, 모바일 레이아웃이 포함되어 있습니다. 실제 GitHub Pages 주소를 정한 뒤 Google Search Console에서 사이트 소유권을 확인하세요. 도메인 주소를 모르는 상태에서 sitemap의 절대 URL을 임의로 만들지 않았습니다.
