CREATE TABLE darksky_cards (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    modified TIMESTAMPTZ DEFAULT now () NOT NULL,
    folder_id INTEGER
        REFERENCES darksky_folders(id) ON DELETE CASCADE,
    details TEXT NOT NULL,
    );