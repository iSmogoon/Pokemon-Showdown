exports.BattleItems = {
	"souldew": {
		id: "souldew",
		name: "Soul Dew",
		spritenum: 459,
		fling: {
			basePower: 30
		},
		onModifySpAPriority: 1,
		onModifySpA: function (spa, pokemon) {
			if (pokemon.baseTemplate.num === 380 || pokemon.baseTemplate.num === 381) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD: function (spd, pokemon) {
			if (pokemon.baseTemplate.num === 380 || pokemon.baseTemplate.num === 381) {
				return this.chainModify(1.5);
			}
		},
		onModifyDefPriority: 2,
		onModifyDef: function (def, pokemon) {
			if (pokemon.template.species === 'Shuckle') {
				return def * 1.5;
			}
		},
		onModifySpDPriority: 2,
		onModifySpD: function (spd, pokemon) {
			if (pokemon.template.species === 'Shuckle') {
				return spd * 1.5;
			}
		},
		onSwitchInPriority: -6,
		onSwitchIn: function (pokemon) {
			if (pokemon.isActive && pokemon.baseTemplate.species === 'Meloetta') {
				var template = this.getTemplate('Meloetta-Pirouette');
				pokemon.formeChange(template);
				pokemon.baseTemplate = template;
				pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('detailschange', pokemon, pokemon.details);
				this.add('message', pokemon.name + " transformed!");
				pokemon.setAbility(template.abilities['0']);
				pokemon.baseAbility = pokemon.ability;
			}
		},
		onTakeItem: function (item, source) {
			if (source.baseTemplate.baseSpecies === 'Meloetta') return false;
			return true;
		},
		num: 225,
		gen: 3,
		desc: "If holder is a Latias or a Latios, its Sp. Atk and Sp. Def are 1.5x."
	},
	"eviolite": {
		id: "eviolite",
		name: "Eviolite",
		spritenum: 130,
		fling: {
			basePower: 40
		},
		onModifyDefPriority: 2,
		onModifyDef: function (def, pokemon) {
			if (pokemon.baseTemplate.nfe) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD: function (spd, pokemon) {
			if (pokemon.baseTemplate.nfe) {
				return this.chainModify(1.5);
			}
		},
		onModifyDefPriority: 2,
		onModifyDef: function (def, pokemon) {
			if (pokemon.template.species === 'Phione') {
				return this.chainModify(1.25);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD: function (spd, pokemon) {
			if (pokemon.template.species === 'Phione') {
				return this.chainModify(1.25);
			}
		},
		num: 538,
		gen: 5,
		desc: "If holder's species can evolve, its Defense and Sp. Def are 1.5x."
	},
	"lightball": {
		inherit: true,
		onModifyAtkPriority: 1,
		onModifyAtk: function (atk, pokemon) {
			if (pokemon.baseTemplate.baseSpecies === 'Raichu') {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 1,
		onModifySpA: function (spa, pokemon) {
			if (pokemon.baseTemplate.baseSpecies === 'Raichu') {
				return this.chainModify(1.5);
			}
		},
	},
    "heatrock": {
		inherit: true,
		onSwitchInPriority: -6,
		onSwitchIn: function (pokemon) {
			if (pokemon.isActive && pokemon.baseTemplate.species === 'Castform') {
				var template = this.getTemplate('Castform-Sunny');
				pokemon.formeChange(template);
				pokemon.baseTemplate = template;
				pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('detailschange', pokemon, pokemon.details);
				this.add('message', pokemon.name + " transformed!");
				pokemon.setAbility(template.abilities['H']);
				pokemon.baseAbility = pokemon.ability;
			}
		},
		onTakeItem: function (item, source) {
			if (source.baseTemplate.baseSpecies === 'Castform') return false;
			return true;
		}
	},
    "icyrock": {
		inherit: true,
		onSwitchInPriority: -6,
		onSwitchIn: function (pokemon) {
			if (pokemon.isActive && pokemon.baseTemplate.species === 'Castform') {
				var template = this.getTemplate('Castform-Snowy');
				pokemon.formeChange(template);
				pokemon.baseTemplate = template;
				pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('detailschange', pokemon, pokemon.details);
				this.add('message', pokemon.name + " transformed!");
				pokemon.setAbility(template.abilities['H']);
				pokemon.baseAbility = pokemon.ability;
			}
		},
		onTakeItem: function (item, source) {
			if (source.baseTemplate.baseSpecies === 'Castform') return false;
			return true;
		}
	},
    "damprock": {
		inherit: true,
		onSwitchInPriority: -6,
		onSwitchIn: function (pokemon) {
			if (pokemon.isActive && pokemon.baseTemplate.species === 'Castform') {
				var template = this.getTemplate('Castform-Rainy');
				pokemon.formeChange(template);
				pokemon.baseTemplate = template;
				pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('detailschange', pokemon, pokemon.details);
				this.add('message', pokemon.name + " transformed!");
				pokemon.setAbility(template.abilities['H']);
				pokemon.baseAbility = pokemon.ability;
			}
		},
		onTakeItem: function (item, source) {
			if (source.baseTemplate.baseSpecies === 'Castform') return false;
			return true;
		}
	},
	"blueorb": {
		id: "blueorb",
		name: "Blue Orb",
		spritenum: 41,
		onSwitchInPriority: -6,
		onSwitchIn: function (pokemon) {
			if (pokemon.isActive && pokemon.baseTemplate.species === 'Kyogre') {
				var template = this.getTemplate('Kyogre-Primal');
				pokemon.formeChange(template);
				pokemon.baseTemplate = template;
				pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('detailschange', pokemon, pokemon.details);
				this.add('message', pokemon.name + "'s Primal Reversion! It reverted to its primal form!");
				pokemon.setAbility(template.abilities['0']);
				pokemon.baseAbility = pokemon.ability;
			}
		},
		onTakeItem: function (item, source) {
			if (source.baseTemplate.baseSpecies === 'Kyogre') return false;
			return true;
		},
		num: -6,
		gen: 6,
		desc: "If holder is a Kyogre, this item triggers its Primal Reversion in battle."
	},
};