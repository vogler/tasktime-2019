<script>
  import { db, timestamp } from './firebase';
  import { debounce, Duration } from './util'
  import { onDestroy } from 'svelte';

  export let todo;

	const del = async () => {
    console.log('del', todo)
    await db.doc(todo.id).delete()
	}

  // Want to update in db whenever data changes, but found no way to just react to local change (via binding) in one todo: https://svelte.dev/repl/0ebf9146c0e34aa3bb9f4ecfb783f405?version=3.15.0
  // $: console.log('change', todo) // If e.g. todo.done is changed, this runs for all todos instead of just the changed one.
  // One solution is to use immutable (todo example: https://svelte.dev/tutorial/svelte-options), but then the logic for toggle/save would have to be moved in the parent component with the list :(
  // So we can't react to changes generically but need to attach a save-function for any change event (on:... below).
  const save = (prop) => async () => {
    console.log('save', prop, 'of', todo)
    await db.doc(todo.id).update({ ...todo, updated: timestamp })
  }

  const saved = (time) => time && time.constructor.name == 'Timestamp' // before save it's set to timestamp (FieldValue.serverTimestamp)
  let duration
  let timer
  $: if (todo.active && saved(todo.startTime) && !timer) {
    console.log('startTime', todo.startTime);
    timer = setInterval(() => duration = Math.round(Date.now()/1000 - todo.startTime.seconds), 1000)
  }
  $: if (!todo.active && saved(todo.stopTime) && timer) {
    console.log('stopTime', todo.stopTime, duration);
    clearTimeout(timer)
    timer = null
  }

  const toggle = async () => {
    console.log('toggle', todo)
    todo.active = !todo.active
    if (todo.active)
      todo.startTime = timestamp
    else
      todo.stopTime = timestamp
    await save('active')()
  }

  onDestroy(async () => {
    if (todo.active) await toggle()
  })
</script>

<style>
	.done {
		opacity: 0.4;
	}
  .timer {
    font-family: monospace
  }
</style>

<div class:done={todo.done}>
  {#if todo.source == 'local'}
    <span class="icon"><i class="fas fa-cloud-upload-alt"/></span>
  {/if}
  <!-- ⚠️ ⚠︎ 🕸 ⚡️ 🌎 🚦 🧭 ⏱ 🖥 🔌 📤 🌐 ❗️ 💬 ☁︎ ⇞ ⇧ ⌁ ⌛︎ ⌚︎ ⚡︎ -->
  <input type=checkbox bind:checked={todo.done} on:change={save('done')}>
  <input placeholder="What needs to be done?" bind:value={todo.text} on:input={debounce(save('text'), 500)}>
  <button class="button fas fa-trash" on:click|once={del}/>
  <button class="button" on:click={toggle}>
    <span class="icon"><i class="fas {todo.active ? 'fa-pause' : 'fa-play'}"/></span>
    {#if duration}
      <span class="timer">{Duration.str(duration)}</span>
    {/if}
  </button>
  {#if duration}
    {#if saved(todo.startTime)}<br>Start: {todo.startTime.toDate().toLocaleString('de')}{/if}
    {#if saved(todo.stopTime)}<br>Stop: {todo.stopTime.toDate().toLocaleString('de')}{/if}
  {/if}
</div>
