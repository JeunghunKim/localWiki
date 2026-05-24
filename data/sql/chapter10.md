# Chapter 10: 고급 SQL

## 학습 목표

- VIEW를 생성하고 활용할 수 있다.
- INDEX의 개념과 생성 방법을 이해한다.
- TRANSACTION의 ACID 특성을 이해하고 COMMIT/ROLLBACK을 사용할 수 있다.
- CTE(Common Table Expression)를 작성할 수 있다.
- 윈도우 함수(Window Functions)를 활용할 수 있다.

---

## 10.1 VIEW (뷰)

`VIEW`는 SELECT 쿼리를 저장하여 **가상 테이블**처럼 사용하는 객체입니다.

### 뷰 생성

```sql
CREATE VIEW 뷰이름 AS
SELECT 쿼리;
```

```sql
-- 주문 상세 정보 뷰
CREATE VIEW order_details AS
SELECT
    o.order_id,
    c.name AS 고객명,
    p.name AS 상품명,
    o.quantity,
    p.price * o.quantity AS 총금액,
    o.order_date
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN products p ON o.product_id = p.product_id;
```

### 뷰 사용

```sql
-- 일반 테이블처럼 사용
SELECT * FROM order_details;

SELECT 고객명, SUM(총금액) AS 총구매금액
FROM order_details
GROUP BY 고객명
ORDER BY 총구매금액 DESC;
```

### 뷰의 장점

- **복잡한 쿼리 단순화**: 자주 사용하는 복잡한 JOIN을 뷰로 저장
- **보안**: 민감한 열을 숨기고 필요한 열만 노출
- **유지보수**: 쿼리 변경이 필요할 때 뷰만 수정

### 뷰 수정/삭제

```sql
-- 뷰 수정
CREATE OR REPLACE VIEW order_details AS
SELECT ...;  -- 수정된 쿼리

-- 뷰 삭제
DROP VIEW IF EXISTS order_details;

-- 뷰 목록 확인 (SQLite)
SELECT name FROM sqlite_master WHERE type = 'view';
```

---

## 10.2 INDEX (인덱스)

`INDEX`는 데이터 조회 속도를 높이는 자료구조입니다. 책의 색인과 유사합니다.

### 인덱스 생성

```sql
-- 단일 열 인덱스
CREATE INDEX idx_customers_city ON customers(city);

-- 복합 인덱스
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);

-- 고유 인덱스
CREATE UNIQUE INDEX idx_customers_email ON customers(email);
```

### 인덱스가 도움되는 경우

```sql
-- WHERE 절에 인덱스 열 사용
SELECT * FROM customers WHERE city = '서울';  -- city 인덱스 사용

-- JOIN 조건에 인덱스 사용
SELECT * FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;  -- FK에 인덱스

-- ORDER BY에 인덱스 사용
SELECT * FROM orders ORDER BY order_date;  -- order_date 인덱스
```

### 인덱스 조회/삭제

```sql
-- SQLite에서 인덱스 목록 확인
SELECT name FROM sqlite_master WHERE type = 'index';

-- 인덱스 삭제
DROP INDEX IF EXISTS idx_customers_city;
```

> ⚠️ **주의**: 인덱스가 많으면 INSERT/UPDATE/DELETE 속도가 느려집니다. 자주 조회하는 열에만 생성하세요.

---

## 10.3 TRANSACTION (트랜잭션)

**트랜잭션**은 **하나의 논리적인 작업 단위**입니다.

### ACID 특성

| 특성 | 영어 | 설명 |
|------|------|------|
| 원자성 | Atomicity | 모두 성공하거나 모두 실패해야 함 |
| 일관성 | Consistency | 트랜잭션 전후 데이터 일관성 유지 |
| 격리성 | Isolation | 다른 트랜잭션의 간섭 없이 독립 실행 |
| 지속성 | Durability | 완료된 트랜잭션은 영구 저장 |

### COMMIT / ROLLBACK

```sql
-- 트랜잭션 시작
BEGIN;  -- 또는 BEGIN TRANSACTION;

-- 작업 수행
UPDATE accounts SET balance = balance - 50000 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 50000 WHERE account_id = 2;

-- 성공 시 확정
COMMIT;

-- 실패 시 취소 (원상 복구)
ROLLBACK;
```

### 은행 이체 예제

