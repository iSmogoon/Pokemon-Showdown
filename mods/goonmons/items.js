exports.BattleItems = {
	"oddincense": {
		inherit: true,
		onSwitchInPriority: -6,
		onSwitchIn: function (pokemon) {
			if (pokemon.isActive && pokemon.baseTemplate.species === 'Darmanitan') {
				var template = this.getTemplate('Darmanitan-Zen');
				pokemon.formeChange(template);
				pokemon.baseTemplate = template;
				pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('detailschange', pokemon, pokemon.details);
				this.add('message', pokemon.name + " transformed into its Zen Mode forme!");
				pokemon.setAbility(template.abilities['0']);
				pokemon.baseAbility = pokemon.ability;
			}
		},
		onTakeItem: function (item, source) {
			if (source.baseTemplate.baseSpecies === 'Darmanitan') return false;
			return true;
		},
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies === 'Darmanitan') {
				this.heal(pokemon.maxhp / 16);
			} 
		},
	},
};