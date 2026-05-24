# Chapter 5: 집계 함수와 GROUP BY

## 학습 목표

- COUNT, SUM, AVG, MIN, MAX 집계 함수를 사용할 수 있다.
- GROUP BY로 데이터를 그룹화하여 집계할 수 있다.
- HAVING으로 그룹에 조건을 적용할 수 있다.
- WHERE와 HAVING의 차이를 명확히 이해한다.

---

## 5.1 집계 함수 개요

집계 함수는 여러 행의 값을 **하나의 결과값으로 계산**합니다.

| 함수 | 설명 | NULL 처리 |
|------|------|----------|
| `COUNT(*)` | 전체 행 수 | NULL 포함 |
| `COUNT(열)` | 해당 열의 NULL이 아닌 값 수 | NULL 제외 |
| `SUM(열)` | 합계 | NULL 제외 |
| `AVG(열)` | 평균 | NULL 제외 |
| `MIN(열)` | 최솟값 | NULL 제외 |
| `MAX(열)` | 최댓값 | NULL 제외 |

---

## 5.2 COUNT

```sql
-- 전체 고객 수
SELECT COUNT(*) FROM customers;
-- 결과: 5

-- 전체 고객 수 (별칭 지정)
SELECT COUNT(*) AS 고객수 FROM customers;

-- city가 NULL이 아닌 고객 수
SELECT COUNT(city) AS 도시입력고객수 FROM customers;

-- 서울 고객 수
SELECT COUNT(*) AS 서울고객수 FROM customers WHERE city = '서울';
-- 결과: 2
```

---

## 5.3 SUM

```sql
-- 전체 상품 재고 합계
SELECT SUM(stock) AS 총재고 FROM products;
-- 결과: 118

-- 전자제품 재고 합계
SELECT SUM(stock) AS 전자제품재고
FROM products
WHERE category = '전자제품';

-- 전체 주문 수량 합계
SELECT SUM(quantity) AS 총주문수량 FROM orders;
```

---

## 5.4 AVG

```sql
-- 전체 상품 평균 가격
SELECT AVG(price) AS 평균가격 FROM products;

-- 가구 평균 가격
SELECT AVG(price) AS 가구평균가격
FROM products
WHERE category = '가구';

-- 소수점 반올림 (ROUND 함수 활용)
SELECT ROUND(AVG(price), 0) AS 평균가격_반올림 FROM products;
```

---

## 5.5 MIN / MAX

```sql
-- 가장 저렴한 상품 가격
SELECT MIN(price) AS 최저가격 FROM products;

-- 가장 비싼 상품 가격
SELECT MAX(price) AS 최고가격 FROM products;

-- 여러 집계를 한 번에
SELECT
    COUNT(*) AS 상품수,
    MIN(price) AS 최저가,
    MAX(price) AS 최고가,
    AVG(price) AS 평균가,
    SUM(stock) AS 총재고
FROM products;
```

**결과:**

| 상품수 | 최저가 | 최고가  | 평균가  | 총재고 |
|--------|--------|---------|---------|--------|
| 6      | 35000  | 1500000 | 382500  | 118    |

---

## 5.6 GROUP BY

`GROUP BY`는 지정한 열의 **같은 값끼리 묶어서** 집계합니다.

```sql
SELECT 그룹열, 집계함수(열)
FROM 테이블
GROUP BY 그룹열;
```

```sql
-- 카테고리별 상품 수와 평균 가격
SELECT
    category AS 카테고리,
    COUNT(*) AS 상품수,
    ROUND(AVG(price), 0) AS 평균가격
FROM products
GROUP BY category;
```

**결과:**

| 카테고리 | 상품수 | 평균가격 |
|---------|--------|---------|
| 가구     | 2      | 215000  |
| 전자제품 | 4      | 516250  |

```sql
-- 도시별 고객 수
SELECT city, COUNT(*) AS 고객수
FROM customers
GROUP BY city
ORDER BY 고객수 DESC;
```

**결과:**

| city | 고객수 |
|------|--------|
| 서울 | 2      |
| 부산 | 1      |
| 대구 | 1      |
| 인천 | 1      |

---

## 5.7 GROUP BY + WHERE

`WHERE`는 **그룹화 전에** 행을 필터링합니다.

```sql
-- 전자제품만 카테고리별 집계 (전자제품만 해당되므로 그룹이 하나)
SELECT category, COUNT(*) AS 상품수, AVG(price) AS 평균가
FROM products
WHERE category = '전자제품'
GROUP BY category;

-- 2024년 주문만 고객별 집계
SELECT customer_id, COUNT(*) AS 주문수, SUM(quantity) AS 총수량
FROM orders
WHERE order_date >= '2024-01-01'
GROUP BY customer_id
ORDER BY 주문수 DESC;
```

