exports.BattleFormats = {
	unrelgens: {
		effectType: 'Banlist',
		validateSet: function (set) {
			var template = this.getTemplate(set.species || set.name);
			if (template.num < 493) {
				return [set.species + " is not in this version of GoonMons."];
			} if (template.num > 649) {
				return [set.species + " is not in this version of GoonMons."];
			}
		}
	},
};