```sql
BEGIN;

-- 송금 계좌에서 차감
UPDATE accounts
SET balance = balance - 50000
WHERE account_id = 1;

-- 잔액 확인 (음수면 ROLLBACK)
-- 실제 코드에서는 프로그래밍 언어로 처리

-- 수취 계좌에 추가
UPDATE accounts
SET balance = balance + 50000
WHERE account_id = 2;

COMMIT;  -- 모두 성공하면 확정
```

### SAVEPOINT

트랜잭션 중간에 저장점을 만들어 부분 롤백이 가능합니다.

```sql
BEGIN;

INSERT INTO orders VALUES (201, 1, 1, 1, '2024-04-01');
SAVEPOINT order_saved;  -- 저장점 설정

INSERT INTO orders VALUES (202, 99, 1, 1, '2024-04-01');  -- 오류 발생 가능

ROLLBACK TO order_saved;  -- order_saved 시점으로 롤백 (첫 번째 INSERT는 유지)

COMMIT;
```

---

## 10.4 CTE (Common Table Expression)

`WITH` 절을 사용해 **임시 결과셋에 이름을 붙이는** 방법입니다. 복잡한 쿼리를 읽기 쉽게 만듭니다.

```sql
WITH CTE이름 AS (
    SELECT 쿼리
)
SELECT * FROM CTE이름;
```

```sql
-- 고객별 총 구매 금액을 구하고, 100만원 이상 고객 조회
WITH customer_totals AS (
    SELECT
        c.customer_id,
        c.name,
        SUM(p.price * o.quantity) AS 총구매금액
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    LEFT JOIN products p ON o.product_id = p.product_id
    GROUP BY c.customer_id, c.name
)
SELECT name, 총구매금액
FROM customer_totals
WHERE 총구매금액 >= 1000000
ORDER BY 총구매금액 DESC;
```

### 여러 CTE 연결

```sql
WITH
-- CTE 1: 카테고리별 평균 가격
cat_avg AS (
    SELECT category, AVG(price) AS avg_price
    FROM products
    GROUP BY category
),
-- CTE 2: 평균보다 비싼 상품
expensive AS (
    SELECT p.name, p.price, p.category, ca.avg_price
    FROM products p
    INNER JOIN cat_avg ca ON p.category = ca.category
    WHERE p.price > ca.avg_price
)
SELECT * FROM expensive ORDER BY category, price DESC;
```

### 재귀 CTE

계층 구조 데이터(직원-관리자, 카테고리 트리 등)를 처리할 수 있습니다.

```sql
-- 1부터 10까지 숫자 생성
WITH RECURSIVE numbers AS (
    SELECT 1 AS n           -- 초기값
    UNION ALL
    SELECT n + 1            -- 재귀 부분
    FROM numbers
    WHERE n < 10
)
SELECT * FROM numbers;
```

---

## 10.5 윈도우 함수 (Window Functions)

윈도우 함수는 **행 그룹(윈도우)에 대해 계산**하면서 각 행을 유지합니다. GROUP BY와 달리 행이 합쳐지지 않습니다.

```sql
함수() OVER (
    [PARTITION BY 열]    -- 그룹 기준
    [ORDER BY 열]        -- 정렬 기준
    [ROWS BETWEEN ...]   -- 프레임 범위
)
```

### ROW_NUMBER / RANK / DENSE_RANK

```sql
-- 가격 순위 (높은 것부터)
SELECT
    name,
    price,
    ROW_NUMBER() OVER (ORDER BY price DESC) AS 행번호,
    RANK()       OVER (ORDER BY price DESC) AS 순위,
    DENSE_RANK() OVER (ORDER BY price DESC) AS 밀집순위
FROM products;
```

**결과:**

| name   | price   | 행번호 | 순위 | 밀집순위 |
|--------|---------|--------|------|---------|
| 노트북 | 1500000 | 1      | 1    | 1       |
| 모니터 | 450000  | 2      | 2    | 2       |
| 책상   | 250000  | 3      | 3    | 3       |

> `RANK()`는 동점이 있을 때 순위를 건너뜁니다. `DENSE_RANK()`는 건너뛰지 않습니다.

### PARTITION BY - 그룹별 순위

```sql
-- 카테고리별 가격 순위
SELECT
    name,
    category,
    price,
    RANK() OVER (PARTITION BY category ORDER BY price DESC) AS 카테고리내순위
FROM products;
```

**결과:**

| name   | category | price   | 카테고리내순위 |
|--------|----------|---------|--------------|
| 노트북 | 전자제품 | 1500000 | 1            |
| 모니터 | 전자제품 | 450000  | 2            |
| 책상   | 가구     | 250000  | 1            |
| 의자   | 가구     | 180000  | 2            |

