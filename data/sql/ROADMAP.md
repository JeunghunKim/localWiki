# SQL 학습 로드맵

> 처음부터 시작하는 체계적인 SQL 학습 가이드

---

## 📌 대상 독자

- 데이터베이스를 처음 접하는 초보자
- SQL 기초를 탄탄히 다지고 싶은 개발자
- 데이터 분석에 SQL을 활용하고 싶은 분

## 🛠 실습 환경

학습 자료의 예제는 **SQLite** 기준으로 작성되었습니다. 아래 중 편한 환경을 선택하세요.

| 도구 | 설명 | 다운로드 |
|------|------|---------|
| SQLite CLI | 가볍고 설치가 간단 | https://www.sqlite.org/download.html |
| DB Browser for SQLite | GUI 환경 | https://sqlitebrowser.org |
| DBeaver | 다양한 DB 지원 GUI | https://dbeaver.io |
| PostgreSQL | 실무에 가까운 환경 | https://www.postgresql.org |

---

## 🗺 학습 로드맵

```
[입문]
 Chapter 1 → Chapter 2 → Chapter 3 → Chapter 4
    ↓
[중급]
 Chapter 5 → Chapter 6 → Chapter 7
    ↓
[실전]
 Chapter 8 → Chapter 9 → Chapter 10
```

---

## 📚 챕터 구성

| 챕터 | 제목 | 핵심 키워드 | 난이도 |
|------|------|------------|--------|
| [Chapter 1](chapter1.md) | SQL과 데이터베이스 기초 | DBMS, 테이블, 행, 열, 기본키, 외래키 | ⭐ |
| [Chapter 2](chapter2.md) | 기본 SELECT 문 | SELECT, FROM, *, AS, DISTINCT | ⭐ |
| [Chapter 3](chapter3.md) | WHERE 절과 필터링 | WHERE, AND, OR, NOT, BETWEEN, IN, LIKE, NULL | ⭐⭐ |
| [Chapter 4](chapter4.md) | 정렬과 제한 | ORDER BY, ASC, DESC, LIMIT, OFFSET | ⭐⭐ |
| [Chapter 5](chapter5.md) | 집계 함수와 GROUP BY | COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING | ⭐⭐ |
| [Chapter 6](chapter6.md) | JOIN | INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN | ⭐⭐⭐ |
| [Chapter 7](chapter7.md) | 서브쿼리 | 단일행/다중행 서브쿼리, 상관 서브쿼리, EXISTS | ⭐⭐⭐ |
| [Chapter 8](chapter8.md) | 데이터 조작 (DML) | INSERT, UPDATE, DELETE, TRUNCATE | ⭐⭐ |
| [Chapter 9](chapter9.md) | 테이블 설계 (DDL) | CREATE TABLE, 데이터 타입, 제약조건, ALTER, DROP | ⭐⭐⭐ |
| [Chapter 10](chapter10.md) | 고급 SQL | VIEW, INDEX, TRANSACTION, CTE, 윈도우 함수 | ⭐⭐⭐⭐ |

---

## 📁 파일 구조

```
sql-learning/
├── ROADMAP.md          ← 이 파일
├── chapter1.md         ← 챕터별 학습 자료 (마크다운)
├── chapter1.tex        ← 챕터별 학습 자료 (LaTeX/XeTeX)
├── chapter2.md
├── chapter2.tex
├── ...
├── chapter10.md
└── chapter10.tex
```

### LaTeX 파일 컴파일 방법

```bash
xelatex chapter1.tex
```

---

## 💡 학습 팁

1. **직접 쳐보기**: 예제 코드를 눈으로만 읽지 말고 반드시 직접 입력하고 실행하세요.
2. **연습 문제 풀기**: 각 챕터 끝의 연습 문제를 풀어보세요.
3. **에러를 두려워하지 말기**: SQL 에러 메시지는 문제 해결의 단서입니다.
4. **실습 DB 만들기**: 학습용 샘플 데이터베이스를 직접 만들어 실습하세요.
5. **순서대로 진행**: 앞 챕터를 이해한 후 다음 챕터로 넘어가세요.

---

## 🔗 추가 학습 자료

- [SQLite 공식 문서](https://www.sqlite.org/docs.html)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [W3Schools SQL Tutorial](https://www.w3schools.com/sql/)
- [Mode SQL Tutorial](https://mode.com/sql-tutorial/)

---

*이 학습 자료는 한국어로 작성되었으며, 실습 환경은 SQLite를 기준으로 합니다.*
