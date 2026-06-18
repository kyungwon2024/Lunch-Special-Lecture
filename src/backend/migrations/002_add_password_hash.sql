-- 002_add_password_hash.sql
-- 목적: I-004 정석 수정 — 비밀번호 해시 전용 컬럼 분리
--
-- 배경:
--   001_initial_schema.sql 의 users.phone_enc 는 BYTEA(휴대폰 AES 암호화용)인데,
--   signup 이 비밀번호 bcrypt 해시(문자열)를 이 BYTEA 컬럼에 저장했다.
--   PostgREST 가 BYTEA 를 '\x<hex>' 문자열로 반환하면서 bcrypt 원문이 변형되어
--   login 의 bcrypt.compare 가 항상 실패 → 가입 후 로그인 100% 불가(Critical).
--
-- 현재 배포 코드는 login 에서 '\x<hex>' 를 원문으로 복원해 비교하는 임시 수정으로
-- 동작한다. 본 마이그레이션은 password 를 전용 TEXT 컬럼으로 분리하는 정석 해법이며,
-- Supabase SQL Editor 에서 1회 실행한다(로컬 DDL 권한 부재로 자동 적용 불가).

-- 1) 전용 컬럼 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 2) 기존 사용자 백필 — phone_enc(BYTEA)에 저장된 bcrypt 바이트를 TEXT 로 복원
--    (phone_enc 는 bcrypt ASCII 바이트열이므로 UTF8 변환 시 원문 복구)
UPDATE users
   SET password_hash = convert_from(phone_enc, 'UTF8')
 WHERE password_hash IS NULL
   AND phone_enc IS NOT NULL;

-- 3) (적용 후) 애플리케이션 코드 전환 가이드
--    - signup: insert { password_hash: passwordHash, phone_enc: <실제 휴대폰 AES-256> }
--    - login : select 'id, password_hash, role, verified' → compare(password, user.password_hash)
--    위 코드 전환 배포가 끝나면 login 의 '\x' 디코딩 임시 로직 제거 가능.

-- 검증 쿼리(선택):
-- SELECT id, left(password_hash, 7) AS pw_prefix FROM users LIMIT 5;  -- '$2a$12$' 또는 '$2b$12$' 기대
