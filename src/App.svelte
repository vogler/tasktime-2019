<script>
	import { onMount } from 'svelte';
	import Todo from './Todo.svelte';
	import { fb, Auth, Firestore } from './firebase';

	let todos = []
	let user;

	onMount(async () => {
    user = await Auth.currentUser;
    console.log('onMount: currentUser:', user)
		const ref = Firestore.collection('todos');
		ref.onSnapshot(snapshot => {
			todos = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) // these are the todos for all users; should be disallowed via firestore rules, and only be loaded after login for current user
			console.log('snapshot:', snapshot, 'todos:', todos)
		});
	});

	const login = (method) => async () => {
    console.log('login with', method)
    const credential = await (method == 'google' ?
      Auth.signInWithPopup(new fb.auth.GoogleAuthProvider()) :
      Auth.signInWithEmailAndPassword('bob@example.com', 'firebase23'))
		user = credential.user;
		console.log('logged in as', user)
	}

	async function logout() {
		Auth.signOut();
	}

	async function getTodos(userId) {
		const user = Auth.currentUser;
	}
</script>

<style>
	main {
		padding: 5%;
		text-align: center;
	}
</style>

<svelte:head>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css" />
</svelte:head>

<main class="content">
{#if user}
	<h2>Logged in as <span class="text-has-info">{user.email}</span></h2>
	<button on:click={logout} class="button">Log out</button>
	<hr>
	<h2>My Todos</h2>
	{#each todos as todo}
		<Todo {...todo} />
		<hr>
	{/each}
{:else}
	<button on:click={login('dummy')} class="button is-success">Log in (dummy E-Mail)</button>
	<button on:click={login('google')} class="button is-success">Log in (Google) - why is this so slow?</button>
{/if}
</main>
