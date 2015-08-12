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
};