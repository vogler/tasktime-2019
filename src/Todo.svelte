<script>
  import { Firestore } from './firebase';
  import { debounce } from './util'

  export let todo;
  export let delTodo;

  const save = (prop) => async () => {
    console.log('save', prop, 'of', todo)
    const ref = await Firestore.doc(`todos/${todo.id}`).update(todo)
  }

  // Want to update in db whenever data changes, but found no way to just react to local change in one todo: https://svelte.dev/repl/0ebf9146c0e34aa3bb9f4ecfb783f405?version=3.15.0
  // $: console.log('change', todo) // If e.g. todo.done is changed, this runs for all todos instead of just the changed one.
  // One solution is to use immutable (todo example: https://svelte.dev/tutorial/svelte-options), but then the logic for toggle/save would have to be moved in the parent component with the list :(
  // So we can't react to changes generically but need to attach a function for any change event (on:... below).
</script>

<style>
	.done {
		opacity: 0.4;
	}
</style>

<div class:done={todo.done}>
  <input type=checkbox bind:checked={todo.done} on:change={save('done')}>
  <input placeholder="What needs to be done?" bind:value={todo.text} on:input={debounce(save('text'), 500)}>
  <button class="delete" on:click={delTodo(todo)}/>
</div>
