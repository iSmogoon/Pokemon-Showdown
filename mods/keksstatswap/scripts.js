exports.BattleScripts = {
	init: function() {
		for (var i in this.data.Pokedex) {
			var stats = this.getTemplate(i).baseStats;
			this.modData('Pokedex', i).baseStats = {hp:stats.spe, atk:stats.def, def:stats.atk, spa:stats.spd, spd:stats.spa, spe:stats.hp};
		}
	}
};