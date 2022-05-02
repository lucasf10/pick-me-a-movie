# Pick me a movie

The app lets you create and share a group that can add movies to a list and randomly pick movies from the list. It is aimed for people who have a hard time picking a movie to watch.

## How to run this API

1. Create and configure a firebase project and a [The Movie DB accont](https://developers.themoviedb.org/3/getting-started/introduction)

2. Create your own **.env** file based on **.env.example**

```

3. Install all dependencies with yarn:

```bash
yarn
```

4. Start project:

```bash
yarn serve
```

To build a production version:
```bash
yarn build
```


## Technologies used

- Vue
- Vue CLI
- Yarn
- Buefy
- Firebase
- PWA

## Features included

- Authentication (create account/login)
- Create a group
- Join a group using its code
- Leave a group
- Add and remove movies to/from the list
- Filter list by title, genre and added by
- Rate movie and see the avarage score
- Mark movie as seen
- Pick random movie from list (filters are taken into consideration)
- Install as a PWA on mobile devices

## Live Version

A live version can be found [here](https://pick-me-a-movie.web.app/#/).

Since it is a PWA, it can be installed as an app on mobile devices.