import App from './App.svelte';

 // can't set App.svelte as input in rollup.config.js directly but need to instantiate it with some target first
const app = new App({ target: document.body });
