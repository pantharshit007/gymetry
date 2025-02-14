<!-- TODOs Frontend  -->

- [ ] Add Tests: Vtest
- [ ] Add suppressHydrationWarning to body tag at the end.
- [x] move the toggle Menu button from `AppBar.tsx` to somewhere else covers logo right now.
- [x] move the theme toggle from `AppBar.tsx` to nav bar.
- [x] check the commented code about latest exercise stats in dashboard.
- [ ] why even giving them the calender in stats page? when we are going to add current date, just show them current date.
- [ ] new add entry should move focus to the card in stats page.
- [x] add delete button to the stats page.
- [x] fixed the `mx-auto` part in main tag in `(dashboard)/layout.tsx` file.
- [x] if time zone conversion is not working, then use `date-fns-tz` package.
- [x] add toast notifications for success and error messages.
- [x] fix the `new Date()` problem with the setUpdate method, in `use-exercise-data.ts`.
- [x] fix option for when user clicks on 60 days option, it should bring 60days data.
- [ ] add 2 option in `/analytics` page, card/table with card add view more and with table add pagination since raw data can be too big.

<!-- TODOs Backend  -->

- [x] add cron job to reset the streak when user logs in.
- [x] optimize the `addLog` service for streak calculation.
- [x] [!important] add redis for caching, to add last log date and check streak based on last log date.
- [x] update the cache when user add new log in the service, currently it will be staled till the next 7 days.
- [ ] add docker compose file.
- [ ] add rate limiting
- [ ] add analytics with posthog.

<!-- TODOs Database  -->

- [ ] on user's first signin, create a streak entry in the database.
