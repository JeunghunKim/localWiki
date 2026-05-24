# Chapter 9: 테이블 설계 (DDL)

## 학습 목표

- CREATE TABLE로 테이블을 생성할 수 있다.
- 적절한 데이터 타입을 선택할 수 있다.
- 제약 조건(PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, DEFAULT)을 적용할 수 있다.
- ALTER TABLE로 테이블 구조를 수정할 수 있다.
- DROP TABLE로 테이블을 삭제할 수 있다.

---

## 9.1 CREATE TABLE

테이블을 생성합니다.

```sql
CREATE TABLE 테이블명 (
    열명1 데이터타입 [제약조건],
    열명2 데이터타입 [제약조건],
    ...
    [테이블 수준 제약조건]
);
```

```sql
CREATE TABLE employees (
    employee_id INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    department  TEXT,
    salary      INTEGER CHECK (salary > 0),
    hire_date   DATE DEFAULT CURRENT_DATE,
    manager_id  INTEGER,
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);
```

---

## 9.2 데이터 타입

DBMS마다 지원하는 데이터 타입이 다르지만, 주요 타입은 비슷합니다.

### 숫자 타입

| 타입 | 설명 | 범위/특징 |
|------|------|----------|
| `INTEGER` / `INT` | 정수 | -2,147,483,648 ~ 2,147,483,647 |
| `BIGINT` | 큰 정수 | 매우 큰 수 |
| `SMALLINT` | 작은 정수 | -32,768 ~ 32,767 |
| `DECIMAL(p, s)` | 고정 소수점 | p: 전체 자릿수, s: 소수 자릿수 |
| `FLOAT` / `REAL` | 부동 소수점 | 근사값 |
| `NUMERIC(p, s)` | DECIMAL과 동일 | |

```sql
salary DECIMAL(10, 2)  -- 최대 10자리, 소수점 2자리 (예: 99999999.99)
```

### 문자 타입

| 타입 | 설명 | 특징 |
|------|------|------|
| `CHAR(n)` | 고정 길이 문자열 | 부족한 공간은 공백으로 채움 |
| `VARCHAR(n)` | 가변 길이 문자열 | 최대 n자까지 저장 |
| `TEXT` | 긴 문자열 | 크기 제한 없음 (SQLite) |

```sql
code    CHAR(10)      -- 항상 10자 ('KR        ')
name    VARCHAR(50)   -- 최대 50자
content TEXT          -- 긴 텍스트
```

### 날짜/시간 타입

| 타입 | 설명 | 형식 |
|------|------|------|
| `DATE` | 날짜 | YYYY-MM-DD |
| `TIME` | 시간 | HH:MM:SS |
| `DATETIME` / `TIMESTAMP` | 날짜 + 시간 | YYYY-MM-DD HH:MM:SS |

### 기타

| 타입 | 설명 |
|------|------|
| `BOOLEAN` | 참/거짓 (SQLite는 INTEGER 0/1 사용) |
| `BLOB` | 이진 데이터 |
| `JSON` | JSON 형식 (MySQL, PostgreSQL) |

---

## 9.3 제약 조건 (Constraints)

### PRIMARY KEY (기본키)

행을 고유하게 식별합니다.

```sql
-- 열 수준
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    ...
);

-- 테이블 수준 (복합 기본키)
CREATE TABLE order_items (
    order_id   INTEGER,
    product_id INTEGER,
    quantity   INTEGER,
    PRIMARY KEY (order_id, product_id)
);

-- AUTO INCREMENT (자동 증가)
-- SQLite: INTEGER PRIMARY KEY 자동으로 증가
-- MySQL: AUTO_INCREMENT
-- PostgreSQL: SERIAL 또는 GENERATED AS IDENTITY
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,  -- SQLite
    name    TEXT
);
```

### NOT NULL

NULL 값을 허용하지 않습니다.

```sql
CREATE TABLE products (
    product_id INTEGER PRIMARY KEY,
    name       TEXT NOT NULL,    -- 반드시 값이 있어야 함
    price      INTEGER NOT NULL
);
```

### UNIQUE

중복 값을 허용하지 않습니다 (NULL은 허용).

```sql
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    email   TEXT UNIQUE,      -- 중복 이메일 불가
    phone   TEXT UNIQUE
);
```

### DEFAULT

값이 없을 때 사용할 기본값을 지정합니다.

```sql
CREATE TABLE orders (
    order_id   INTEGER PRIMARY KEY,
    status     TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    quantity   INTEGER DEFAULT 1
);
```

### CHECK

열에 저장될 값의 조건을 지정합니다.

```sql
CREATE TABLE products (
    product_id INTEGER PRIMARY KEY,
    name       TEXT NOT NULL,
    price      INTEGER CHECK (price > 0),       -- 가격은 양수
    stock      INTEGER CHECK (stock >= 0),      -- 재고는 0 이상
    rating     REAL CHECK (rating BETWEEN 0 AND 5)
);
```

### FOREIGN KEY (외래키)

다른 테이블의 기본키를 참조합니다.