### 집계 윈도우 함수

```sql
-- 각 상품의 가격 + 카테고리 평균 가격
SELECT
    name,
    price,
    category,
    AVG(price) OVER (PARTITION BY category) AS 카테고리평균,
    SUM(price) OVER () AS 전체합계,
    price * 100.0 / SUM(price) OVER () AS 비율
FROM products;
```

### LAG / LEAD - 이전/다음 행 참조

```sql
-- 주문 간격 계산
SELECT
    order_id,
    order_date,
    LAG(order_date) OVER (ORDER BY order_date) AS 이전주문일,
    LEAD(order_date) OVER (ORDER BY order_date) AS 다음주문일
FROM orders;
```

### 누적 합계 (Cumulative Sum)

```sql
-- 주문일 순서로 누적 수량
SELECT
    order_id,
    order_date,
    quantity,
    SUM(quantity) OVER (ORDER BY order_date) AS 누적수량
FROM orders;
```

---

## 연습 문제

**1번.** 고객명, 상품명, 총금액, 주문일을 포함하는 `v_order_summary` 뷰를 생성하세요.

**2번.** `orders` 테이블의 `customer_id` 열에 인덱스를 생성하세요.

**3번.** CTE를 사용하여 주문 수량이 가장 많은 상품 TOP 3를 조회하세요.

**4번.** 각 상품의 가격과 해당 카테고리 내 순위(RANK)를 조회하세요.

**5번.** 고객별 주문 총금액의 누적합을 주문일 순서로 조회하세요.

---

## 정답

```sql
-- 1번
CREATE VIEW v_order_summary AS
SELECT
    c.name AS 고객명,
    p.name AS 상품명,
    p.price * o.quantity AS 총금액,
    o.order_date
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN products p ON o.product_id = p.product_id;

-- 2번
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- 3번
WITH product_qty AS (
    SELECT product_id, SUM(quantity) AS 총수량
    FROM orders
    GROUP BY product_id
)
SELECT p.name, pq.총수량
FROM products p
INNER JOIN product_qty pq ON p.product_id = pq.product_id
ORDER BY pq.총수량 DESC
LIMIT 3;

-- 4번
SELECT
    name,
    category,
    price,
    RANK() OVER (PARTITION BY category ORDER BY price DESC) AS 카테고리내순위
FROM products;

-- 5번
SELECT
    o.order_date,
    c.name AS 고객명,
    p.price * o.quantity AS 주문금액,
    SUM(p.price * o.quantity) OVER (ORDER BY o.order_date) AS 누적금액
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN products p ON o.product_id = p.product_id;
```

---

## 마무리

SQL의 기초부터 고급까지 10개 챕터를 완료했습니다. 🎉

### 학습한 내용 정리

| 챕터 | 주제 | 핵심 명령어 |
|------|------|------------|
| 1 | 기초 개념 | 테이블, PK, FK, DBMS |
| 2 | SELECT | SELECT, FROM, AS, DISTINCT |
| 3 | 필터링 | WHERE, AND, OR, BETWEEN, IN, LIKE |
| 4 | 정렬/제한 | ORDER BY, LIMIT, OFFSET |
| 5 | 집계 | COUNT, SUM, AVG, GROUP BY, HAVING |
| 6 | JOIN | INNER, LEFT, RIGHT, FULL, CROSS JOIN |
| 7 | 서브쿼리 | 단일행, 다중행, EXISTS, 인라인뷰 |
| 8 | DML | INSERT, UPDATE, DELETE |
| 9 | DDL | CREATE, ALTER, DROP, 제약조건 |
| 10 | 고급 | VIEW, INDEX, TRANSACTION, CTE, 윈도우함수 |

### 다음 단계

- **실전 프로젝트**: 실제 데이터베이스를 설계하고 쿼리를 작성해보세요.
- **성능 최적화**: EXPLAIN으로 쿼리 실행 계획을 분석하세요.
- **특정 DBMS 심화**: PostgreSQL, MySQL 등 목표 DBMS를 심화 학습하세요.
- **데이터 분석**: SQL을 활용한 데이터 분석 기법을 배워보세요.

---

*이전 챕터: [Chapter 9 - 테이블 설계 (DDL)](chapter9.md)*
*처음으로: [ROADMAP](ROADMAP.md)*
