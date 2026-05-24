# Chapter 8: 데이터 조작 (DML)

## 학습 목표

- INSERT 문으로 데이터를 삽입할 수 있다.
- UPDATE 문으로 데이터를 수정할 수 있다.
- DELETE 문으로 데이터를 삭제할 수 있다.
- TRUNCATE와 DELETE의 차이를 이해한다.
- WHERE 없는 UPDATE/DELETE의 위험성을 인식한다.

---

## 8.1 INSERT - 데이터 삽입

`INSERT INTO` 문은 테이블에 새로운 행을 추가합니다.

### 기본 문법

```sql
-- 모든 열에 값 삽입 (열 목록 생략)
INSERT INTO 테이블명 VALUES (값1, 값2, ...);

-- 특정 열에만 값 삽입 (권장)
INSERT INTO 테이블명 (열1, 열2, ...) VALUES (값1, 값2, ...);
```

```sql
-- 고객 한 명 추가
INSERT INTO customers (customer_id, name, email, city, join_date)
VALUES (6, '한지민', 'jimin@email.com', '광주', '2024-03-01');

-- 열 목록 지정 시 순서를 바꿔도 됨
INSERT INTO customers (name, customer_id, city, email, join_date)
VALUES ('오민석', 7, '수원', 'minseok@email.com', '2024-03-10');
```

> **권장사항**: 열 목록을 항상 명시하세요. 테이블 구조가 변경되어도 쿼리가 올바르게 동작합니다.

---

## 8.2 INSERT - 여러 행 한 번에 삽입

```sql
-- 여러 행을 한 번에 삽입 (MySQL, PostgreSQL, SQLite)
INSERT INTO products (product_id, name, price, category, stock)
VALUES
    (7, '헤드셋', 120000, '전자제품', 20),
    (8, '웹캠',   65000, '전자제품', 15),
    (9, '소파',  350000, '가구',       3);
```

---

## 8.3 INSERT INTO ... SELECT

다른 테이블에서 데이터를 선택하여 삽입할 수 있습니다.

```sql
-- 백업 테이블 생성 후 데이터 복사
CREATE TABLE customers_backup AS SELECT * FROM customers;

-- 또는 명시적 INSERT INTO ... SELECT
INSERT INTO customers_backup (customer_id, name, email, city, join_date)
SELECT customer_id, name, email, city, join_date
FROM customers
WHERE city = '서울';
```

---

## 8.4 UPDATE - 데이터 수정

`UPDATE` 문은 기존 데이터를 수정합니다.

```sql
UPDATE 테이블명
SET 열1 = 값1, 열2 = 값2, ...
WHERE 조건;
```

```sql
-- customer_id가 1인 고객의 도시 변경
UPDATE customers
SET city = '인천'
WHERE customer_id = 1;

-- 여러 열 동시 수정
UPDATE customers
SET city = '대전', email = 'new@email.com'
WHERE customer_id = 1;

-- 가격 10% 인상
UPDATE products
SET price = price * 1.1
WHERE category = '전자제품';
```

> ⚠️ **경고**: WHERE 절 없이 UPDATE를 실행하면 **테이블의 모든 행**이 수정됩니다!

```sql
-- 매우 위험! 모든 고객의 도시가 '서울'로 바뀜
UPDATE customers SET city = '서울';
```

---

## 8.5 UPDATE 주의사항

### 수정 전 SELECT로 확인

```sql
-- 먼저 어떤 행이 영향받는지 확인
SELECT * FROM products WHERE category = '전자제품';

-- 확인 후 UPDATE 실행
UPDATE products SET price = price * 1.1 WHERE category = '전자제품';
```

### 조건 확인

```sql
-- rowcount 확인 (SQLite에서 changes() 함수 사용)
UPDATE customers SET city = '부산' WHERE customer_id = 999;
SELECT changes();  -- 0이면 영향받은 행 없음
```

---

## 8.6 DELETE - 데이터 삭제

`DELETE` 문은 테이블에서 행을 삭제합니다.

```sql
DELETE FROM 테이블명
WHERE 조건;
```

```sql
-- 특정 고객 삭제
DELETE FROM customers WHERE customer_id = 7;

-- 재고가 0인 상품 삭제
DELETE FROM products WHERE stock = 0;

-- 2023년 이전 주문 삭제
DELETE FROM orders WHERE order_date < '2024-01-01';
```

