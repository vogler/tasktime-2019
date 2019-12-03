<script>
  import { onMount } from 'svelte';
  import Todo from './Todo.svelte';
  import { firebase, Auth, Firestore } from './firebase';

  let user
  let newTodo
  let todos = []
  $: remaining = todos.filter(t => !t.done).length;

  onMount(async () => {
    user = await Auth.currentUser; // this is always null at this point
    console.log('onMount: currentUser:', user)
    const ref = Firestore.collection('todos');
    ref.onSnapshot(snapshot => {
      todos = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) // these are the todos for all users; should be disallowed via firestore rules, and only be loaded after login for current user
      console.log('snapshot:', snapshot, 'todos:', todos)
      todos = [{id: 1, text: 'foo', done: false}, {id: 2, text: 'bar', done: true}] // TODO remove after testing
    });
  });

  Auth.onAuthStateChanged((user_) => {
    console.log('onAuthStateChanged:', user_, user_ ? 'logged in' : 'logged out')
    user = user_;
  });

  const login = (method) => async () => {
    console.log('login with', method)
    const credential = await (method == 'google' ?
      Auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()) :
      Auth.signInWithEmailAndPassword('bob@example.com', 'firebase23'))
    console.log('logged in as', user)
  }

  async function logout() {
    console.log('logout')
    Auth.signOut();
  }

  async function getTodos(userId) {
    const user = Auth.currentUser;
  }

  async function addTodo() {
    console.log('addTodo', newTodo)
    todos = todos.concat({ id: 1, text: newTodo, done: false })
    newTodo = ''
  }

	const delTodo = (todo) => () => {
		console.log('delTodo', todo)
		todos = todos.filter(t => t != todo)
	}

  function clear() {
    console.log('clear', todos)
    todos = todos.filter(t => !t.done)
  }
</script>

<style>
  main {
    padding: 5%;
    text-align: center;
  }
</style>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css"/>
</svelte:head>

<main class="content">
{#if user}
  Logged in as <span class="text-has-info">{user.email}</span> <br>
  <button on:click={logout}>Log out</button>
  <hr>
  <form on:submit|preventDefault={addTodo}>
    <!-- <input type="range" bind:value={newTodoPrio}/> {newTodoPrio} -->
    <input type="text" bind:value={newTodo} placeholder="new todo..."/>
    <input type="submit" value="add"/>
  </form>
  <hr>
  {#each todos as todo}
    <Todo bind:todo {delTodo}/>
  {/each}
  {remaining} remaining
  <br>todos: {JSON.stringify(todos)}<br>
  <button on:click={clear}>Clear completed</button>
{:else}
  <button on:click={login('dummy')} class="button is-success">Log in (dummy E-Mail)</button>
  <button on:click={login('google')} class="button is-success">Log in (Google) - why is this so slow?</button>
{/if}
</main>
