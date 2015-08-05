exports.BattleAbilities = {
	"battlearmor": {
		desc: "Not very effective hits do 33% less damage to this pokemon.",
		shortDesc: "Resisted hits do 33% less damage to this Pokemon.",
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
		desc: "Consuming a berry heals this Pokemon for 50% of it's maximum health. Including the effect of the berry",
		shortDesc: "Consumed berries heal for 50% of max health.",
		inherit: true,
		onEatItem: function (item, pokemon) {
			this.heal(pokemon.maxhp / 2);
		},
	},
	"cloudnine": {
		desc: "Completely removes weather when this Pokemon is switched in.",
		shortDesc: "Removes weather upon switch in.",
		inherit: true,
		onStart: function(pokemon) {
			this.setWeather('');
		}
	},
	"colorchange": {
		desc: "This Pokemon's secondary typing changes to match that of the move in it's first move slot.",
		shortDesc: "Changes the user's secondary typing to match thats of it's first move.",
		onStart: function (pokemon) {
			var move = this.getMove(pokemon.moveset[0].move);
			var pTypes = pokemon.types;
			if (pokemon.types[0] != move.type) {
				pokemon.types[1] = move.type;
				this.add('-start', pokemon, 'typechange', pTypes.join('/'));
				pokemon.typesData = [
                                {type: pTypes[0], suppressed: false, isAdded: false},
                                {type: pTypes[1], suppressed: false, isAdded: false}
                        ];
			}
		},
	},
	"defeatist": {
		desc: "While this Pokemon has 50% or less of its maximum HP, its Defense and Special Defense are halved.",
		shortDesc: "While this Pokemon has 50% or less of its max HP, its Defense and Sp. Def are halved.",
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
		desc: "Summons the Sun when this Pokemon is switched in permanently.",
		shortDesc: "Summons permanent Sun upon switch in.",
		inherit: true,
		onStart: function(source) {
			this.setWeather('sunnyday');
			this.weatherData.duration = 0;
		},
	},
	"drizzle": {
		desc: "Summons the Rain when this Pokemon is switched in permanently.",
		shortDesc: "Summons permanent Rain upon switch in.",
		inherit: true,
		onStart: function(source) {
			this.setWeather('raindance');
			this.weatherData.duration = 0;
		},
	},
	"snowwarning": {
		desc: "Summons Hail when this Pokemon is switched in permanently.",
		shortDesc: "Summons permanent Hun upon switch in.",
		inherit: true,
		onStart: function(source) {
			this.setWeather('hail');
			this.weatherData.duration = 0;
		},
	},
	"sandstream": {
		desc: "Summons the Sand when this Pokemon is switched in permanently.",
		shortDesc: "Summons permanent Sand upon switch in.",
		inherit: true,
		onStart: function(source) {
			this.setWeather('sandstorm');
			this.weatherData.duration = 0;
		},
	},
	"flowergift": {
		desc: "When Cherrim enters the battle, it will enter Sunshine Forme.. This ability only works on Cherrim.",
		shortDesc: "If this Pokemon is Cherrim, it changes to Sunshine Forme upon entering battle.",
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
	"forewarn": {
		desc: "On switch-in, this Pokemon is alerted to the foes' moveset.",
		shortDesc: "The opponent's moveset is revealed.",
		onStart: function(pokemon) {
			var target = pokemon.side.foe.randomActive();
			if (!target) return;
			for (var j=0; j<target.moveset.length; j++) {
				var move = this.getMove(target.moveset[j].move);
				this.add('-message', target.name+' has '+move.name+'!');
			}
		},
		id: "forewarn",
		name: "Forewarn",
		rating: 1,
		num: 108
	},
	"grasspelt": {
		desc: "If Grassy Terrain is active, this Pokemon's Defense and Special Defense are multiplied by 1.5.",
		shortDesc: "Grants x1.5 defense and x1.5 special defense in Grassy Terrain.",
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
		desc: "If Sunny Day is active all damage taken by this Pokemon is reduced by 33%.",
		shortDesc: "If Sunny Day is active, takes 33% reduced damage",
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
		shortDesc: "This Pokemon is immune to weather effects.",
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
		desc: "This Pokemon's damaging moves become multi-hit moves that hit twice. The second hit does 0.3x damage. Does not affect multi-hit moves or moves that have multiple targets.",
		shortDesc: "This Pokemon's damaging moves hit twice. The second hit does 0.3x damage.",
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
					return this.chainModify(0.2);
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
		desc: "This Pokemon is immune to any form of trapping. Shadow Tag, Arena Trap, Infestation, Clamp etc...",
		shortDesc: "This Pokemon is immune to trapping.",
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
		desc: "If Rain is active, this Pokemon's Speed is increased by 50%.",
		shortDesc: "This Pokemon's speed is increased in Rain.",
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
		desc: "If Sandstorm is active, this Pokemon's Speed is increased by 50%. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm is active, this Pokemon's Speed is increased by 50%; immunity to Sandstorm.",
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
		desc: "If Sunny Day is active, this Pokemon's Speed is increased by 50%.",
		shortDesc: "If Sunny DAy is active, this Pokemon's Speed is increased by 50%.",
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
	/*
	"tempochange": {
		desc: "When Meloetta enters the battle, it will transform into Pirouette Form. This ability only works on Meloetta.",
		shortDesc: "Transforms into Pirouette Form upon switch in.",
		onStart: function(pokemon) {
			if (pokemon.template.speciesid==='meloetta' && pokemon.formeChange('Meloetta-Pirouette')) {
				pokemon.transformed = false;
				this.add('-formechange', pokemon, 'Meloetta-Pirouette');
				this.add('-message', 'Meloetta transformed!');
			} else {
				return false; //removed in recent update
			}
		},
		id: "Tempo Change",
		name: "Tempo Change",
		rating: 3,
		num: -5
	},
	*/
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
