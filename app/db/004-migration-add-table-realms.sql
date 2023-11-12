CREATE TABLE IF NOT EXISTS realm (
    realm_id uuid DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    PRIMARY KEY (realm_id)
)