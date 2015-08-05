exports.BattleMovedex = {
	"darkvoid": {
		num: 464,
		accuracy: 95,
		basePower: 60,
		category: "Special",
		desc: "50% chance to sleep the target.",
		shortDesc: "50% chance to cause sleep.",
		id: "darkvoid",
		isViable: true,
		name: "Dark Void",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 50,
			status: 'slp'
		},
		target: "normal",
		type: "Dark"
	},
	"dizzypunch": {
		inherit: true,
		basePower: 65,
		onBasePower: function (power, user) {
			if (user.template.id === 'spinda') return this.chainModify(1.5);
		},
		secondary: {
			chance: 50,
			volatileStatus: 'confusion'
		}
	},
	"flameburst": {
		num: 481,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		desc: "If this move is successful, each ally adjacent to the target loses 1/16 of its maximum HP, rounded down, unless it has the Ability Magic Guard.",
		shortDesc: "Damages Pokemon next to the target as well.",
		id: "flameburst",
		name: "Flame Burst",
		pp: 15,
		priority: 0,
		flags: {protect: 1, pulse: 1, mirror: 1, distance: 1},
		secondary: {
			chance: 10,
			volatileStatus: 'brn'
		},
		target: "normal",
		type: "Fire"
	},
	"irontail": {
		inherit: true,
		basePower: 100,
		accuracy: 90,
	},
"kingsshield": {
		num: 588,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user is protected from most attacks made by other Pokemon during this turn, and Pokemon making contact with the user have their Attack lowered by 2 stages. Non-damaging moves go through this protection. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
		shortDesc: "Protects from attacks. Contact: lowers Atk by 2.",
		id: "kingsshield",
		isViable: true,
		name: "King's Shield",
		pp: 10,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'kingsshield',
		onTryHit: function (pokemon) {
			return !!this.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit: function (pokemon) {
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') return;
				if (move.breaksProtect) {
					target.removeVolatile('kingsshield');
					return;
				}
				this.add('-activate', target, 'Protect');
				var lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (move.flags['contact']) {
					this.boost({atk:-1}, source, target, this.getMove("King's Shield"));
				}
				return null;
			}
		},
		secondary: false,
		target: "self",
		type: "Steel"
	},
	"landswrath": {
		inherit: true,
		basePower: 120,
		accuracy: 95,
	},
	"lunardance": {
		num: 461,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack and Speed by 1 stage.",
		shortDesc: "Raises the user's Special Attack and Speed by 1.",
		id: "lunardance",
		isViable: true,
		name: "Lunar Dance",
		pp: 10,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			spa: 1,
			spe: 1
		},
		secondary: false,
		target: "self",
		type: "Psychic"
	},
	"meditate": {
		inherit: true,
		boosts: {
			atk: 1,
			spd: 1
		},
	},
	"megakick": {
		inherit: true,
		accuracy: 95,
		basePower: 65,
		onBasePower: function (power, user) {
			if (user.template.id === 'hitmonlee') return this.chainModify(1.5);
		},
		type: "Fighting"
	},
	"megapunch": {
		inherit: true,
		accuracy: 95,
		basePower: 65,
		onBasePower: function (power, user) {
			if (user.template.id === 'hitmonchan') return this.chainModify(1.5);
		},
		type: "Fighting"
	},
"naturepower": {
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		desc: "Does a Physical Grass-type attack, that also applies Ground to its effectiveness.",
		shortDesc: "Grass/Ground-type Flying Press.",
		id: "naturepower",
		name: "Nature Power",
		pp: 10,
		priority: 0,
		onEffectiveness: function (typeMod, type, move) {
			return typeMod + this.getEffectiveness('Ground', type);
		},
		self: {
			onHit: function (pokemon) {
				this.add('-anim', pokemon, "Geomancy", pokemon);
			}
		},
		onTry: function (pokemon) {
				this.add('-anim', pokemon, "Earth Power", pokemon);
		},
		flags: {protect: 1, mirror: 1, nonsky: 1},
		secondary: false,
		target: "allAdjacent",
		type: "Grass"
	},
"nightdaze": {
		inherit: true,
		accuracy: 100,
		basePower: 95,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			boosts: {
				accuracy: -1
			}
		},
	},
