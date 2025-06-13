<!-- TODOs Frontend  -->

- [ ] Add Tests: Vtest
- [ ] Add suppressHydrationWarning to body tag at the end.
- [ ] new add entry should move focus to the card in stats page.
- [ ] why is `/about` page rendering multiple times? in terminal, it is showing the same page multiple times, hmr.
- [ ] add streak data to zustand to be able to fetch in profile page, along side other handy data.
- [ ] in the stats page, the distance is not being calculated correctly, when the user enters steps, it should be converted to meters.

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

- [ ] add rate limiting for /auth point: Google OAuth.
- [-] some bug with the streak calculation.
- [ ] store user gender in the database.
- [ ] we can compress the size of the load send to redis by compressing/decompressing it via zlib: `superjson+gzip`
- [ ] I think i created a bug i am calculating last streak data ex: 7 days from the last log date instead it should be from today till 7 days in past in the services `subDays(new Date(), 7)`
