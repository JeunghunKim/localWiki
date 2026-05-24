# Chapter 7: 서브쿼리

## 학습 목표

- 서브쿼리(하위 쿼리)의 개념을 이해한다.
- 단일 행 서브쿼리, 다중 행 서브쿼리를 작성할 수 있다.
- 상관 서브쿼리(Correlated Subquery)를 이해하고 활용할 수 있다.
- EXISTS / NOT EXISTS 연산자를 사용할 수 있다.
- 인라인 뷰(FROM 절 서브쿼리)를 작성할 수 있다.

---

## 7.1 서브쿼리란?

**서브쿼리(Subquery)** 는 다른 SQL 문 안에 포함된 SQL 문입니다. 괄호 `()`로 감쌉니다.

```sql
SELECT *
FROM products
WHERE price > (SELECT AVG(price) FROM products);  -- 서브쿼리
```

서브쿼리는 위치에 따라 세 가지로 나뉩니다.

| 위치 | 이름 | 설명 |
|------|------|------|
| WHERE 절 | 중첩 서브쿼리 | 조건 비교에 사용 |
| FROM 절 | 인라인 뷰 | 임시 테이블처럼 사용 |
| SELECT 절 | 스칼라 서브쿼리 | 단일 값을 열로 사용 |

---

## 7.2 단일 행 서브쿼리

단일 행 서브쿼리는 **하나의 행과 하나의 열**을 반환합니다. `=`, `>`, `<` 등의 비교 연산자와 함께 사용합니다.

```sql
-- 평균 가격보다 비싼 상품
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);
```

**결과:**

| name   | price   |
|--------|---------|
| 노트북 | 1500000 |
| 모니터 | 450000  |

```sql
-- 가장 비싼 상품 조회
SELECT name, price
FROM products
WHERE price = (SELECT MAX(price) FROM products);
-- 결과: 노트북, 1500000

-- 가장 많은 주문을 한 고객 ID 조회
SELECT name
FROM customers
WHERE customer_id = (
    SELECT customer_id
    FROM orders
    GROUP BY customer_id
    ORDER BY COUNT(*) DESC
    LIMIT 1
);
```

---

## 7.3 다중 행 서브쿼리

다중 행 서브쿼리는 **여러 행**을 반환합니다. `IN`, `ANY`, `ALL` 등의 연산자와 함께 사용합니다.

### IN 사용

```sql
-- 주문을 한 적 있는 고객 목록
SELECT name, city
FROM customers
WHERE customer_id IN (
    SELECT DISTINCT customer_id FROM orders
);

-- 전자제품을 주문한 고객 목록
SELECT DISTINCT c.name
FROM customers c
WHERE c.customer_id IN (
    SELECT o.customer_id
    FROM orders o
    INNER JOIN products p ON o.product_id = p.product_id
    WHERE p.category = '전자제품'
);
```

### NOT IN 사용

```sql
-- 한 번도 주문하지 않은 고객
SELECT name, email
FROM customers
WHERE customer_id NOT IN (
    SELECT DISTINCT customer_id FROM orders
);
```

> ⚠️ `NOT IN`은 서브쿼리 결과에 NULL이 포함되면 예상치 못한 결과가 나올 수 있습니다. 이 경우 `NOT EXISTS`를 사용하는 것이 안전합니다.

---

## 7.4 스칼라 서브쿼리 (SELECT 절)

SELECT 절에서 사용하며 **단일 값**을 반환합니다.

```sql
-- 각 상품의 가격과 평균 가격의 차이
SELECT
    name,
    price,
    (SELECT AVG(price) FROM products) AS 전체평균가격,
    price - (SELECT AVG(price) FROM products) AS 평균과의차이
FROM products
ORDER BY 평균과의차이 DESC;
```

---

## 7.5 인라인 뷰 (FROM 절 서브쿼리)

FROM 절에 서브쿼리를 사용하면 **임시 테이블**처럼 활용할 수 있습니다.

```sql
-- 고객별 주문 수를 구하고, 그 중 2건 이상인 고객만
SELECT *
FROM (
    SELECT customer_id, COUNT(*) AS 주문수
    FROM orders
    GROUP BY customer_id
) AS order_summary
WHERE 주문수 >= 2;
```

