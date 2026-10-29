# Call of Bengal — 괴담 교환소·기여작가 확장 운영 안내

이 파일은 **2026-10-29 공식 장문 기준본**에 추가되는 기능의 운영 안내다. 기존 민담 자료실과 `data/stories.json`은 변경하지 않는다.

## 공개 기능
- `/exchange.html`: 한국·벵골 기여작가 괴담 목록, 썸네일·소개·작가·출처 링크, 검색 및 지역 필터 (`?q=...&region=korea|bengal`).
- `/contributors.html`: 한국·벵골 작가 2열 목록. 작가 이름 클릭 또는 `?author=작가ID`로 상세 창 열기. 상세 창의 작품 목록은 공개 작품 데이터에서 자동으로 집계된다.
- `assets/exchange.js`, `assets/contributors.js`: 별도 스크립트이므로 기존 `assets/site.js`는 수정하지 않는다.
- 빈 공개 데이터 상태에서는 임의의 작품·작가 대신 안내 문구만 보여 준다.

## 1. 작가 데이터 등록
`data/contributors.json`은 배열이다. 실제 공개 및 프로필 공개 허락을 확인한 작가를 추가한다.

```json
[
  {
    "id": "author-001",
    "published": true,
    "region": "korea",
    "name_ko": "[공개 허락을 받은 이름 또는 필명]",
    "name_original": "",
    "original_language": "ko",
    "bio_ko": "[동의한 소개만 작성]",
    "links": [
      {"label": "Instagram", "url": "https://example.org/profile"}
    ]
  }
]
```

`region`은 `korea` 또는 `bengal`이다. `id`는 URL 쿼리에 사용되므로 영문·숫자·하이픈 등으로 구성하고 중복되지 않아야 한다. 외부 링크는 실제 주소만 사용한다. `published:false`이면 목록에서 보이지 않는다.

## 2. 작품 등록
`templates/exchange-story-template.html`을 복사하여 `exchange-stories/exc-001.html`처럼 **실제 작품별 HTML**로 만들고, 빈칸을 확인된 정보로 채운다. 게시할 파일에서는 템플릿에만 있는 `noindex,nofollow`를 제거하고 고유 title·description·canonical 메타를 작성한다. 작성한 작품의 원문·번역 허락을 먼저 확인한다. 상세페이지의 작가 링크는 `../contributors.html?author=author-001`처럼 고유 ID와 일치시킨다.

`data/exchange-stories.json`에 해당 작품을 등록한다.

```json
[
  {
    "id": "EXC-001",
    "published": true,
    "author_id": "author-001",
    "region": "korea",
    "title_ko": "[작품 제목]",
    "title_original": "",
    "original_language": "ko",
    "summary_ko": "[짧은 작품 소개]",
    "url": "exchange-stories/exc-001.html",
    "cover_image": "assets/exchange/exc-001.webp",
    "source_url": "",
    "translator_ko": "",
    "editor_ko": "",
    "published_at": "2026-10-29",
    "tags": []
  }
]
```

- `author_id`는 `contributors.json`의 공개 작가 ID와 일치해야 표시된다.
- `published`가 `true`이고 유효한 `url`을 가진 작품만 화면에 표시된다. `published:false`인 작품은 작가 상세 창에도 나타나지 않는다.
- `cover_image`는 선택 사항이며 `assets/exchange/`에 WebP, PNG, JPEG를 둔다. 이미지가 없으면 기존 색상에 맞춘 텍스트 없는 장식형 대체 표지가 표시된다.
- `source_url`은 **작품 원문 게시물 URL**이 실제 공개된 경우에만 넣는다. 작가 SNS 계정은 별도로 작가 데이터의 `links`에 넣는다.
- 원고 내용이 DM으로 제공된 경우 허구의 원문 URL을 만들지 말고, 상세페이지에 비공개 제출 원고임을 정확하게 기록한다.
- JSON 파일이나 독립 HTML 문서를 새로 만들 때는 UTF-8로 저장한다.

## 3. 공개 절차
1. 공개·번역·표지 이용 동의를 받고 작가 정보를 공개 허락 범위에서 등록한다.
2. 실제 작품 상세 HTML과 이미지 제작(원고 허락 및 출처 표기 검토).
3. `exchange-stories.json`에 작품 항목 등록, `published:true` 확인.
4. 작가 ID 연결, 카드 검색 및 모달의 클릭 가능한 작품 링크 검사.
5. **공개한 작품 HTML URL만** `sitemap.xml`에 추가. 기존 URL은 보존.
6. 모바일·키보드·한국어/벵골어 가독성, GitHub Pages 배포 후 경로 확인.

## 4. 저장소에 반영할 때
이 업데이트 ZIP을 압축 해제하여 **GitHub 저장소 루트에 같은 경로로 병합**한다. 이전 공식 기준 ZIP 파일 전체를 업로드할 필요는 없다. 사이트가 프로젝트 하위 경로 `/Call-of-Bengal/`에 배포되므로 파일을 저장소 루트에 두어야 한다.

**배포 검증 범위:** 이 ZIP은 로컬 공식 기준본을 대상으로 수정·검사한 것이며, GitHub 원격의 최신 커밋을 확인하지 못했다. 원격에서 이미 수정한 파일이 있다면 먼저 비교·병합한다.
