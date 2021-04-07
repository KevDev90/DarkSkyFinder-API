TRUNCATE  darksky_cards RESTART IDENTITY CASCADE;
TRUNCATE  darksky_folders RESTART IDENTITY CASCADE;

INSERT INTO darksky_folders (title)
VALUES

('Folder 1'),
('Folder 2');



INSERT INTO darksky_cards (title, modified, folder_id, details, favorited)
VALUES
(       
        'Card 1',
        '02-27-2021',
        1,
        'This is test card 1',
        false
    ),
    (
        'Card 2',
        '02-25-2021',
        2,
        'This is test card 2',
        true
    ),
    (
        'Card 3',
        '02-26-2021',
        1,
        'This is test card 3',
        false
    ),
    (
        'Card 4',
        '02-22-2021',
        2,
        'This is test card 4',
        true
    );