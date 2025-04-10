<!-- TODOs Frontend  -->

- [ ] Add Tests: Vtest
- [ ] Add suppressHydrationWarning to body tag at the end.
- [x] move the toggle Menu button from `AppBar.tsx` to somewhere else covers logo right now.
- [x] move the theme toggle from `AppBar.tsx` to nav bar.
- [x] check the commented code about latest exercise stats in dashboard.
- [x] why even giving them the calender in stats page? when we are going to add current date, just show them current date.
- [ ] new add entry should move focus to the card in stats page.
- [x] add delete button to the stats page.
- [x] fixed the `mx-auto` part in main tag in `(dashboard)/layout.tsx` file.
- [x] if time zone conversion is not working, then use `date-fns-tz` package.
- [x] add toast notifications for success and error messages.
- [x] fix the `new Date()` problem with the setUpdate method, in `use-exercise-data.ts`.
- [x] fix option for when user clicks on 60 days option, it should bring 60days data.
- [x] add 2 option in `/analytics` page, card/table with card add view more and with table add pagination since raw data can be too big.
- [ ] why is `/about` page rendering multiple times? in terminal, it is showing the same page multiple times, hmr.
- [ ] add streak data to zustand to be able to fetch in profile page, along side other handy data.

```bash
○ Compiling / ...
 ✓ Compiled in 559ms
 ✓ Compiled / in 718ms
 GET / 200 in 1368ms
 GET /about 200 in 1414ms
 GET / 200 in 430ms
 GET /about 200 in 444ms
 GET / 200 in 326ms
 GET /about 200 in 385ms
 GET / 200 in 338ms
 GET /about 200 in 386ms
 GET / 200 in 360ms
 GET /about 200 in 359ms
 GET / 200 in 338ms
 GET /about 200 in 341ms
 GET / 200 in 333ms
 GET /about 200 in 363ms
 GET / 200 in 289ms
 GET /about 200 in 381ms
 GET /favicon.ico?favicon.da171a61.ico 200 in 351ms
 GET /favicon.ico 200 in 401ms
 GET /favicon.ico?favicon.da171a61.ico 200 in 233ms
 GET /favicon.ico 200 in 240ms
```

<!-- TODOs Backend  -->

- [x] add cron job to reset the streak when user logs in.
- [x] optimize the `addLog` service for streak calculation.
- [x] [!important] add redis for caching, to add last log date and check streak based on last log date.
- [x] update the cache when user add new log in the service, currently it will be staled till the next 7 days.
- [x] add docker compose file.
- [x] add rate limiting
- [ ] add rate limiting for /auth point: Google OAuth.
- [x] add analytics with posthog.
- [-] some bug with the streak calculation.
- [x] in analyzeLogService, we are subtracting from current date if user stops for a long time then the last x days we will fetch wouldn't be in that range it should be from the last recorded date till the x days.
- [ ] store user gender in the database.
- [x] there is some bug in the streak calculation, when new user logs for first time longest stays on 0 will check later on.
- [ ] we can compress the size of the load send to redis by compressing/decompressing it via zlib: `superjson+gzip`
- [ ] I think i created a bug i am calculating last streak data ex: 7 days from the last log date instead it should be from today till 7 days in past in the services `subDays(new Date(), 7)` 

<!-- TODOs Database  -->

- [x] on user's first signin, create a streak entry in the database.
