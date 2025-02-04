<!-- TODOs Frontend  -->

- [ ] Add Tests: Vtest
- [ ] Add suppressHydrationWarning to body tag at the end.
- [x] move the toggle Menu button from `AppBar.tsx` to somewhere else covers logo right now.
- [x] move the theme toggle from `AppBar.tsx` to nav bar.
- [ ] check the commented code about latest exercise stats in dashboard.
- [ ] why even giving them the calender in stats page? when we are going to add current date, just show them current date.
- [ ] new add entry should move focus to the card in stats page.
- [x] add delete button to the stats page.
- [x] fixed the `mx-auto` part in main tag in `(dashboard)/layout.tsx` file.
- [ ] if time zone conversion is not working, then use `date-fns-tz` package.
- [ ] add toast notifications for success and error messages.

<!-- TODOs Backend  -->

- [ ] add cron job to reset the streak when user logs in.
- [ ] optimize the `addLog` service for streak calculation.
- [ ] [!important] add redis for caching, to add last log date and check streak based on last log date.

<!-- TODOs Database  -->

- [ ] on user's first signin, create a streak entry in the database.
