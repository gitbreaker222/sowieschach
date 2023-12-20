<script>
  import { version } from '$app/environment';

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

    const categoryIndex = _random(categories.length);
    const category = categories[categoryIndex];
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
</script>

<main>
  <section class="s_app">
    <h1>Sowie Schach</h1>
    <ol>
      <li>Normaler Zug</li>
      <li>Effekt würfeln</li>
    </ol>

    <button class="button--effect g_pre-line" on:click={chooseEffect}>{currentEffect}</button>

    <div>Level: <code>{level}</code> / <code>{timer}</code></div>
  </section>

  <section class="s_timer">
    <h1>Timer / Level</h1>

    <button on:click={handleStartStop}>
      {#if timerRunning}
        Stop ⏸
      {:else}
        Start ▶
      {/if}
    </button>

    <input type="time" bind:value={timer} />

    <label>
      Level:
      <input type="number" bind:value={level} min="1" max="5" />
    </label>

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
    min-height: 98vh;
    padding: 1rem;
    display: grid;
  }
  section:nth-child(even) {
    min-height: 98vh;
    background: #ccc;
  }

  .s_app {
    grid-template-rows: auto auto 1fr auto;
  }

  footer {
    background: #222222;
    color: snow;
  }

  .button--effect {
    font-size: 2rem;
    border-width: 1em;
  }

  .lvl--past {
    font-style: italic;
  }
  .lvl--now {
    font-weight: bold;
  }
</style>
