<script>
  export let todo;
  export let delTodo;

  import { Firestore } from './firebase';

  function toggle() {
      // const ref = Firestore.doc(`todos/${id}`)
      // ref.update({ complete: !complete })
      todo.done= !todo.done
  }
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
