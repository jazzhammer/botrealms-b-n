CREATE TABLE IF NOT EXISTS bot_botscript (
    bot_botscript_id uuid DEFAULT gen_random_uuid(),
    bot_script_id uuid NOT NULL,
    bot_id uuid NOT NULL,
    PRIMARY KEY (bot_botscript_id)
)