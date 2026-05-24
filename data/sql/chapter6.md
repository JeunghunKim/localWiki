# Chapter 6: JOIN

## 학습 목표

- JOIN의 개념과 필요성을 이해한다.
- INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN의 차이를 설명할 수 있다.
- CROSS JOIN과 Self JOIN을 활용할 수 있다.
- 여러 테이블을 JOIN하여 원하는 데이터를 조회할 수 있다.

---

## 6.1 JOIN이란?

`JOIN`은 **두 개 이상의 테이블을 연결**하여 하나의 결과셋으로 조회하는 방법입니다.

관계형 데이터베이스에서는 데이터 중복을 줄이기 위해 정보를 여러 테이블에 나누어 저장합니다. JOIN은 이 분리된 데이터를 다시 합쳐서 필요한 정보를 얻을 때 사용합니다.

**예시**: 주문 내역을 조회할 때 고객 이름(customers), 상품 이름(products), 주문 정보(orders)가 필요합니다.

```
orders ──────┬──── customers (customer_id로 연결)
             └──── products  (product_id로 연결)
```

---

## 6.2 INNER JOIN

`INNER JOIN`은 두 테이블에서 **조건을 만족하는 행만** 반환합니다.

```sql
SELECT 열목록
FROM 테이블A
INNER JOIN 테이블B ON 테이블A.공통열 = 테이블B.공통열;
```

```sql
-- 주문과 고객 정보를 함께 조회
SELECT
    o.order_id,
    c.name AS 고객명,
    o.order_date
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;
```

**결과:**

| order_id | 고객명 | order_date |
|----------|--------|------------|
| 101      | 김철수 | 2024-01-10 |
| 102      | 이영희 | 2024-01-11 |
| 103      | 김철수 | 2024-01-12 |
| 104      | 박민준 | 2024-01-15 |
| 105      | 최지영 | 2024-02-01 |
| 106      | 정수현 | 2024-02-05 |
| 107      | 이영희 | 2024-02-10 |
| 108      | 김철수 | 2024-02-15 |

> **테이블 별칭**: `FROM orders o`처럼 테이블에도 별칭을 붙일 수 있습니다.

---

## 6.3 세 테이블 JOIN

```sql
-- 주문 ID, 고객명, 상품명, 주문 수량 조회
SELECT
    o.order_id,
    c.name AS 고객명,
    p.name AS 상품명,
    o.quantity,
    p.price * o.quantity AS 총금액
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN products p ON o.product_id = p.product_id
ORDER BY o.order_id;
```

**결과:**

| order_id | 고객명 | 상품명 | quantity | 총금액   |
|----------|--------|--------|----------|---------|
| 101      | 김철수 | 노트북 | 1        | 1500000 |
| 102      | 이영희 | 마우스 | 2        | 70000   |
| 103      | 김철수 | 키보드 | 1        | 80000   |

---

## 6.4 LEFT JOIN (LEFT OUTER JOIN)

`LEFT JOIN`은 왼쪽 테이블의 **모든 행**과 오른쪽 테이블에서 매칭되는 행을 반환합니다. 매칭되지 않으면 NULL로 채웁니다.

```sql
-- 모든 고객과 그들의 주문 (주문 없는 고객도 포함)
SELECT
    c.name AS 고객명,
    c.city,
    o.order_id,
    o.order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;
```

> 만약 주문하지 않은 고객이 있다면 `order_id`와 `order_date`가 NULL로 표시됩니다.

```sql
-- 주문한 적 없는 고객 찾기
SELECT c.name, c.email
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```

---

## 6.5 RIGHT JOIN (RIGHT OUTER JOIN)

`RIGHT JOIN`은 오른쪽 테이블의 **모든 행**과 왼쪽 테이블에서 매칭되는 행을 반환합니다.

```sql
-- 모든 상품과 주문 (주문되지 않은 상품도 포함)
SELECT
    p.name AS 상품명,
    o.order_id,
    o.quantity
FROM orders o
RIGHT JOIN products p ON o.product_id = p.product_id;
```

> ⚠️ SQLite는 RIGHT JOIN을 지원하지 않습니다. LEFT JOIN과 테이블 순서를 바꿔 사용하세요.

---

