-- Enable PostGIS and pgcrypto extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_hash VARCHAR(64) UNIQUE NOT NULL,
    phone_enc BYTEA NOT NULL,
    email_enc BYTEA NULL,
    name_enc BYTEA NULL,
    social_provider VARCHAR(10) NULL CHECK (social_provider IN ('kakao', 'naver', 'apple')),
    social_id VARCHAR(255) NULL,
    verified BOOLEAN NOT NULL DEFAULT false,
    verified_at TIMESTAMPTZ NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'owner', 'admin')),
    font_scale NUMERIC(3,2) NOT NULL DEFAULT 1.0 CHECK (font_scale IN (1.0, 1.25, 1.5)),
    dark_mode BOOLEAN NOT NULL DEFAULT false,
    push_opt_in_location BOOLEAN NOT NULL DEFAULT true,
    push_opt_in_favorite BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(15) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'withdrawn')),
    suspended_reason TEXT NULL,
    withdrawn_at TIMESTAMPTZ NULL,
    purged_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. owners Table
CREATE TABLE IF NOT EXISTS owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_number_hash VARCHAR(64) UNIQUE NOT NULL,
    business_number_enc BYTEA NOT NULL,
    representative_name_enc BYTEA NOT NULL,
    opening_date DATE NOT NULL,
    business_status VARCHAR(15) NOT NULL DEFAULT 'active' CHECK (business_status IN ('active', 'closed', 'suspended')),
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verification_proof JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. admins Table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    level VARCHAR(15) NOT NULL DEFAULT 'support' CHECK (level IN ('super', 'ops', 'support')),
    allowed_ip_cidrs INET[] NOT NULL DEFAULT '{}'::inet[],
    last_login_at TIMESTAMPTZ NULL,
    last_login_ip INET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. stores Table
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE RESTRICT,
    name VARCHAR(80) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    categories TEXT[] NOT NULL CHECK (array_length(categories, 1) >= 1),
    representative_image_url TEXT NULL,
    additional_images TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    status VARCHAR(15) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'closed', 'suspended')),
    status_badge VARCHAR(10) NOT NULL DEFAULT 'open' CHECK (status_badge IN ('open', 'paused', 'closed')),
    paused_until TIMESTAMPTZ NULL,
    draft_data JSONB NULL,
    draft_step SMALLINT NULL CHECK (draft_step BETWEEN 1 AND 3),
    published_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. store_metadata Table
CREATE TABLE IF NOT EXISTS store_metadata (
    store_id UUID PRIMARY KEY REFERENCES stores(id) ON DELETE CASCADE,
    solo_seating BOOLEAN NOT NULL DEFAULT false,
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    meal_duration_enum VARCHAR(10) NOT NULL CHECK (meal_duration_enum IN ('15-25', '25-40', '40+')),
    available_now_toggle BOOLEAN NOT NULL DEFAULT false,
    operating_hours JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. recurring_specials Table
CREATE TABLE IF NOT EXISTS recurring_specials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    menu_name VARCHAR(80) NOT NULL,
    normal_price BIGINT NOT NULL CHECK (normal_price > 0),
    discount_price BIGINT NOT NULL CHECK (discount_price > 0 AND discount_price < normal_price),
    total_quantity INTEGER NOT NULL CHECK (total_quantity > 0),
    recurring_days VARCHAR(3)[] NOT NULL CHECK (recurring_days <@ ARRAY['MON','TUE','WED','THU','FRI','SAT','SUN']::VARCHAR(3)[]),
    start_time TIME NOT NULL DEFAULT '11:00',
    end_time TIME NOT NULL DEFAULT '14:00',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. lunch_specials Table
CREATE TABLE IF NOT EXISTS lunch_specials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    menu_name VARCHAR(80) NOT NULL,
    description TEXT NULL,
    normal_price BIGINT NOT NULL CHECK (normal_price > 0),
    discount_price BIGINT NOT NULL CHECK (discount_price > 0 AND discount_price < normal_price),
    discount_rate SMALLINT NOT NULL CHECK (discount_rate BETWEEN 1 AND 99),
    total_quantity INTEGER NOT NULL CHECK (total_quantity > 0),
    gallery_images TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(15) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'PUBLISHED', 'SOLD_OUT', 'EXPIRED', 'CANCELLED')),
    publish_at TIMESTAMPTZ NULL,
    published_at TIMESTAMPTZ NULL,
    recurring_id UUID NULL REFERENCES recurring_specials(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. coupon_templates Table
CREATE TABLE IF NOT EXISTS coupon_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    discount_type VARCHAR(10) NOT NULL CHECK (discount_type IN ('percent', 'amount')),
    discount_value INTEGER NOT NULL CHECK (discount_value > 0),
    applied_special_ids UUID[] NOT NULL DEFAULT '{}'::UUID[],
    target_user_group VARCHAR(10) NOT NULL DEFAULT 'ALL' CHECK (target_user_group IN ('NEW', 'LOYAL', 'ALL')),
    loyal_threshold SMALLINT NULL DEFAULT 3,
    limit_quantity INTEGER NULL CHECK (limit_quantity > 0),
    remaining_quantity INTEGER NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(15) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXHAUSTED', 'EXPIRED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NULL REFERENCES coupon_templates(id) ON DELETE SET NULL,
    lunch_special_id UUID NOT NULL REFERENCES lunch_specials(id) ON DELETE RESTRICT,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(15) NOT NULL DEFAULT 'ISSUED' CHECK (status IN ('ISSUED', 'USED', 'EXPIRED', 'REVOKED')),
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ NULL,
    used_location GEOGRAPHY(Point, 4326) NULL,
    redeemed_by_owner_id UUID NULL REFERENCES owners(id) ON DELETE SET NULL,
    revoke_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. coupon_audit Table
CREATE TABLE IF NOT EXISTS coupon_audit (
    id BIGSERIAL PRIMARY KEY,
    coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('ISSUED', 'TOKEN_GENERATED', 'REDEEM_ATTEMPT', 'REDEEM_SUCCESS', 'REDEEM_FAIL', 'EXPIRED', 'REVOKED')),
    event_data JSONB NOT NULL DEFAULT '{}'::JSONB,
    actor_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(20) NOT NULL CHECK (category IN ('COUPON_ISSUED', 'COUPON_REDEEMED', 'COUPON_EXPIRE_SOON', 'COUPON_EXPIRED', 'NEAR_SPECIAL', 'FAVORITE_SPECIAL', 'REPORT_RESOLVED', 'SYSTEM_NOTICE')),
    title VARCHAR(120) NOT NULL,
    body TEXT NOT NULL,
    deep_link TEXT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ NULL,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. push_tokens Table
CREATE TABLE IF NOT EXISTS push_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(10) NOT NULL CHECK (provider IN ('FCM', 'APNS')),
    token TEXT NOT NULL,
    device_id VARCHAR(100) NULL,
    os_version VARCHAR(20) NULL,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, token)
);

