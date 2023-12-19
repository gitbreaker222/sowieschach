const effects = {
  SWAP: [
    'TAUSCHE:\n mein <Bauer> : dein <Bauer>',
    'TAUSCHE:\n mein <Bauer> : dein <Turm>',
    'TAUSCHE:\n mein <Bauer> : dein <Springer>',
    'TAUSCHE:\n mein <Bauer> : dein <Läufer>',
    'TAUSCHE:\n mein <Turm> : dein <Bauer>',
    'TAUSCHE:\n mein <Turm> : dein <Turm>',
    'TAUSCHE:\n mein <Turm> : dein <Springer>',
    'TAUSCHE:\n mein <Turm> : dein <Läufer>',
    'TAUSCHE:\n mein <Springer> : dein <Bauer>',
    'TAUSCHE:\n mein <Springer> : dein <Turm>',
    'TAUSCHE:\n mein <Springer> : dein <Springer>',
    'TAUSCHE:\n mein <Springer> : dein <Läufer>',
    'TAUSCHE:\n mein <Läufer> : dein <Bauer>',
    'TAUSCHE:\n mein <Läufer> : dein <Turm>',
    'TAUSCHE:\n mein <Läufer> : dein <Springer>',
    'TAUSCHE:\n mein <Läufer> : dein <Läufer>'
  ],
  MOVE_TYPE: [
    'BEWEGE:\n alle meine <Bauer> RICHTUNG $direction',
    'BEWEGE:\n alle meine <Turm> RICHTUNG $direction',
    'BEWEGE:\n alle meine <Springer> RICHTUNG $direction',
    'BEWEGE:\n alle meine <Läufer> RICHTUNG $direction'
  ],
  MOVE_COLUMN: [
    'BEWEGE:\n meine in SPALTE <Schwarz> RICHTUNG $direction',
    'BEWEGE:\n meine in SPALTE <Weiß> RICHTUNG $direction'
  ],
  RESURRECT: [
    'WIEDERBELEBE:\n einen von meinen <Bauer> auf Feld $field',
    'WIEDERBELEBE:\n einen von meinen <Turm> auf Feld $field',
    'WIEDERBELEBE:\n einen von meinen <Springer> auf Feld $field',
    'WIEDERBELEBE:\n einen von meinen <Läufer> auf Feld $field'
  ]
};
export const load = async () => {
  return {
    categories: Object.keys(effects),
	  directions: {
		  lvl1: ["↑","↓"],
		  lvl3: ["↑", "↓", "←", "→"],
		  lvl5: ["↖", "↗", "←", "→"],
	  },
    effects
  };
};
