<script>
  import { Firestore } from './firebase';

  export let todo;
  export let delTodo;

  function toggle() {
      const ref = Firestore.doc(`todos/${todo.id}`)
      ref.update({ done: !done })
      console.log('toggled', todo.id)
      // todo.done= !todo.done
  }

  // want to have some generic update if data changes, but found no way to just react to local change
  // https://svelte.dev/repl/0ebf9146c0e34aa3bb9f4ecfb783f405?version=3.15.0
  $: console.log('change', todo) // if todo.done is changed, this runs for all todos instead of just the changed one
</script>

<style>
	.done {
		opacity: 0.4;
	}
</style>

<div class:done={todo.done}>
  <input type=checkbox bind:checked={todo.done}>
  <input placeholder="What needs to be done?" bind:value={todo.text}>
  <button class="delete" on:click={delTodo(todo)}/>
</div>
