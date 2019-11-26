# Framework comparison
- http://todomvc.com/
- https://github.com/gothinkster/realworld

After watching some videos from [Youtube: Fireship](https://www.youtube.com/channel/UCsBjURrPoezykLs9EqgamOA/videos) decided to try Firebase with Svelte.
Cloned [Fireship's todo demo](https://github.com/fireship-io/188-firebase-vs-amplify/tree/firebase) based on Firebase (Auth, Firestore) and Svelte 3.

# Firebase
[Youtube: 100 Firebase Tips, Tricks, and Screw-ups](https://www.youtube.com/watch?v=iWEgpdVSZyg) https://fireship.io/lessons/firebase-tips-and-tricks/
- auth with temporary user and late sign-up

## Firestore
- [rtdb vs. firestore](https://firebase.google.com/docs/database/rtdb-vs-firestore
): use firestore which is newer and also supports realtime/subscribing to data
  - can run query in the console and copy corresponding code for it
  - RxFire (RxJS) works with Svelte
- Use `{ merge: true }` for a non-destructive Firestore set
- `query.get()` (no updates), `query.onSnapshot(q => q.docChanges().map(change => change.type)` type can be 'added', 'modfified' or 'removed', also has oldIndex, newIndex
- has offline support and even syncs between tabs with `db.enablePersistance({ synchronizeTabs: true })`
- auto-index for compound queries (throws exception with link to create the needed index)
- typed ORMs (https://github.com/typeorm/typeorm does not support firebase):
  - https://github.com/1amageek/pring.ts (90 stars)
  - https://github.com/lmcq/firebase-firestorm (121 stars)
  - https://github.com/wovalle/fireorm (86 stars)
  - https://github.com/kossnocorp/typesaurus (65 stars) <- seems best since it's just typed wrappers and no need for classes with decorators


# Svelte
[Compiler approach](https://svelte.dev/blog/virtual-dom-is-pure-overhead) seems like a good idea. How granular is this? If a component consists of a foreach on a list, will it replace the whole list or only the element that changed?
Installed extensions svelte-vscode and svelte-intellisense in vscode but no intellisense for imported js modules in .svelte files.
Asked on https://discordapp.com/channels/457912077277855764/457912077277855766 but no response.
This is already a no go but maybe it's a vscode/tsconfig setup problem.
Also it needs quite a lot of packages for rollup and a `rollup.config.js`; tried [parcel-plugin](https://github.com/DeMoorJasper/parcel-plugin-svelte) from [integrations](https://github.com/sveltejs/integrations), but didn't work.

Interesting Links:
- https://github.com/sveltejs/svelte-todomvc
- https://github.com/sveltejs/svelte-virtual-list
- https://github.com/sveltejs/svelte-scroller

Cons:
- wasn't able to setup Typescript (see below)
- not even intellisense for imported .js in .svelte files worked (works for firebase.js imported in main.js, but not in script tag in App.svelte)
- forced to use one file per component? less flexible than just functions.
- javascript, html and css are separated; might have to jump around instead of having all as javascript and close together
- yet another templating language (e.g. `{#each todos as todo}<Todo {...todo}/>{/each}`), instead of just javascript
- for todo example it's not easy to decompose and use a Todo component for each todo:
  - `<Todo {...todo}/>` (spread props): change in Todo doesn't change todos in App
  - `<Todo {todo}/>` (one prop, change its fields): change in Todo does change todos, but bindings don't update (new field values only show after todos is assigned in App (e.g. by addTodo))
  - probably their idea is to use a store for update/subscribe, but then we'd have to iterate over the list of todos for every change...
  - alternatively give up component idea and put all in one file, as here: https://svelte.dev/examples#each-block-bindings

## Typescript in Svelte
[svelte-ts](https://github.com/avantci/svelte-ts) (from [issue](https://github.com/sveltejs/svelte/issues/3677)) currently needs Bazel.
Examples using Typescript:
- [Todo-App with roadtrip, Svelte and TypeScript](https://github.com/Kiho/svelte-roadtrip-todo) only supports deprecated Svelte 2: https://github.com/Kiho/svelte-roadtrip-todo/issues/1#issuecomment-553900696
- [Smelte CRUD App for Svelte](https://github.com/Kiho/smelte-crud-app) uses Svelte 3.6.11 and Typescript 3.5.2. [Smelte: UI framework with material components built with Svelte and Tailwind CSS](https://github.com/matyunya/smelte). `build` worked, but didn't display anything in Chrome ('Failed to load module script: The server responded with a non-JavaScript MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.'), works in Safari.


# React
- [TodoMVC typescript-react](https://github.com/tastejs/todomvc/tree/gh-pages/examples/typescript-react)
- [reactfire: Hooks, Context Providers, and Components that make it easy to interact with Firebase](https://github.com/FirebaseExtended/reactfire)
- [react-router](https://reacttraining.com/react-router/)
- [mobx-react-lite](https://github.com/mobxjs/mobx-react-lite/) (reactive, see [mobx](https://github.com/mobxjs/mobx))
- Components:
  - https://github.com/bcrumbs/reactackle
  - https://github.com/kiwicom/orbit-components


# CSS
- https://getbootstrap.com/
- https://bulma.io/
- css-in-js:
  - https://github.com/emotion-js/emotion
