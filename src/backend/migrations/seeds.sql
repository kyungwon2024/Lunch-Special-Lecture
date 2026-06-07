-- Seeds data for local development

-- 1. Create Users
-- Admin User
INSERT INTO users (id, phone_hash, phone_enc, email_enc, name_enc, role, verified, verified_at, status)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    encode(digest('01000000000', 'sha256'), 'hex'),
    pgp_sym_encrypt('01000000000', 'test-jwt-secret'),
    pgp_sym_encrypt('admin@lunchspecial.kr', 'test-jwt-secret'),
    pgp_sym_encrypt('어드민', 'test-jwt-secret'),
    'admin',
    true,
    NOW(),
    'active'
) ON CONFLICT (phone_hash) DO NOTHING;

-- Owner User 1
INSERT INTO users (id, phone_hash, phone_enc, email_enc, name_enc, role, verified, verified_at, status)
VALUES (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    encode(digest('01011112222', 'sha256'), 'hex'),
    pgp_sym_encrypt('01011112222', 'test-jwt-secret'),
    pgp_sym_encrypt('owner1@test.com', 'test-jwt-secret'),
    pgp_sym_encrypt('박사장', 'test-jwt-secret'),
    'owner',
    true,
    NOW(),
    'active'
) ON CONFLICT (phone_hash) DO NOTHING;

-- Owner User 2
INSERT INTO users (id, phone_hash, phone_enc, email_enc, name_enc, role, verified, verified_at, status)
VALUES (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    encode(digest('01022223333', 'sha256'), 'hex'),
    pgp_sym_encrypt('01022223333', 'test-jwt-secret'),
    pgp_sym_encrypt('owner2@test.com', 'test-jwt-secret'),
    pgp_sym_encrypt('이사장', 'test-jwt-secret'),
    'owner',
    true,
    NOW(),
    'active'
) ON CONFLICT (phone_hash) DO NOTHING;

-- Normal User 1 (Verified)
INSERT INTO users (id, phone_hash, phone_enc, email_enc, name_enc, role, verified, verified_at, status)
VALUES (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    encode(digest('01033334444', 'sha256'), 'hex'),
    pgp_sym_encrypt('01033334444', 'test-jwt-secret'),
    pgp_sym_encrypt('user1@test.com', 'test-jwt-secret'),
    pgp_sym_encrypt('김대리', 'test-jwt-secret'),
    'user',
    true,
    NOW(),
    'active'
) ON CONFLICT (phone_hash) DO NOTHING;

-- Normal User 2 (Not Verified)
INSERT INTO users (id, phone_hash, phone_enc, email_enc, name_enc, role, verified, verified_at, status)
VALUES (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    encode(digest('01044445555', 'sha256'), 'hex'),
    pgp_sym_encrypt('01044445555', 'test-jwt-secret'),
    pgp_sym_encrypt('user2@test.com', 'test-jwt-secret'),
    pgp_sym_encrypt('이주부', 'test-jwt-secret'),
    'user',
    false,
    NULL,
    'active'
) ON CONFLICT (phone_hash) DO NOTHING;


-- 2. Create Owners
INSERT INTO owners (id, user_id, business_number_hash, business_number_enc, representative_name_enc, opening_date, business_status, verification_proof)
VALUES (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    encode(digest('1208680349', 'sha256'), 'hex'),
    pgp_sym_encrypt('1208680349', 'test-jwt-secret'),
    pgp_sym_encrypt('박사장', 'test-jwt-secret'),
    '2020-03-01',
    'active',
    '{"status": "verified", "source": "nts_api"}'::jsonb
) ON CONFLICT (business_number_hash) DO NOTHING;

INSERT INTO owners (id, user_id, business_number_hash, business_number_enc, representative_name_enc, opening_date, business_status, verification_proof)
VALUES (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    encode(digest('1208680350', 'sha256'), 'hex'),
    pgp_sym_encrypt('1208680350', 'test-jwt-secret'),
    pgp_sym_encrypt('이사장', 'test-jwt-secret'),
    '2018-05-15',
    'active',
    '{"status": "verified", "source": "nts_api"}'::jsonb
) ON CONFLICT (business_number_hash) DO NOTHING;


-- 3. Create Admins
INSERT INTO admins (id, user_id, level, allowed_ip_cidrs)
VALUES (
    'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'super',
    '{"0.0.0.0/0"}'::inet[]
) ON CONFLICT (user_id) DO NOTHING;