## 6.6 FULL OUTER JOIN

`FULL OUTER JOIN`은 **양쪽 테이블의 모든 행**을 반환합니다. 매칭되지 않는 행은 NULL로 채웁니다.

```sql
-- 모든 고객과 모든 주문 (매칭 여부와 관계없이)
SELECT c.name, o.order_id
FROM customers c
FULL OUTER JOIN orders o ON c.customer_id = o.customer_id;
```

> ⚠️ SQLite는 FULL OUTER JOIN을 지원하지 않습니다. LEFT JOIN과 UNION을 조합해 구현합니다.

```sql
-- SQLite에서 FULL OUTER JOIN 구현
SELECT c.name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id

UNION

SELECT c.name, o.order_id
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id;
```

---

## 6.7 JOIN 유형 비교

```
테이블 A: [1, 2, 3]
테이블 B: [2, 3, 4]

INNER JOIN: [2, 3]               ← 교집합
LEFT JOIN:  [1, 2, 3]            ← A의 전체 + B 매칭
RIGHT JOIN: [2, 3, 4]            ← A 매칭 + B의 전체
FULL JOIN:  [1, 2, 3, 4]         ← 합집합
```

---

## 6.8 CROSS JOIN

`CROSS JOIN`은 두 테이블의 **모든 조합(카테시안 곱)** 을 반환합니다.

```sql
-- 3개 행 × 2개 행 = 6개 행
SELECT c.name, p.name AS 상품명
FROM customers c
CROSS JOIN products p
LIMIT 10;
```

> 실무에서는 ON 조건을 빠뜨린 JOIN이 의도치 않게 CROSS JOIN이 될 수 있으니 주의하세요.

---

## 6.9 Self JOIN

같은 테이블을 **두 번 JOIN**하는 방법입니다. 계층 구조나 같은 테이블 내 비교에 활용합니다.

```sql
-- 직원-관리자 관계 예시 (employees 테이블)
-- employee_id, name, manager_id (자신의 상사 ID)
SELECT
    e.name AS 직원,
    m.name AS 관리자
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id;
```

---

## 6.10 JOIN 시 주의사항

### 열 이름 충돌

여러 테이블에 같은 이름의 열이 있으면 `테이블명.열명` 또는 별칭으로 구분합니다.

```sql
-- customer_id가 양쪽 테이블에 있으므로 명시적으로 지정
SELECT
    c.customer_id,   -- customers.customer_id
    o.order_id,
    c.name
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;
```

### JOIN 성능

- JOIN 조건에 사용하는 열에는 **인덱스**를 생성하면 성능이 크게 향상됩니다.
- 불필요한 테이블을 JOIN하지 않도록 주의하세요.

---

## 연습 문제

**1번.** `orders`와 `customers` 테이블을 JOIN하여 주문 ID, 고객명, 주문일을 조회하세요.

**2번.** `orders`, `customers`, `products` 세 테이블을 JOIN하여 주문 ID, 고객명, 상품명, 수량, 총금액을 조회하세요.

**3번.** 모든 고객을 조회하되 주문 내역이 있으면 주문 수도 함께 표시하세요 (주문 없는 고객도 포함).

**4번.** 고객별 총 구매 금액을 조회하세요 (고객명, 총구매금액). 구매 내역이 없는 고객은 0으로 표시하세요.

---

## 정답

```sql
-- 1번
SELECT o.order_id, c.name AS 고객명, o.order_date
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;

-- 2번
SELECT o.order_id, c.name AS 고객명, p.name AS 상품명,
       o.quantity, p.price * o.quantity AS 총금액
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN products p ON o.product_id = p.product_id;

-- 3번
SELECT c.name AS 고객명, COUNT(o.order_id) AS 주문수
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name;

-- 4번
SELECT c.name AS 고객명,
       COALESCE(SUM(p.price * o.quantity), 0) AS 총구매금액
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
LEFT JOIN products p ON o.product_id = p.product_id
GROUP BY c.customer_id, c.name
ORDER BY 총구매금액 DESC;
```

---

*이전 챕터: [Chapter 5 - 집계 함수와 GROUP BY](#sql/chapter5.md)*
*다음 챕터: [Chapter 7 - 서브쿼리](#sql/chapter7.md)*