```sql
-- 카테고리별 최고가 상품 조회
SELECT p.name, p.price, p.category
FROM products p
INNER JOIN (
    SELECT category, MAX(price) AS max_price
    FROM products
    GROUP BY category
) AS cat_max
ON p.category = cat_max.category AND p.price = cat_max.max_price;
```

---

## 7.6 상관 서브쿼리 (Correlated Subquery)

상관 서브쿼리는 **외부 쿼리의 값을 참조**하는 서브쿼리입니다. 외부 쿼리의 각 행마다 서브쿼리가 실행됩니다.

```sql
-- 각 카테고리의 평균 가격보다 비싼 상품
SELECT p1.name, p1.price, p1.category
FROM products p1
WHERE p1.price > (
    SELECT AVG(p2.price)
    FROM products p2
    WHERE p2.category = p1.category  -- 외부 쿼리의 category 참조
);
```

```sql
-- 가장 최근 주문을 한 날짜와 고객 이름
SELECT c.name, (
    SELECT MAX(o.order_date)
    FROM orders o
    WHERE o.customer_id = c.customer_id  -- 외부 쿼리의 customer_id 참조
) AS 최근주문일
FROM customers c;
```

---

## 7.7 EXISTS / NOT EXISTS

`EXISTS`는 서브쿼리 결과가 **1행 이상 존재**하면 TRUE를 반환합니다. `IN`보다 성능이 좋은 경우가 많습니다.

```sql
-- 주문을 한 적 있는 고객 (EXISTS 버전)
SELECT name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
);
```

```sql
-- 주문한 적 없는 고객 (NOT EXISTS 버전)
SELECT name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
);
```

> **EXISTS vs IN**: NULL 처리와 성능 측면에서 EXISTS가 일반적으로 더 안전하고 빠릅니다. 특히 서브쿼리 결과가 클 때 EXISTS가 유리합니다.

---

## 7.8 서브쿼리 vs JOIN

같은 결과를 서브쿼리와 JOIN으로 모두 표현할 수 있는 경우가 많습니다.

```sql
-- 서브쿼리 버전
SELECT name
FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders);

-- JOIN 버전 (같은 결과)
SELECT DISTINCT c.name
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;
```

> 일반적으로 JOIN이 더 빠르지만, 가독성에 따라 선택하세요.

---

## 연습 문제

**1번.** 전체 상품의 평균 가격보다 저렴한 상품을 조회하세요.

**2번.** `orders` 테이블에서 한 번이라도 주문된 상품(`product_id`)의 이름과 가격을 조회하세요 (서브쿼리 사용).

**3번.** 주문을 한 번도 하지 않은 고객의 이름과 이메일을 조회하세요 (NOT IN 또는 NOT EXISTS 사용).

**4번.** 각 카테고리에서 가장 저렴한 상품의 이름과 가격을 조회하세요 (인라인 뷰 사용).

**5번.** 고객별 최근 주문일을 스칼라 서브쿼리로 조회하세요.

---

## 정답

```sql
-- 1번
SELECT name, price
FROM products
WHERE price < (SELECT AVG(price) FROM products);

-- 2번
SELECT name, price
FROM products
WHERE product_id IN (SELECT DISTINCT product_id FROM orders);

-- 3번
-- NOT IN 버전
SELECT name, email
FROM customers
WHERE customer_id NOT IN (SELECT DISTINCT customer_id FROM orders);

-- NOT EXISTS 버전
SELECT name, email
FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);

-- 4번
SELECT p.name, p.price, p.category
FROM products p
INNER JOIN (
    SELECT category, MIN(price) AS min_price
    FROM products
    GROUP BY category
) AS cat_min ON p.category = cat_min.category AND p.price = cat_min.min_price;

-- 5번
SELECT c.name,
       (SELECT MAX(o.order_date)
        FROM orders o
        WHERE o.customer_id = c.customer_id) AS 최근주문일
FROM customers c;
```

---

*이전 챕터: [Chapter 6 - JOIN](#sql/chapter6.md)*
*다음 챕터: [Chapter 8 - 데이터 조작 (DML)](#sql/chapter8.md)*