-- 5. Create Stores
-- Store 1 (Gangnam Station)
INSERT INTO stores (id, owner_id, name, phone, address, location, categories, status, status_badge)
VALUES (
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
    '진고개 한식당',
    '02-1234-5678',
    '서울시 강남구 역삼동 123-45',
    ST_SetSRID(ST_MakePoint(127.0281, 37.4975), 4326)::geography,
    ARRAY['한식', '건강식'],
    'active',
    'open'
) ON CONFLICT (id) DO NOTHING;

-- Store 2 (Gangnam Station - Near Store 1)
INSERT INTO stores (id, owner_id, name, phone, address, location, categories, status, status_badge)
VALUES (
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380b00',
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
    '홍길동 제육마을',
    '02-987-6543',
    '서울시 강남구 테헤란로 123',
    ST_SetSRID(ST_MakePoint(127.0289, 37.4981), 4326)::geography,
    ARRAY['한식', '분식'],
    'active',
    'open'
) ON CONFLICT (id) DO NOTHING;


-- 6. Store Metadata
INSERT INTO store_metadata (store_id, solo_seating, total_seats, meal_duration_enum, available_now_toggle, operating_hours)
VALUES (
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
    true,
    24,
    '15-25',
    true,
    '{"mon": {"open": "11:00", "close": "22:00"}, "tue": {"open": "11:00", "close": "22:00"}, "wed": {"open": "11:00", "close": "22:00"}, "thu": {"open": "11:00", "close": "22:00"}, "fri": {"open": "11:00", "close": "22:00"}}'::jsonb
) ON CONFLICT (store_id) DO NOTHING;

INSERT INTO store_metadata (store_id, solo_seating, total_seats, meal_duration_enum, available_now_toggle, operating_hours)
VALUES (
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380b00',
    false,
    40,
    '25-40',
    false,
    '{"mon": {"open": "11:00", "close": "21:30"}, "tue": {"open": "11:00", "close": "21:30"}, "wed": {"open": "11:00", "close": "21:30"}, "thu": {"open": "11:00", "close": "21:30"}, "fri": {"open": "11:00", "close": "21:30"}}'::jsonb
) ON CONFLICT (store_id) DO NOTHING;


-- 7. Recurring Specials
INSERT INTO recurring_specials (id, store_id, menu_name, normal_price, discount_price, total_quantity, recurring_days, start_time, end_time, active)
VALUES (
    '00000000-0000-0000-0000-000000000011',
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
    '가성비 제육볶음 쌈밥정식',
    10000,
    7500,
    30,
    ARRAY['MON', 'TUE', 'WED', 'THU', 'FRI']::VARCHAR(3)[],
    '11:00',
    '14:00',
    true
) ON CONFLICT (id) DO NOTHING;


-- 8. Lunch Specials (Active Today)
INSERT INTO lunch_specials (id, store_id, menu_name, description, normal_price, discount_price, discount_rate, total_quantity, expires_at, status, publish_at, published_at, recurring_id)
VALUES (
    '00000000-0000-0000-0000-000000000022',
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
    '가성비 제육볶음 쌈밥정식',
    '국산 한돈 돼지고기를 매콤한 비법 양념에 볶아 신선한 유기농 모둠 쌈채소와 뚝배기 된장찌개를 든든한 1인용 밥상으로 제공합니다.',
    10000,
    7500,
    25,
    30,
    NOW() + INTERVAL '3 hours',
    'PUBLISHED',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '1 hour',
    '00000000-0000-0000-0000-000000000011'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO lunch_specials (id, store_id, menu_name, description, normal_price, discount_price, discount_rate, total_quantity, expires_at, status, publish_at, published_at, recurring_id)
VALUES (
    '00000000-0000-0000-0000-000000000033',
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380b00',
    '수제 매콤 돈까스 특선',
    '매일 아침 직접 두드려 만드는 한돈 등심 돈까스에 매콤달콤한 수제 소스를 얹어 내어드립니다.',
    12000,
    8000,
    33,
    40,
    NOW() + INTERVAL '4 hours',
    'PUBLISHED',
    NOW() - INTERVAL '30 minutes',
    NOW() - INTERVAL '30 minutes',
    NULL
) ON CONFLICT (id) DO NOTHING;


-- 9. Coupon Templates
INSERT INTO coupon_templates (id, store_id, discount_type, discount_value, applied_special_ids, target_user_group, limit_quantity, remaining_quantity, expires_at, status)
VALUES (
    '00000000-0000-0000-0000-000000000044',
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
    'amount',
    1000,
    ARRAY['00000000-0000-0000-0000-000000000022']::UUID[],
    'ALL',
    100,
    100,
    NOW() + INTERVAL '7 days',
    'ACTIVE'
) ON CONFLICT (id) DO NOTHING;
