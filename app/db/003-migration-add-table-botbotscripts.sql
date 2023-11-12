CREATE TABLE IF NOT EXISTS botbotscript (
    botbotscript_id uuid DEFAULT gen_random_uuid(),
    bot_script_id uuid NOT NULL,
    bot_id uuid NOT NULL,
    PRIMARY KEY (botbotscript_id)
)