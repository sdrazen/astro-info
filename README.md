# Astro Info

This is frontend of the Astro Info web application. It's a web app for amateur astronomers, astrophotographers and other night sky lovers. If you want to develop your own astronomy web app, you can use and modify this code however you like. Furthermore, if you also want to make your own backend, it can be found [here](https://github.com/sdrazen/astro-info-backend). In `src/assets/data` you can find all data necessary to make your own database which currently consists of 6 collections (tables). Data provided in the `src/assets/data` folder is in JSON format which is more than suitable to make your own **MongoDb** database, for example.

## Installing

```bash
npm install
```

## Features

-   more than 8.000 deep-sky objects and their details
-   more than 9.000 moon features and their details
-   info on past and future lunar and solar eclipses
-   traslated to English, Croatian and German language
-   ability to add more languages quickly and easily
-   data currently in MongoDb database
-   insertable user data about astronomy stores and best astronomy locations
-   astro calulator (RA, DEC, Alt/Az, object positions at given time etc.)
-   new APOD (Astronomy Picture of the Day) every day
-   ISS position shown on a map which refreshes at user given intervals

## Specifics

This application is designed in a way that it can run in two ways: by default it uses its backend for fetching data (from MongoDb database) and API results. However, if something happens to the backend for any reason, this app can also call API results directly from frontend. In that case data from database will not be available but API call will still be fully functional (Google Maps API, Flickr API and NASA API). So, **by default you don't need any API keys** to use or develop this application. But if You for any reason decide to switch to the frontend mode for API calls (you can do it in user settings), you will have to provide three API keys of your own for the app to be able to provide its full functionality: **Google Maps API key**, **Flickr API key** and **NASA API key**. In that kind of scenario you can enter your API keys in the `common/globals.ts` file.

## Live application

This application is live on the cloud and can be seen [here](https://astroinfo-59d91.web.app/).
