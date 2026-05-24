# Chapter 1: SQL과 데이터베이스 기초

## 학습 목표

- 데이터베이스와 DBMS의 개념을 이해한다.
- 관계형 데이터베이스의 구조를 파악한다.
- SQL의 역할과 분류를 설명할 수 있다.
- 테이블, 행, 열, 기본키, 외래키 등 핵심 용어를 정확히 이해한다.

---

## 1.1 데이터베이스란?

**데이터베이스(Database, DB)** 는 관련된 데이터를 체계적으로 저장하고 관리하는 집합입니다.

예를 들어 온라인 쇼핑몰을 운영한다면 다음과 같은 데이터를 관리해야 합니다.

- 고객 정보 (이름, 이메일, 주소)
- 상품 정보 (이름, 가격, 재고)
- 주문 정보 (누가, 무엇을, 언제)

이런 데이터들을 파일(엑셀, CSV 등)로 관리하면 데이터 중복, 불일치, 검색 어려움 등의 문제가 생깁니다. **데이터베이스는 이러한 문제를 해결하기 위해 등장**했습니다.

---

## 1.2 DBMS

**DBMS(Database Management System, 데이터베이스 관리 시스템)** 는 데이터베이스를 생성하고 관리하는 소프트웨어입니다.

### DBMS의 주요 기능

| 기능 | 설명 |
|------|------|
| 데이터 정의 | 테이블, 인덱스 등 데이터 구조 정의 |
| 데이터 조작 | 데이터 삽입, 수정, 삭제, 조회 |
| 데이터 제어 | 접근 권한 관리, 보안 |
| 데이터 무결성 | 데이터 일관성과 정확성 유지 |
| 트랜잭션 관리 | 작업의 원자성 보장 |

### 주요 DBMS 종류

| DBMS | 특징 | 용도 |
|------|------|------|
| **SQLite** | 경량, 파일 기반, 설치 불필요 | 모바일, 임베디드, 학습용 |
| **MySQL** | 오픈소스, 빠른 읽기 성능 | 웹 서비스 |
| **PostgreSQL** | 표준 준수, 고급 기능 풍부 | 엔터프라이즈, 데이터 분석 |
| **Oracle** | 엔터프라이즈급, 상용 | 대기업, 금융 |
| **SQL Server** | Microsoft 생태계 | 윈도우 환경 |

---

## 1.3 관계형 데이터베이스

**관계형 데이터베이스(Relational Database, RDB)** 는 데이터를 **테이블(표)** 형태로 저장하고, 테이블 간의 **관계(Relation)** 를 통해 데이터를 연결하는 방식입니다.

### 테이블(Table)

테이블은 행(Row)과 열(Column)로 구성된 2차원 구조입니다.

**고객(customers) 테이블 예시:**

| customer_id | name   | email              | city   |
|-------------|--------|--------------------|--------|
| 1           | 김철수 | chulsoo@email.com  | 서울   |
| 2           | 이영희 | younghee@email.com | 부산   |
| 3           | 박민준 | minjun@email.com   | 대구   |

### 핵심 용어 정리

| 용어 | 영어 | 설명 |
|------|------|------|
| 테이블 | Table | 데이터를 저장하는 2차원 구조 |
| 행 | Row / Record / Tuple | 테이블의 가로 한 줄 (하나의 데이터 항목) |
| 열 | Column / Field / Attribute | 테이블의 세로 한 줄 (데이터의 속성) |
| 기본키 | Primary Key (PK) | 행을 고유하게 식별하는 열 |
| 외래키 | Foreign Key (FK) | 다른 테이블의 기본키를 참조하는 열 |
| 스키마 | Schema | 테이블의 구조 정의 |
| 인스턴스 | Instance | 현재 저장된 실제 데이터 |

---

## 1.4 기본키와 외래키

### 기본키 (Primary Key)

기본키는 테이블의 각 행을 **유일하게 식별**하는 열(또는 열의 조합)입니다.

**기본키의 조건:**
- 중복 값이 있으면 안 됩니다 (유일성).
- NULL 값이 있으면 안 됩니다 (NOT NULL).

```
customers 테이블에서 customer_id가 기본키 → 모든 고객은 서로 다른 ID를 가짐
```

### 외래키 (Foreign Key)

외래키는 다른 테이블의 기본키를 **참조**하는 열입니다. 테이블 간의 관계를 정의합니다.

**주문(orders) 테이블 예시:**

| order_id | customer_id | product   | amount |
|----------|-------------|-----------|--------|
| 101      | 1           | 노트북    | 1500000 |
| 102      | 2           | 마우스    | 35000  |
| 103      | 1           | 키보드    | 80000  |

여기서 `customer_id`는 `customers` 테이블의 `customer_id`를 참조하는 **외래키**입니다.

