# TODO

- [ ] Replace time inputs on settings page with sliders (TBD: what to do about the max value?) implement in plan mode.

# Ideas

- [ ] should I switch to web sockets instead of polling? It's currently polling every 30 seconds and that's problematic when a timer runs out – things don't start to update until the next time the app checks with the server.
- [ ] instead of earning time into extra, it might make more sense to earn into a bank and then allow them to transfer from the bank into one of their budget timers.

# Done

- [x] loan payback system - earning timers earn less when Extra is negative (configurable penalty)
- [x] negative balance protection - can't start budget timers when Extra is negative
- [x] PWA icon now fills with green background (no black areas)
- [x] added app name and icon to login/pin pad screen
- [x] added app icon to main page header
- [x] the extra time that's displayed for a kid on the main page doesn't match the time shown in the settings page - added periodic refresh to settings page (30s interval)
- [x] Reset to default should not change Extra time value
- [x] Allow updating Extra time value via input on settings page
- [x] make the seconds display on all the timers be smaller than the minutes and hours.
- [x] move the "time in extra" hint to be next to the time when there's no time left on the budget timer
- [x] in the settings page for the current balance for a kid, the order of the timers should match how it is on the main screen. That means the extra budget timer should be last in the list. Same goes for daily defaults.
- [x] show the timer icon for the timer is in the settings page.
- [x] Clarify "default time per day" - make clear it's time appended at start of next day and whatever they had from the previous day will carryover. Might be nice to have a little explainer about that on the settings page.
- [x] save notifications are blocking the back button on the settings page. When you click a notification, it should dismiss.
- [x] Fix timer display on mobile when >1hr (too wide for tile)
- [x] Goal: Compact layout for tablet in landscape mode - I need to reduce the overall height, compress tiles somehow. I'm thinking we don't need the buttons to say start, and the timer display title can be in the button. For the extra times I think that saves a lot of space, for the budget timers, I'm wondering if the button should be moved to the left of the timer. Or, if there's another way to make more efficient use of the space. Give me some options.
- [x] I need a icon for this app. Can you link me some options or ideas? I'll also need this to be able to be the Favicon.
- [x] on a phone, we should have an accordion for the kids so you can click into each one without having to scroll so much.
- [x] for the ad additional time plus button on the main page. I want to be prompted for a passcode first and then I want to be able to add or subtract time in that view. So in addition to adding time I want to be able to subtract time. I should be able to hit the buttons as many times as I want after I put the passcode in, but after I close that model, then I would need a passcode to get back in. Lastly, we need to pick a different icon. A +/- would be good.
- [x] make sure we're not looking for the extra time timer via the slug like this `{budgetTypeSlug !== 'extra'`. Should always be using the db column.
- [x] timer history page. This Will allow us to audit the times that happened in the past. It can be one page but then have a filter so we can filter by kid if desired. Use plan mode for this and let's talk about it.
