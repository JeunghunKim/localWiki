# Chapter 2: 기본 SELECT 문

## 학습 목표

- SELECT 문의 기본 구조를 이해한다.
- 특정 열을 선택하거나 모든 열을 조회할 수 있다.
- 열 별칭(AS)을 사용할 수 있다.
- DISTINCT로 중복을 제거할 수 있다.
- 간단한 계산식을 SELECT에 포함시킬 수 있다.

---

## 2.1 SELECT 기본 구조

SQL에서 데이터를 **조회**할 때는 `SELECT` 문을 사용합니다.

```sql
SELECT 열이름1, 열이름2, ...
FROM 테이블이름;
```

- `SELECT`: 조회할 열을 지정합니다.
- `FROM`: 데이터를 가져올 테이블을 지정합니다.
- SQL 문은 세미콜론(`;`)으로 끝납니다.

---

## 2.2 모든 열 조회 (*)

`*` (asterisk)를 사용하면 테이블의 **모든 열**을 조회합니다.

```sql
SELECT * FROM customers;
```

**결과:**

| customer_id | name   | email              | city | join_date  |
|-------------|--------|--------------------|------|------------|
| 1           | 김철수 | chulsoo@email.com  | 서울 | 2023-01-15 |
| 2           | 이영희 | younghee@email.com | 부산 | 2023-03-22 |
| 3           | 박민준 | minjun@email.com   | 대구 | 2023-05-10 |
| 4           | 최지영 | jiyoung@email.com  | 서울 | 2023-07-08 |
| 5           | 정수현 | soohyun@email.com  | 인천 | 2024-01-20 |

> ⚠️ **주의**: 실무에서는 `SELECT *`보다 필요한 열만 명시적으로 지정하는 것이 좋습니다. 불필요한 데이터를 가져오면 성능에 영향을 줍니다.

---

## 2.3 특정 열 조회

필요한 열만 쉼표(`,`)로 구분하여 지정합니다.

```sql
SELECT name, city FROM customers;
```

**결과:**

| name   | city |
|--------|------|
| 김철수 | 서울 |
| 이영희 | 부산 |
| 박민준 | 대구 |
| 최지영 | 서울 |
| 정수현 | 인천 |

```sql
SELECT name, price, category FROM products;
```

**결과:**

| name   | price   | category |
|--------|---------|----------|
| 노트북 | 1500000 | 전자제품 |
| 마우스 | 35000   | 전자제품 |
| 키보드 | 80000   | 전자제품 |
| 책상   | 250000  | 가구     |
| 의자   | 180000  | 가구     |
| 모니터 | 450000  | 전자제품 |

---

## 2.4 열 별칭 (AS)

`AS` 키워드를 사용하면 결과에 표시되는 **열 이름을 바꿀 수** 있습니다.

```sql
SELECT name AS 상품명, price AS 가격 FROM products;
```

**결과:**

| 상품명 | 가격    |
|--------|---------|
| 노트북 | 1500000 |
| 마우스 | 35000   |
| 키보드 | 80000   |

- `AS`는 생략 가능합니다: `SELECT name 상품명, price 가격 FROM products;`
- 별칭에 공백이 있으면 큰따옴표나 대괄호로 감쌉니다: `SELECT name AS "상품 이름"`

---

## 2.5 계산식과 표현식

SELECT 절에 **수식**을 사용할 수 있습니다.

```sql
-- 가격에 10% 부가세를 더한 금액
SELECT name, price, price * 1.1 AS 부가세포함가격
FROM products;
```

**결과:**

| name   | price   | 부가세포함가격 |
|--------|---------|--------------|
| 노트북 | 1500000 | 1650000.0    |
| 마우스 | 35000   | 38500.0      |
| 키보드 | 80000   | 88000.0      |

```sql
-- 문자열 연결 (SQLite에서 || 연산자 사용)
SELECT name || ' (' || city || ')' AS 고객정보
FROM customers;
```

**결과:**

| 고객정보          |
|-----------------|
| 김철수 (서울)   |
| 이영희 (부산)   |
| 박민준 (대구)   |

---

## 2.6 DISTINCT - 중복 제거

`DISTINCT` 키워드는 중복된 행을 제거하고 **유일한 값만** 반환합니다.

```sql
-- city 열에 어떤 도시가 있는지 확인
SELECT DISTINCT city FROM customers;
```

**결과:**

| city |
|------|
| 서울 |
| 부산 |
| 대구 |
| 인천 |

(서울이 2명이지만 한 번만 표시됩니다)

```sql
-- 여러 열에 DISTINCT 적용
SELECT DISTINCT category FROM products;
```

**결과:**

| category |
|----------|
| 전자제품 |
| 가구     |

---

## 2.7 리터럴 값과 NULL

### 리터럴 값

SELECT 절에 고정 값(리터럴)을 넣을 수 있습니다.

```sql
SELECT name, '고객' AS 유형 FROM customers;
```

**결과:**

| name   | 유형 |
|--------|------|
| 김철수 | 고객 |
| 이영희 | 고객 |

### NULL

`NULL`은 값이 **없음(미정, 모름)** 을 나타냅니다. 0이나 빈 문자열(`''`)과 다릅니다.

```sql
-- NULL이 포함된 경우 예시
SELECT name, city FROM customers WHERE city IS NULL;
```

---

## 2.8 SELECT 실행 순서

SQL은 작성 순서와 **실제 실행 순서**가 다릅니다.

```
작성 순서: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY
실행 순서: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
```

지금은 `FROM` 다음 `SELECT`가 실행된다는 것만 알아두세요. 이후 챕터에서 자세히 다룹니다.

---

## 2.9 주석

SQL 코드에 설명을 달 때 주석을 사용합니다.

```sql
-- 한 줄 주석 (대시 두 개)
SELECT name, price FROM products; -- 인라인 주석

/* 여러 줄 주석
   이 쿼리는 상품 이름과 가격을 조회합니다. */
SELECT name, price
FROM products;
```

---

## 연습 문제

**1번.** `products` 테이블에서 `name`과 `stock` 열만 조회하세요.

**2번.** `customers` 테이블의 모든 데이터를 조회하세요.

**3번.** `products` 테이블에서 `name`, `price` 열을 조회하되, `price`의 별칭을 `판매가격`으로 지정하세요.

**4번.** `products` 테이블에서 `category`의 종류를 중복 없이 조회하세요.

**5번.** `products` 테이블에서 `name`, `price`, 그리고 `price * 0.9`를 `할인가격`이라는 별칭으로 조회하세요.

**6번.** `customers` 테이블에서 `name`과 `email`을 `이름 (이메일)` 형식으로 연결하여 `연락처`라는 별칭으로 조회하세요.

---

## 정답

```sql
-- 1번
SELECT name, stock FROM products;

-- 2번
SELECT * FROM customers;

-- 3번
SELECT name, price AS 판매가격 FROM products;

-- 4번
SELECT DISTINCT category FROM products;

-- 5번
SELECT name, price, price * 0.9 AS 할인가격 FROM products;

-- 6번
SELECT name || ' (' || email || ')' AS 연락처 FROM customers;
```

---

*이전 챕터: [Chapter 1 - SQL과 데이터베이스 기초](chapter1.md)*
*다음 챕터: [Chapter 3 - WHERE 절과 필터링](chapter3.md)*
