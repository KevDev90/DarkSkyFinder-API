function makeCardsArray() {
    return [
        {
            id: 1,
            title: "card 1",
            modified: "03-27-2021",
            folder_id: 1,
            details: "This is a test card. Sunny, warm, short",
            favorited: true,
        },
        {
            id: 2,
            title: "card 2",
            modified: "2021-03-25T00:00:00.000Z",
            folder_id: 2,
            details: "This is a test card. Cloudy, warm, long",
            favorited: false,
        },
        {
            id: 3,
            title: "card 3",
            modified: "03-26-2021",
            folder_id: 1,
            details: "This is a test card. Sunny, cold, short",
            favorited: true,
        },
        {
            id: 4,
            title: "card 4",
            modified: "03-22-2021",
            folder_id: 2,
            details: "This is a test card. Snowy, cold, short",
            favorited: false,
        }
    ];
  }

  module.exports = {
    makeCardsArray
    //makeMaliciousNote,
  }; 