-- 13. reports Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    coupon_id UUID NULL REFERENCES coupons(id) ON DELETE SET NULL,
    store_id UUID NULL REFERENCES stores(id) ON DELETE SET NULL,
    report_type VARCHAR(30) NOT NULL CHECK (report_type IN ('STORE_REJECTION', 'ABUSE_USER', 'INAPPROPRIATE_CONTENT', 'OTHER')),
    content TEXT NOT NULL,
    attached_images TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    status VARCHAR(15) NOT NULL DEFAULT 'RECEIVED' CHECK (status IN ('RECEIVED', 'IN_REVIEW', 'RESOLVED', 'REJECTED', 'MERGED')),
    assigned_admin_id UUID NULL REFERENCES admins(id) ON DELETE SET NULL,
    resolution_action VARCHAR(20) NULL CHECK (resolution_action IN ('WARNING', 'COUPON_REFUND', 'USER_SUSPEND', 'STORE_SUSPEND', 'NONE')),
    resolution_note TEXT NULL,
    resolved_at TIMESTAMPTZ NULL,
    sla_deadline TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    merged_into_id UUID NULL REFERENCES reports(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. store_audit_logs Table
CREATE TABLE IF NOT EXISTS store_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    changed_by_owner_id UUID NULL REFERENCES owners(id) ON DELETE SET NULL,
    changed_by_admin_id UUID NULL REFERENCES admins(id) ON DELETE SET NULL,
    changed_fields JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. audit_logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE RESTRICT,
    action_type VARCHAR(30) NOT NULL,
    target_type VARCHAR(20) NULL,
    target_id UUID NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    ip_address INET NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    coupon_id UUID NOT NULL UNIQUE REFERENCES coupons(id) ON DELETE RESTRICT,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NULL,
    images TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    verified_purchase BOOLEAN NOT NULL DEFAULT true,
    owner_reply TEXT NULL,
    owner_replied_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. favorites Table
CREATE TABLE IF NOT EXISTS favorites (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    notify_new_special BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, store_id)
);

-- 18. companies Table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    business_number_enc BYTEA NOT NULL UNIQUE,
    hr_admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    plan VARCHAR(15) NOT NULL DEFAULT 'TEAM' CHECK (plan IN ('TEAM', 'ENTERPRISE')),
    monthly_quota_per_employee SMALLINT NOT NULL DEFAULT 20,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. employees Table
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    employee_code VARCHAR(50) NOT NULL,
    department VARCHAR(50) NULL,
    status VARCHAR(15) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'leave', 'resigned')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. meal_tickets Table
