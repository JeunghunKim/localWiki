# Chapter 4: 정렬과 제한

## 학습 목표

- ORDER BY를 사용해 결과를 원하는 순서로 정렬할 수 있다.
- 오름차순(ASC)과 내림차순(DESC)의 차이를 이해한다.
- 여러 열로 정렬하는 방법을 습득한다.
- LIMIT와 OFFSET으로 결과 행 수를 제한할 수 있다.

---

## 4.1 ORDER BY 기본

`ORDER BY` 절은 조회 결과를 특정 열 기준으로 정렬합니다.

```sql
SELECT 열이름
FROM 테이블이름
[WHERE 조건]
ORDER BY 정렬기준열 [ASC | DESC];
```

```sql
-- 가격 오름차순 정렬 (기본값)
SELECT name, price FROM products ORDER BY price;

-- 가격 오름차순 (명시적)
SELECT name, price FROM products ORDER BY price ASC;
```

**결과:**

| name   | price   |
|--------|---------|
| 마우스 | 35000   |
| 키보드 | 80000   |
| 의자   | 180000  |
| 책상   | 250000  |
| 모니터 | 450000  |
| 노트북 | 1500000 |

---

## 4.2 DESC - 내림차순 정렬

```sql
-- 가격 내림차순 정렬 (비싼 것부터)
SELECT name, price FROM products ORDER BY price DESC;
```

**결과:**

| name   | price   |
|--------|---------|
| 노트북 | 1500000 |
| 모니터 | 450000  |
| 책상   | 250000  |
| 의자   | 180000  |
| 키보드 | 80000   |
| 마우스 | 35000   |

```sql
-- 가입일 최신순 정렬
SELECT name, join_date FROM customers ORDER BY join_date DESC;
```

---

## 4.3 여러 열로 정렬

쉼표로 구분하여 **여러 열로 순차 정렬**할 수 있습니다. 앞의 정렬 기준이 같을 때 다음 기준을 적용합니다.

```sql
-- 카테고리 오름차순, 같은 카테고리 내에서는 가격 내림차순
SELECT name, category, price
FROM products
ORDER BY category ASC, price DESC;
```

**결과:**

| name   | category | price   |
|--------|----------|---------|
| 책상   | 가구     | 250000  |
| 의자   | 가구     | 180000  |
| 노트북 | 전자제품 | 1500000 |
| 모니터 | 전자제품 | 450000  |
| 키보드 | 전자제품 | 80000   |
| 마우스 | 전자제품 | 35000   |

---

## 4.4 NULL 정렬 동작

정렬 시 `NULL` 값의 위치는 DBMS마다 다릅니다.

| DBMS | NULL 오름차순 | NULL 내림차순 |
|------|------------|------------|
| PostgreSQL | 마지막 | 처음 |
| MySQL | 처음 | 마지막 |
| SQLite | 처음 | 마지막 |
| Oracle | 마지막 | 처음 |

```sql
-- PostgreSQL: NULLS FIRST / NULLS LAST 명시 가능
SELECT name, city FROM customers ORDER BY city NULLS FIRST;
SELECT name, city FROM customers ORDER BY city NULLS LAST;
```

---

## 4.5 LIMIT - 결과 행 수 제한

`LIMIT`는 반환할 행의 **최대 개수**를 지정합니다. (SQLite, MySQL, PostgreSQL 지원)

```sql
-- 상위 3개만 조회
SELECT name, price FROM products ORDER BY price DESC LIMIT 3;
```

**결과:**

| name   | price   |
|--------|---------|
| 노트북 | 1500000 |
| 모니터 | 450000  |
| 책상   | 250000  |

> **실용적 활용**: 가장 비싼/저렴한 상품, 최신 주문, 상위 N개 조회 등에 활용합니다.

---

## 4.6 OFFSET - 결과 건너뛰기

`OFFSET`은 지정한 수만큼 행을 **건너뛰고** 결과를 반환합니다. 페이징 구현에 활용합니다.

```sql
-- 4번째부터 6번째 상품 조회 (3개 건너뛰고 3개)
SELECT name, price FROM products ORDER BY price DESC LIMIT 3 OFFSET 3;
```

**결과:**

| name   | price  |
|--------|--------|
| 의자   | 180000 |
| 키보드 | 80000  |
| 마우스 | 35000  |

### 페이징 패턴

```sql
-- 페이지 1 (1~10번째)
SELECT * FROM products ORDER BY product_id LIMIT 10 OFFSET 0;

-- 페이지 2 (11~20번째)
SELECT * FROM products ORDER BY product_id LIMIT 10 OFFSET 10;

-- 페이지 3 (21~30번째)
SELECT * FROM products ORDER BY product_id LIMIT 10 OFFSET 20;

-- 일반 공식: OFFSET = (페이지번호 - 1) * 페이지크기
```

---

## 4.7 열 번호로 정렬

열 이름 대신 SELECT 절의 **열 번호**로 정렬할 수 있습니다 (권장하지 않음).

```sql
-- name이 1번째, price가 2번째 열
SELECT name, price FROM products ORDER BY 2 DESC;  -- price 기준 내림차순
```

> ⚠️ 열 번호 사용은 가독성을 낮추므로 실무에서는 열 이름을 명시하는 것이 좋습니다.

---

## 4.8 ORDER BY와 WHERE 함께 사용

```sql
-- 전자제품 중 가격 상위 3개
SELECT name, price, category
FROM products
WHERE category = '전자제품'
ORDER BY price DESC
LIMIT 3;
```

**결과:**

| name   | price   | category |
|--------|---------|----------|
| 노트북 | 1500000 | 전자제품 |
| 모니터 | 450000  | 전자제품 |
| 키보드 | 80000   | 전자제품 |

---

## 4.9 SQL Server의 TOP

SQL Server에서는 `LIMIT` 대신 `TOP`을 사용합니다.

```sql
-- SQL Server 문법
SELECT TOP 3 name, price FROM products ORDER BY price DESC;

-- TOP PERCENT
SELECT TOP 50 PERCENT name, price FROM products ORDER BY price DESC;
```

---

## 연습 문제

**1번.** `customers` 테이블에서 가입일(`join_date`) 기준 최신순으로 정렬하여 전체를 조회하세요.

**2번.** `products` 테이블에서 가격이 낮은 순서로 상위 3개를 조회하세요.

**3번.** `products` 테이블에서 카테고리별로 정렬하고 같은 카테고리 내에서는 재고(`stock`) 내림차순으로 조회하세요.

**4번.** `products` 테이블을 가격 내림차순으로 정렬하여 3번째~5번째 상품을 조회하세요.

**5번.** `orders` 테이블에서 주문일 최신순으로 정렬하여 최근 5건을 조회하세요.

---

## 정답

```sql
-- 1번
SELECT * FROM customers ORDER BY join_date DESC;

-- 2번
SELECT name, price FROM products ORDER BY price ASC LIMIT 3;

-- 3번
SELECT name, category, stock FROM products ORDER BY category ASC, stock DESC;

-- 4번
SELECT name, price FROM products ORDER BY price DESC LIMIT 3 OFFSET 2;

-- 5번
SELECT * FROM orders ORDER BY order_date DESC LIMIT 5;
```

---

*이전 챕터: [Chapter 3 - WHERE 절과 필터링](chapter3.md)*
*다음 챕터: [Chapter 5 - 집계 함수와 GROUP BY](chapter5.md)*
