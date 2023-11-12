CREATE TABLE IF NOT EXISTS botscript (
    botscript_id uuid DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    type VARCHAR(32) NOT NULL,
    logic TEXT NOT NULL,
    PRIMARY KEY (botscript_id)
)