CREATE TABLE IF NOT EXISTS meal_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    coupon_id UUID UNIQUE NULL REFERENCES coupons(id) ON DELETE SET NULL,
    amount BIGINT NOT NULL CHECK (amount > 0),
    issued_month DATE NOT NULL,
    status VARCHAR(15) NOT NULL DEFAULT 'ISSUED' CHECK (status IN ('ISSUED', 'USED', 'EXPIRED', 'CANCELLED')),
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    lunch_special_id UUID NULL REFERENCES lunch_specials(id) ON DELETE SET NULL,
    slot VARCHAR(30) NOT NULL CHECK (slot IN ('MAIN_TOP', 'CATEGORY_TOP', 'KEYWORD')),
    keyword VARCHAR(50) NULL,
    daily_budget BIGINT NOT NULL CHECK (daily_budget >= 0),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_PAYMENT' CHECK (status IN ('PENDING_PAYMENT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED')),
    impressions BIGINT NOT NULL DEFAULT 0,
    clicks BIGINT NOT NULL DEFAULT 0,
    conversions BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NULL REFERENCES coupons(id) ON DELETE SET NULL,
    campaign_id UUID NULL REFERENCES campaigns(id) ON DELETE SET NULL,
    user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    owner_id UUID NULL REFERENCES owners(id) ON DELETE SET NULL,
    payment_provider VARCHAR(15) NOT NULL CHECK (payment_provider IN ('TOSS_PAY', 'NAVER_PAY', 'KAKAO_PAY')),
    payment_key VARCHAR(200) NOT NULL UNIQUE,
    amount BIGINT NOT NULL CHECK (amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIAL_REFUND')),
    paid_at TIMESTAMPTZ NULL,
    refund_amount BIGINT NULL,
    refunded_at TIMESTAMPTZ NULL,
    pg_response JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

/*
-- =========================================================================
-- INDEXES DEFINITIONS
-- =========================================================================

-- PostGIS GiST index for fast radius search (NFR-003, F-0101)
CREATE INDEX IF NOT EXISTS idx_stores_location ON stores USING GIST (location);

-- Partial index for active stores
CREATE INDEX IF NOT EXISTS idx_stores_status_active ON stores (status) WHERE status = 'active';

-- GIN index for multi-category filters
CREATE INDEX IF NOT EXISTS idx_stores_categories ON stores USING GIN (categories);

-- Index for owner's store lookups
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores (owner_id);

-- Index for active lunch specials of a store
CREATE INDEX IF NOT EXISTS idx_specials_store_status ON lunch_specials (store_id, status, expires_at);

-- Partial index for main feed active specials
CREATE INDEX IF NOT EXISTS idx_specials_active_now ON lunch_specials (expires_at) WHERE status = 'PUBLISHED';

-- Partial index for sorting active specials by published date descending
CREATE INDEX IF NOT EXISTS idx_specials_published_at ON lunch_specials (published_at DESC) WHERE status = 'PUBLISHED';

-- Index for user's coupon wallet
CREATE INDEX IF NOT EXISTS idx_coupons_user_status ON coupons (user_id, status, expires_at);

-- Partial index for 1 day 5 coupon limit (F-0306)
CREATE INDEX IF NOT EXISTS idx_coupons_daily_limit ON coupons (user_id, CAST(issued_at AS DATE)) WHERE status = 'ISSUED';

-- Partial UNIQUE index enforcing 1 coupon issued per store per user per day (F-0306)
CREATE UNIQUE INDEX IF NOT EXISTS idx_coupons_per_store_user_date ON coupons (user_id, store_id, CAST(issued_at AS DATE)) WHERE status = 'ISSUED';

-- Partial index for cron jobs monitoring expiring coupons
CREATE INDEX IF NOT EXISTS idx_coupons_expires_soon ON coupons (expires_at) WHERE status = 'ISSUED';

-- Index for owner analytics
CREATE INDEX IF NOT EXISTS idx_coupons_store_status ON coupons (store_id, status, used_at DESC);

-- Index for unread notifications
CREATE INDEX IF NOT EXISTS idx_notis_user_read ON notifications (user_id, read, created_at DESC);

-- Index for notification expiration cron cleanup
CREATE INDEX IF NOT EXISTS idx_notis_expires ON notifications (expires_at);

-- Partial index for 어드민 SLA monitoring (24h)
CREATE INDEX IF NOT EXISTS idx_reports_sla ON reports (sla_deadline) WHERE status IN ('RECEIVED', 'IN_REVIEW');

-- Partial index for admin review queues
CREATE INDEX IF NOT EXISTS idx_reports_assigned ON reports (assigned_admin_id) WHERE status = 'IN_REVIEW';

-- Index for active coupon templates of stores
CREATE INDEX IF NOT EXISTS idx_templates_store_active ON coupon_templates (store_id, status, expires_at);

-- Index for cron job scanning active recurring specials
CREATE INDEX IF NOT EXISTS idx_recurring_active ON recurring_specials (store_id, active);

-- Index for cleaning up inactive push tokens
CREATE INDEX IF NOT EXISTS idx_push_inactive ON push_tokens (last_active_at);

-- Index for admin audit logging
CREATE INDEX IF NOT EXISTS idx_audit_admin_date ON audit_logs (admin_id, created_at DESC);
*/
