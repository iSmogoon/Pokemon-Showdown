exports.BattleMovedex = {
	"glaciate": {
		inherit: true,
		basePower: 85,
		secondary: {
			chance: 100,
			boosts: {
				spe: -2,
			},
		},
	},
	"meditate": {
		inherit: true,
		boosts: {
			atk: 1,
			spd: 1
		},
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
	"stealthrock": {
        inherit: true,
		effect: {
			onStart: function(side) {
				this.add('sidestart',side,'move: Stealth Rock');
			},
			onSwitchIn: function (pokemon) {
				var typeMod = this.getEffectiveness('Rock', pokemon);
				var factor = 8;
				if (typeMod == 1) factor = 4;
				if (typeMod >= 2) factor = 4;
				if (typeMod == -1) factor = 16;
				if (typeMod <= -2) factor = 32;
				var damage = this.damage(pokemon.maxhp/factor);
				}
		},
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
		},
		target: "normal",
		type: "Flying"
	},
	"vcreate": {
		inherit: true,
		basePower: 130,
		accuracy: 95,
		self: {
			boosts: {
				def: -1,
				spd: -1
			}
		}
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
};