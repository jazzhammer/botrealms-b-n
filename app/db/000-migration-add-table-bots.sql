CREATE TABLE IF NOT EXISTS bot (
    bot_id uuid DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    PRIMARY KEY (bot_id)
)