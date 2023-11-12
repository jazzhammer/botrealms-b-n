CREATE TABLE IF NOT EXISTS bot_equipment (
    bot_equipment_id uuid DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    PRIMARY KEY (bot_equipment_id)
)