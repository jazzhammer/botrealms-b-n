CREATE TABLE IF NOT EXISTS bot_equipment (
    bot_equipment_id uuid DEFAULT gen_random_uuid(),
    bot_id uuid NOT NULL,
    equipment_id uuid NOT NULL,
    PRIMARY KEY (bot_equipment_id)
)