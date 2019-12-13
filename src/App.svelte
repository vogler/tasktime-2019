<script>
  import { onMount } from 'svelte';
  import Todo from './Todo.svelte';
  import { firebase, Auth, db, timestamp } from './firebase';

  let user
  let newTodoText
  let todos = []
  $: remaining = todos.filter(t => !t.done).length

  onMount(async () => {
    // user = await Auth.currentUser; // this is always null at this point
  });

  let dbListener // call to unsubscribe
  const query = (user) => {
    if (user) {
      dbListener = db.where('user', '==', user.email).orderBy('created').onSnapshot({ includeMetadataChanges: false }, snapshot => {
        todos = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, source: doc.metadata.hasPendingWrites ? 'local' : 'server' })) // these are the todos for all users; should be disallowed via firestore rules, and only be loaded after login for current user
        console.log('onSnapshot:', snapshot, 'todos:', todos, 'changes:', snapshot.docChanges())
      });
    } else {
      dbListener()
    }
  }

  Auth.onAuthStateChanged((user_) => {
    console.log('onAuthStateChanged:', user_, user_ ? 'logged in' : 'logged out')
    user = user_;
    query(user)
  });

  const login = (method) => async () => {
    console.log('login with', method)
    const credential = await (method == 'google' ?
      Auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()) :
      Auth.signInWithEmailAndPassword('bob@example.com', 'firebase23'))
    console.log('logged in as', user)
  }

  const logout = () => {
    console.log('logout')
    Auth.signOut();
  }

  const clear = () => {
    console.log('clear', todos)
    todos = todos.filter(t => !t.done)
  }

  const addTodo = async () => {
    const todo = { text: newTodoText, done: false, created: timestamp, user: user.email }
    console.log('addTodo', todo)
    newTodoText = ''
    const ref = await db.add(todo) // this blocks if offline, but onSnapshot will fire with hasPendingWrites: true for the added document (will be merged once online again)
    console.log('addTodo', todo, 'was saved at', ref.path)
  }

  // functions passed to Todo component such that it can manipulate the list of todos: -- this is no longer needed since we can delete in db directly and the list of todos will update via onSnapshot (check commit 'move delTodo into Todo.del (outer todos is updated via db)')
	// const delTodo = (todo) => async () => {
  //   console.log('delTodo', todo)
  //   todos = todos.filter(t => t != todo) // remove todo
	// }
</script>

<style>
  main {
    /* padding: 5%; */
    text-align: center;
  }
  #user-menu {
    text-align: right;
    margin-bottom: 1em;
  }
</style>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css"/>
</svelte:head>

<main>
{#if user}
  <div id="user-menu">
    {#if user.photoURL}
      <img alt={user.displayName} src={user.photoURL} width="32" style="vertical-align: middle; border-radius: 50%"/>
    {/if}
    <span class="text-has-info">{user.email}</span>
    <button on:click={logout}>Log out</button>
  </div>
  <form on:submit|preventDefault={addTodo}>
    <!-- <input type="range" bind:value={newTodoPrio}/> {newTodoPrio} -->
    <input type="text" bind:value={newTodoText} placeholder="new todo..."/>
    <input type="submit" value="add"/>
  </form>
  <hr>
  <!-- need https://svelte.dev/examples#keyed-each-blocks (todo.id) for delTodo -->
  {#each todos as todo (todo.id)}
    <Todo bind:todo/>
  {/each}
  {remaining} remaining
  <button on:click={clear}>Clear completed</button>
  <hr>todos: {JSON.stringify(todos)}
{:else}
  <div class="box">
    <h1 class="title">Login</h1>
    <button on:click={login('dummy')} class="button is-medium">
      <span class="icon"><i class="fas fa-at"></i></span>
      <span>E-Mail (dummy)</span>
    </button>
    <!-- why is google login so slow? -->
    <button on:click={login('google')} class="button is-medium">
      <span class="icon"><i class="fab fa-google"></i></span>
      <span>Google</span>
    </button>
  </div>
{/if}
</main>
