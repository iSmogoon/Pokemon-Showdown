exports.BattleScripts = {
	init: function () {
		this.modData('Pokedex', 'latios').abilities['1'] = 'Synchronize';
		this.modData('Pokedex', 'latias').abilities['1'] = 'Synchronize';
		this.modData('Pokedex', 'latiosmega').abilities['1'] = 'Magic Bounce';
	}
};