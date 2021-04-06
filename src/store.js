const cards = [
    {
        id: 1,
        title: "card 1",
        modified: "2021-03-31T14:07:31.292Z",
        folder_id: 1,
        details: "This is a test. Sunny, warm, short",
        favorited: true,
    },
    {
        id: 2,
        title: "card 2",
        modified: "2021-03-31T14:07:31.292Z",
        folder_id: 2,
        details: "This is a test. Cloudy, warm, long",
        favorited: false,
    },
    {
        id: 3,
        title: "card 3",
        modified: "2021-03-31T14:07:31.292Z",
        folder_id: 1,
        details: "This is a test. Sunny, cold, short",
        favorited: true,
    },
    {
        id: 4,
        title: "card 4",
        modified: "2021-03-31T14:07:31.292Z",
        folder_id: 2,
        details: "This is a test. Snowy, cold, short",
        favorited: false,
    }
]

const folders = [
    {
        id: 1,
        title: "Folder 1",
    },
    {
        id: 2,
        title: "Folder 2",
    },
    {
        id: 3,
        title: "Folder 3",
    }
]

module.exports = { cards, folders }