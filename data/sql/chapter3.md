# Chapter 3: WHERE 절과 필터링

## 학습 목표

- WHERE 절을 사용해 조건에 맞는 데이터만 조회할 수 있다.
- 비교 연산자와 논리 연산자를 활용할 수 있다.
- BETWEEN, IN, LIKE, IS NULL 등의 특수 연산자를 사용할 수 있다.

---

## 3.1 WHERE 절 기본

`WHERE` 절은 특정 조건을 만족하는 행만 조회합니다.

```sql
SELECT 열이름
FROM 테이블이름
WHERE 조건;
```

```sql
-- 서울에 사는 고객만 조회
SELECT * FROM customers WHERE city = '서울';
```

**결과:**

| customer_id | name   | email             | city | join_date  |
|-------------|--------|-------------------|------|------------|
| 1           | 김철수 | chulsoo@email.com | 서울 | 2023-01-15 |
| 4           | 최지영 | jiyoung@email.com | 서울 | 2023-07-08 |

---

## 3.2 비교 연산자

| 연산자 | 의미 | 예시 |
|--------|------|------|
| `=` | 같다 | `WHERE city = '서울'` |
| `<>` 또는 `!=` | 같지 않다 | `WHERE city <> '서울'` |
| `>` | 크다 | `WHERE price > 100000` |
| `<` | 작다 | `WHERE price < 100000` |
| `>=` | 크거나 같다 | `WHERE price >= 100000` |
| `<=` | 작거나 같다 | `WHERE price <= 100000` |

```sql
-- 가격이 100,000원 이상인 상품
SELECT name, price FROM products WHERE price >= 100000;
```

**결과:**

| name   | price   |
|--------|---------|
| 노트북 | 1500000 |
| 책상   | 250000  |
| 의자   | 180000  |
| 모니터 | 450000  |

---

## 3.3 논리 연산자

### AND - 모든 조건을 만족

```sql
-- 전자제품 중 가격이 100,000원 이상인 상품
SELECT name, price, category
FROM products
WHERE category = '전자제품' AND price >= 100000;
```

**결과:**

| name   | price   | category |
|--------|---------|----------|
| 노트북 | 1500000 | 전자제품 |
| 모니터 | 450000  | 전자제품 |

### OR - 하나 이상의 조건을 만족

```sql
-- 서울 또는 부산에 사는 고객
SELECT name, city FROM customers WHERE city = '서울' OR city = '부산';
```

**결과:**

| name   | city |
|--------|------|
| 김철수 | 서울 |
| 이영희 | 부산 |
| 최지영 | 서울 |

### NOT - 조건의 반대

```sql
-- 서울이 아닌 고객
SELECT name, city FROM customers WHERE NOT city = '서울';

-- 가구가 아닌 상품
SELECT name, category FROM products WHERE NOT category = '가구';
```

### 연산자 우선순위

`AND`는 `OR`보다 우선순위가 높습니다. 괄호를 사용해 명확히 표현하는 것이 좋습니다.

```sql
-- 의도와 다를 수 있는 쿼리
SELECT * FROM products WHERE category = '가구' OR price > 100000 AND stock < 10;

-- 괄호로 명확하게
SELECT * FROM products WHERE (category = '가구' OR price > 100000) AND stock < 10;
```

---

## 3.4 BETWEEN - 범위 조건

`BETWEEN a AND b`는 a 이상 b 이하의 값을 선택합니다 (경계 값 포함).

```sql
-- 가격이 50,000원 ~ 300,000원인 상품
SELECT name, price FROM products WHERE price BETWEEN 50000 AND 300000;
```

**결과:**

| name   | price  |
|--------|--------|
| 키보드 | 80000  |
| 책상   | 250000 |
| 의자   | 180000 |

```sql
-- 동일한 의미 (BETWEEN 없이)
SELECT name, price FROM products WHERE price >= 50000 AND price <= 300000;
```

> `NOT BETWEEN`을 사용하면 범위 밖의 값을 선택합니다.

---

## 3.5 IN - 목록 조건

`IN`은 지정한 값 목록 중 하나와 일치하는 행을 선택합니다.

```sql
-- 서울, 부산, 대구에 사는 고객
SELECT name, city FROM customers WHERE city IN ('서울', '부산', '대구');
```

**결과:**