---

## 5.8 HAVING

`HAVING`은 **그룹화 후에** 그룹에 조건을 적용합니다.

```sql
SELECT 그룹열, 집계함수(열)
FROM 테이블
GROUP BY 그룹열
HAVING 그룹조건;
```

```sql
-- 상품이 2개 이상인 카테고리만 조회
SELECT category, COUNT(*) AS 상품수
FROM products
GROUP BY category
HAVING COUNT(*) >= 2;
```

**결과:**

| category | 상품수 |
|----------|--------|
| 가구     | 2      |
| 전자제품 | 4      |

```sql
-- 평균 가격이 200,000원 이상인 카테고리
SELECT category, ROUND(AVG(price), 0) AS 평균가격
FROM products
GROUP BY category
HAVING AVG(price) >= 200000;
```

---

## 5.9 WHERE vs HAVING

| 구분 | WHERE | HAVING |
|------|-------|--------|
| 적용 시점 | 그룹화 전 (개별 행) | 그룹화 후 (그룹) |
| 집계 함수 사용 | ❌ 불가 | ✅ 가능 |
| 대상 | 개별 행 필터링 | 그룹 필터링 |

```sql
-- WHERE: 그룹화 전 필터 / HAVING: 그룹화 후 필터
SELECT category, COUNT(*) AS 상품수, AVG(price) AS 평균가
FROM products
WHERE stock > 0          -- 재고 있는 상품만 포함 (개별 행 필터)
GROUP BY category
HAVING COUNT(*) >= 2;    -- 2개 이상인 카테고리만 (그룹 필터)
```

---

## 5.10 GROUP BY 규칙

> **중요**: `SELECT` 절에는 `GROUP BY`에 포함된 열과 집계 함수만 사용할 수 있습니다.

```sql
-- ❌ 잘못된 쿼리 (name은 GROUP BY에 없고 집계 함수도 아님)
SELECT category, name, COUNT(*)
FROM products
GROUP BY category;

-- ✅ 올바른 쿼리
SELECT category, COUNT(*), MIN(price), MAX(price)
FROM products
GROUP BY category;
```

---

## 5.11 DISTINCT vs GROUP BY

`COUNT(DISTINCT 열)`로 유일한 값의 수를 셀 수 있습니다.

```sql
-- 주문에 등장한 고유 고객 수
SELECT COUNT(DISTINCT customer_id) AS 주문고객수 FROM orders;
-- 결과: 5

-- 카테고리 수
SELECT COUNT(DISTINCT category) AS 카테고리수 FROM products;
-- 결과: 2
```

---

## 연습 문제

**1번.** `products` 테이블에서 전체 상품의 최고가, 최저가, 평균가를 한 번에 조회하세요.

**2번.** `orders` 테이블에서 `customer_id`별 총 주문 수를 조회하세요.

**3번.** `products` 테이블에서 카테고리별 총 재고(`stock`) 합계를 조회하세요.

**4번.** `orders` 테이블에서 `customer_id`별 총 주문 수가 2건 이상인 고객만 조회하세요.

**5번.** `products` 테이블에서 카테고리별 평균 가격을 구하고, 평균 가격 내림차순으로 정렬하세요.

**6번.** `orders` 테이블에서 2024년 2월 이후(`order_date >= '2024-02-01'`)의 주문만 대상으로 `customer_id`별 총 주문 수량 합계를 구하세요.

---

## 정답

```sql
-- 1번
SELECT MAX(price) AS 최고가, MIN(price) AS 최저가, ROUND(AVG(price), 0) AS 평균가
FROM products;

-- 2번
SELECT customer_id, COUNT(*) AS 주문수
FROM orders
GROUP BY customer_id;

-- 3번
SELECT category, SUM(stock) AS 총재고
FROM products
GROUP BY category;

-- 4번
SELECT customer_id, COUNT(*) AS 주문수
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 2;

-- 5번
SELECT category, ROUND(AVG(price), 0) AS 평균가격
FROM products
GROUP BY category
ORDER BY 평균가격 DESC;

-- 6번
SELECT customer_id, SUM(quantity) AS 총주문수량
FROM orders
WHERE order_date >= '2024-02-01'
GROUP BY customer_id;
```

---

*이전 챕터: [Chapter 4 - 정렬과 제한](chapter4.md)*
*다음 챕터: [Chapter 6 - JOIN](chapter6.md)*
