<main id="main">
  <button on:click={handleClick}>Click Me!</button>
    <style>
  html,
body {
    background: var(--default);
}

:root {
    --default: #0c0c0c;
    --empty: #3a3a3c;
    --wrong: #b59f3b;
    --right: #538d4e;
}

#game {
    display: grid;
    place-items: center;
    width: 100%;
    height: 600px;
}

.grid {
    display: grid;
    grid-template-rows: repeat(6, auto);
    grid-template-columns: repeat(5, auto);
}

.box {
    width: 60px;
    height: 60px;
    border: 2px solid var(--empty);
    margin: 4px;
    color: rgb(253, 252, 252);
    text-transform: uppercase;
    display: grid;
    place-items: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 2.4rem;
}

.box.empty {
    background: var(--empty);
}

.box.wrong {
    background: var(--wrong);
}

.box.right {
    background: var(--right);
}

.animated {
    animation: flip 0.5s ease;
}

@keyframes flip {
    0% {
        transform: scaleY(1);
    }
    50% {
        transform: scaleY(0);
    }
    100% {
        transform: scaleY(1);
    }
}
</style>
</main>

<style>
  :global(html) {
    background: black;
  }

  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  button {
    background: #14c07c;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 20px;
    padding: 20px;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
  
</style>



<script lang="ts">
  const dictionary = ['ребус', 'мисис', 'реакт', 'салют', 'джава', 'смарт'];
const state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(6)
        .fill(String, 0, 5)
        .map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
};

function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            drawBox(grid, i, j);
        }
    }

    container.appendChild(grid);
}

function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = letter;
    box.id = `box${row}${col}`;

    container.appendChild(box);
    return box;
}

function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;
        if (key === 'Enter') {
            if (state.currentCol === 5) {
                const word = getCurrentWord();
                if (isWordValid(word)) {
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                } else {
                    alert('Not a valid word.');
                }
            }
        }
        if (key === 'Backspace') {
            removeLetter();
        }
        if (isLetter(key)) {
            addLetter(key);
        }

        updateGrid();
    };
}

function getCurrentWord() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
    return dictionary.includes(word);
}

function revealWord(guess) {
    const row = state.currentRow;
    const animation_duration = 500; // ms

    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        setTimeout(() => {
            if (letter === state.secret[i]) {
                box.classList.add('right');
            } else if (state.secret.includes(letter)) {
                box.classList.add('wrong');
            } else {
                box.classList.add('empty');
            }
        }, ((i + 1) * animation_duration) / 2);

        box.classList.add('animated');
        box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }

    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 5;

    setTimeout(() => {
        if (isWinner) {
            alert('Congratulations!');
        } else if (isGameOver) {
            alert(`Better luck next time! The word was ${state.secret}.`);
        }
    }, 3 * animation_duration);
}

function isLetter(key) {
    return key.length === 1 && key.match(/[а-я]/i);
}

function addLetter(letter) {
    if (state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter() {
    if (state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
}

function startup() {
    const game = document.getElementById('game');
    drawGrid(game);
    registerKeyboardEvents();
}

startup();


  import {onMount} from 'svelte';
  import {createSmartappDebugger, createAssistant} from '@sberdevices/assistant-client';
  import {setTheme} from './themes';
  import {logger} from "./utils";
  // clear spam from sber client

  let assistant;
  let state1 = {count: 0};

  // Set token for assistant-client from https://developers.sber.ru/studio/settings/emulator
  let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZjAwMWJlYjc4NjkyOThkZGRiY2FkOTQ5M2M2YzlkODAyN2E3ZGYzOGZlNWMxM2JkODYyNzFhZTZlZjA0YjVlODVkOGYiLCJhdWQiOiJWUFMiLCJleHAiOjE2NTQyNTAwOTMsImlhdCI6MTY1NDE2MzY4MywiaXNzIjoiS0VZTUFTVEVSIiwidHlwZSI6IkJlYXJlciIsImp0aSI6ImFkMjJhNzBhLWYwMGQtNDU1My04MjE3LWFlMTM3NjE1YjM4MiIsInNpZCI6IjhlZWU4OTBiLTRiY2UtNDkyNS1iZjgxLWVlMDg0ZmM0ZDVmZiJ9.BrJjvNW-G1-9RRvvTx5QlKwLR-uGq9lReT5hzzmWErqNBOi-DJAXHuzfmKee-c2HMl9RG6QzzYAs8eVtxcNmwjrGshppDu1gzSEu1DLv5LMUzuAdnM9-wissEClKHwEOdjpQXey49JeLlQc-9rwXjXL0PNsemEHOJu4XqM4f3-dXuA_C-kmQaQSs6-X1iaYNY2oe_3wXKwXJ6Dnhu-CSV5Ql3pZR5EVJPm6zWpNenr4-Ij2aZyNhqFF09rK_VPoN6NzogJkISpTrWhPHxDgO_9S4XLIbPVtQnBSmF89LaJDs4Wz0QKHzJoRdOqb9BqDsbyZXptEc0H8u-Ewp1WhQIg_zZShZTr4n0iQFRIeL6G1kKokRKrz5kehKCAU-hPz7tqbTZQOpEptPErUkonaEMTmiCf0Z-M5-wzjIYgXy56ynMbpaUci9-HsMnnP4mxE2g1CvzzL0SlONxc_pCZLgI6m_XqfTJh6_salbXgrmEnJIMpNJRTQCxZACC3ingrLM69XM7DMcx9AozcG3BeUZbweIYmmDiYAMSmOdJaP1NMho_Hsbd_CWhfIU-fPpuY9WpZ7r2ZTEoU49_brA-34t0eE0hegmisreJcSAPnChquypd4IkieHEZoODZtVkedD2nOa7qn-Y0jXlpk8X3doDP4_w9_3Mxfwye02AeVbrmk8';

  // Set the name of your SmartApp for activation
  let initPhrase = 'запусти название';

  // Set theme depended on current character;
  let character = 'eva'; // default, before sber client gets state
  $: setTheme(character);
  // Now you can CSS custom properties from https://plasma.sberdevices.ru/current/?path=/docs/colors--default
  onMount(() => {
    function getState() {
      return {}
    }

    const init = (): any => {
      // Use it for debugging in browser
      if (process.env.NODE_ENV === 'production') {
        return createAssistant({getState});
      }
      return createSmartappDebugger({
        token,
        initPhrase,
        getState,
      });
      // TODO: Use to run it in production mode inside Salute App
    };
    assistant = init();

    assistant.on('start', () => {
      logger.log('SmartApp started');
    });

    assistant.on('data', event => {
      // Set your action or data hooks
      if (!event.type) {
        // Use invariants to prevent errors on Sber Portal
        return;
      }
      // FIXME Add event handler for closing the app and use "assistant.close()" inside it;

      if (event.type === 'character') {
        character = event.character.id;
      }

      if (event.type === 'smart_app_data') {
        state1 = event.smart_app_data;
      }
      logger.log('data event:', event);
    });
  });

  function handleClick() {
    assistant.sendData({
      action: {
        action_id: 'click',
        // You can send any data to your hook
        data: {}
      }
    })
  }
</script>

