# :cat:

## [Demo](https://meowvue.now.sh/)

#### Vue.js version of [Meows](https://github.com/breeku/Meows)

### Todo:
#### Both:
- [x] Allow user to post posts.
  - MongoDB
- [x] User authentication.
  - Firebase
- [x] Allow user to modify/remove their posts.
  - MongoDB & Firebase
- [x] Demo online.
  - zeit.co
#### Frontend:
- [x] Transition grouped list of cards.
  - Still need to fix the glitching with removing / adding.
- [x] See which post was made by user and add edit/remove buttons to them.
- [x] Style.
- [ ] Seperate into different components.
#### Backend:
- [x] Rate limit.
- [x] Bad words filter.
- [ ] Check if the modify/remove request is made by appropriate user.
  - Find _id >> check if _id = uid.
#### Maybe:
- [ ] Pictures in posts
  - How to post picture&get it from MongoDB?
- [ ] Post comments
  - Leads to cluttered ui, not really necessary.
  - Although with pictures it would be cool, thinking instagram.
- [ ] Realtime updates
  - Would need to transfer into a realtime database or do some trickery with change streams.

> Created with Vue.js, Node.js, Express, MongoDB and Firebase.

> If you want to run this locally you'll need to change Firebase credentials.

> Then in /server do ``` npm run dev ```, and in /client/meows do ``` npm run serve ```