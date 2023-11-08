CREATE TABLE IF NOT EXISTS bots (
    bots_id uuid DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    PRIMARY KEY (bots_id)
)