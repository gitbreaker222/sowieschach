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

    <button class="button--effect" on:click={chooseEffect}>{currentEffect}</button>

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

    <ul>
      <li class:lvl--now={level === 1} class:lvl--past={level > 1}>
        Level 1: RICHTUNG: {data.directions.lvl1.join(' / ')}
      </li>
      <li class:lvl--now={level === 2} class:lvl--past={level > 2}>
        Level 2: BEWEGEN: mit schieben
      </li>
      <li class:lvl--now={level === 3} class:lvl--past={level > 3}>
        Level 3: RICHTUNG: {data.directions.lvl3.join(' / ')}
      </li>
      <li class:lvl--now={level === 4} class:lvl--past={level > 4}>
        Level 4: BEWEGEN: mit schubsen; <br />
        … TAUSCH / WIEDERBELEBE: Ersatzweise Bauer
      </li>
      <li class:lvl--now={level === 5} class:lvl--past={level > 5}>
        Level 5: RICHTUNG: {data.directions.lvl5.join(' / ')}
      </li>
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
	  grid-template-rows: auto auto 1fr auto
  }

  footer {
    background: #222222;
    color: snow;
  }

	.button--effect {
		font-size: 2rem;
		border-width: 1em;
		white-space: pre-line;
	}

  .lvl--past {
    font-style: italic;
  }
  .lvl--now {
    font-weight: bold;
  }
</style>
