function clampIntRange(num, min, max) {
	num = Math.floor(num);
	if (num < min) num = min;
	if (typeof max !== 'undefined' && num > max) num = max;
	return num;
}
exports.BattleStatuses = {
	raindance: {
		inherit: true,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('rain water boost');
				return basePower * 1.3;
			}
			if (move.type === 'Fire') {
				this.debug('rain fire suppress');
				return basePower * .7;
			}
		}
	},
	sunnyday: {
		inherit: true,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Sunny Day fire boost');
				return basePower * 1.3;
			}
			if (move.type === 'Water') {
				this.debug('Sunny Day water suppress');
				return basePower * .7;
			}
		}
	},
	hail: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function (source, effect) {
			if (source && source.hasItem('icyrock')) {
				return 8;
			}
			return 5;
		},
		// This should be applied directly to the stat before any of the other modifiers are chained
		// So we give it increased priority.
		onModifyDefPriority: 10,
		onModifyDef: function (def, pokemon) {
			if (pokemon.hasType('Ice') && this.isWeather('hail')) {
				return this.modify(def, 1.5);
			}
		},
		onStart: function (battle, source, effect) {
			if (effect && effect.effectType === 'Ability' && this.gen <= 5) {
				this.effectData.duration = 0;
				this.add('-weather', 'Hail', '[from] ability: ' + effect, '[of] ' + source);
			} else {
				this.add('-weather', 'Hail');
			}
		},
		onResidualOrder: 1,
		onResidual: function () {
			this.add('-weather', 'Hail', '[upkeep]');
			if (this.isWeather('hail')) this.eachEvent('Weather');
		},
		onWeather: function (target) {
			this.damage(target.maxhp / 16);
		},
		onEnd: function () {
			this.add('-weather', 'none');
		}
	},
	latios: {
		// Latios: Synchronize
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'synchronize';
				pokemon.baseAbility = 'synchronize';
			}
		}
	},
	latias: {
		// Latias: Synchronize
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'synchronize';
				pokemon.baseAbility = 'synchronize';
			}
		}
	},
	latiosmega: {
		// Latios-Mega: Magic Bounce
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'magicbounce';
				pokemon.baseAbility = 'magicbounce';
			}
		}
	},
	latiasmega: {
		// Latios-Mega: Magic Bounce
		onImmunity: function (type, pokemon) {
			if (type === 'Ground' && (!this.suppressingAttackEvents() || this.activePokemon === pokemon)) return false;
		},
		onStart: function (pokemon) {
			if (pokemon.ability === 'levitate') {
				pokemon.ability = 'magicguard';
				pokemon.baseAbility = 'magicguard';
			}
		}
	},
};