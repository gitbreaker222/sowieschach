<script>
  import { version } from '$app/environment';
  import { fade } from 'svelte/transition';

  export let data;

  const versionParts = version.split('_');

  let level = 1;
  let timer = '04:00';
  let timerRunning = false;
  let interval = null;

  let currentEffect = '(…Effekt…)';

  function _random(max = 1) {
    return Number.parseInt(Math.random() * max);
  }

  function chooseEffect() {
    const { categories, directions, effects } = data;
    const DIRECTION = '$direction';
    const FIELD = '$field';

    const category = categories[_random(categories.length)];
    const effectIndex = _random(effects[category].length);
    let effect = effects[category][effectIndex];

    if (effect.includes(DIRECTION)) {
      let randomDirection = '';
      let effectLevel;
      switch (level) {
        case 1:
        case 2:
          effectLevel = 'lvl1';
          break;
        case 3:
        case 4:
          effectLevel = 'lvl3';
          break;
        case 5:
          effectLevel = 'lvl5';
          break;
      }
      const directionIndex = _random(directions[effectLevel].length);
      randomDirection = directions[effectLevel][directionIndex];
      effect = effect.replace(DIRECTION, randomDirection);

      if (level > 1 && level < 4) {
        effect = effect + '\n mit Schieben';
      } else if (level >= 4) {
        effect = effect + '\n mit Schubsen';
      }
    } else if (effect.includes(FIELD)) {
      effect = effect.replace(FIELD, _random(16) + 1);
    }
    
    if (['SWAP', 'RESURRECT'].includes(category) && (level > 3)) {
      effect = effect + '\n (ersatzweise Bauer)';
    }

    currentEffect = effect;
  }

  function _pad(num = 0, size = 2) {
    return num.toString().padStart(size, '0');
  }

  function countDown1() {
    const timeParts = timer.split(':');
    let minutes = Number.parseInt(timeParts[0]);
    let seconds = Number.parseInt(timeParts[1]);

    seconds = seconds === 0 ? 59 : seconds - 1;
    minutes = seconds === 59 ? minutes - 1 : minutes;

    timer = `${_pad(minutes)}:${_pad(seconds)}`;

    if (minutes <= 0 && seconds <= 0) {
      if (level === 5) {
        handleStartStop();
      } else {
        level = level + 1;
        timer = '04:00';
      }
    }
  }

  function handleStartStop() {
    if (timerRunning) {
      clearInterval(interval);
      timerRunning = false;
    } else {
      interval = setInterval(countDown1, 1000);
      timerRunning = true;
    }
  }

  function addLevel(amount) {
    const newLevel = level + amount;
    if (newLevel < 1) return (level = 1);
    else if (newLevel > 5) return (level = 5);
    return (level = newLevel);
  }
</script>

<main>
  <section class="s_app">
    <h1>Sowie Schach</h1>
    <div>
      <ol>
        <li>Normaler Zug</li>
        <li>Effekt würfeln</li>
      </ol>
      {#if currentEffect?.startsWith('WIEDERBELEBE')}
        <div class="effect-hint" transition:fade>
          Feld-Nummern:
          <table class="fields-table">
            <tr>
              {#each new Array(8) as x, i}
                <td>{i + 9}</td>
              {/each}
            </tr>
            <tr>
              {#each new Array(8) as x, i}
                <td>{i + 1}</td>
              {/each}
            </tr>
          </table>
        </div>
      {/if}
    </div>

    <button class="button--effect g_pre-line" on:click={chooseEffect}>{currentEffect}</button>

    <div class="monitor">Level: <code>{level}</code> / <code>{timer}</code></div>
  </section>

  <section class="s_timer">
    <h1>Timer / Level</h1>

    <input class="timer" type="time" bind:value={timer} />

    <button class="timer-button" on:click={handleStartStop}>
      {#if timerRunning}
        Stop ⏸
      {:else}
        Start ▶
      {/if}
    </button>

    <div class="level-control">
      <button on:click={() => addLevel(-1)}>-</button>
      Level: {level}
      <button on:click={() => addLevel(1)}>+</button>
    </div>

    <ul class="g_pre-line">
      {#each data.levelRules as rule, i}
        <li class:lvl--now={level === i + 1} class:lvl--past={level > i + 1}>
          {rule}
        </li>
      {/each}
    </ul>
  </section>
</main>

<footer>
  Version: <a href="https://github.com/gitbreaker222/sowieschach/commit/{versionParts[1]}">
    {versionParts[0]}
  </a>
</footer>

<style>
  section {
    min-height: 99vh;
    padding: 1rem;
    display: grid;
  }
  section:nth-child(even) {
    background: var(--sk-back-4);
  }

  /* section app */

  .s_app {
    grid-template-rows: auto 1fr 2fr 1fr;
  }

  .s_app .monitor {
    align-self: center;
  }
  @media (orientation: landscape) {
    .s_app {
      grid-template-rows: auto 1fr 3rem;
      grid-template-columns: auto 1fr;
      grid-gap: 1rem;
    }
    .s_app .button--effect {
      grid-area: 1 / 2 / -1 / -1;
    }
  }

  /* section timer */

  .s_timer {
    grid-template-rows: 1fr 3fr 1fr auto auto;
    grid-gap: 0.5rem;
  }

  .s_timer .timer {
    font-size: 25vw;
    text-align: center;
  }

  .s_timer .level-control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 3rem;
  }

  @media (orientation: landscape) {
    .s_timer {
      grid-template-rows: auto 1fr auto;
      grid-template-columns: repeat(2, auto);
      grid-gap: 0.5rem 1rem;
    }
    .s_timer .timer {
      grid-area: 1 / 2 / span 2 / span 1;
      font-size: 12vw;
    }
    .s_timer .timer-button {
      grid-area: 3 / 2 / span 1 / span 1;
    }
    .s_timer .level-control {
      grid-area: 3 / 1 / span 1 / span 1;
    }
  }

  /* section footer */

  footer {
    background: var(--sk-text-1);
    color: var(--sk-back-1);
  }
  footer a {
    color: inherit;
  }

  /* elements */

  .button--effect {
    font-size: 2rem;
    border: 1em solid var(--sk-text-1);
  }

  .fields-table {
    width: 100%;
    background: snow;
    color: black;
  }
  .fields-table td {
    text-align: center;
    width: 12.5%;
  }
  .fields-table tr:nth-child(odd) td:nth-child(even),
  .fields-table tr:nth-child(even) td:nth-child(odd) {
    background: black;
    color: snow;
  }

  .level-control button {
    height: 100%;
    width: 30%;
  }

  .lvl--past {
    font-style: italic;
  }
  .lvl--now {
    font-weight: bold;
  }
</style>
