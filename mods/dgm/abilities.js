exports.BattleAbilities = {
	"battlearmor": {
		desc: "Not very effective hits do two thirds damage to this pokemon.",
		shortDesc: "Resisted hits do 2/3 damage to this pokemon.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (this.getEffectiveness(move.type, defender) < 0) {
				this.debug('Battle Armor Weaken');
				return basePower*2/3;
			}
		},
		id: "battlearmor",
		name: "Battle Armor",
		rating: 1,
		num: 4
	},
	"cheekpouch": {
		inherit: true,
		onEatItem: function (item, pokemon) {
			this.heal(pokemon.maxhp / 2);
		},
	},
	"cloudnine": {
		inherit: true,
		onStart: function(pokemon) {
			this.setWeather('');
		}
	},
	"colorchange": {
		desc: "This Pokemon's secondary type changes according to it's most powerful attack.",
		shortDesc: "This Pokemon's secondary type changes according to it's most powerful attack.",
		onStart: function(pokemon) {
			var move = this.getMove(pokemon.moveset[0].move);
			if (pokemon.types[0] != move.type) {
				pokemon.types[1] = move.type;
				this.add('-message', pokemon.name+' changed its color to '+pokemon.types+'!');
			}
		},
		id: "colorchange",
		name: "Color Change",
		rating: 4,
		num: 16
	},
	"defeatist": {
		desc: "While this Pokemon has 1/2 or less of its maximum HP, its Attack and Special Attack are halved.",
		shortDesc: "While this Pokemon has 1/2 or less of its max HP, its Attack and Sp. Atk are halved.",
		onModifyDefPriority: 5,
		onModifyDef: function (def, pokemon) {
			if (pokemon.hp < pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		onModifySpDPriority: 5,
		onModifySpD: function (spd, pokemon) {
			if (pokemon.hp < pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		onResidual: function (pokemon) {
			pokemon.update();
		},
		id: "defeatist",
		name: "Defeatist",
		rating: -1,
		num: 129
	},
	"drought": {
		inherit: true,
		onStart: function(source) {
			this.setWeather('sunnyday');
			this.weatherData.duration = 0;
		},
	},
	"drizzle": {
		inherit: true,
		onStart: function(source) {
			this.setWeather('raindance');
			this.weatherData.duration = 0;
		},
	},
	"snowwarning": {
		inherit: true,
		onStart: function(source) {
			this.setWeather('hail');
			this.weatherData.duration = 0;
		},
	},
	"sandstream": {
		inherit: true,
		onStart: function(source) {
			this.setWeather('sandstorm');
			this.weatherData.duration = 0;
		},
	},
	"flowergift": {
		desc: "When Cherrim enters the battle, it will enter Sunshine Forme.. This ability only works on Cherrim, even if it is copied by Role Play, Entrainment, or swapped with Skill Swap.",
		shortDesc: "If this Pokemon is Cherrim, it changes to Sunshine Forme.",
		onStart: function(pokemon) {
			if (pokemon.template.speciesid==='cherrim' && pokemon.formeChange('Cherrim-Sunshine')) {
				pokemon.transformed = false;
				this.add('-formechange', pokemon, 'Cherrim-Sunshine');
				this.add('-message', 'Cherrim blossomed!');
			} else {
				return false;
			}
		},
		id: "flowergift",
		name: "Flower Gift",
		rating: 3,
		num: 122
	},
	"grasspelt": {
		shortDesc: "If Grassy Terrain is active, this Pokemon's Defense and Special Defense are multiplied by 1.5.",
		onModifyDefPriority: 6,
		onModifyDef: function (pokemon) {
			if (this.isTerrain('grassyterrain')) return this.chainModify(1.5);
		},
		onModifySpDPriority: 6,
		onModifySpD: function (pokemon) {
			if (this.isTerrain('grassyterrain')) return this.chainModify(1.5);
		},
		id: "grasspelt",
		name: "Grass Pelt",
		rating: 4,
		num: 179
	},
	"healer": {
		desc: "Has a 30% chance of curing an adjacent ally's status ailment at the end of each turn in Double and Triple Battles.",
		shortDesc: "30% chance of curing an adjacent ally's status at the end of each turn.",
		id: "healer",
		name: "Healer",
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual: function (pokemon) {
			this.heal(pokemon.maxhp / 18);
		},
		rating: 0,
		num: 131
	},
	"leafguard": {
		desc: "If this Pokemon is active while Sunny Day is in effect, it cannot become poisoned, burned, paralyzed or put to sleep (other than user-induced Rest). Leaf Guard does not heal status effects that existed before Sunny Day came into effect.",
		shortDesc: "If Sunny Day is active, this Pokemon cannot be statused and Rest will fail for it.",
		onSourceBasePower: function(basePower, attacker, defender, move) {
			if (this.isWeather('sunnyday')) {
				this.debug('Leaf Guard weaken');
				return basePower*2/3;
			}
		},
		id: "leafguard",
		name: "Leaf Guard",
		rating: 3,
		num: 102
	},
	"overcoat": {
		shortDesc: "This Pokemon is immune to powder moves and damage from Sandstorm or Hail.",
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'powder' || type === 'sunnyday' || type === 'raindance') return false;
		},
		id: "overcoat",
		name: "Overcoat",
		rating: 2.5,
		num: 142
	},
		"pickup": {
		desc: "Removes hazards on switch-in.",
        shortDesc: "Removes hazards on switch-in.",
		onStart: function(pokemon) {
				var sideConditions = {spikes:1, toxicspikes:1, stickyweb:1};
				for (var i in sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(i)) {
						this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] ability: Pickup', '[of] ' + pokemon);
					}
				}
		},
		id: "pickup",
		name: "Pickup",
		rating: 0,
		num: 53
	},
	"parentalbond": {
		desc: "This Pokemon's damaging moves become multi-hit moves that hit twice. The second hit has its damage halved. Does not affect multi-hit moves or moves that have multiple targets.",
		shortDesc: "This Pokemon's damaging moves hit twice. The second hit has its damage halved.",
		onModifyMove: function (move, pokemon, target) {
			if (move.category !== 'Status' && !move.selfdestruct && !move.multihit && !move.poweruppunch && ((target.side && target.side.active.length < 2) || move.target in {any:1, normal:1, randomNormal:1})) {
				move.multihit = 2;
				pokemon.addVolatile('parentalbond');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower) {
				if (this.effectData.hit) {
					return this.chainModify(0.3);
				} else {
					this.effectData.hit = true;
				}
			}
		},
		id: "parentalbond",
		name: "Parental Bond",
		rating: 5,
		num: 184
	},
	"runaway": {
		shortDesc: "No competitive use.",
		id: "runaway",
		name: "Run Away",
		onModifyPokemonPriority: -10,
		onModifyPokemon: function (pokemon) {
			pokemon.trapped = pokemon.maybeTrapped = false;
		},
		rating: 0,
		num: 50
	},
		"swiftswim": {
		shortDesc: "If Rain Dance is active, this Pokemon's Speed is raised by 50%.",
		onModifySpe: function (speMod, pokemon) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				return this.chain(speMod, 1.5);
			}
		},
		onModifySpe: function (speMod, pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chain(speMod, .5);
			}
		},
		id: "swiftswim",
		name: "Swift Swim",
		rating: 2.5,
		num: 33
	},
	"sandrush": {
		desc: "If Sandstorm is active, this Pokemon's Speed is doubled. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm is active, this Pokemon's Speed is doubled; immunity to Sandstorm.",
		onModifySpe: function (speMod, pokemon) {
			if (this.isWeather('sandstorm')) {
				return this.chain(speMod, 1.5);
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		id: "sandrush",
		name: "Sand Rush",
		rating: 2.5,
		num: 146
	},
	"chlorophyll": {
		shortDesc: "If Sunny Day is active, this Pokemon's Speed is doubled.",
		onModifySpe: function (speMod) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chain(speMod, 1.5);
			}
		},
		onModifySpe: function (speMod) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				return this.chain(speMod, .5);
			}
		},
		id: "chlorophyll",
		name: "Chlorophyll",
		rating: 2.5,
		num: 34
	},
	"tempochange": {
		desc: "When Meloetta enters the battle, it will turn into its Zen Mode. This ability only works on Meloetta, even if it is copied by Role Play, Entrainment, or swapped with Skill Swap.",
		shortDesc: "If this Pokemon is Meloetta, it changes to its Pirouette Forme.",
		onStart: function(pokemon) {
			if (pokemon.template.speciesid==='meloetta' && pokemon.formeChange('Meloetta-Pirouette')) {
				pokemon.transformed = false;
				this.add('-formechange', pokemon, 'Meloetta-Pirouette');
				this.add('-message', 'Meloetta transformed!');
			} else {
				return false;
			}
		},
		id: "Tempo Change",
		name: "Tempo Change",
		rating: 3,
		num: -5
	},
	"persistent": {
		inherit: true,
		isNonStandard: false,
	},
	"rebound": {
		inherit: true,
		isNonStandard: false,
	},
	"mountaineer": {
		inherit: true,
		isNonStandard: false,
	},
};