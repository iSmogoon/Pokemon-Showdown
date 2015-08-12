exports.BattleAbilities = {
	"heatproof": {
		desc: "This Pokemon takes normally-effective damage from Fire-type attacks..",
		shortDesc: "The power of Fire-type attacks against this Pokemon is halved; burn damage halved.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Heatproof weaken');
				return basePower / 4;
			}
		},
		onImmunity: function (type, source) {
			if (type === 'brn') return false;
		},
		id: "heatproof",
		name: "Heatproof",
		rating: 2.5,
		num: 85
	},
	"oblivious": {
		inherit: true,
		onAnyModifyBoost: function (boosts, target) {
			var source = this.effectData.target;
			if (source === target) return;
			if (source === this.activePokemon && target === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (target === this.activePokemon && source === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
			if (target === this.activePokemon && source === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (source === this.activePokemon && target === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['spa'] = 0;
				boosts['evasion'] = 0;
			}
		},
		id: "oblivious",
		name: "Oblivious",
		rating: 1,
		num: 12
	},
	"rivalry": {
		desc: "This Pokemon's Special Attack is raised by 1 stage if it attacks and knocks out another Pokemon.",
		shortDesc: "if ur mon faints an opposin mon you get sp atk boost",
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({spa:1}, source);
			}
		},
		id: "rivalry",
		name: "Rivalry",
		rating: 0.5,
		num: 79
	},
	"wonderskin": {
		desc: "This Pokemon cannot be put to sleep, burned, poisoned, or paralyzed; this includes both opponent-induced statuses as well as user-induced statuses.",
		shortDesc: "This Pokemon cannot be statused. Gaining this Ability while inflicted cures it.",
		onUpdate: function(pokemon) {
			if (pokemon.status === 'slp' || pokemon.status === 'brn' || pokemon.status === 'psn' || pokemon.status === 'tox' || pokemon.status === 'par') {
				pokemon.cureStatus();
			}
		},
		onImmunity: function(type, pokemon) {
			if (type === 'slp' || type === 'brn' || type === 'psn' || type === 'tox' || type === 'par') return false;
		},
		id: "wonderskin",
		name: "Wonder Skin",
		rating: 1,
		num: 147
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