CREATE TABLE IF NOT EXISTS equipment (
    equipment_id uuid DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    type VARCHAR(32) NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (equipment_id)
)