"ominouswind": {
		inherit: true,
		secondary: {
			chance: 60,
			self: {
				onHit: function (target, source) {
					var stats = [];
					for (var i in target.boosts) {
						if (i !== 'atk' && i !== 'evasion' && i !== 'spa' && i !== 'spe' && target.boosts[i] < 6) {
							stats.push(i);
						}
					}
					if (stats.length) {
						var i = stats[this.random(stats.length)];
						var boost = {};
						boost[i] = 1;
						this.boost(boost);
					} else {
						return false;
					}
				}
			}
		}
	},
	"paraboliccharge": {
		inherit: true,
		basePower: 80,
		drain: [3, 4]
	},
	"phantomforce": {
		num: 566,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks. If the user is holding a Power Herb, the move completes in one turn. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "Disappears turn 1. Hits turn 2. Breaks protection.",
		id: "phantomforce",
		name: "Phantom Force",
		pp: 10,
		priority: 0,
		flags: {contact: 1, mirror: 1},
		breaksProtect: false,
		effect: false,
		secondary: false,
		target: "normal",
		type: "Ghost"
	},
	"powergem": {
		inherit: true,
		secondary: {
			chance: 10,
			boosts: {
				spa: -1
			},
		},
	},
	"seedflare": {
		inherit: true,
		basePower: 100,
		accuracy: 90,
		secondary: {
			chance: 20,
			boosts: {
				def: -1,
				spd: -1
			},
		},
	},
	"silverwind": {
		inherit: true,
		secondary: {
			chance: 60,
			self: {
				onHit: function (target, source) {
					var stats = [];
					for (var i in target.boosts) {
						if (i !== 'accuracy' && i !== 'evasion' && i !== 'atk' && i !== 'def' && target.boosts[i] < 6) {
							stats.push(i);
						}
					}
					if (stats.length) {
						var i = stats[this.random(stats.length)];
						var boost = {};
						boost[i] = 1;
						this.boost(boost);
					} else {
						return false;
					}
				}
			}
		}
		},
	"skyattack": {
		num: 143,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target and a higher chance for a critical hit. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Charges, then hits turn 2. 30% flinch. High crit.",
		id: "skyattack",
		name: "Sky Attack",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		willCrit: true,
		secondary: false,
		target: "normal",
		type: "Flying"
	},
	stealthrock: {
        	inherit: true,
        	effect: {
            // this is a side condition
            	onStart: function(side) {
                	this.add('-sidestart',side,'move: Stealth Rock');
            	},
            	onSwitchIn: function(pokemon) {
                	var typeMod = this.getEffectiveness('Rock', pokemon);
                	var factor = 8;
                	if (typeMod == 1) factor = 6;
                	if (typeMod >= 2) factor = 4;
                	if (typeMod == -1) factor = 16;
                	if (typeMod <= -2) factor = 12;
				//if (typeMod == 1) factor = 4;
				//if (typeMod >= 2) factor = 2;
				//if (typeMod == -1) factor = 16;
				//if (typeMod <= -2) factor = 32;
                var damage = this.damage(pokemon.maxhp/factor);
            	}
        }
    	},
	"technoblast": {
		inherit: true,
		basePower: 95,
	},
	"topsyturvy": {
		inherit: true,
		flags: {protect: 1, mirror: 1},
		priority: 1,
	},
	"triplekick:": {
		inherit: true,
		basePower: 25,
		accuracy: 95,
	},
	"twister": {
		num: 239,
		accuracy: 10,
		basePower: 20,
		category: "Special",
		desc: "Removes weather upon hit.",
		shortDesc: "Removes weather.",
		id: "twister",
		name: "Twister",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onHit: function (source) {
			this.setWeather('');
			this.weatherData.duration = 0;
		},
		target: "normal",
		type: "Flying"
	},
	"hyperspacehole": {
		inherit: true,
		basePower: 95,
	},
	"lightofruin": {
		inherit: true,
		isUnreleased: false,
	},
	"thousandarrows": {
		inherit: true,
		isUnreleased: false,
	},
	"thousandwaves": {
		inherit: true,
		isUnreleased: false,
	},
	"steameruption": {
		inherit: true,
		isUnreleased: false,
	},
};