```sql
CREATE TABLE orders (
    order_id    INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    product_id  INTEGER NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE CASCADE      -- 고객 삭제 시 주문도 자동 삭제
        ON UPDATE CASCADE,     -- 고객 ID 변경 시 주문의 ID도 자동 변경
    FOREIGN KEY (product_id)  REFERENCES products(product_id)
        ON DELETE RESTRICT     -- 상품 삭제 시 주문이 있으면 에러
);
```

**ON DELETE / ON UPDATE 옵션:**

| 옵션 | 설명 |
|------|------|
| `CASCADE` | 부모 변경 시 자식도 같이 변경/삭제 |
| `RESTRICT` | 자식이 있으면 부모 변경/삭제 불가 |
| `SET NULL` | 부모 삭제 시 자식의 외래키를 NULL로 설정 |
| `SET DEFAULT` | 부모 삭제 시 자식의 외래키를 DEFAULT 값으로 설정 |

---

## 9.4 ALTER TABLE

테이블 구조를 수정합니다.

```sql
-- 열 추가
ALTER TABLE customers ADD COLUMN phone TEXT;
ALTER TABLE customers ADD COLUMN birth_date DATE DEFAULT NULL;

-- 열 이름 변경 (SQLite는 지원 제한적)
ALTER TABLE customers RENAME COLUMN phone TO phone_number;

-- 테이블 이름 변경
ALTER TABLE customers RENAME TO clients;
```

> ⚠️ SQLite는 ALTER TABLE 기능이 제한적입니다. 열 삭제가 필요한 경우 테이블을 새로 만들고 데이터를 옮겨야 합니다.

---

## 9.5 DROP TABLE

테이블을 삭제합니다. **복구할 수 없습니다.**

```sql
-- 테이블 삭제
DROP TABLE orders;

-- 테이블이 존재할 때만 삭제 (에러 방지)
DROP TABLE IF EXISTS orders;
```

**삭제 순서**: 외래키로 참조되는 테이블(부모)보다 참조하는 테이블(자식)을 먼저 삭제해야 합니다.

```sql
DROP TABLE IF EXISTS orders;     -- 자식 먼저
DROP TABLE IF EXISTS products;   -- 자식 먼저
DROP TABLE IF EXISTS customers;  -- 부모 나중에
```

---

## 9.6 CREATE TABLE AS SELECT

기존 테이블의 구조와 데이터로 새 테이블을 만듭니다.

```sql
-- 구조와 데이터 모두 복사
CREATE TABLE customers_backup AS
SELECT * FROM customers;

-- 일부 데이터만 복사
CREATE TABLE seoul_customers AS
SELECT * FROM customers WHERE city = '서울';

-- 구조만 복사 (데이터 없이)
CREATE TABLE empty_customers AS
SELECT * FROM customers WHERE 1 = 0;
```

---

## 9.7 정규화 개념

### 데이터 중복 문제

```
주문 테이블에 고객 이름을 직접 저장하면:
- 이름 변경 시 모든 주문 데이터를 수정해야 함
- 이름이 여러 곳에 중복 저장됨
```

**정규화**는 이런 문제를 방지하기 위해 테이블을 분리하는 과정입니다.

```
❌ 비정규화 테이블:
orders(order_id, customer_name, customer_email, product_name, product_price, ...)

✅ 정규화 테이블:
customers(customer_id, name, email)
products(product_id, name, price)
orders(order_id, customer_id, product_id, ...)  ← 외래키로 연결
```

---

## 연습 문제

**1번.** 다음 구조를 가진 `reviews` 테이블을 생성하세요.
- `review_id`: 자동 증가 기본키
- `customer_id`: 정수, NOT NULL, customers 테이블 외래키
- `product_id`: 정수, NOT NULL, products 테이블 외래키
- `rating`: 실수, 1.0 ~ 5.0 사이 CHECK 제약
- `comment`: 텍스트, NULL 허용
- `created_at`: 날짜, 기본값 현재 날짜

**2번.** `customers` 테이블에 `phone` 열(TEXT)을 추가하세요.

**3번.** 임시 테이블 `top_products`를 생성하세요 (가격이 200,000원 이상인 상품의 name, price, category).

**4번.** `reviews` 테이블을 삭제하세요.

---

## 정답

```sql
-- 1번
CREATE TABLE reviews (
    review_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    product_id  INTEGER NOT NULL,
    rating      REAL CHECK (rating BETWEEN 1.0 AND 5.0),
    comment     TEXT,
    created_at  DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (product_id)  REFERENCES products(product_id)
);

-- 2번
ALTER TABLE customers ADD COLUMN phone TEXT;

-- 3번
CREATE TABLE top_products AS
SELECT name, price, category
FROM products
WHERE price >= 200000;

-- 4번
DROP TABLE IF EXISTS reviews;
```

---

*이전 챕터: [Chapter 8 - 데이터 조작 (DML)](#sql/chapter8.md)*
*다음 챕터: [Chapter 10 - 고급 SQL](#sql/chapter10.md)*
