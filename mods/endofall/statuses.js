exports.BattleStatuses = {
	theend: {
		effectType: 'Weather',
		duration: 0,
		onStart: function () {
			this.add('-weather', 'theend');
		},
		onResidualOrder: 1,
		onResidual: function () {
			this.add('-weather', 'theend', '[upkeep]');
			this.eachEvent('Weather');
		},
		onWeather: function (target) {
			this.damage(target.maxhp / 6);
		},
	},
};