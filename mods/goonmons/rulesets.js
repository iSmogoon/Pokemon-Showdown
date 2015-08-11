exports.BattleFormats = {
	goondex: {
		effectType: 'Rule',
		validateSet: function (set) {
			var unovaDex = {
				"Serperior":1, "Emboar":1, "Samurott":1, 
			};
			if (!(set.species in unovaDex)) {
				return [set.species + " is not in the Hoenn Pokedex."];
			}
		}
	},
};
