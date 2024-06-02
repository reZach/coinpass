# Good Samaritan Movement
A project meant to inspire you by showing that even one small act of love
can have a rippling effect across the world.

### To update pins/cities
1. Pull repo
2. Run `npm run update`
3. Commit changes to repo
4. `npm run deploy`

### check mapbox usage (https://docs.mapbox.com/accounts/guides/invoices/#spending-cap)
1. go here https://account.mapbox.com/statistics/ daily
2. if getting close to 50,000, then set `disableMap` killswitch in map.js
3. Commit changes to repo
4. `npm run deploy`
5. Beginning of next month, revert change from step 2

_Yes, the code is a bit sloppy. It's a side project_

city data coming from
https://simplemaps.com/data/world-cities