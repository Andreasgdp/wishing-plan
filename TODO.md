# TODO to do the following steps before the migration is done

- [X] Go over expo setup and make sure it's up to date and has Wishing Plan relevant information
    - Remove unnecessary steps like setting up vercel
- [ ] Go over the codebase in general and investigate areas it would make sense to make breaking changes in (since this migration is already a breaking change)
- [ ] Look at the state of the components and use the philosophy mentioned [here](https://www.youtube.com/watch?v=vPRdY87_SH0) to redesign and make the overall app more clean and understandable.
- [ ] Rename @acme to @wishingplan for the monorepo
- [ ] Setup and try out the expo app
    - See if it works with the current setup or if it needs some changes
- [ ] Setup jest for testing, so that the current tests passes (implementation of tests in expo can be done later)
- [ ] Investigate what speed improvements we will be able to implement with the new setup
- [ ] ...