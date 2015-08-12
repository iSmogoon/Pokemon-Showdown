exports.BattleFormats = {
	goondex: {
		effectType: 'Rule',
		validateSet: function (set) {
			var goonDex = {
				"Victini":1, "Serperior":1, "Emboar":1, "Samurott":1, "Watchog":1, "Stoutland":1, "Liepard":1, "Musharna":1, "Unfezant":1, "Zebstrika":1, "Gigalith":1, "Swoobat":1, "Excadrill":1, "Audino":1, "Conkeldurr":1, "Seismitoad":1, "Throh":1, "Sawk":1, "Basculin":1, "Basculin-Blue-Striped":1, "Darmanitan":1, "Garbodor":1, "Swanna":1, "Golurk":1, "Bisharp":1, "Heatmor":1, "Durant":1, "Volcarona":1, "Cobalion":1, "Virizion":1, "Terrakion":1, "Thundurus":1, "Tornadus":1, "Landorus":1, "Kyurem":1, "Meloetta":1, "Genesect":1, "Keldeo":1, "Thundurus-Therian":1, "Tornadus-Therian":1, "Landorus-Therian":1, "Kyurem-Black":1, "Kyurem-White":1, "Keldeo-Resolute":1,
			};
			if (!(set.species in goonDex)) {
				return [set.species + " is not in this version of GoonMons."];
			}
		}
	},
};