> ⚠️ **경고**: WHERE 절 없이 DELETE를 실행하면 **테이블의 모든 행**이 삭제됩니다!

```sql
-- 매우 위험! 모든 주문 삭제
DELETE FROM orders;
```

---

## 8.7 DELETE vs TRUNCATE

| 구분 | DELETE | TRUNCATE |
|------|--------|---------|
| 대상 | 특정 행 또는 전체 | 전체 행만 |
| WHERE 절 | 사용 가능 | 사용 불가 |
| 롤백 | 가능 (트랜잭션 내) | DBMS에 따라 다름 |
| 속도 | 느림 (행 단위 처리) | 빠름 |
| 자동 증가값 리셋 | 리셋 안 됨 | 리셋됨 (DBMS마다 다름) |
| 로그 | 기록됨 | 최소 기록 |

```sql
-- DELETE: 조건부 삭제 가능
DELETE FROM orders WHERE order_date < '2024-01-01';

-- TRUNCATE: 전체 삭제 (구조는 유지)
TRUNCATE TABLE orders_temp;

-- SQLite는 TRUNCATE 없음 → DELETE FROM 사용
DELETE FROM orders_temp;
```

---

## 8.8 외래키 제약 조건과 DELETE

외래키(FOREIGN KEY)가 있는 경우 참조되는 행을 먼저 삭제해야 합니다.

```sql
-- 에러 발생: orders 테이블에서 이 customer_id를 참조 중
DELETE FROM customers WHERE customer_id = 1;

-- 올바른 순서: 자식 테이블 먼저 삭제
DELETE FROM orders WHERE customer_id = 1;    -- 자식
DELETE FROM customers WHERE customer_id = 1; -- 부모
```

---

## 8.9 UPSERT (INSERT OR REPLACE / ON CONFLICT)

데이터가 있으면 UPDATE, 없으면 INSERT하는 패턴입니다.

```sql
-- SQLite: INSERT OR REPLACE
INSERT OR REPLACE INTO products (product_id, name, price, category, stock)
VALUES (1, '노트북 Pro', 1800000, '전자제품', 10);

-- PostgreSQL: INSERT ... ON CONFLICT
INSERT INTO products (product_id, name, price, category, stock)
VALUES (1, '노트북 Pro', 1800000, '전자제품', 10)
ON CONFLICT (product_id)
DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price;

-- MySQL: INSERT ... ON DUPLICATE KEY UPDATE
INSERT INTO products (product_id, name, price)
VALUES (1, '노트북 Pro', 1800000)
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price);
```

---

## 연습 문제

**1번.** `customers` 테이블에 새 고객을 추가하세요: (8, '강동원', 'dongwon@email.com', '제주', '2024-04-01')

**2번.** `products` 테이블에 여러 상품을 한 번에 추가하세요: 헤드폰(150000, 전자제품, 25), 책장(120000, 가구, 7)

**3번.** `products` 테이블에서 '가구' 카테고리 상품 가격을 5% 인상하세요.

**4번.** `customers` 테이블에서 `customer_id`가 8인 고객의 도시를 '부산'으로 변경하세요.

**5번.** `orders` 테이블에서 `order_id`가 108인 주문을 삭제하세요.

---

## 정답

```sql
-- 1번
INSERT INTO customers (customer_id, name, email, city, join_date)
VALUES (8, '강동원', 'dongwon@email.com', '제주', '2024-04-01');

-- 2번
INSERT INTO products (name, price, category, stock)
VALUES
    ('헤드폰', 150000, '전자제품', 25),
    ('책장',   120000, '가구',      7);

-- 3번
-- 먼저 확인
SELECT name, price FROM products WHERE category = '가구';
-- 수정
UPDATE products SET price = price * 1.05 WHERE category = '가구';

-- 4번
UPDATE customers SET city = '부산' WHERE customer_id = 8;

-- 5번
-- 먼저 확인
SELECT * FROM orders WHERE order_id = 108;
-- 삭제
DELETE FROM orders WHERE order_id = 108;
```

---

*이전 챕터: [Chapter 7 - 서브쿼리](#sql/chapter7.md)*
*다음 챕터: [Chapter 9 - 테이블 설계 (DDL)](#sql/chapter9.md)*
