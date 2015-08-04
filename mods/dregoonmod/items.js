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
};