| name   | city |
|--------|------|
| 김철수 | 서울 |
| 이영희 | 부산 |
| 박민준 | 대구 |
| 최지영 | 서울 |

```sql
-- 동일한 의미 (OR 사용)
SELECT name, city FROM customers
WHERE city = '서울' OR city = '부산' OR city = '대구';

-- 특정 상품 ID 목록 조회
SELECT * FROM products WHERE product_id IN (1, 3, 6);

-- NOT IN: 목록에 없는 값
SELECT name, city FROM customers WHERE city NOT IN ('서울', '부산');
```

---

## 3.6 LIKE - 패턴 매칭

`LIKE`는 **문자열 패턴**에 맞는 값을 검색합니다.

### 와일드카드

| 와일드카드 | 의미 | 예시 |
|-----------|------|------|
| `%` | 0개 이상의 임의 문자 | `'김%'` → 김으로 시작 |
| `_` | 정확히 1개의 임의 문자 | `'_수현'` → 두 번째 자리가 수현 |

```sql
-- 이름이 '김'으로 시작하는 고객
SELECT name FROM customers WHERE name LIKE '김%';
-- 결과: 김철수

-- 이메일에 'email'이 포함된 고객
SELECT name, email FROM customers WHERE email LIKE '%email%';

-- 이름이 3글자인 고객 (이름이 한글 3자)
SELECT name FROM customers WHERE name LIKE '___';

-- 'com'으로 끝나는 이메일
SELECT email FROM customers WHERE email LIKE '%com';
```

> ⚠️ `LIKE`는 대소문자를 구분할 수 있습니다 (DBMS마다 다름). SQLite는 기본적으로 ASCII 문자에 대해 대소문자 무시.

---

## 3.7 IS NULL / IS NOT NULL

`NULL`은 값이 없음을 나타냅니다. `NULL`은 `=` 연산자로 비교할 수 없고, 반드시 `IS NULL` 또는 `IS NOT NULL`을 사용해야 합니다.

```sql
-- city가 NULL인 고객 (값이 없는 경우)
SELECT name FROM customers WHERE city IS NULL;

-- city가 NULL이 아닌 고객
SELECT name, city FROM customers WHERE city IS NOT NULL;
```

> ⚠️ **잘못된 예:**
> ```sql
> -- 이렇게 하면 안 됩니다!
> SELECT * FROM customers WHERE city = NULL;  -- 항상 빈 결과
> ```

---

## 3.8 복합 조건 예제

```sql
-- 전자제품이면서 가격이 50,000~500,000원이고 재고가 10개 이상인 상품
SELECT name, price, stock
FROM products
WHERE category = '전자제품'
  AND price BETWEEN 50000 AND 500000
  AND stock >= 10;

-- 서울 또는 부산이고 2023년 이후 가입한 고객
SELECT name, city, join_date
FROM customers
WHERE city IN ('서울', '부산')
  AND join_date >= '2023-01-01';
```

---

## 연습 문제

**1번.** `products` 테이블에서 `price`가 200,000원 미만인 상품의 이름과 가격을 조회하세요.

**2번.** `customers` 테이블에서 `city`가 '대구' 또는 '인천'인 고객의 이름과 도시를 조회하세요.

**3번.** `products` 테이블에서 `price`가 100,000원 이상 500,000원 이하인 상품을 조회하세요.

**4번.** `customers` 테이블에서 이름이 '이'로 시작하는 고객을 조회하세요.

**5번.** `products` 테이블에서 `category`가 '전자제품'이 아닌 상품을 조회하세요.

**6번.** `products` 테이블에서 `stock`이 10 미만인 상품을 조회하세요.

---

## 정답

```sql
-- 1번
SELECT name, price FROM products WHERE price < 200000;

-- 2번
SELECT name, city FROM customers WHERE city IN ('대구', '인천');

-- 3번
SELECT * FROM products WHERE price BETWEEN 100000 AND 500000;

-- 4번
SELECT * FROM customers WHERE name LIKE '이%';

-- 5번
SELECT * FROM products WHERE category <> '전자제품';
-- 또는
SELECT * FROM products WHERE category NOT IN ('전자제품');

-- 6번
SELECT * FROM products WHERE stock < 10;
```

---

*이전 챕터: [Chapter 2 - 기본 SELECT 문](chapter2.md)*
*다음 챕터: [Chapter 4 - 정렬과 제한](chapter4.md)*