```
orders.customer_id → customers.customer_id (참조 관계)
```

---

## 1.5 SQL이란?

**SQL(Structured Query Language, 구조적 질의 언어)** 은 관계형 데이터베이스와 통신하기 위한 표준 언어입니다.

### SQL의 분류

| 분류 | 영어 | 명령어 | 설명 |
|------|------|--------|------|
| **데이터 정의어** | DDL (Data Definition Language) | CREATE, ALTER, DROP | 테이블 구조 정의 |
| **데이터 조작어** | DML (Data Manipulation Language) | SELECT, INSERT, UPDATE, DELETE | 데이터 조작 |
| **데이터 제어어** | DCL (Data Control Language) | GRANT, REVOKE | 권한 관리 |
| **트랜잭션 제어어** | TCL (Transaction Control Language) | COMMIT, ROLLBACK | 트랜잭션 관리 |

### SQL 특징

- **선언적(Declarative)**: "어떻게"가 아닌 "무엇을" 원하는지 기술합니다.
- **표준화**: ISO 표준 (SQL-92, SQL-99, SQL:2016 등)으로 대부분의 DBMS에서 사용 가능.
- **대소문자 구분 없음**: `SELECT`와 `select`는 동일 (관례상 키워드는 대문자 사용).

---

## 1.6 실습 환경 준비

### SQLite 설치 (명령줄)

```bash
# Ubuntu/Debian
sudo apt-get install sqlite3

# macOS (Homebrew)
brew install sqlite

# Windows: https://www.sqlite.org/download.html 에서 다운로드
```

### 첫 데이터베이스 생성

```bash
# 터미널에서 SQLite 실행
sqlite3 mydb.db

# SQLite 프롬프트가 열림
sqlite>
```

### 실습용 샘플 데이터 생성

이후 챕터에서 사용할 테이블을 미리 만들어 둡니다.

```sql
-- 고객 테이블
CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    city TEXT,
    join_date DATE
);

-- 상품 테이블
CREATE TABLE products (
    product_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT,
    stock INTEGER DEFAULT 0
);

-- 주문 테이블
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    order_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 샘플 데이터 삽입
INSERT INTO customers VALUES
    (1, '김철수', 'chulsoo@email.com', '서울', '2023-01-15'),
    (2, '이영희', 'younghee@email.com', '부산', '2023-03-22'),
    (3, '박민준', 'minjun@email.com', '대구', '2023-05-10'),
    (4, '최지영', 'jiyoung@email.com', '서울', '2023-07-08'),
    (5, '정수현', 'soohyun@email.com', '인천', '2024-01-20');

INSERT INTO products VALUES
    (1, '노트북', 1500000, '전자제품', 10),
    (2, '마우스', 35000, '전자제품', 50),
    (3, '키보드', 80000, '전자제품', 30),
    (4, '책상', 250000, '가구', 5),
    (5, '의자', 180000, '가구', 8),
    (6, '모니터', 450000, '전자제품', 15);

INSERT INTO orders VALUES
    (101, 1, 1, 1, '2024-01-10'),
    (102, 2, 2, 2, '2024-01-11'),
    (103, 1, 3, 1, '2024-01-12'),
    (104, 3, 6, 1, '2024-01-15'),
    (105, 4, 4, 1, '2024-02-01'),
    (106, 5, 5, 2, '2024-02-05'),
    (107, 2, 1, 1, '2024-02-10'),
    (108, 1, 2, 3, '2024-02-15');
```

---

## 연습 문제

**1번.** 다음 설명이 맞으면 O, 틀리면 X를 표시하세요.

- ( ) 기본키는 NULL 값을 가질 수 있다.
- ( ) SQL은 관계형 데이터베이스를 위한 표준 언어이다.
- ( ) 외래키는 다른 테이블의 기본키를 참조한다.
- ( ) 한 테이블에 기본키는 여러 개 있을 수 있다.

**2번.** 다음 용어를 영어로 쓰고 간단히 설명하세요.

- 테이블: ________
- 행: ________
- 열: ________

**3번.** SQL의 DML에 해당하는 명령어를 모두 쓰세요.

**4번.** 위의 실습 환경 준비 코드를 직접 실행하고, 다음 쿼리를 실행해 결과를 확인하세요.

```sql
SELECT * FROM customers;
SELECT * FROM products;
SELECT * FROM orders;
```

---

## 정답

1. X, O, O, X
2. Table(데이터 저장 구조), Row/Record(하나의 데이터 항목), Column/Field(데이터 속성)
3. SELECT, INSERT, UPDATE, DELETE

---

*다음 챕터: [Chapter 2 - 기본 SELECT 문](#sql/chapter2.md)*
