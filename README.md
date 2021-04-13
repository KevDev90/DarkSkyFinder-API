# DarkSky - API

A Logbook of All Things Celestial 

Live version: (https://dark-sky-finder-client.vercel.app/)

## Introduction 

In the DarkSky application, a user can login to their profile and create folders to help collect their thoughts and experiences while stargazing. For example, they could be broken down by
the time of year, weather conditions, their stargazing location, who you stargazed with, or celestial events such as meteor showers or eclipses.

Users also have the ability to add experience cards to folders. These cards include a title for reference, details about the experience, their location, and the date of their experience.

The main features include:
* Summary of application features

* View Folders 
* View Cards for a specific folder
* Add Cards
* Add Folders 
* Delete Cards
* Delete Folders

## Technologies

* Testing 
  * Supertest (integration) 
  * Mocha and Chai (unit)
* Database 
  * Postgres
  * Knex.js 
* Node and Express  
  * RESTful API 

  
## Production 

Deployed via Heroku

## API Endpoints


### Folders Router
```
- /api/folders
- - GET - gets all folders 
- - POST - creates a new folder
```

### folders/:folderId Router 
```
- /api/folders/:folderId
- - GET - gets fodlers by id 
- - DELETE - deletes folder by id 
```

### Cards Router
```
- /api/cards
- - GET - gets all cards 
- - POST - creates a new cards
```

### Cards/:id Router
```
- /api/cards/:cardId
- - GET - gets cards by id 
```
