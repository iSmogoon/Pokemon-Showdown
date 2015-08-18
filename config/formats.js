// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.js

exports.Formats = [

	// XY Singles
	///////////////////////////////////////////////////////////////////

	{
		name: "DreGoonMod OU",
		desc: ["&bullet; <a href=\"http://pastebin.com/iutaZuyA\">DreGoonMod</a>"],
		section: "GoonServer Metas",
		column: 3,
		mod: 'dgm',
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause', 'Sleep Clause'],
		banlist: ['Uber', 'NFE']
	},
	{
		name: "Goon\'s Mega Revolution",
		section: "GoonServer Metas",
		column: 3,
		mod: 'mevolve',
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite']
	},
	{
		name: "Kekecleon\'s  Stat Swap",
		desc: ["&bullet; HP switches with Speed, Atk switches with Def, SpA switches with SpD."],
		section: "GoonServer Metas",
		column: 3,
		mod: 'keksstatswap',
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Arceus', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Deoxys-Defense', 'Dialga', 'Giratina-Origin', 'Giratina',
				  'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Salamencite', 
				  'Shaymin-Sky', 'Xerneas', 'Yveltal', 'Zekrom', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Mawilite']
	},
    {
        name: "PacifistMons",
        ruleset: ['Pokemon', 'Standard', 'Team Preview'],
        banlist: ['Heatran', 'Gengarite', 'Taunt', 'Magic Guard'],
		section: "GoonServer Metas",
		column: 3,
        validateSet: function(set) {
            var problems = [];
            for (var i in set.moves) {
                var move = this.getMove(set.moves[i]);
                if (move.heal) problems.push(move.name + ' is banned as it is a healing move.');
                if (move.category !== 'Status') problems.push(move.name + ' is banned as it is an attacking move.');
            }
            return problems;
        }
    },
	{
		name: "Middle Cup",
		desc: ["&bullet; Middle Cup: Only Pokemon that have evolved once and can evolve again are allowed. Max level is 50."],
		section: "GoonServer Metas",
		column: 3,
		mod: 'middlecup',
		maxLevel: 50,
		ruleset: ['Pokemon', 'Eviolite Clause', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause', 'Sleep Clause'],
		banlist: ['OU', 'UU', 'Ubers', 'RU', 'NU', 'PU', 'LC', 'Chansey + Eviolite']
	},
	/*
	{
		name: "LC Inheritance",
		desc: ["&bullet; LC Inheritance: All Pokemon get the abilities and moves of their evolutions."],
		section: "GoonServer Metas",
		column: 3,
		maxLevel: 5,
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause', 'Cancel Mod', 'Little Cup'],
		banlist: ['Dragon Rage', 'Sonic Boom', 'Swagger']
	},
	*/
	{
		name: "Gods and Followers",
		section: "GoonServer Metas",

		mod: 'godsandfollowers',
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause', 'Followers Clause', 'Mega Rayquaza Ban Mod', 'Cancel Mod'],
		banlist: ['Illegal']
	},
	{
		name: "LC Inheritance",
		section: "GoonServer Metas",
		maxLevel: 5,
		column: 3, 
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['LC Uber', 'Gligar', 'Misdreavus', 'Scyther', 'Sneasel', 'Tangela', 'Dragon Rage', 'Sonic Boom', 'Swagger'],
		validateSet: (function () {
			var pokemonWithAbility;
			var createAbilityMap = function () {
				var abilityMap = Object.create(null);
				for (var speciesid in Tools.data.Pokedex) {
					var pokemon = Tools.data.Pokedex[speciesid];
					for (var key in pokemon.abilities) {
						var abilityId = toId(pokemon.abilities[key]);
						if (abilityMap[abilityId]) {
							abilityMap[abilityId].push(speciesid);
						} else {
							abilityMap[abilityId] = [speciesid];
						}
					}
				}
				return abilityMap;
			};
			var getPokemonWithAbility = function (ability) {
				if (!pokemonWithAbility) pokemonWithAbility = createAbilityMap();
				return pokemonWithAbility[toId(ability)] || [];
			};
			var restrictedAbilities = {
				'Wonder Guard':1, 'Pure Power':1, 'Huge Power':1,
				'Shadow Tag':1, 'Imposter':1, 'Parental Bond':1
			};
			return function (set, teamHas) {
				var format = this.getFormat('inheritance');
				var problems = [];
				var inheritFailed = [];
				var learnSometimes;
				var isHidden = false;
				var lsetData = {set:set, format:format};
				var name = set.name || set.species;

				var setHas = {};

				if (format.ruleset) {
					for (var i = 0; i < format.ruleset.length; i++) {
						var subformat = this.getFormat(format.ruleset[i]);
						if (subformat.validateSet) {
							problems = problems.concat(subformat.validateSet.call(this, set, format) || []);
						}
					}
				}
				if (problems.length) return problems;

				var originalTemplate = this.getTemplate(set.species);
				item = this.getItem(set.item);
				ability = this.getAbility(set.ability);

				if (!ability.name) return [name + " needs to have an ability."];

				var banlistTable = this.getBanlistTable(format);

				var pokemonPool = getPokemonWithAbility(ability);

				for (var it = 0; it < pokemonPool.length; it++) {
					problems = [];
					learnSometimes = true;
					template = this.getTemplate(pokemonPool[it]);
					if (originalTemplate.species !== template.species) {
						if (template.species === 'Smeargle') {
							problems.push(name + " can't inherit from Smeargle.");
						} else if (ability.name in restrictedAbilities &&
							ability.name !== originalTemplate.abilities['0'] &&
							ability.name !== originalTemplate.abilities['1'] &&
							ability.name !== originalTemplate.abilities['H']) {
							problems.push(name + " can't have " + set.ability + ".");
						}
					}
					var check = template.id;
					var clause = '';
					setHas[check] = true;
					if (banlistTable[check]) {
						clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
						problems.push(set.species + ' is banned' + clause + '.');
					} else if (!this.data.FormatsData[check] || !this.data.FormatsData[check].tier) {
						check = toId(template.baseSpecies);
						if (banlistTable[check]) {
							clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
							problems.push(template.baseSpecies + ' is banned' + clause + '.');
						}
					}

					check = toId(set.ability);
					setHas[check] = true;
					if (banlistTable[check]) {
						clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
						problems.push(name + "'s ability " + set.ability + " is banned" + clause + ".");
					}
					check = toId(set.item);
					setHas[check] = true;
					if (banlistTable[check]) {
						clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
						problems.push(name + "'s item " + set.item + " is banned" + clause + ".");
					}
					if (banlistTable['Unreleased'] && item.isUnreleased) {
						problems.push(name + "'s item " + set.item + " is unreleased.");
					}
					if (banlistTable['Unreleased'] && template.isUnreleased) {
						if (!format.requirePentagon || (template.eggGroups[0] === 'Undiscovered' && !template.evos)) {
							problems.push(name + " (" + template.species + ") is unreleased.");
						}
					}
					setHas[toId(set.ability)] = true;

					if (ability.name === template.abilities['H']) {
						isHidden = true;

						if (template.unreleasedHidden && banlistTable['illegal']) {
							problems.push(name + "'s hidden ability is unreleased.");
						} else if (this.gen === 5 && set.level < 10 && (template.maleOnlyHidden || template.gender === 'N')) {
							problems.push(name + " must be at least level 10 with its hidden ability.");
						}
						if (template.maleOnlyHidden) {
							set.gender = 'M';
							lsetData.sources = ['5D'];
						}
					}

					for (var i = 0; i < set.moves.length; i++) {
						var move = this.getMove(string(set.moves[i]));
						set.moves[i] = move.name;
						check = move.id;
						setHas[check] = true;
						if (banlistTable[check]) {
							clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
							problems.push(name + "'s move " + set.moves[i] + " is banned" + clause + ".");
						}

						if (banlistTable['Unreleased']) {
							if (move.isUnreleased) problems.push(name + "'s move " + set.moves[i] + " is unreleased.");
						}

						var problem = format.checkLearnset.call(this, move, template, lsetData);
						if (problem) {
							var problemString = name + " can't learn " + move.name;
							if (problem.type === 'incompatible') {
								if (isHidden) {
									problemString = problemString.concat(" because it's incompatible with its ability or another move.");
								} else {
									problemString = problemString.concat(" because it's incompatible with another move.");
								}
							} else if (problem.type === 'oversketched') {
								problemString = problemString.concat(" because it can only sketch " + problem.maxSketches + " move" + (problem.maxSketches > 1 ? "s" : "") + ".");
							} else if (problem.type === 'pokebank') {
								problemString = problemString.concat(" because it's only obtainable from a previous generation.");
							} else {
								problemString = problemString.concat(".");
								learnSometimes = false;
							}
							problems.push(problemString);
						}
					}

					if (lsetData.sources && lsetData.sources.length === 1 && !lsetData.sourcesBefore) {
						// we're restricted to a single source
						var source = lsetData.sources[0];
						if (source.substr(1, 1) === 'S') {
							// it's an event
							var eventData = null;
							var splitSource = source.substr(2).split(' ');
							var eventTemplate = this.getTemplate(splitSource[1]);
							if (eventTemplate.eventPokemon) eventData = eventTemplate.eventPokemon[parseInt(splitSource[0], 10)];
							if (eventData) {
								if (eventData.nature && eventData.nature !== set.nature) {
									problems.push(name + " must have a " + eventData.nature + " nature because it has a move only available from a specific event.");
								}
								if (eventData.shiny) {
									set.shiny = true;
								}
								if (eventData.generation < 5) eventData.isHidden = false;
								if (eventData.isHidden !== undefined && eventData.isHidden !== isHidden) {
									problems.push(name + (isHidden ? " can't have" : " must have") + " its hidden ability because it has a move only available from a specific event.");
								}
								if (this.gen <= 5 && eventData.abilities && eventData.abilities.indexOf(ability.id) < 0) {
									problems.push(name + " must have " + eventData.abilities.join(" or ") + " because it has a move only available from a specific event.");
								}
								if (eventData.gender) {
									set.gender = eventData.gender;
								}
								if (eventData.level && set.level < eventData.level) {
									problems.push(name + " must be at least level " + eventData.level + " because it has a move only available from a specific event.");
								}
							}
							isHidden = false;
						}
					}
					if (isHidden && lsetData.sourcesBefore) {
						if (!lsetData.sources && lsetData.sourcesBefore < 5) {
							problems.push(name + " has a hidden ability - it can't have moves only learned before gen 5.");
						} else if (lsetData.sources && template.gender && template.gender !== 'F' && !{'Nidoran-M':1, 'Nidorino':1, 'Nidoking':1, 'Volbeat':1}[template.species]) {
							var compatibleSource = false;
							for (var i = 0, len = lsetData.sources.length; i < len; i++) {
								if (lsetData.sources[i].charAt(1) === 'E' || (lsetData.sources[i].substr(0, 2) === '5D' && set.level >= 10)) {
									compatibleSource = true;
									break;
								}
							}
							if (!compatibleSource) {
								problems.push(name + " has moves incompatible with its hidden ability.");
							}
						}
					}
					if (set.level < template.evoLevel) {
						// FIXME: Event pokemon given at a level under what it normally can be attained at gives a false positive
						problems.push(name + " must be at least level " + template.evoLevel + " to be evolved.");
					}
					if (!lsetData.sources && lsetData.sourcesBefore <= 3 && this.getAbility(set.ability).gen === 4 && !template.prevo && this.gen <= 5) {
						problems.push(name + " has a gen 4 ability and isn't evolved - it can't use anything from gen 3.");
					}
					if (!lsetData.sources && lsetData.sourcesBefore >= 3 && (isHidden || this.gen <= 5) && template.gen <= lsetData.sourcesBefore) {
						var oldAbilities = this.mod('gen' + lsetData.sourcesBefore).getTemplate(template.species).abilities;
						if (ability.name !== oldAbilities['0'] && ability.name !== oldAbilities['1'] && !oldAbilities['H']) {
							problems.push(name + " has moves incompatible with its ability.");
						}
					}

					setHas[toId(template.tier)] = true;
					if (banlistTable[template.tier]) {
						problems.push(name + " is in " + template.tier + ", which is banned.");
					}

					if (teamHas) {
						for (var i in setHas) {
							teamHas[i] = true;
						}
					}
					for (var i = 0; i < format.setBanTable.length; i++) {
						var bannedCombo = true;
						for (var j = 0; j < format.setBanTable[i].length; j++) {
							if (!setHas[format.setBanTable[i][j]]) {
								bannedCombo = false;
								break;
							}
						}
						if (bannedCombo) {
							clause = format.name ? " by " + format.name : '';
							problems.push(name + " has the combination of " + format.setBanTable[i].join(' + ') + ", which is banned" + clause + ".");
						}
					}

					if (!problems.length) {
						if (set.forcedLevel) set.level = set.forcedLevel;
						return false;
					}

					if (learnSometimes) {
						inheritFailed.push({
							species: template.species,
							problems: problems
						});
					}
				}

				switch (inheritFailed.length) {
				case 0:
					return [name + " has an illegal Inheritance set."];
				case 1:
					return [name + " has an illegal set (incompatibility) inherited from " + inheritFailed[0].species].concat(inheritFailed[0].problems);
				case 2:
					return [name + " has an illegal set (incompatibility) inherited either from " + inheritFailed[0].species + " or " + inheritFailed[1].species];
				default:
					return [name + " has an illegal set (incompatibility) inherited from any among " + inheritFailed.map('species')];
				}
			};
		})(),
		checkLearnset: function (move, template, lsetData) {
			move = toId(move);
			template = this.getTemplate(template);

			lsetData = lsetData || {};
			var set = (lsetData.set || (lsetData.set = {}));
			var format = (lsetData.format || (lsetData.format = {}));
			var alreadyChecked = {};
			var level = set.level || 100;

			var isHidden = false;
			if (set.ability && this.getAbility(set.ability).name === template.abilities['H']) isHidden = true;
			var incompatibleHidden = false;

			var limit1 = true;
			var sketch = false;
			var blockedHM = false;

			var sometimesPossible = false; // is this move in the learnset at all?

			// This is a pretty complicated algorithm

			// Abstractly, what it does is construct the union of sets of all
			// possible ways this pokemon could be obtained, and then intersect
			// it with a the pokemon's existing set of all possible ways it could
			// be obtained. If this intersection is non-empty, the move is legal.

			// We apply several optimizations to this algorithm. The most
			// important is that with, for instance, a TM move, that Pokemon
			// could have been obtained from any gen at or before that TM's gen.
			// Instead of adding every possible source before or during that gen,
			// we keep track of a maximum gen variable, intended to mean "any
			// source at or before this gen is possible."

			// set of possible sources of a pokemon with this move, represented as an array
			var sources = [];
			// the equivalent of adding "every source at or before this gen" to sources
			var sourcesBefore = 0;
			var noPastGen = !!format.requirePentagon;
			// since Gen 3, Pokemon cannot be traded to past generations
			var noFutureGen = this.gen >= 3 ? true : !!(format.banlistTable && format.banlistTable['tradeback']);

			do {
				alreadyChecked[template.speciesid] = true;
				if (lsetData.ignoreMoveType && this.getMove(move).type === lsetData.ignoreMoveType) return false;
				if (template.learnset) {
					if (template.learnset[move] || template.learnset['sketch']) {
						sometimesPossible = true;
						var lset = template.learnset[move];
						if (!lset || template.speciesid === 'smeargle') {
							lset = template.learnset['sketch'];
							sketch = true;
							// Chatter, Struggle and Magikarp's Revenge cannot be sketched
							if (move in {'chatter':1, 'struggle':1, 'magikarpsrevenge':1}) return true;
						}
						if (typeof lset === 'string') lset = [lset];

						for (var i = 0, len = lset.length; i < len; i++) {
							var learned = lset[i];
							if (noPastGen && learned.charAt(0) !== '6') continue;
							if (noFutureGen && parseInt(learned.charAt(0), 10) > this.gen) continue;
							if (learned.charAt(0) !== '6' && isHidden && !this.mod('gen' + learned.charAt(0)).getTemplate(template.species).abilities['H']) {
								// check if the Pokemon's hidden ability was available
								incompatibleHidden = true;
								continue;
							}
							if (!template.isNonstandard) {
								// HMs can't be transferred
								if (this.gen >= 4 && learned.charAt(0) <= 3 && move in {'cut':1, 'fly':1, 'surf':1, 'strength':1, 'flash':1, 'rocksmash':1, 'waterfall':1, 'dive':1}) continue;
								if (this.gen >= 5 && learned.charAt(0) <= 4 && move in {'cut':1, 'fly':1, 'surf':1, 'strength':1, 'rocksmash':1, 'waterfall':1, 'rockclimb':1}) continue;
								// Defog and Whirlpool can't be transferred together
								if (this.gen >= 5 && move in {'defog':1, 'whirlpool':1} && learned.charAt(0) <= 4) blockedHM = true;
							}
							if (learned.substr(0, 2) in {'4L':1, '5L':1, '6L':1}) {
								// gen 4-6 level-up moves
								if (level >= parseInt(learned.substr(2), 10)) {
									// we're past the required level to learn it
									return false;
								}
								if (!template.gender || template.gender === 'F') {
									// available as egg move
									learned = learned.charAt(0) + 'Eany';
								} else {
									// this move is unavailable, skip it
									continue;
								}
							}
							if (learned.charAt(1) in {L:1, M:1, T:1}) {
								if (learned.charAt(0) === '6') {
									// current-gen TM or tutor moves:
									//   always available
									return false;
								}
								// past-gen level-up, TM, or tutor moves:
								//   available as long as the source gen was or was before this gen
								limit1 = false;
								sourcesBefore = Math.max(sourcesBefore, parseInt(learned.charAt(0), 10));
							} else if (learned.charAt(1) in {E:1, S:1, D:1}) {
								// egg, event, or DW moves:
								//   only if that was the source
								if (learned.charAt(1) === 'E') {
									// it's an egg move, so we add each pokemon that can be bred with to its sources
									if (learned.charAt(0) === '6') {
										// gen 6 doesn't have egg move incompatibilities except for certain cases with baby Pokemon
										learned = '6E' + (template.prevo ? template.id : '');
										sources.push(learned);
										continue;
									}
									var eggGroups = template.eggGroups;
									if (!eggGroups) continue;
									if (eggGroups[0] === 'Undiscovered') eggGroups = this.getTemplate(template.evos[0]).eggGroups;
									var atLeastOne = false;
									var fromSelf = (learned.substr(1) === 'Eany');
									learned = learned.substr(0, 2);
									for (var templateid in this.data.Pokedex) {
										var dexEntry = this.getTemplate(templateid);
										if (
											// CAP pokemon can't breed
											!dexEntry.isNonstandard &&
											// can't breed mons from future gens
											dexEntry.gen <= parseInt(learned.charAt(0), 10) &&
											// genderless pokemon can't pass egg moves
											(dexEntry.gender !== 'N' || this.gen <= 1 && dexEntry.gen <= 1)) {
											if (
												// chainbreeding
												fromSelf ||
												// otherwise parent must be able to learn the move
												!alreadyChecked[dexEntry.speciesid] && dexEntry.learnset && (dexEntry.learnset[move] || dexEntry.learnset['sketch'])) {
												if (dexEntry.eggGroups.intersect(eggGroups).length) {
													// we can breed with it
													atLeastOne = true;
													sources.push(learned + dexEntry.id);
												}
											}
										}
									}
									// chainbreeding with itself from earlier gen
									if (!atLeastOne) sources.push(learned + template.id);
									// Egg move tradeback for gens 1 and 2.
									if (!noFutureGen) sourcesBefore = Math.max(sourcesBefore, parseInt(learned.charAt(0), 10));
								} else if (learned.charAt(1) === 'S') {
									// Event Pokémon:
									//	Available as long as the past gen can get the Pokémon and then trade it back.
									sources.push(learned + ' ' + template.id);
									if (!noFutureGen) sourcesBefore = Math.max(sourcesBefore, parseInt(learned.charAt(0), 10));
								} else {
									// DW Pokemon are at level 10 or at the evolution level
									var minLevel = (template.evoLevel && template.evoLevel > 10) ? template.evoLevel : 10;
									if (set.level < minLevel) continue;
									sources.push(learned);
								}
							}
						}
					}
					if (format.mimicGlitch && template.gen < 5) {
						// include the Mimic Glitch when checking this mon's learnset
						var glitchMoves = {metronome:1, copycat:1, transform:1, mimic:1, assist:1};
						var getGlitch = false;
						for (var i in glitchMoves) {
							if (template.learnset[i]) {
								if (!(i === 'mimic' && this.getAbility(set.ability).gen === 4 && !template.prevo)) {
									getGlitch = true;
									break;
								}
							}
						}
						if (getGlitch) {
							sourcesBefore = Math.max(sourcesBefore, 4);
							if (this.getMove(move).gen < 5) {
								limit1 = false;
							}
						}
					}
				}
				// also check to see if the mon's prevo or freely switchable formes can learn this move
				if (!template.learnset && template.baseSpecies !== template.species) {
					// forme takes precedence over prevo only if forme has no learnset
					template = this.getTemplate(template.baseSpecies);
				} else if (template.prevo) {
					template = this.getTemplate(template.prevo);
					if (template.gen > Math.max(2, this.gen)) template = null;
				} else if (template.baseSpecies !== template.species && template.baseSpecies !== 'Kyurem' && template.baseSpecies !== 'Pikachu') {
					template = this.getTemplate(template.baseSpecies);
				} else {
					template = null;
				}
			} while (template && template.species && !alreadyChecked[template.speciesid]);

			if (limit1 && sketch) {
				// limit 1 sketch move
				if (lsetData.sketchMove) {
					return {type:'oversketched', maxSketches: 1};
				}
				lsetData.sketchMove = move;
			}

			// Now that we have our list of possible sources, intersect it with the current list
			if (!sourcesBefore && !sources.length) {
				if (noPastGen && sometimesPossible) return {type:'pokebank'};
				if (incompatibleHidden) return {type:'incompatible'};
				return true;
			}
			if (!sources.length) sources = null;
			if (sourcesBefore || lsetData.sourcesBefore) {
				// having sourcesBefore is the equivalent of having everything before that gen
				// in sources, so we fill the other array in preparation for intersection
				var learned;
				if (sourcesBefore && lsetData.sources) {
					if (!sources) sources = [];
					for (var i = 0, len = lsetData.sources.length; i < len; i++) {
						learned = lsetData.sources[i];
						if (parseInt(learned.substr(0, 1), 10) <= sourcesBefore) {
							sources.push(learned);
						}
					}
					if (!lsetData.sourcesBefore) sourcesBefore = 0;
				}
				if (lsetData.sourcesBefore && sources) {
					if (!lsetData.sources) lsetData.sources = [];
					for (var i = 0, len = sources.length; i < len; i++) {
						learned = sources[i];
						if (parseInt(learned.substr(0, 1), 10) <= lsetData.sourcesBefore) {
							lsetData.sources.push(learned);
						}
					}
					if (!sourcesBefore) delete lsetData.sourcesBefore;
				}
			}
			if (sources) {
				if (lsetData.sources) {
					var intersectSources = lsetData.sources.intersect(sources);
					if (!intersectSources.length && !(sourcesBefore && lsetData.sourcesBefore)) {
						return {type:'incompatible'};
					}
					lsetData.sources = intersectSources;
				} else {
					lsetData.sources = sources.unique();
				}
			}

			if (sourcesBefore) {
				lsetData.sourcesBefore = Math.min(sourcesBefore, lsetData.sourcesBefore || 6);
			}

			return false;
		}
	},
	{
		name: "Inheritance",
		section: "GoonServer Metas",
		column: 3,
		ruleset: ['Pokemon', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause', 'Sleep Clause Mod', 'Cancel Mod'],
		banlist: ['Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite',
			'Gengar-Mega', 'Kangaskhan-Mega', 'Mewtwo', 'Lugia', 'Ho-Oh', 'Blaziken', 'Mawile-Mega', 'Salamence-Mega',
			'Kyogre', 'Groudon', 'Rayquaza', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Lucario-Mega',
			'Dialga', 'Palkia', 'Giratina', 'Giratina-Origin', 'Darkrai', 'Shaymin-Sky', 'Arceus', 'Reshiram', 'Zekrom',
			'Kyurem-White', 'Genesect', 'Greninja', 'Aegislash', 'Xerneas', 'Yveltal',
			'Slaking', 'Regigigas', 'Shedinja', 'Kyurem-Black'
		],
		validateSet: (function () {
			var pokemonWithAbility;
			var createAbilityMap = function () {
				var abilityMap = Object.create(null);
				for (var speciesid in Tools.data.Pokedex) {
					var pokemon = Tools.data.Pokedex[speciesid];
					for (var key in pokemon.abilities) {
						var abilityId = toId(pokemon.abilities[key]);
						if (abilityMap[abilityId]) {
							abilityMap[abilityId].push(speciesid);
						} else {
							abilityMap[abilityId] = [speciesid];
						}
					}
				}
				return abilityMap;
			};
			var getPokemonWithAbility = function (ability) {
				if (!pokemonWithAbility) pokemonWithAbility = createAbilityMap();
				return pokemonWithAbility[toId(ability)] || [];
			};
			var restrictedAbilities = {
				'Wonder Guard':1, 'Pure Power':1, 'Huge Power':1,
				'Shadow Tag':1, 'Imposter':1, 'Parental Bond':1
			};
			return function (set, teamHas) {
				var format = this.getFormat('inheritance');
				var problems = [];
				var inheritFailed = [];
				var learnSometimes;
				var isHidden = false;
				var lsetData = {set:set, format:format};
				var name = set.name || set.species;

				var setHas = {};

				if (format.ruleset) {
					for (var i = 0; i < format.ruleset.length; i++) {
						var subformat = this.getFormat(format.ruleset[i]);
						if (subformat.validateSet) {
							problems = problems.concat(subformat.validateSet.call(this, set, format) || []);
						}
					}
				}
				if (problems.length) return problems;

				var originalTemplate = this.getTemplate(set.species);
				item = this.getItem(set.item);
				ability = this.getAbility(set.ability);

				if (!ability.name) return [name + " needs to have an ability."];

				var banlistTable = this.getBanlistTable(format);

				var pokemonPool = getPokemonWithAbility(ability);

				for (var it = 0; it < pokemonPool.length; it++) {
					problems = [];
					learnSometimes = true;
					template = this.getTemplate(pokemonPool[it]);
					if (originalTemplate.species !== template.species) {
						if (template.species === 'Smeargle') {
							problems.push(name + " can't inherit from Smeargle.");
						} else if (ability.name in restrictedAbilities &&
							ability.name !== originalTemplate.abilities['0'] &&
							ability.name !== originalTemplate.abilities['1'] &&
							ability.name !== originalTemplate.abilities['H']) {
							problems.push(name + " can't have " + set.ability + ".");
						}
					}
					var check = template.id;
					var clause = '';
					setHas[check] = true;
					if (banlistTable[check]) {
						clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
						problems.push(set.species + ' is banned' + clause + '.');
					} else if (!this.data.FormatsData[check] || !this.data.FormatsData[check].tier) {
						check = toId(template.baseSpecies);
						if (banlistTable[check]) {
							clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
							problems.push(template.baseSpecies + ' is banned' + clause + '.');
						}
					}

					check = toId(set.ability);
					setHas[check] = true;
					if (banlistTable[check]) {
						clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
						problems.push(name + "'s ability " + set.ability + " is banned" + clause + ".");
					}
					check = toId(set.item);
					setHas[check] = true;
					if (banlistTable[check]) {
						clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
						problems.push(name + "'s item " + set.item + " is banned" + clause + ".");
					}
					if (banlistTable['Unreleased'] && item.isUnreleased) {
						problems.push(name + "'s item " + set.item + " is unreleased.");
					}
					if (banlistTable['Unreleased'] && template.isUnreleased) {
						if (!format.requirePentagon || (template.eggGroups[0] === 'Undiscovered' && !template.evos)) {
							problems.push(name + " (" + template.species + ") is unreleased.");
						}
					}
					setHas[toId(set.ability)] = true;

					if (ability.name === template.abilities['H']) {
						isHidden = true;

						if (template.unreleasedHidden && banlistTable['illegal']) {
							problems.push(name + "'s hidden ability is unreleased.");
						} else if (this.gen === 5 && set.level < 10 && (template.maleOnlyHidden || template.gender === 'N')) {
							problems.push(name + " must be at least level 10 with its hidden ability.");
						}
						if (template.maleOnlyHidden) {
							set.gender = 'M';
							lsetData.sources = ['5D'];
						}
					}

					for (var i = 0; i < set.moves.length; i++) {
						var move = this.getMove(string(set.moves[i]));
						set.moves[i] = move.name;
						check = move.id;
						setHas[check] = true;
						if (banlistTable[check]) {
							clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
							problems.push(name + "'s move " + set.moves[i] + " is banned" + clause + ".");
						}

						if (banlistTable['Unreleased']) {
							if (move.isUnreleased) problems.push(name + "'s move " + set.moves[i] + " is unreleased.");
						}

						var problem = format.checkLearnset.call(this, move, template, lsetData);
						if (problem) {
							var problemString = name + " can't learn " + move.name;
							if (problem.type === 'incompatible') {
								if (isHidden) {
									problemString = problemString.concat(" because it's incompatible with its ability or another move.");
								} else {
									problemString = problemString.concat(" because it's incompatible with another move.");
								}
							} else if (problem.type === 'oversketched') {
								problemString = problemString.concat(" because it can only sketch " + problem.maxSketches + " move" + (problem.maxSketches > 1 ? "s" : "") + ".");
							} else if (problem.type === 'pokebank') {
								problemString = problemString.concat(" because it's only obtainable from a previous generation.");
							} else {
								problemString = problemString.concat(".");
								learnSometimes = false;
							}
							problems.push(problemString);
						}
					}

					if (lsetData.sources && lsetData.sources.length === 1 && !lsetData.sourcesBefore) {
						// we're restricted to a single source
						var source = lsetData.sources[0];
						if (source.substr(1, 1) === 'S') {
							// it's an event
							var eventData = null;
							var splitSource = source.substr(2).split(' ');
							var eventTemplate = this.getTemplate(splitSource[1]);
							if (eventTemplate.eventPokemon) eventData = eventTemplate.eventPokemon[parseInt(splitSource[0], 10)];
							if (eventData) {
								if (eventData.nature && eventData.nature !== set.nature) {
									problems.push(name + " must have a " + eventData.nature + " nature because it has a move only available from a specific event.");
								}
								if (eventData.shiny) {
									set.shiny = true;
								}
								if (eventData.generation < 5) eventData.isHidden = false;
								if (eventData.isHidden !== undefined && eventData.isHidden !== isHidden) {
									problems.push(name + (isHidden ? " can't have" : " must have") + " its hidden ability because it has a move only available from a specific event.");
								}
								if (this.gen <= 5 && eventData.abilities && eventData.abilities.indexOf(ability.id) < 0) {
									problems.push(name + " must have " + eventData.abilities.join(" or ") + " because it has a move only available from a specific event.");
								}
								if (eventData.gender) {
									set.gender = eventData.gender;
								}
								if (eventData.level && set.level < eventData.level) {
									problems.push(name + " must be at least level " + eventData.level + " because it has a move only available from a specific event.");
								}
							}
							isHidden = false;
						}
					}
					if (isHidden && lsetData.sourcesBefore) {
						if (!lsetData.sources && lsetData.sourcesBefore < 5) {
							problems.push(name + " has a hidden ability - it can't have moves only learned before gen 5.");
						} else if (lsetData.sources && template.gender && template.gender !== 'F' && !{'Nidoran-M':1, 'Nidorino':1, 'Nidoking':1, 'Volbeat':1}[template.species]) {
							var compatibleSource = false;
							for (var i = 0, len = lsetData.sources.length; i < len; i++) {
								if (lsetData.sources[i].charAt(1) === 'E' || (lsetData.sources[i].substr(0, 2) === '5D' && set.level >= 10)) {
									compatibleSource = true;
									break;
								}
							}
							if (!compatibleSource) {
								problems.push(name + " has moves incompatible with its hidden ability.");
							}
						}
					}
					if (set.level < template.evoLevel) {
						// FIXME: Event pokemon given at a level under what it normally can be attained at gives a false positive
						problems.push(name + " must be at least level " + template.evoLevel + " to be evolved.");
					}
					if (!lsetData.sources && lsetData.sourcesBefore <= 3 && this.getAbility(set.ability).gen === 4 && !template.prevo && this.gen <= 5) {
						problems.push(name + " has a gen 4 ability and isn't evolved - it can't use anything from gen 3.");
					}
					if (!lsetData.sources && lsetData.sourcesBefore >= 3 && (isHidden || this.gen <= 5) && template.gen <= lsetData.sourcesBefore) {
						var oldAbilities = this.mod('gen' + lsetData.sourcesBefore).getTemplate(template.species).abilities;
						if (ability.name !== oldAbilities['0'] && ability.name !== oldAbilities['1'] && !oldAbilities['H']) {
							problems.push(name + " has moves incompatible with its ability.");
						}
					}

					setHas[toId(template.tier)] = true;
					if (banlistTable[template.tier]) {
						problems.push(name + " is in " + template.tier + ", which is banned.");
					}

					if (teamHas) {
						for (var i in setHas) {
							teamHas[i] = true;
						}
					}
					for (var i = 0; i < format.setBanTable.length; i++) {
						var bannedCombo = true;
						for (var j = 0; j < format.setBanTable[i].length; j++) {
							if (!setHas[format.setBanTable[i][j]]) {
								bannedCombo = false;
								break;
							}
						}
						if (bannedCombo) {
							clause = format.name ? " by " + format.name : '';
							problems.push(name + " has the combination of " + format.setBanTable[i].join(' + ') + ", which is banned" + clause + ".");
						}
					}

					if (!problems.length) {
						if (set.forcedLevel) set.level = set.forcedLevel;
						return false;
					}

					if (learnSometimes) {
						inheritFailed.push({
							species: template.species,
							problems: problems
						});
					}
				}

				switch (inheritFailed.length) {
				case 0:
					return [name + " has an illegal Inheritance set."];
				case 1:
					return [name + " has an illegal set (incompatibility) inherited from " + inheritFailed[0].species].concat(inheritFailed[0].problems);
				case 2:
					return [name + " has an illegal set (incompatibility) inherited either from " + inheritFailed[0].species + " or " + inheritFailed[1].species];
				default:
					return [name + " has an illegal set (incompatibility) inherited from any among " + inheritFailed.map('species')];
				}
			};
		})(),
		checkLearnset: function (move, template, lsetData) {
			move = toId(move);
			template = this.getTemplate(template);

			lsetData = lsetData || {};
			var set = (lsetData.set || (lsetData.set = {}));
			var format = (lsetData.format || (lsetData.format = {}));
			var alreadyChecked = {};
			var level = set.level || 100;

			var isHidden = false;
			if (set.ability && this.getAbility(set.ability).name === template.abilities['H']) isHidden = true;
			var incompatibleHidden = false;

			var limit1 = true;
			var sketch = false;
			var blockedHM = false;

			var sometimesPossible = false; // is this move in the learnset at all?

			// This is a pretty complicated algorithm

			// Abstractly, what it does is construct the union of sets of all
			// possible ways this pokemon could be obtained, and then intersect
			// it with a the pokemon's existing set of all possible ways it could
			// be obtained. If this intersection is non-empty, the move is legal.

			// We apply several optimizations to this algorithm. The most
			// important is that with, for instance, a TM move, that Pokemon
			// could have been obtained from any gen at or before that TM's gen.
			// Instead of adding every possible source before or during that gen,
			// we keep track of a maximum gen variable, intended to mean "any
			// source at or before this gen is possible."

			// set of possible sources of a pokemon with this move, represented as an array
			var sources = [];
			// the equivalent of adding "every source at or before this gen" to sources
			var sourcesBefore = 0;
			var noPastGen = !!format.requirePentagon;
			// since Gen 3, Pokemon cannot be traded to past generations
			var noFutureGen = this.gen >= 3 ? true : !!(format.banlistTable && format.banlistTable['tradeback']);

			do {
				alreadyChecked[template.speciesid] = true;
				if (lsetData.ignoreMoveType && this.getMove(move).type === lsetData.ignoreMoveType) return false;
				if (template.learnset) {
					if (template.learnset[move] || template.learnset['sketch']) {
						sometimesPossible = true;
						var lset = template.learnset[move];
						if (!lset || template.speciesid === 'smeargle') {
							lset = template.learnset['sketch'];
							sketch = true;
							// Chatter, Struggle and Magikarp's Revenge cannot be sketched
							if (move in {'chatter':1, 'struggle':1, 'magikarpsrevenge':1}) return true;
						}
						if (typeof lset === 'string') lset = [lset];

						for (var i = 0, len = lset.length; i < len; i++) {
							var learned = lset[i];
							if (noPastGen && learned.charAt(0) !== '6') continue;
							if (noFutureGen && parseInt(learned.charAt(0), 10) > this.gen) continue;
							if (learned.charAt(0) !== '6' && isHidden && !this.mod('gen' + learned.charAt(0)).getTemplate(template.species).abilities['H']) {
								// check if the Pokemon's hidden ability was available
								incompatibleHidden = true;
								continue;
							}
							if (!template.isNonstandard) {
								// HMs can't be transferred
								if (this.gen >= 4 && learned.charAt(0) <= 3 && move in {'cut':1, 'fly':1, 'surf':1, 'strength':1, 'flash':1, 'rocksmash':1, 'waterfall':1, 'dive':1}) continue;
								if (this.gen >= 5 && learned.charAt(0) <= 4 && move in {'cut':1, 'fly':1, 'surf':1, 'strength':1, 'rocksmash':1, 'waterfall':1, 'rockclimb':1}) continue;
								// Defog and Whirlpool can't be transferred together
								if (this.gen >= 5 && move in {'defog':1, 'whirlpool':1} && learned.charAt(0) <= 4) blockedHM = true;
							}
							if (learned.substr(0, 2) in {'4L':1, '5L':1, '6L':1}) {
								// gen 4-6 level-up moves
								if (level >= parseInt(learned.substr(2), 10)) {
									// we're past the required level to learn it
									return false;
								}
								if (!template.gender || template.gender === 'F') {
									// available as egg move
									learned = learned.charAt(0) + 'Eany';
								} else {
									// this move is unavailable, skip it
									continue;
								}
							}
							if (learned.charAt(1) in {L:1, M:1, T:1}) {
								if (learned.charAt(0) === '6') {
									// current-gen TM or tutor moves:
									//   always available
									return false;
								}
								// past-gen level-up, TM, or tutor moves:
								//   available as long as the source gen was or was before this gen
								limit1 = false;
								sourcesBefore = Math.max(sourcesBefore, parseInt(learned.charAt(0), 10));
							} else if (learned.charAt(1) in {E:1, S:1, D:1}) {
								// egg, event, or DW moves:
								//   only if that was the source
								if (learned.charAt(1) === 'E') {
									// it's an egg move, so we add each pokemon that can be bred with to its sources
									if (learned.charAt(0) === '6') {
										// gen 6 doesn't have egg move incompatibilities except for certain cases with baby Pokemon
										learned = '6E' + (template.prevo ? template.id : '');
										sources.push(learned);
										continue;
									}
									var eggGroups = template.eggGroups;
									if (!eggGroups) continue;
									if (eggGroups[0] === 'Undiscovered') eggGroups = this.getTemplate(template.evos[0]).eggGroups;
									var atLeastOne = false;
									var fromSelf = (learned.substr(1) === 'Eany');
									learned = learned.substr(0, 2);
									for (var templateid in this.data.Pokedex) {
										var dexEntry = this.getTemplate(templateid);
										if (
											// CAP pokemon can't breed
											!dexEntry.isNonstandard &&
											// can't breed mons from future gens
											dexEntry.gen <= parseInt(learned.charAt(0), 10) &&
											// genderless pokemon can't pass egg moves
											(dexEntry.gender !== 'N' || this.gen <= 1 && dexEntry.gen <= 1)) {
											if (
												// chainbreeding
												fromSelf ||
												// otherwise parent must be able to learn the move
												!alreadyChecked[dexEntry.speciesid] && dexEntry.learnset && (dexEntry.learnset[move] || dexEntry.learnset['sketch'])) {
												if (dexEntry.eggGroups.intersect(eggGroups).length) {
													// we can breed with it
													atLeastOne = true;
													sources.push(learned + dexEntry.id);
												}
											}
										}
									}
									// chainbreeding with itself from earlier gen
									if (!atLeastOne) sources.push(learned + template.id);
									// Egg move tradeback for gens 1 and 2.
									if (!noFutureGen) sourcesBefore = Math.max(sourcesBefore, parseInt(learned.charAt(0), 10));
								} else if (learned.charAt(1) === 'S') {
									// Event Pokémon:
									//	Available as long as the past gen can get the Pokémon and then trade it back.
									sources.push(learned + ' ' + template.id);
									if (!noFutureGen) sourcesBefore = Math.max(sourcesBefore, parseInt(learned.charAt(0), 10));
								} else {
									// DW Pokemon are at level 10 or at the evolution level
									var minLevel = (template.evoLevel && template.evoLevel > 10) ? template.evoLevel : 10;
									if (set.level < minLevel) continue;
									sources.push(learned);
								}
							}
						}
					}
					if (format.mimicGlitch && template.gen < 5) {
						// include the Mimic Glitch when checking this mon's learnset
						var glitchMoves = {metronome:1, copycat:1, transform:1, mimic:1, assist:1};
						var getGlitch = false;
						for (var i in glitchMoves) {
							if (template.learnset[i]) {
								if (!(i === 'mimic' && this.getAbility(set.ability).gen === 4 && !template.prevo)) {
									getGlitch = true;
									break;
								}
							}
						}
						if (getGlitch) {
							sourcesBefore = Math.max(sourcesBefore, 4);
							if (this.getMove(move).gen < 5) {
								limit1 = false;
							}
						}
					}
				}
				// also check to see if the mon's prevo or freely switchable formes can learn this move
				if (!template.learnset && template.baseSpecies !== template.species) {
					// forme takes precedence over prevo only if forme has no learnset
					template = this.getTemplate(template.baseSpecies);
				} else if (template.prevo) {
					template = this.getTemplate(template.prevo);
					if (template.gen > Math.max(2, this.gen)) template = null;
				} else if (template.baseSpecies !== template.species && template.baseSpecies !== 'Kyurem' && template.baseSpecies !== 'Pikachu') {
					template = this.getTemplate(template.baseSpecies);
				} else {
					template = null;
				}
			} while (template && template.species && !alreadyChecked[template.speciesid]);

			if (limit1 && sketch) {
				// limit 1 sketch move
				if (lsetData.sketchMove) {
					return {type:'oversketched', maxSketches: 1};
				}
				lsetData.sketchMove = move;
			}

			// Now that we have our list of possible sources, intersect it with the current list
			if (!sourcesBefore && !sources.length) {
				if (noPastGen && sometimesPossible) return {type:'pokebank'};
				if (incompatibleHidden) return {type:'incompatible'};
				return true;
			}
			if (!sources.length) sources = null;
			if (sourcesBefore || lsetData.sourcesBefore) {
				// having sourcesBefore is the equivalent of having everything before that gen
				// in sources, so we fill the other array in preparation for intersection
				var learned;
				if (sourcesBefore && lsetData.sources) {
					if (!sources) sources = [];
					for (var i = 0, len = lsetData.sources.length; i < len; i++) {
						learned = lsetData.sources[i];
						if (parseInt(learned.substr(0, 1), 10) <= sourcesBefore) {
							sources.push(learned);
						}
					}
					if (!lsetData.sourcesBefore) sourcesBefore = 0;
				}
				if (lsetData.sourcesBefore && sources) {
					if (!lsetData.sources) lsetData.sources = [];
					for (var i = 0, len = sources.length; i < len; i++) {
						learned = sources[i];
						if (parseInt(learned.substr(0, 1), 10) <= lsetData.sourcesBefore) {
							lsetData.sources.push(learned);
						}
					}
					if (!sourcesBefore) delete lsetData.sourcesBefore;
				}
			}
			if (sources) {
				if (lsetData.sources) {
					var intersectSources = lsetData.sources.intersect(sources);
					if (!intersectSources.length && !(sourcesBefore && lsetData.sourcesBefore)) {
						return {type:'incompatible'};
					}
					lsetData.sources = intersectSources;
				} else {
					lsetData.sources = sources.unique();
				}
			}

			if (sourcesBefore) {
				lsetData.sourcesBefore = Math.min(sourcesBefore, lsetData.sourcesBefore || 6);
			}

			return false;
		}
	},
	{
		name: "Prioritymons",
		section: "GoonServer Metas",
		column: 3,
		desc: ["&bullet; Prioritymons: In this metagame, the move in the user's first slot will have 1 additional priority. (ie, Extreme Speed in the first slot has +3 priority instead of +2)"],
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite'],
		onModifyMove: function (move, pokemon) {
			var move = this.getMove(pokemon.moveset[0].move);
			move.priority = (move.priority)+1;
		},
	},
	{
		name: "Base Power Damage",
		section: "GoonServer Metas",
		column: 3,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite'],
		onModifyMove: function (move, pokemon) {
				move.damage = move.basePower;
				move.basePower = 0;
				/* this part doesn't work
				if (move.type === pokemon.types) {
					move.damage = move.damage * 1.5;
				}
				*/
		},
	},
       {
                name: "Mix and Mega",
                section: "Mix and Mega Stuff",
                column: 3,
                mod: 'mixandmega', //Forcibly prevent Knock Off + Trick
                ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Team Preview'],
                banlist: ['Shadow Tag', 'Gengarite'],
                validateTeam: function (team, format) {
                        var itemTable = {};
                        for (var i = 0; i < team.length; i++) {
                                var item = this.getItem(team[i].item);
                                if (!item) continue;
                                if (itemTable[item] && item.megaStone) {
                                        return ["You are limited to one of each Mega Stone.", "(You have more than one " + this.getItem(item).name + ")"];
                                } else if (itemTable[item] && (item.id === "redorb" || item.name === "blueorb")) {
                                        return ["You are limited to one of each Primal Orb.", "(You have more than one " + this.getItem(item).name + ")"];
                                }
                                itemTable[item] = true;
                        }
                },
                onBegin: function () {
                        var allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
                        for (var i = 0, len = allPokemon.length; i < len; i++) {
                                var pokemon = allPokemon[i];
                                pokemon.baseSpecies = pokemon.baseTemplate.species; //Storage
                        }
                },
                //Prepare Mega-Evolutions/Devolutions
                onSwitchInPriority: -6,
                onSwitchIn: function (pokemon) {
                        if (!pokemon.template.isMega && !pokemon.template.isPrimal && !pokemon.canMegaEvo) {
                                if (!pokemon.baseStatStorage) pokemon.baseStatStorage = {atk: pokemon.baseTemplate.baseStats.atk, def: pokemon.baseTemplate.baseStats.def, spa: pokemon.baseTemplate.baseStats.spa, spd: pokemon.baseTemplate.baseStats.spd, spe: pokemon.baseTemplate.baseStats.spe};
                                if (!pokemon.typeStorage) pokemon.typeStorage = [pokemon.baseTemplate.types[0]];
                                if (pokemon.baseTemplate.types[1]) pokemon.typeStorage[1] = pokemon.baseTemplate.types[1];
                                if (!pokemon.weightStorage) pokemon.weightStorage = pokemon.baseTemplate.weightkg;
                                var megaEvo = false;
                                var item = (pokemon.item) ? this.getItem(pokemon.item) : false;
                                var spec = pokemon.baseTemplate.species;
                               
                                //Primal Devolution
                                if (item && (item.id === 'redorb' || item.id === 'blueorb')) {
                                        //If you're an uber or uber-like Pokemon, don't [Gdon + Ogre will work as normal due to items.js]
                                        if (pokemon.baseTemplate.tier !== 'Uber' && spec !== 'Kyurem-Black' && spec !== 'Slaking' && spec !== 'Regigigas' && spec !== 'Cresselia' && !(pokemon.baseTemplate.evos && pokemon.baseTemplate.evos[0])) {
                                                var pstr = (item.id === 'redorb') ? 'Groudon-Primal' : 'Kyogre-Primal';
                                                var template = this.getTemplate(pstr);
                                                pokemon.formeChange(template);
                                                pokemon.baseTemplate = template;
                                                pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
                                                this.add('detailschange', pokemon, pokemon.details);
                                                this.add('message', pokemon.name + "'s Primal Reversion! It reverted to its primal form!");
                                                pokemon.setAbility(template.abilities['0']);
                                                pokemon.baseAbility = pokemon.ability;
                                        }
                                }
                               
                                //Mega Evolution
                                //If you're an uber, don't.
                                if (pokemon.baseTemplate.tier === 'Uber' && (spec !== 'Mewtwo' || (item.id !== 'mewtwonitex' && item.id !== 'mewtwonitey'))) return pokemon.canMegaEvo = false;
                                //If you don't have a mega stone, you can't mega-evolve, except if you have Dragon Ascent.
                                if ((!item || !item.megaStone) && pokemon.moves.indexOf('dragonascent') === -1) return pokemon.canMegaEvo = false;
                                if (item && item.megaStone) megaEvo = item.megaStone;
                                //Mega stones have priority over Rayquaza-Mega.
                                if (!megaEvo && pokemon.moves.indexOf('dragonascent') > -1 && spec !== 'Rayquaza') megaEvo = 'Rayquaza-Mega'; //Prevent Rayquaza from Mega Evolving, but allow Smeargle to Mega-Evolve
                                //If you aren't fully evolved, due to flavor reasons, you can't mega-evolve regardless.
                                //I feel bad about this too, Mega-Pikachu would've been sick [Albeit Light Ball Pikachu still would be better]
                                if (pokemon.baseTemplate.evos && pokemon.baseTemplate.evos[0]) return pokemon.canMegaEvo = false;
                                var ab = [pokemon.baseTemplate.abilities[0], pokemon.baseTemplate.abilities[1], pokemon.baseTemplate.abilities['H']];
                               
                                //Species-Based Mega-Evolutions
                                if (spec === 'Kyurem-Black' || spec === 'Slaking' || spec === 'Regigigas' || spec === 'Cresselia') return pokemon.canMegaEvo = false;
                                if (item.id === 'beedrillite' && spec !== 'Beedrill') return pokemon.canMegaEvo = false;
                                if (item.id === 'kangaskhanite' && spec !== 'Kangaskhan') return pokemon.canMegaEvo = false;
                                //Ability-Based Mega-Evolutions
                                if (item.id === 'medichamite' && spec !== 'Medicham' && spec !== 'Mawile' && ab.indexOf('Huge Power') === -1 && ab.indexOf('Pure Power') === -1) return pokemon.canMegaEvo = false;
                                if (item.id === 'mawilite' && spec !== 'Mawile' && ab.indexOf('Huge Power') === -1 && ab.indexOf('Pure Power') === -1) return pokemon.canMegaEvo = false;
                                if (item.id === 'gengarite' && spec !== 'Gengar' && ab.indexOf('Shadow Tag') === -1) return pokemon.canMegaEvo = false;
                                if (item.id === 'blazikenite' && spec !== 'Blaziken' && ab.indexOf('Speed Boost') === -1) return pokemon.canMegaEvo = false;
                                //Stat-based Mega-Evolutions
                                if ((item.id === 'ampharosite' || item.id === 'heracronite' || item.id === 'garchompite') && pokemon.baseStatStorage.spe < 10) return pokemon.canMegaEvo = false;
                                if (item.id === 'cameruptite' && pokemon.baseStatStorage.spe < 20) return pokemon.canMegaEvo = false;
                                if ((item.id === 'abomasite' || item.id === 'sablenite') && pokemon.baseStatStorage.spe < 30) return pokemon.canMegaEvo = false;
                                if (item.id === 'beedrillite' && pokemon.baseStatStorage.spa < 30) return pokemon.canMegaEvo = false; //Doesn't matter
                                if (item.id === 'diancite' && (pokemon.baseStatStorage.def < 40 || pokemon.baseStatStorage.spd < 40)) return pokemon.canMegaEvo = false;
                                if (item.id === 'lopunnite' && pokemon.weightStorage < 5) return pokemon.canMegaEvo = false;
                                if (item.id === 'mewtwonitey' && (pokemon.weightStorage < 89 || pokemon.baseStatStorage.def < 20)) return pokemon.canMegaEvo = false;
                                //Overflow Limiter [SHUCKLE, Steelix, Regirock]
                                if (spec === 'Shuckle' && ['abomasite', 'aggronite', 'audinite', 'cameruptite', 'charizarditex', 'charizarditey', 'galladite', 'gyaradosite', 'heracronite', 'houndoominite', 'latiasite', 'mewtwonitey', 'sablenite', 'salamencite', 'scizorite', 'sharpedonite', 'slowbronite', 'steelixite', 'tyranitarite', 'venusaurite'].indexOf(item.id) > -1) return pokemon.canMegaEvo = false;
                                if ((spec === 'Steelix' || spec === 'Regirock') && item.id === 'slowbronite') return pokemon.canMegaEvo = false;
                               
                                return pokemon.canMegaEvo = megaEvo;
                        }
                },
                onModifyPokemon: function (pokemon) {
                        for (var q in pokemon.side.pokemon) {
                                var p = pokemon.side.pokemon[q];
                                if ((p.baseTemplate.isMega || p.baseTemplate.isPrimal) && p.baseSpecies !== 'Kyogre' && p.baseSpecies !== 'Groudon') {
                                        if (!p.statCalc && !p.newBaseStats) {
                                                var spec = p.baseTemplate.species;
                                                p.megaBaseStats = {atk: p.baseStatStorage.atk, def: p.baseStatStorage.def, spa: p.baseStatStorage.spa, spd: p.baseStatStorage.spd, spe: p.baseStatStorage.spe};
                                                if (!p.megaTypes) p.megaTypes = [p.typeStorage[0]];
                                                if (p.typeStorage[1]) p.megaTypes[1] = p.typeStorage[1];
                                                p.megaWeight = p.weightStorage;
                                                if (spec === 'Abomasnow-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 30;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe -= 30;
                                                        p.megaWeight += 2;
                                                } else if (spec === 'Absol-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spe += 40;
                                                } else if (spec === 'Aerodactyl-Mega') {
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 20;
                                                        p.megaWeight += 20;
                                                } else if (spec === 'Aggron-Mega') {
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 50;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaWeight += 35;
                                                        if (p.megaTypes[0] === 'Steel') p.megaTypes = ['Steel'];
                                                        else p.megaTypes[1] = 'Steel';
                                                } else if (spec === 'Alakazam-Mega') {
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spe += 30;
                                                } else if (spec === 'Altaria-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 40;
                                                        if (p.megaTypes[0] === 'Fairy') p.megaTypes = ['Fairy'];
                                                        else p.megaTypes[1] = 'Fairy';
                                                } else if (spec === 'Ampharos-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 50;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe -= 10;
                                                        if (p.megaTypes[0] === 'Dragon') p.megaTypes = ['Dragon'];
                                                        else p.megaTypes[1] = 'Dragon';
                                                } else if (spec === 'Audino-Mega') {
                                                        p.megaBaseStats.def += 40;
                                                        p.megaBaseStats.spa += 20;
                                                        p.megaBaseStats.spd += 40;
                                                        p.megaWeight += 1;
                                                        if (p.megaTypes[0] === 'Fairy') p.megaTypes = ['Fairy'];
                                                        else p.megaTypes[1] = 'Fairy';
                                                } else if (spec === 'Banette-Mega') {
                                                        p.megaBaseStats.atk += 50;
                                                        p.megaBaseStats.def += 10;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 10;
                                                        p.megaWeight += .5;
                                                } else if (spec === 'Beedrill-Mega') { //Doesn't matter, but eehhhhhhhhhhhh
                                                        p.megaBaseStats.atk += 60;
                                                        p.megaBaseStats.spa -= 30;
                                                        p.megaBaseStats.spe += 70;
                                                } else if (spec === 'Blastoise-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 50;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaWeight += 15.6;
                                                } else if (spec === 'Blaziken-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 10;
                                                        p.megaBaseStats.spa += 20;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe += 20;
                                                } else if (spec === 'Camerupt-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.def += 30;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spd += 30;
                                                        p.megaBaseStats.spe -= 20;
                                                        p.megaWeight += 100.5;
                                                } else if (spec === 'Charizard-Mega-X') {
                                                        p.megaBaseStats.atk += 46;
                                                        p.megaBaseStats.def += 33;
                                                        p.megaBaseStats.spa += 21;
                                                        p.megaWeight += 20;
                                                        if (p.megaTypes[0] === 'Dragon') p.megaTypes = ['Dragon'];
                                                        else p.megaTypes[1] = 'Dragon';
                                                } else if (spec === 'Charizard-Mega-Y') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.spa += 50;
                                                        p.megaBaseStats.spd += 30;
                                                        p.megaWeight += 10;
                                                } else if (spec === 'Diancie-Mega') {
                                                        p.megaBaseStats.atk += 60;
                                                        p.megaBaseStats.def -= 40;
                                                        p.megaBaseStats.spa += 60;
                                                        p.megaBaseStats.spd -= 40;
                                                        p.megaBaseStats.spe += 60;
                                                        p.megaWeight += 19;
                                                } else if (spec === 'Gallade-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 30;
                                                        p.megaBaseStats.spe += 30;
                                                        p.megaWeight += 4.4;
                                                } else if (spec === 'Garchomp-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe -= 10;
                                                } else if (spec === 'Gardevoir-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 20;
                                                } else if (spec === 'Gengar-Mega') {
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 20;
                                                } else if (spec === 'Glalie-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spe += 20;
                                                        p.megaWeight += 93.7;
                                                } else if (spec === 'Groudon-Primal') {
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 50;
                                                        p.megaWeight += 49.7;
                                                        if (p.megaTypes[0] === 'Fire') p.megaTypes = ['Fire'];
                                                        else p.megaTypes[1] = 'Fire';
                                                } else if (spec === 'Gyarados-Mega') {
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 30;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 30;
                                                        p.megaWeight += 70;
                                                        if (p.megaTypes[0] === 'Dark') p.megaTypes = ['Dark'];
                                                        else p.megaTypes[1] = 'Dark';
                                                } else if (spec === 'Heracross-Mega') {
                                                        p.megaBaseStats.atk += 60;
                                                        p.megaBaseStats.def += 40;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe -= 10;
                                                        p.megaWeight += 8.5;
                                                } else if (spec === 'Houndoom-Mega') {
                                                        p.megaBaseStats.def += 40;
                                                        p.megaBaseStats.spa += 30;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe += 20;
                                                        p.megaWeight += 14.5;
                                                } else if (spec === 'Kangaskhan-Mega') { //hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 20;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 10;
                                                } else if (spec === 'Kyogre-Primal') {
                                                        p.megaBaseStats.atk += 50;
                                                        p.megaBaseStats.spa += 30;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaWeight += 78;
                                                } else if (spec === 'Latias-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.def += 30;
                                                        p.megaBaseStats.spa += 30;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaWeight += 12;
                                                } else if (spec === 'Latios-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 30;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaWeight += 10;
                                                } else if (spec === 'Lopunny-Mega') {
                                                        p.megaBaseStats.atk += 60;
                                                        p.megaBaseStats.def += 10;
                                                        p.megaBaseStats.spe += 30;
                                                        p.megaWeight -= 5;
                                                        if (p.megaTypes[0] === 'Fighting') p.megaTypes = ['Fighting'];
                                                        else p.megaTypes[1] = 'Fighting';
                                                } else if (spec === 'Lucario-Mega') {
                                                        p.megaBaseStats.atk += 35;
                                                        p.megaBaseStats.def += 18;
                                                        p.megaBaseStats.spa += 25;
                                                        p.megaBaseStats.spe += 22;
                                                        p.megaWeight += 3.5;
                                                } else if (spec === 'Manectric-Mega') {
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 30;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 30;
                                                        p.megaWeight += 3.8;
                                                } else if (spec === 'Mawile-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.def += 40;
                                                        p.megaBaseStats.spd += 40;
                                                        p.megaWeight += 12;
                                                } else if (spec === 'Medicham-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 10;
                                                        p.megaBaseStats.spa += 20;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe += 20;
                                                } else if (spec === 'Metagross-Mega') {
                                                        p.megaBaseStats.atk += 10;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 40;
                                                        p.megaWeight += 392.9;
                                                } else if (spec === 'Mewtwo-Mega-X') {
                                                        p.megaBaseStats.atk += 80;
                                                        p.megaBaseStats.def += 10;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaWeight += 5;
                                                        if (p.megaTypes[0] === 'Fighting') p.megaTypes = ['Fighting'];
                                                        else p.megaTypes[1] = 'Fighting';
                                                } else if (spec === 'Mewtwo-Mega-Y') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def -= 20;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spd += 30;
                                                        p.megaBaseStats.spe += 10;
                                                        p.megaWeight -= 89;
                                                } else if (spec === 'Pidgeot-Mega') {
                                                        p.megaBaseStats.def += 5;
                                                        p.megaBaseStats.spa += 65;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe += 20;
                                                        p.megaWeight += 11;
                                                } else if (spec === 'Pinsir-Mega') {
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 20;
                                                        p.megaWeight += 4;
                                                        if (p.megaTypes[0] === 'Flying') p.megaTypes = ['Flying'];
                                                        else p.megaTypes[1] = 'Flying';
                                                } else if (spec === 'Rayquaza-Mega') {
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 10;
                                                        p.megaBaseStats.spa += 30;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe += 20;
                                                        p.megaWeight += 185.5;
                                                } else if (spec === 'Sableye-Mega') {
                                                        p.megaBaseStats.atk += 10;
                                                        p.megaBaseStats.def += 50;
                                                        p.megaBaseStats.spa += 20;
                                                        p.megaBaseStats.spd += 50;
                                                        p.megaBaseStats.spe -= 30;
                                                        p.megaWeight += 150;
                                                } else if (spec === 'Salamence-Mega') {
                                                        p.megaBaseStats.atk += 10;
                                                        p.megaBaseStats.def += 50;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe += 20;
                                                        p.megaWeight += 10;
                                                } else if (spec === 'Sceptile-Mega') {
                                                        p.megaBaseStats.atk += 25;
                                                        p.megaBaseStats.def += 10;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spe += 25;
                                                        p.megaWeight += 3;
                                                        if (p.megaTypes[0] === 'Dragon') p.megaTypes = ['Dragon'];
                                                        else p.megaTypes[1] = 'Dragon';
                                                } else if (spec === 'Scizor-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.def += 40;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 10;
                                                        p.megaWeight += 7;
                                                } else if (spec === 'Sharpedo-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.def += 30;
                                                        p.megaBaseStats.spa += 15;
                                                        p.megaBaseStats.spd += 25;
                                                        p.megaBaseStats.spe += 10;
                                                        p.megaWeight += 41.5;
                                                } else if (spec === 'Slowbro-Mega') {
                                                        p.megaBaseStats.def += 70;
                                                        p.megaBaseStats.spa += 30;
                                                        p.megaWeight += 31.5;
                                                } else if (spec === 'Steelix-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 30;
                                                        p.megaBaseStats.spd += 30;
                                                        p.megaWeight += 340;
                                                } else if (spec === 'Swampert-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 10;
                                                        p.megaWeight += 20.1;
                                                } else if (spec === 'Tyranitar-Mega') {
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 40;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 10;
                                                        p.megaWeight += 53;
                                                } else if (spec === 'Venusaur-Mega') {
                                                        p.megaBaseStats.atk += 18;
                                                        p.megaBaseStats.def += 40;
                                                        p.megaBaseStats.spa += 22;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaWeight += 55;
                                                }
                                                p.statCalc = true;
                                        }
                                        p.newBaseStats = {};
                                        for (var statName in p.megaBaseStats) {
                                                var stat = p.megaBaseStats[statName];
                                                stat = Math.floor(Math.floor(2 * stat + p.set.ivs[statName] + Math.floor(p.set.evs[statName] / 4)) * p.level / 100 + 5);
                                                var nature = p.battle.getNature(p.set.nature);
                                                if (statName === nature.plus) stat *= 1.1;
                                                if (statName === nature.minus) stat *= 0.9;
                                                p.newBaseStats[statName] = Math.floor(stat);
                                        }
                                        p.baseStats = p.stats = p.newBaseStats;
                                        if (!p.typestr) {
                                                p.typestr = p.megaTypes[0];
                                                if (p.megaTypes[1]) p.typestr += '/' + p.megaTypes[1];
                                        }
                                        if (!p.typechange && p.isActive) {
                                                this.add('-start', pokemon, 'typechange', p.typestr);
                                                p.typechange = true;
                                                p.typesData = [{type: p.megaTypes[0], suppressed: false,  isAdded: false}];
                                                if (p.megaTypes[1]) p.typesData[1] = {type: p.megaTypes[1], suppressed: false,  isAdded: false};
                                                this.add('-message', p.name + ' is a ' + p.baseSpecies + '!');
                                        } else if (p.typechange && !p.isActive) {
                                                p.typechange = false;
                                        }
                                }
                        }
                }
        },
	{
                name: "Mix and Mega Hackmons Cup",
                section: "Mix and Mega Stuff",
                column: 3,
                mod: 'mixandmega', //Forcibly prevent Knock Off + Trick
				team: 'randomHC',
				ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
                onBegin: function () {
                        var allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
                        for (var i = 0, len = allPokemon.length; i < len; i++) {
                                var pokemon = allPokemon[i];
                                pokemon.baseSpecies = pokemon.baseTemplate.species; //Storage
                        }
                },
                //Prepare Mega-Evolutions/Devolutions
                onSwitchInPriority: -6,
                onSwitchIn: function (pokemon) {
                        if (!pokemon.template.isMega && !pokemon.template.isPrimal && !pokemon.canMegaEvo) {
                                if (!pokemon.baseStatStorage) pokemon.baseStatStorage = {atk: pokemon.baseTemplate.baseStats.atk, def: pokemon.baseTemplate.baseStats.def, spa: pokemon.baseTemplate.baseStats.spa, spd: pokemon.baseTemplate.baseStats.spd, spe: pokemon.baseTemplate.baseStats.spe};
                                if (!pokemon.typeStorage) pokemon.typeStorage = [pokemon.baseTemplate.types[0]];
                                if (pokemon.baseTemplate.types[1]) pokemon.typeStorage[1] = pokemon.baseTemplate.types[1];
                                if (!pokemon.weightStorage) pokemon.weightStorage = pokemon.baseTemplate.weightkg;
                                var megaEvo = false;
                                var item = (pokemon.item) ? this.getItem(pokemon.item) : false;
                                var spec = pokemon.baseTemplate.species;
                               
                                //Primal Devolution
                                if (item && (item.id === 'redorb' || item.id === 'blueorb')) {
                                        //If you're an uber or uber-like Pokemon, don't [Gdon + Ogre will work as normal due to items.js]
                                        if (pokemon.baseTemplate.tier !== 'Uber' && spec !== 'Kyurem-Black' && spec !== 'Slaking' && spec !== 'Regigigas' && spec !== 'Cresselia' && !(pokemon.baseTemplate.evos && pokemon.baseTemplate.evos[0])) {
                                                var pstr = (item.id === 'redorb') ? 'Groudon-Primal' : 'Kyogre-Primal';
                                                var template = this.getTemplate(pstr);
                                                pokemon.formeChange(template);
                                                pokemon.baseTemplate = template;
                                                pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
                                                this.add('detailschange', pokemon, pokemon.details);
                                                this.add('message', pokemon.name + "'s Primal Reversion! It reverted to its primal form!");
                                                pokemon.setAbility(template.abilities['0']);
                                                pokemon.baseAbility = pokemon.ability;
                                        }
                                }
                               
                                //Mega Evolution
                                //If you're an uber, don't.
                                if (pokemon.baseTemplate.tier === 'Uber' && (spec !== 'Mewtwo' || (item.id !== 'mewtwonitex' && item.id !== 'mewtwonitey'))) return pokemon.canMegaEvo = false;
                                //If you don't have a mega stone, you can't mega-evolve, except if you have Dragon Ascent.
                                if ((!item || !item.megaStone) && pokemon.moves.indexOf('dragonascent') === -1) return pokemon.canMegaEvo = false;
                                if (item && item.megaStone) megaEvo = item.megaStone;
                                //Mega stones have priority over Rayquaza-Mega.
                                if (!megaEvo && pokemon.moves.indexOf('dragonascent') > -1 && spec !== 'Rayquaza') megaEvo = 'Rayquaza-Mega'; //Prevent Rayquaza from Mega Evolving, but allow Smeargle to Mega-Evolve
                                //If you aren't fully evolved, due to flavor reasons, you can't mega-evolve regardless.
                                //I feel bad about this too, Mega-Pikachu would've been sick [Albeit Light Ball Pikachu still would be better]
                                if (pokemon.baseTemplate.evos && pokemon.baseTemplate.evos[0]) return pokemon.canMegaEvo = false;
                                var ab = [pokemon.baseTemplate.abilities[0], pokemon.baseTemplate.abilities[1], pokemon.baseTemplate.abilities['H']];
                               
                                //Species-Based Mega-Evolutions
                                if (spec === 'Kyurem-Black' || spec === 'Slaking' || spec === 'Regigigas' || spec === 'Cresselia') return pokemon.canMegaEvo = false;
                                if (item.id === 'beedrillite' && spec !== 'Beedrill') return pokemon.canMegaEvo = false;
                                if (item.id === 'kangaskhanite' && spec !== 'Kangaskhan') return pokemon.canMegaEvo = false;
                                //Ability-Based Mega-Evolutions
                                if (item.id === 'medichamite' && spec !== 'Medicham' && spec !== 'Mawile' && ab.indexOf('Huge Power') === -1 && ab.indexOf('Pure Power') === -1) return pokemon.canMegaEvo = false;
                                if (item.id === 'mawilite' && spec !== 'Mawile' && ab.indexOf('Huge Power') === -1 && ab.indexOf('Pure Power') === -1) return pokemon.canMegaEvo = false;
                                if (item.id === 'gengarite' && spec !== 'Gengar' && ab.indexOf('Shadow Tag') === -1) return pokemon.canMegaEvo = false;
                                if (item.id === 'blazikenite' && spec !== 'Blaziken' && ab.indexOf('Speed Boost') === -1) return pokemon.canMegaEvo = false;
                                //Stat-based Mega-Evolutions
                                if ((item.id === 'ampharosite' || item.id === 'heracronite' || item.id === 'garchompite') && pokemon.baseStatStorage.spe < 10) return pokemon.canMegaEvo = false;
                                if (item.id === 'cameruptite' && pokemon.baseStatStorage.spe < 20) return pokemon.canMegaEvo = false;
                                if ((item.id === 'abomasite' || item.id === 'sablenite') && pokemon.baseStatStorage.spe < 30) return pokemon.canMegaEvo = false;
                                if (item.id === 'beedrillite' && pokemon.baseStatStorage.spa < 30) return pokemon.canMegaEvo = false; //Doesn't matter
                                if (item.id === 'diancite' && (pokemon.baseStatStorage.def < 40 || pokemon.baseStatStorage.spd < 40)) return pokemon.canMegaEvo = false;
                                if (item.id === 'lopunnite' && pokemon.weightStorage < 5) return pokemon.canMegaEvo = false;
                                if (item.id === 'mewtwonitey' && (pokemon.weightStorage < 89 || pokemon.baseStatStorage.def < 20)) return pokemon.canMegaEvo = false;
                                //Overflow Limiter [SHUCKLE, Steelix, Regirock]
                                if (spec === 'Shuckle' && ['abomasite', 'aggronite', 'audinite', 'cameruptite', 'charizarditex', 'charizarditey', 'galladite', 'gyaradosite', 'heracronite', 'houndoominite', 'latiasite', 'mewtwonitey', 'sablenite', 'salamencite', 'scizorite', 'sharpedonite', 'slowbronite', 'steelixite', 'tyranitarite', 'venusaurite'].indexOf(item.id) > -1) return pokemon.canMegaEvo = false;
                                if ((spec === 'Steelix' || spec === 'Regirock') && item.id === 'slowbronite') return pokemon.canMegaEvo = false;
                               
                                return pokemon.canMegaEvo = megaEvo;
                        }
                },
                onModifyPokemon: function (pokemon) {
                        for (var q in pokemon.side.pokemon) {
                                var p = pokemon.side.pokemon[q];
                                if ((p.baseTemplate.isMega || p.baseTemplate.isPrimal) && p.baseSpecies !== 'Kyogre' && p.baseSpecies !== 'Groudon') {
                                        if (!p.statCalc && !p.newBaseStats) {
                                                var spec = p.baseTemplate.species;
                                                p.megaBaseStats = {atk: p.baseStatStorage.atk, def: p.baseStatStorage.def, spa: p.baseStatStorage.spa, spd: p.baseStatStorage.spd, spe: p.baseStatStorage.spe};
                                                if (!p.megaTypes) p.megaTypes = [p.typeStorage[0]];
                                                if (p.typeStorage[1]) p.megaTypes[1] = p.typeStorage[1];
                                                p.megaWeight = p.weightStorage;
                                                if (spec === 'Abomasnow-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 30;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe -= 30;
                                                        p.megaWeight += 2;
                                                } else if (spec === 'Absol-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spe += 40;
                                                } else if (spec === 'Aerodactyl-Mega') {
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 20;
                                                        p.megaWeight += 20;
                                                } else if (spec === 'Aggron-Mega') {
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 50;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaWeight += 35;
                                                        if (p.megaTypes[0] === 'Steel') p.megaTypes = ['Steel'];
                                                        else p.megaTypes[1] = 'Steel';
                                                } else if (spec === 'Alakazam-Mega') {
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spe += 30;
                                                } else if (spec === 'Altaria-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 40;
                                                        if (p.megaTypes[0] === 'Fairy') p.megaTypes = ['Fairy'];
                                                        else p.megaTypes[1] = 'Fairy';
                                                } else if (spec === 'Ampharos-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 50;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe -= 10;
                                                        if (p.megaTypes[0] === 'Dragon') p.megaTypes = ['Dragon'];
                                                        else p.megaTypes[1] = 'Dragon';
                                                } else if (spec === 'Audino-Mega') {
                                                        p.megaBaseStats.def += 40;
                                                        p.megaBaseStats.spa += 20;
                                                        p.megaBaseStats.spd += 40;
                                                        p.megaWeight += 1;
                                                        if (p.megaTypes[0] === 'Fairy') p.megaTypes = ['Fairy'];
                                                        else p.megaTypes[1] = 'Fairy';
                                                } else if (spec === 'Banette-Mega') {
                                                        p.megaBaseStats.atk += 50;
                                                        p.megaBaseStats.def += 10;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 10;
                                                        p.megaWeight += .5;
                                                } else if (spec === 'Beedrill-Mega') { //Doesn't matter, but eehhhhhhhhhhhh
                                                        p.megaBaseStats.atk += 60;
                                                        p.megaBaseStats.spa -= 30;
                                                        p.megaBaseStats.spe += 70;
                                                } else if (spec === 'Blastoise-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 50;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaWeight += 15.6;
                                                } else if (spec === 'Blaziken-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 10;
                                                        p.megaBaseStats.spa += 20;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe += 20;
                                                } else if (spec === 'Camerupt-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.def += 30;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spd += 30;
                                                        p.megaBaseStats.spe -= 20;
                                                        p.megaWeight += 100.5;
                                                } else if (spec === 'Charizard-Mega-X') {
                                                        p.megaBaseStats.atk += 46;
                                                        p.megaBaseStats.def += 33;
                                                        p.megaBaseStats.spa += 21;
                                                        p.megaWeight += 20;
                                                        if (p.megaTypes[0] === 'Dragon') p.megaTypes = ['Dragon'];
                                                        else p.megaTypes[1] = 'Dragon';
                                                } else if (spec === 'Charizard-Mega-Y') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.spa += 50;
                                                        p.megaBaseStats.spd += 30;
                                                        p.megaWeight += 10;
                                                } else if (spec === 'Diancie-Mega') {
                                                        p.megaBaseStats.atk += 60;
                                                        p.megaBaseStats.def -= 40;
                                                        p.megaBaseStats.spa += 60;
                                                        p.megaBaseStats.spd -= 40;
                                                        p.megaBaseStats.spe += 60;
                                                        p.megaWeight += 19;
                                                } else if (spec === 'Gallade-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 30;
                                                        p.megaBaseStats.spe += 30;
                                                        p.megaWeight += 4.4;
                                                } else if (spec === 'Garchomp-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe -= 10;
                                                } else if (spec === 'Gardevoir-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 20;
                                                } else if (spec === 'Gengar-Mega') {
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 20;
                                                } else if (spec === 'Glalie-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spe += 20;
                                                        p.megaWeight += 93.7;
                                                } else if (spec === 'Groudon-Primal') {
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 50;
                                                        p.megaWeight += 49.7;
                                                        if (p.megaTypes[0] === 'Fire') p.megaTypes = ['Fire'];
                                                        else p.megaTypes[1] = 'Fire';
                                                } else if (spec === 'Gyarados-Mega') {
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 30;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 30;
                                                        p.megaWeight += 70;
                                                        if (p.megaTypes[0] === 'Dark') p.megaTypes = ['Dark'];
                                                        else p.megaTypes[1] = 'Dark';
                                                } else if (spec === 'Heracross-Mega') {
                                                        p.megaBaseStats.atk += 60;
                                                        p.megaBaseStats.def += 40;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe -= 10;
                                                        p.megaWeight += 8.5;
                                                } else if (spec === 'Houndoom-Mega') {
                                                        p.megaBaseStats.def += 40;
                                                        p.megaBaseStats.spa += 30;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe += 20;
                                                        p.megaWeight += 14.5;
                                                } else if (spec === 'Kangaskhan-Mega') { //hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 20;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 10;
                                                } else if (spec === 'Kyogre-Primal') {
                                                        p.megaBaseStats.atk += 50;
                                                        p.megaBaseStats.spa += 30;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaWeight += 78;
                                                } else if (spec === 'Latias-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.def += 30;
                                                        p.megaBaseStats.spa += 30;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaWeight += 12;
                                                } else if (spec === 'Latios-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 30;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaWeight += 10;
                                                } else if (spec === 'Lopunny-Mega') {
                                                        p.megaBaseStats.atk += 60;
                                                        p.megaBaseStats.def += 10;
                                                        p.megaBaseStats.spe += 30;
                                                        p.megaWeight -= 5;
                                                        if (p.megaTypes[0] === 'Fighting') p.megaTypes = ['Fighting'];
                                                        else p.megaTypes[1] = 'Fighting';
                                                } else if (spec === 'Lucario-Mega') {
                                                        p.megaBaseStats.atk += 35;
                                                        p.megaBaseStats.def += 18;
                                                        p.megaBaseStats.spa += 25;
                                                        p.megaBaseStats.spe += 22;
                                                        p.megaWeight += 3.5;
                                                } else if (spec === 'Manectric-Mega') {
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 30;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 30;
                                                        p.megaWeight += 3.8;
                                                } else if (spec === 'Mawile-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.def += 40;
                                                        p.megaBaseStats.spd += 40;
                                                        p.megaWeight += 12;
                                                } else if (spec === 'Medicham-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 10;
                                                        p.megaBaseStats.spa += 20;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe += 20;
                                                } else if (spec === 'Metagross-Mega') {
                                                        p.megaBaseStats.atk += 10;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 40;
                                                        p.megaWeight += 392.9;
                                                } else if (spec === 'Mewtwo-Mega-X') {
                                                        p.megaBaseStats.atk += 80;
                                                        p.megaBaseStats.def += 10;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaWeight += 5;
                                                        if (p.megaTypes[0] === 'Fighting') p.megaTypes = ['Fighting'];
                                                        else p.megaTypes[1] = 'Fighting';
                                                } else if (spec === 'Mewtwo-Mega-Y') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def -= 20;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spd += 30;
                                                        p.megaBaseStats.spe += 10;
                                                        p.megaWeight -= 89;
                                                } else if (spec === 'Pidgeot-Mega') {
                                                        p.megaBaseStats.def += 5;
                                                        p.megaBaseStats.spa += 65;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe += 20;
                                                        p.megaWeight += 11;
                                                } else if (spec === 'Pinsir-Mega') {
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 20;
                                                        p.megaWeight += 4;
                                                        if (p.megaTypes[0] === 'Flying') p.megaTypes = ['Flying'];
                                                        else p.megaTypes[1] = 'Flying';
                                                } else if (spec === 'Rayquaza-Mega') {
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 10;
                                                        p.megaBaseStats.spa += 30;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe += 20;
                                                        p.megaWeight += 185.5;
                                                } else if (spec === 'Sableye-Mega') {
                                                        p.megaBaseStats.atk += 10;
                                                        p.megaBaseStats.def += 50;
                                                        p.megaBaseStats.spa += 20;
                                                        p.megaBaseStats.spd += 50;
                                                        p.megaBaseStats.spe -= 30;
                                                        p.megaWeight += 150;
                                                } else if (spec === 'Salamence-Mega') {
                                                        p.megaBaseStats.atk += 10;
                                                        p.megaBaseStats.def += 50;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 10;
                                                        p.megaBaseStats.spe += 20;
                                                        p.megaWeight += 10;
                                                } else if (spec === 'Sceptile-Mega') {
                                                        p.megaBaseStats.atk += 25;
                                                        p.megaBaseStats.def += 10;
                                                        p.megaBaseStats.spa += 40;
                                                        p.megaBaseStats.spe += 25;
                                                        p.megaWeight += 3;
                                                        if (p.megaTypes[0] === 'Dragon') p.megaTypes = ['Dragon'];
                                                        else p.megaTypes[1] = 'Dragon';
                                                } else if (spec === 'Scizor-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.def += 40;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 10;
                                                        p.megaWeight += 7;
                                                } else if (spec === 'Sharpedo-Mega') {
                                                        p.megaBaseStats.atk += 20;
                                                        p.megaBaseStats.def += 30;
                                                        p.megaBaseStats.spa += 15;
                                                        p.megaBaseStats.spd += 25;
                                                        p.megaBaseStats.spe += 10;
                                                        p.megaWeight += 41.5;
                                                } else if (spec === 'Slowbro-Mega') {
                                                        p.megaBaseStats.def += 70;
                                                        p.megaBaseStats.spa += 30;
                                                        p.megaWeight += 31.5;
                                                } else if (spec === 'Steelix-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 30;
                                                        p.megaBaseStats.spd += 30;
                                                        p.megaWeight += 340;
                                                } else if (spec === 'Swampert-Mega') {
                                                        p.megaBaseStats.atk += 40;
                                                        p.megaBaseStats.def += 20;
                                                        p.megaBaseStats.spa += 10;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 10;
                                                        p.megaWeight += 20.1;
                                                } else if (spec === 'Tyranitar-Mega') {
                                                        p.megaBaseStats.atk += 30;
                                                        p.megaBaseStats.def += 40;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaBaseStats.spe += 10;
                                                        p.megaWeight += 53;
                                                } else if (spec === 'Venusaur-Mega') {
                                                        p.megaBaseStats.atk += 18;
                                                        p.megaBaseStats.def += 40;
                                                        p.megaBaseStats.spa += 22;
                                                        p.megaBaseStats.spd += 20;
                                                        p.megaWeight += 55;
                                                }
                                                p.statCalc = true;
                                        }
                                        p.newBaseStats = {};
                                        for (var statName in p.megaBaseStats) {
                                                var stat = p.megaBaseStats[statName];
                                                stat = Math.floor(Math.floor(2 * stat + p.set.ivs[statName] + Math.floor(p.set.evs[statName] / 4)) * p.level / 100 + 5);
                                                var nature = p.battle.getNature(p.set.nature);
                                                if (statName === nature.plus) stat *= 1.1;
                                                if (statName === nature.minus) stat *= 0.9;
                                                p.newBaseStats[statName] = Math.floor(stat);
                                        }
                                        p.baseStats = p.stats = p.newBaseStats;
                                        if (!p.typestr) {
                                                p.typestr = p.megaTypes[0];
                                                if (p.megaTypes[1]) p.typestr += '/' + p.megaTypes[1];
                                        }
                                        if (!p.typechange && p.isActive) {
                                                this.add('-start', pokemon, 'typechange', p.typestr);
                                                p.typechange = true;
                                                p.typesData = [{type: p.megaTypes[0], suppressed: false,  isAdded: false}];
                                                if (p.megaTypes[1]) p.typesData[1] = {type: p.megaTypes[1], suppressed: false,  isAdded: false};
                                                this.add('-message', p.name + ' is a ' + p.baseSpecies + '!');
                                        } else if (p.typechange && !p.isActive) {
                                                p.typechange = false;
                                        }
                                }
                        }
                }
        },
	{
		name: "Random Battle",
		section: "ORAS Singles",

		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod']
	},

	{
		name: "Unrated Random Battle",
		section: "ORAS Singles",

		team: 'random',
		challengeShow: false,
		rated: false,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "OU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3521201/\">OU Metagame Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/dex/xy/tags/ou/\">OU Banlist</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3536420/\">OU Viability Ranking</a>"
		],
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite']
	},
	{
		name: "OU (no Mega)",
		section: "ORAS Singles",

		ruleset: ['OU'],
		onBegin: function () {
			for (var i = 0; i < this.p1.pokemon.length; i++) {
				this.p1.pokemon[i].canMegaEvo = false;
			}
			for (var i = 0; i < this.p2.pokemon.length; i++) {
				this.p2.pokemon[i].canMegaEvo = false;
			}
		}
	},
	{
		name: "Ubers",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3522911/\">Ubers Metagame Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3535106/\">Ubers Viability Ranking</a>"
		],
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Team Preview', 'Mega Rayquaza Clause'],
		banlist: []
	},
	{
		name: "UU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3542640/\">np: UU Stage 3.2</a>",
			"&bullet; <a href=\"https://www.smogon.com/dex/xy/tags/uu/\">UU Banlist</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3541343/\">UU Viability Ranking</a>"
		],
		section: "ORAS Singles",

		ruleset: ['OU'],
		banlist: ['OU', 'BL', 'Alakazite', 'Altarianite', 'Diancite', 'Heracronite', 'Galladite', 'Gardevoirite', 'Lopunnite', 'Medichamite',
			'Metagrossite', 'Pidgeotite', 'Pinsirite', 'Drizzle', 'Drought', 'Shadow Tag'
		]
	},
	{
		name: "RU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3538971/\">np: RU Stage 10</a>",
			"&bullet; <a href=\"https://www.smogon.com/dex/xy/tags/ru/\">RU Banlist</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3538036/\">RU Viability Ranking</a>"
		],
		section: "ORAS Singles",

		ruleset: ['UU'],
		banlist: ['UU', 'BL2', 'Galladite', 'Houndoominite', 'Pidgeotite']
	},
	{
		name: "NU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3542109/\">np: NU Stage 7</a>",
			"&bullet; <a href=\"https://www.smogon.com/dex/xy/tags/nu/\">NU Banlist</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3523692/\">NU Viability Ranking</a>"
		],
		section: "ORAS Singles",

		ruleset: ['RU'],
		banlist: ['RU', 'BL3', 'Cameruptite', 'Glalitite', 'Steelixite']
	},
	{
		name: "LC",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3505710/\">LC Metagame Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3490462/\">LC Banlist</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3496013/\">LC Viability Ranking</a>"
		],

		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['LC Uber', 'Gligar', 'Misdreavus', 'Scyther', 'Sneasel', 'Tangela', 'Dragon Rage', 'Sonic Boom', 'Swagger']
	},
	{
		name: "Anything Goes",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3523229/\">Anything Goes</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3535064/\">Anything Goes Viability Ranking</a>"
		],
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal']
	},
	/*{
		name: "CAP Naviathan Playtest",
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Allow CAP', 'Syclant', 'Revenankh', 'Pyroak', 'Fidgit', 'Stratagem', 'Arghonaut', 'Kitsunoh', 'Cyclohm', 'Colossoil', 'Krilowatt', 'Voodoom',
			'Tomohawk', 'Necturna', 'Mollux', 'Aurumoth', 'Malaconda', 'Cawmodore', 'Volkraken', 'Plasmanta',
			'Aegislash', 'Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Dialga', 'Genesect',
			'Giratina', 'Giratina-Origin', 'Greninja', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia',
			'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Xerneas', 'Yveltal', 'Zekrom',
			'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite', 'Soul Dew'
		]
	},*/
	{
		name: "Battle Spot Singles",
		section: "ORAS Singles",

		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview GBU'],
		banlist: ['Tornadus + Defiant', 'Thundurus + Defiant', 'Landorus + Sheer Force'],
		requirePentagon: true,
		validateTeam: function (team, format) {
			if (team.length < 3) return ['You must bring at least three Pok\u00e9mon.'];
		},
		onBegin: function () {
			this.debug('cutting down to 3');
			this.p1.pokemon = this.p1.pokemon.slice(0, 3);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 3);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Custom Game",
		section: "ORAS Singles",

		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod']
	},

	// XY Doubles
	///////////////////////////////////////////////////////////////////

	{
		name: "Random Doubles Battle",
		section: "ORAS Doubles",

		gameType: 'doubles',
		team: 'randomDoubles',
		ruleset: ['PotD', 'Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "Doubles OU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3545903/\">np: Doubles OU Stage 3</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3498688/\">Doubles OU Banlist</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3535930/\">Doubles OU Viability Ranking</a>"
		],
		section: "ORAS Doubles",

		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard Doubles', 'Team Preview'],
		banlist: ['Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo',
			'Palkia', 'Rayquaza', 'Reshiram', 'Xerneas', 'Yveltal', 'Zekrom', 'Salamencite', 'Soul Dew', 'Dark Void',
			'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder', 'Gravity ++ Spore'
		]
	},
	{
		name: "Doubles OU (suspect test)",
		section: "ORAS Doubles",

		gameType: 'doubles',
		challengeShow: false,
		ruleset: ['Doubles OU'],
		banlist: []
	},
	{
		name: "Doubles Ubers",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3542746/\">Doubles Ubers</a>"
		],
		section: "ORAS Doubles",

		gameType: 'doubles',
		ruleset: ['Pokemon', 'Species Clause', 'Moody Clause', 'OHKO Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal', 'Dark Void']
	},
	{
		name: "Doubles UU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3542755/\">Doubles UU</a>"
		],
		section: "ORAS Doubles",

		gameType: 'doubles',
		ruleset: ['Doubles OU'],
		banlist: ['Abomasnow', 'Aegislash', 'Amoonguss', 'Azumarill', 'Bisharp', 'Breloom', 'Charizard', 'Conkeldurr', 'Cresselia',
			'Diancie', 'Dragonite', 'Excadrill', 'Ferrothorn', 'Garchomp', 'Gardevoir', 'Gengar', 'Greninja', 'Gyarados', 'Heatran',
			'Hitmontop', 'Hoopa', 'Hoopa-Unbound', 'Hydreigon', 'Jirachi', 'Kangaskhan', 'Keldeo', 'Kyurem-Black', 'Landorus', 'Landorus-Therian', 'Latios', 'Ludicolo',
			'Metagross', 'Mew', 'Milotic', 'Ninetales', 'Politoed', 'Rotom-Wash', 'Sableye', 'Scizor', 'Scrafty', 'Serperior', 'Shaymin-Sky', 'Suicune',
			'Sylveon', 'Talonflame', 'Terrakion', 'Thundurus', 'Thundurus-Therian', 'Togekiss', 'Tyranitar', 'Venusaur', 'Volcarona', 'Weavile', 'Whimsicott', 'Zapdos'
		]
	},
	{
		name: "Doubles NU",
		section: "ORAS Doubles",

		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Doubles UU'],
		banlist: ['Snorlax', 'Machamp', 'Lopunny', 'Galvantula', 'Mienshao', 'Infernape', 'Aromatisse', 'Clawitzer', 'Kyurem', 'Flygon',
			'Lucario', 'Alakazam', 'Gastrodon', 'Bronzong', 'Chandelure', 'Dragalge', 'Mamoswine', 'Genesect', 'Arcanine', 'Volcarona',
			'Aggron', 'Manectric', 'Salamence', 'Tornadus', 'Porygon2', 'Latias', 'Meowstic', 'Ninetales', 'Crobat', 'Blastoise',
			'Darmanitan', 'Sceptile', 'Jirachi', 'Goodra', 'Deoxys-Attack', 'Milotic', 'Victini', 'Hariyama', 'Crawdaunt', 'Aerodactyl',
			'Abomasnow', 'Krookodile', 'Cofagrigus', 'Druddigon', 'Escavalier', 'Dusclops', 'Slowbro', 'Slowking', 'Eelektross', 'Spinda',
			'Cloyster', 'Raikou', 'Thundurus-Therian', 'Swampert', 'Nidoking', 'Aurorus', 'Granbull', 'Braviary'
		]
	},
	{
		name: "Battle Spot Doubles (VGC 2015)",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3524352/\">VGC 2015 Rules</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3530547/\">VGC 2015 Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3500650/\">VGC Learning Resources</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3526666/\">Sample Teams for VGC 2015</a>"
		],
		section: "ORAS Doubles",

		gameType: 'doubles',
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview VGC'],
		banlist: ['Tornadus + Defiant', 'Thundurus + Defiant', 'Landorus + Sheer Force'],
		requirePentagon: true,
		validateTeam: function (team, format) {
			if (team.length < 4) return ['You must bring at least four Pok\u00e9mon.'];
		},
		onBegin: function () {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0, 4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Battle Spot Special 11",
		section: "ORAS Doubles",

		gameType: 'doubles',
		maxForcedLevel: 50,
		ruleset: ['Battle Spot Doubles (VGC 2015)'],
		banlist: ['Charizard', 'Gengar', 'Kangaskhan', 'Tyranitar', 'Gardevoir', 'Mawile', 'Salamence', 'Garchomp', 'Rotom',
			'Rotom-Heat', 'Rotom-Wash', 'Rotom-Frost', 'Rotom-Fan', 'Rotom-Mow', 'Heatran', 'Cresselia', 'Amoonguss', 'Bisharp',
			'Terrakion', 'Thundurus', 'Thundurus-Therian', 'Landorus', 'Landorus-Therian', 'Greninja', 'Talonflame', 'Aegislash', 'Sylveon'
		],
		requirePentagon: true,
		validateTeam: function (team, format) {
			if (team.length < 4) return ['You must bring at least four Pok\u00e9mon.'];
		},
		onBegin: function () {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0, 4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Pikachu Cup",
		section: "ORAS Doubles",

		gameType: 'doubles',
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview VGC'],
		banlist: ['Arceus', 'Raikou', 'Thundurus', 'Thundurus-Therian', 'Zapdos', 'Zekrom'],
		validateTeam: function (team, format) {
			if (team.length < 4) return ['You must bring at least four Pok\u00e9mon.'];
			for (var i = 0; i < team.length; i++) {
				var template = this.getTemplate(team[i].species);
				if (!template.types || template.types.indexOf('Electric') < 0) return ["Only Electric-type Pok\u00e9mon are allowed."];
			}
		},
		onBegin: function () {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0, 4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Doubles Hackmons Cup",
		section: "ORAS Doubles",

		gameType: 'doubles',
		team: 'randomHC',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "Doubles Custom Game",
		section: "ORAS Doubles",

		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		maxLevel: 9999,
		defaultLevel: 100,
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod']
	},

	// XY Triples
	///////////////////////////////////////////////////////////////////

	{
		name: "Random Triples Battle",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3511522/\">Smogon Triples</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3540390/\">Smogon Triples Viability Ranking</a>"
		],
		section: "ORAS Triples",

		gameType: 'triples',
		team: 'randomDoubles',
		ruleset: ['PotD', 'Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "Smogon Triples",
		section: "ORAS Triples",

		gameType: 'triples',
		ruleset: ['Pokemon', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Illegal', 'Unreleased', 'Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White',
			'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Xerneas', 'Yveltal', 'Zekrom',
			'Soul Dew', 'Dark Void', 'Perish Song'
		]
	},
	{
		name: "Battle Spot Triples",
		section: "ORAS Triples",

		gameType: 'triples',
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview'],
		banlist: ['Tornadus + Defiant', 'Thundurus + Defiant', 'Landorus + Sheer Force'],
		requirePentagon: true,
		validateTeam: function (team, format) {
			if (team.length < 6) return ['You must have six Pok\u00e9mon.'];
		}
	},
	{
		name: "Triples Hackmons Cup",
		section: "ORAS Triples",

		gameType: 'triples',
		team: 'randomHC',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "Triples Custom Game",
		section: "ORAS Triples",

		gameType: 'triples',
		searchShow: false,
		canUseRandomTeam: true,
		maxLevel: 9999,
		defaultLevel: 100,
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod']
	},

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		name: "No Status",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3542555/\">No Status</a>"],
		section: "OM of the Month",
		column: 2,

		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: ['Aegislash', 'Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Genesect', 'Giratina', 'Giratina-Origin', 'Greninja', 'Groudon',
			'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Landorus', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Xerneas', 'Yveltal', 'Zekrom',
			'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite', 'Soul Dew'
		],
		validateSet: function (set) {
			var problems = [];
			if (set.moves) {
				for (var i in set.moves) {
					var move = this.getMove(set.moves[i]);
					if (move.category === 'Status') problems.push(set.species + "'s move " + move.name + " is banned by No Status.");
				}
			}
			return problems;
		}
	},
	{
		name: "MonsJustMons",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3514696/\">MonsJustMons</a>"],
		section: "OM of the Month",

		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Arceus', 'Archeops', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh',
			'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Regigigas', 'Reshiram', 'Slaking', 'Xerneas', 'Yveltal', 'Zekrom'
		],
		validateSet: function (set) {
			set.item = '';
			set.ability = 'None';
			set.evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			set.ivs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			set.nature = '';
		}
	},
	{
		name: "[Seasonal] Rainbow Road",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a>"],
		section: "OM of the Month",

		team: "randomRainbow",
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onBegin: function () {
			this.add('message', "The last attack on each Pok\u00e9mon is based on their Pok\u00e9dex color.");
			this.add('-message', "Red/Pink beats Yellow/Green, which beats Blue/Purple, which beats Red/Pink.");
			this.add('-message', "Using a color move on a Pok\u00e9mon in the same color group is a neutral hit.");
			this.add('-message', "Use /details [POKEMON] to check its Pok\u00e9dex color.");

			var allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			var physicalnames = {
				'Red': 'Crimson Crash', 'Pink': 'Rose Rush', 'Yellow': 'Saffron Strike', 'Green': 'Viridian Slash',
				'Blue': 'Blue Bombardment', 'Purple': 'Indigo Impact'
			};
			var specialnames = {
				'Red': 'Scarlet Shine', 'Pink': 'Coral Catapult', 'Yellow': 'Golden Gleam', 'Green': 'Emerald Flash',
				'Blue': 'Cerulean Surge', 'Purple': 'Violet Radiance'
			};
			for (var i = 0; i < allPokemon.length; i++) {
				var pokemon = allPokemon[i];
				var color = pokemon.template.color;
				var category = (pokemon.stats.atk > pokemon.stats.spa ? 'Physical' : 'Special');
				var last = pokemon.moves.length - 1;
				var move = (category === 'Physical' ? physicalnames[color] : specialnames[color]);
				if (pokemon.moves[last]) {
					pokemon.moves[last] = toId(move);
					pokemon.moveset[last].move = move;
					pokemon.baseMoveset[last].move = move;
				}
			}
		},
		onBeforeTurn: function (pokemon) {
			var side = pokemon.side;
			side.item = '';

			var decisions = [];
			var decision, i;
			if (side.hadItem || this.random(4) === 0) { // Can never get 2 consecutive turns of items
				side.hadItem = false;
				return;
			}
			switch (this.random(8)) {
			case 0:
				side.item = 'lightning';
				side.hadItem = true;
				this.add('message', "Lightning suddenly struck " + side.name + " and shrank their Pok\u00e9mon!");
				this.add('-start', pokemon, 'shrunken', '[silent]');
				break;
			case 1:
				side.item = 'blooper';
				side.hadItem = true;
				this.add('message', "A Blooper came down and splattered ink all over " + side.name + "'s screen!");
				this.add('-start', pokemon, 'blinded', '[silent]');
				break;
			case 2:
				if (pokemon.isGrounded()) {
					side.item = 'banana';
					side.hadItem = true;
					this.add('message', side.name + " slipped on a banana peel!");
					this.add('-start', pokemon, 'slipped', '[silent]');
					pokemon.addVolatile('flinch');
				}
				break;
			case 3:
				if (!side.sideConditions['goldenmushroom']) {
					side.item = 'goldmushroom';
					side.hadItem = true;
					this.add('message', side.name + " collected a Golden Mushroom, giving them a speed boost!");
					this.add('-start', pokemon, 'goldenmushroom', '[silent]');
					side.addSideCondition('goldenmushroom');
					side.sideConditions['goldenmushroom'].duration = 3;
					// Get all relevant decisions from the Pokemon and tweak speed.
					for (i = 0; i < this.queue.length; i++) {
						if (this.queue[i].pokemon === pokemon) {
							decision = this.queue[i];
							decision.speed = pokemon.getStat('spe');
							decisions.push(decision);
							// Cancel the decision
							this.queue.splice(i, 1);
							i--;
						}
					}
					for (i = 0; i < decisions.length; i++) {
						this.insertQueue(decisions[i]);
					}
				}
				break;
			case 4:
			case 5:
				if (!side.sideConditions['goldenmushroom']) {
					side.item = 'mushroom';
					side.hadItem = true;
					this.add('message', side.name + " collected a Mushroom, giving them a quick speed boost!");
					this.add('-start', pokemon, 'mushroom', '[silent]');
					side.addSideCondition('mushroom');
					side.sideConditions['mushroom'].duration = 1;
					// Get all relevant decisions from the Pokemon and tweak speed.
					for (i = 0; i < this.queue.length; i++) {
						if (this.queue[i].pokemon === pokemon) {
							decision = this.queue[i];
							decision.speed = pokemon.getStat('spe');
							decisions.push(decision);
							// Cancel the decision
							this.queue.splice(i, 1);
							i--;
						}
					}
					for (i = 0; i < decisions.length; i++) {
						this.insertQueue(decisions[i]);
					}
				}
				break;
			default:
				if (side.pokemonLeft - side.foe.pokemonLeft >= 2) {
					side.item = 'blueshell';
					side.hadItem = true;
					this.add('message', "A Blue Spiny Shell flew over the horizon and crashed into " + side.name + "!");
					this.damage(pokemon.maxhp / 2, pokemon, pokemon, this.getMove('judgment'), true);
				}
			}
		},
		onAccuracy: function (accuracy, target, source, move) {
			if (source.hasAbility('keeneye')) return;
			var modifier = 1;
			if (source.side.item === 'blooper' && !source.hasAbility('clearbody')) {
				modifier *= 0.4;
			}
			if (target.side.item === 'lightning') {
				modifier *= 0.8;
			}
			return this.chainModify(modifier);
		},
		onDisableMove: function (pokemon) {
			// Enforce Choice Item locking on color moves
			// Technically this glitches with Klutz, but Lopunny is Brown and will never appear :D
			if (!pokemon.ignoringItem() && pokemon.getItem().isChoice && pokemon.lastMove === 'swift') {
				var moves = pokemon.moveset;
				for (var i = 0; i < moves.length; i++) {
					if (moves[i].id !== 'swift') {
						pokemon.disableMove(moves[i].id, false);
					}
				}
			}
		},
		onEffectiveness: function (typeMod, target, type, move) {
			if (move.id !== 'swift') return;
			// Only calculate color effectiveness once
			if (target.types[0] !== type) return 0;
			var targetColor = target.template.color;
			var sourceColor = this.activePokemon.template.color;
			var effectiveness = {
				'Red': {'Red': 0, 'Pink': 0, 'Yellow': 1, 'Green': 1, 'Blue': -1, 'Purple': -1},
				'Pink': {'Red': 0, 'Pink': 0, 'Yellow': 1, 'Green': 1, 'Blue': -1, 'Purple': -1},
				'Yellow': {'Red': -1, 'Pink': -1, 'Yellow': 0, 'Green': 0, 'Blue': 1, 'Purple': 1},
				'Green': {'Red': -1, 'Pink': -1, 'Yellow': 0, 'Green': 0, 'Blue': 1, 'Purple': 1},
				'Blue': {'Red': 1, 'Pink': 1, 'Yellow': -1, 'Green': -1, 'Blue': 0, 'Purple': 0},
				'Purple': {'Red': 1, 'Pink': 1, 'Yellow': -1, 'Green': -1, 'Blue': 0, 'Purple': 0}
			};
			return effectiveness[sourceColor][targetColor];
		},
		onModifyDamage: function (damage, source, target, effect) {
			if (source === target || effect.effectType !== 'Move') return;
			if (target.side.item === 'lightning') return this.chainModify(2);
			if (source.side.item === 'lightning') return this.chainModify(0.5);
		},
		onModifySpe: function (speMod, pokemon) {
			if (pokemon.side.sideConditions['goldenmushroom'] || pokemon.side.sideConditions['mushroom']) {
				return this.chainModify(1.75);
			}
		},
		onResidual: function (battle) {
			var side;
			for (var i = 0; i < battle.sides.length; i++) {
				side = battle.sides[i];
				if (side.sideConditions['goldenmushroom'] && side.sideConditions['goldenmushroom'].duration === 1) {
					this.add('-message', "The effect of " + side.name + "'s Golden Mushroom wore off.");
					this.add('-end', side.active[0], 'goldenmushroom', '[silent]');
					side.removeSideCondition('goldenmushroom');
				}
				switch (side.item) {
				case 'lightning':
					this.add('-end', side.active[0], 'shrunken', '[silent]');
					break;
				case 'blooper':
					this.add('-end', side.active[0], 'blinded', '[silent]');
					break;
				case 'banana':
					this.add('-end', side.active[0], 'slipped', '[silent]');
					break;
				case 'mushroom':
					this.add('-end', side.active[0], 'mushroom', '[silent]');
				}

				side.item = '';
			}
		},
		onModifyMove: function (move, pokemon) {
			if (move.id !== 'swift') return;
			var physicalnames = {
				'Red': 'Crimson Crash', 'Pink': 'Rose Rush', 'Yellow': 'Saffron Strike', 'Green': 'Viridian Slash',
				'Blue': 'Blue Bombardment', 'Purple': 'Indigo Impact'
			};
			var specialnames = {
				'Red': 'Scarlet Shine', 'Pink': 'Coral Catapult', 'Yellow': 'Golden Gleam', 'Green': 'Emerald Flash',
				'Blue': 'Cerulean Surge', 'Purple': 'Violet Radiance'
			};
			var color = pokemon.template.color;
			move.category = (pokemon.stats.atk > pokemon.stats.spa ? 'Physical' : 'Special');
			move.name = (move.category === 'Physical' ? physicalnames[color] : specialnames[color]);
			move.basePower = 100;
			move.accuracy = 100;
			move.type = '???';
			if (move.category === 'Physical') move.flags['contact'] = true;
		},
		onPrepareHit: function (pokemon, target, move) {
			if (move.id !== 'swift') return;
			var animations = {
				'Crimson Crash': 'Flare Blitz', 'Scarlet Shine': 'Fusion Flare', 'Rose Rush': 'Play Rough',
				'Coral Catapult': 'Moonblast', 'Saffron Strike': 'Bolt Strike',	'Golden Gleam': 'Charge Beam',
				'Viridian Slash': 'Power Whip', 'Emerald Flash': 'Solarbeam', 'Blue Bombardment': 'Waterfall',
				'Cerulean Surge': 'Hydro Pump', 'Indigo Impact': 'Poison Jab', 'Violet Radiance': 'Gunk Shot'
			};
			this.attrLastMove('[anim] ' + animations[move.name]);
		},
		onSwitchInPriority: -9,
		onSwitchIn: function (pokemon) {
			if (!pokemon.hp) return;
			this.add('-start', pokemon, pokemon.template.color, '[silent]');
			if (pokemon.side.item === 'lightning') {
				this.add('-start', pokemon, 'shrunken', '[silent]');
			}
			if (pokemon.side.sideConditions['goldenmushroom']) {
				this.add('-start', pokemon, 'goldenmushroom', '[silent]');
			}
		},
		onSwitchOut: function (pokemon) {
			this.add('-end', pokemon, pokemon.template.color, '[silent]');
		}
	},
	{
		name: "CAP",
		section: "Other Metagames",
		column: 2,

		ruleset: ['OU'],
		banlist: ['Allow CAP']
	},
	{
		name: "Battle Factory",
		section: "Other Metagames",

		team: 'randomFactory',
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Mega Rayquaza Clause']
	},
	{
		name: "Challenge Cup 1v1",
		section: "Other Metagames",

		team: 'randomCC',
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview 1v1'],
		onBegin: function () {
			this.debug('Cutting down to 1');
			this.p1.pokemon = this.p1.pokemon.slice(0, 1);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 1);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Balanced Hackmons",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3489849/\">Balanced Hackmons</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3515725/\">Balanced Hackmons Suspect Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3525676/\">Balanced Hackmons Viability Ranking</a>"
		],
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Ability Clause', '-ate Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Groudon-Primal', 'Kyogre-Primal', 'Arena Trap', 'Huge Power', 'Parental Bond', 'Pure Power', 'Shadow Tag', 'Wonder Guard', 'Assist', 'Chatter']
	},
	{
		name: "1v1",
		desc: [
			"Bring three Pok&eacute;mon to Team Preview and choose one to battle.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3496773/\">1v1</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3536109/\">1v1 Viability Ranking</a>"
		],
		section: 'Other Metagames',

		ruleset: ['Pokemon', 'Moody Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Swagger Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview 1v1'],
		banlist: ['Illegal', 'Unreleased', 'Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin',
			'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-Sky',
			'Xerneas', 'Yveltal', 'Zekrom', 'Focus Sash', 'Kangaskhanite', 'Soul Dew'
		],
		validateTeam: function (team, format) {
			if (team.length > 3) return ['You may only bring up to three Pok\u00e9mon.'];
		},
		onBegin: function () {
			this.p1.pokemon = this.p1.pokemon.slice(0, 1);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 1);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Monotype",
		desc: [
			"All Pok&eacute;mon on a team must share a type.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3544507/\">Monotype</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3517737/\">Monotype Viability Ranking</a>"
		],
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Same Type Clause', 'Team Preview'],
		banlist: ['Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin', 'Greninja', 'Groudon', 'Ho-Oh',
			'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Talonflame', 'Xerneas', 'Yveltal', 'Zekrom',
			'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Metagrossite', 'Salamencite', 'Shaymin-Sky', 'Slowbronite', 'Soul Dew'
		]
	},
	{
		name: "Tier Shift",
		desc: [
			"Pok&eacute;mon below OU/BL get all their stats boosted. UU/BL2 get +5, RU/BL3 get +10, and NU or lower get +15.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3532973/\">Tier Shift</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3536719/\">Tier Shift Viability Ranking</a>"
		],
		section: "Other Metagames",

		mod: 'tiershift',
		ruleset: ['OU'],
		banlist: ['Shadow Tag', 'Swift Swim', 'Chatter']
	},
	
	{
		name: "Tier Shift Randoms",
		desc: [
			"Pok&eacute;mon below OU/BL get all their stats boosted. UU/BL2 get +5, RU/BL3 get +10, and NU or lower get +15.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3532973/\">Tier Shift</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3536719/\">Tier Shift Viability Ranking</a>"
		],
		section: "Other Metagames",
		mod: 'tiershift',
		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	
	{
		name: "PU",
		desc: [
			"The unofficial tier below NU.",
			"&bullet; <a href=\"https://www.smogon.com/forums/forums/pu.327/\">PU</a>"
		],
		section: "Other Metagames",

		ruleset: ['NU'],
		banlist: ['NU', 'BL4', 'Altarianite', 'Beedrillite', 'Lopunnite', 'Chatter', 'Shell Smash + Baton Pass']
	},
	{
		name: "Inverse Battle",
		desc: [
			"Battle with an inverted type chart.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3518146/\">Inverse Battle</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3526371/\">Inverse Battle Viability Ranking</a>"
		],
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Diggersby', 'Giratina-Origin', 'Groudon',
			'Ho-Oh', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Serperior',
			'Shaymin-Sky', 'Snorlax', 'Xerneas', 'Yveltal', 'Zekrom', 'Gengarite', 'Kangaskhanite', 'Salamencite', 'Soul Dew'
		],
		onNegateImmunity: function (pokemon, type) {
			if (type in this.data.TypeChart && this.runEvent('Immunity', pokemon, null, null, type)) return false;
		},
		onEffectiveness: function (typeMod, target, type, move) {
			// The effectiveness of Freeze Dry on Water isn't reverted
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.getImmunity(move, type)) return 1;
			return -typeMod;
		}
	},
	{
		name: "Almost Any Ability",
		desc: [
			"Pok&eacute;mon can use any ability, barring the few that are banned.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3528058/\">Almost Any Ability</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3538917/\">Almost Any Ability Viability Ranking</a>"
		],
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Ability Clause', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Ignore Illegal Abilities',
			'Arceus', 'Archeops', 'Bisharp', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon',
			'Ho-Oh', 'Hoopa-Unbound', 'Keldeo', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Mamoswine', 'Mewtwo', 'Palkia',
			'Rayquaza', 'Regigigas', 'Reshiram', 'Shedinja', 'Slaking', 'Smeargle', 'Terrakion', 'Weavile', 'Xerneas', 'Yveltal',
			'Zekrom',
			'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite', 'Soul Dew', 'Chatter'
		],
		validateSet: function (set) {
			var bannedAbilities = {'Aerilate': 1, 'Arena Trap': 1, 'Contrary': 1, 'Fur Coat': 1, 'Huge Power': 1, 'Imposter': 1, 'Parental Bond': 1, 'Protean': 1, 'Pure Power': 1, 'Shadow Tag': 1, 'Simple':1, 'Speed Boost': 1, 'Wonder Guard': 1};
			if (set.ability in bannedAbilities) {
				var template = this.getTemplate(set.species || set.name);
				var legalAbility = false;
				for (var i in template.abilities) {
					if (set.ability === template.abilities[i]) legalAbility = true;
				}
				if (!legalAbility) return ['The ability ' + set.ability + ' is banned on Pok\u00e9mon that do not naturally have it.'];
			}
		}
	},
	{
		name: "STABmons",
		desc: [
			"Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3493081/\">STABmons</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3512215/\">STABmons Viability Ranking</a>"
		],
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Ignore STAB Moves',
			'Arceus', 'Blaziken', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Diggersby', 'Genesect', 'Giratina', 'Giratina-Origin', 'Greninja',
			'Groudon', 'Ho-Oh', 'Keldeo', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Landorus', 'Lugia', 'Mewtwo', 'Palkia',
			'Porygon-Z', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Sylveon', 'Xerneas', 'Yveltal', 'Zekrom',
			'Aerodactylite', 'Altarianite', 'Gengarite', 'Kangaskhanite', "King's Rock", 'Lopunnite', 'Lucarionite', 'Mawilite', 'Metagrossite', 'Razor Fang',
			'Salamencite', 'Slowbronite', 'Soul Dew'
		]
	},
	{
		name: "LC UU",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3523929/\">LC UU</a>"],
		section: "Other Metagames",

		maxLevel: 5,
		ruleset: ['LC'],
		banlist: ['Abra', 'Aipom', 'Archen', 'Bunnelby', 'Carvanha', 'Chinchou', 'Cottonee', 'Croagunk', 'Diglett',
			'Drilbur', 'Dwebble', 'Elekid', 'Ferroseed', 'Fletchling', 'Foongus', 'Gastly', 'Gothita', 'Honedge', 'Larvesta',
			'Lileep', 'Magnemite', 'Mienfoo', 'Munchlax', 'Omanyte', 'Onix', 'Pawniard', 'Ponyta', 'Porygon', 'Scraggy',
			'Shellder', 'Snivy', 'Snubbull', 'Spritzee', 'Staryu', 'Stunky', 'Surskit', 'Timburr', 'Tirtouga', 'Vullaby',
			'Shell Smash', 'Corphish', 'Pancham', 'Vulpix', 'Zigzagoon'
		]
	},
	{
		name: "Hackmons Cup",
		section: "Other Metagames",

		team: 'randomHC',
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "2v2 Doubles",
		desc: [
			"Double battle where you bring four Pok&eacute;mon to Team Preview and choose only two.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3505227/\">2v2 Doubles</a>"
		],
		section: "Other Metagames",

		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Doubles OU'],
		banlist: ['Perish Song'],
		validateTeam: function (team, format) {
			if (team.length > 4) return ['You may only bring up to four Pok\u00e9mon.'];
		},
		onBegin: function () {
			this.p1.pokemon = this.p1.pokemon.slice(0, 2);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 2);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Averagemons",
		desc: [
			"Every Pok&eacute;mon has a stat spread of 100/100/100/100/100/100.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3526481/\">Averagemons</a>"
		],
		section: "Other Metagames",

		searchShow: false,
		mod: 'averagemons',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Sableye + Prankster', 'Shedinja', 'Smeargle', 'Venomoth',
			'DeepSeaScale', 'DeepSeaTooth', 'Eviolite', 'Gengarite', 'Kangaskhanite', 'Light Ball', 'Mawilite', 'Medichamite', 'Soul Dew', 'Thick Club',
			'Arena Trap', 'Huge Power', 'Pure Power', 'Shadow Tag', 'Chatter'
		]
	},
	{
		name: "Hidden Type",
		desc: [
			"Pok&eacute;mon have an added type determined by their IVs. Same as the Hidden Power type.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3516349/\">Hidden Type</a>"
		],
		section: "Other Metagames",

		searchShow: false,
		mod: 'hiddentype',
		ruleset: ['OU']
	},
	{
		name: "OU Theorymon",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3541537/\">OU Theorymon</a>"],
		section: "Other Metagames",

		mod: 'theorymon',
		searchShow: false,
		ruleset: ['OU']
	},
	{
		name: "Gen-NEXT OU",
		section: "Other Metagames",

		mod: 'gennext',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard NEXT', 'Team Preview'],
		banlist: ['Uber']
	},
	{
		name: "Monotype Random Battle",
		section: "Other Metagames",

		team: 'randomMonotype',
		searchShow: false,
		ruleset: ['Pokemon', 'Same Type Clause', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod']
	},

	// BW2 Singles
	///////////////////////////////////////////////////////////////////
/*
	{
		name: "[Gen 5] OU",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3509218/#post-5522693\">BW Resources</a>"],
		section: "BW2 Singles",
		column: 3,

		mod: 'gen5',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew']
	},
	{
		name: "[Gen 5] Ubers",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3509218/#post-5522693\">BW Resources</a>"],
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['Pokemon', 'Team Preview', 'Standard Ubers'],
		banlist: []
	},
	{
		name: "[Gen 5] UU",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3509218/#post-5522693\">BW Resources</a>"],
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['[Gen 5] OU'],
		banlist: ['OU', 'BL', 'Drought', 'Sand Stream', 'Snow Warning']
	},
	{
		name: "[Gen 5] RU",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3509218/#post-5522693\">BW Resources</a>"],
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['[Gen 5] UU'],
		banlist: ['UU', 'BL2', 'Shell Smash + Baton Pass', 'Snow Warning']
	},
	{
		name: "[Gen 5] NU",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3509218/#post-5522693\">BW Resources</a>"],
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['[Gen 5] RU'],
		banlist: ['RU', 'BL3', 'Prankster + Assist']
	},
	{
		name: "[Gen 5] LC",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3509218/#post-5522693\">BW Resources</a>"],
		section: "BW2 Singles",

		mod: 'gen5',
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Berry Juice', 'Soul Dew', 'Dragon Rage', 'Sonic Boom', 'LC Uber', 'Gligar', 'Scyther', 'Sneasel', 'Tangela']
	},
	{
		name: "[Gen 5] GBU Singles",
		section: "BW2 Singles",

		mod: 'gen5',
		searchShow: false,
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview GBU'],
		banlist: ['Dark Void', 'Sky Drop'],
		onBegin: function () {
			this.debug('cutting down to 3');
			this.p1.pokemon = this.p1.pokemon.slice(0, 3);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 3);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "[Gen 5] Custom Game",
		section: "BW2 Singles",

		mod: 'gen5',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod']
	},

	// BW2 Doubles
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 5] Doubles OU",
		section: 'BW2 Doubles',
		column: 3,

		mod: 'gen5',
		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo',
			'Palkia', 'Rayquaza', 'Reshiram', 'Zekrom', 'Soul Dew', 'Dark Void', 'Sky Drop'
		]
	},
	{
		name: "[Gen 5] GBU Doubles",
		section: 'BW2 Doubles',

		mod: 'gen5',
		gameType: 'doubles',
		searchShow: false,
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview VGC'],
		banlist: ['Dark Void', 'Sky Drop'],
		onBegin: function () {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0, 4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "[Gen 5] Doubles Custom Game",
		section: 'BW2 Doubles',

		mod: 'gen5',
		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod']
	},

	// Past Generations
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 4] OU",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3509218/#post-5522692\">DPP Resources</a>"],
		section: "Past Generations",
		column: 3,

		mod: 'gen4',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber']
	},
	{
		name: "[Gen 4] Ubers",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3509218/#post-5522692\">DPP Resources</a>"],
		section: "Past Generations",

		mod: 'gen4',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Arceus']
	},
	{
		name: "[Gen 4] UU",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3509218/#post-5522692\">DPP Resources</a>"],
		section: "Past Generations",

		mod: 'gen4',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'OU', 'BL']
	},
	{
		name: "[Gen 4] LC",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3509218/#post-5522692\">DPP Resources</a>"],
		section: "Past Generations",

		mod: 'gen4',
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Little Cup'],
		banlist: ['Berry Juice', 'DeepSeaTooth', 'Dragon Rage', 'Sonic Boom', 'Meditite', 'Misdreavus', 'Murkrow', 'Scyther', 'Sneasel', 'Tangela', 'Yanma']
	},
	{
		name: "[Gen 4] Custom Game",
		section: "Past Generations",

		mod: 'gen4',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions
		ruleset: ['Cancel Mod']
	},
	{
		name: "[Gen 4] Doubles Custom Game",
		section: 'Past Generations',

		mod: 'gen4',
		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions
		ruleset: ['Cancel Mod']
	},
	{
		name: "[Gen 3] OU",
		section: "Past Generations",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3509218/#post-5522690\">ADV Resources</a>"],

		mod: 'gen3',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'Smeargle + Ingrain']
	},
	{
		name: "[Gen 3] Ubers",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3509218/#post-5522690\">ADV Resources</a>"],
		section: "Past Generations",

		mod: 'gen3',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Wobbuffet + Leftovers']
	},
	{
		name: "[Gen 3] Custom Game",
		section: "Past Generations",

		mod: 'gen3',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "[Gen 2] OU",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3509218/#post-5522689\">GSC Resources</a>"],
		section: "Past Generations",

		mod: 'gen2',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber']
	},
	{
		name: "[Gen 2] Random Battle",
		section: "Past Generations",

		mod: 'gen2',
		searchShow: false,
		team: 'random',
		ruleset: ['Pokemon', 'Standard']
	},
	{
		name: "[Gen 2] Custom Game",
		section: "Past Generations",

		mod: 'gen2',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "[Gen 1] OU",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3509218/#post-5522688\">RBY Resources</a>"],
		section: "Past Generations",

		mod: 'gen1',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber']
	},
	{
		name: "[Gen 1] Ubers",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3509218/#post-5522688\">RBY Resources</a>"],
		section: "Past Generations",

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
		banlist: []
	},
	{
		name: "[Gen 1] OU (tradeback)",
		section: "Past Generations",

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Uber', 'Unreleased', 'Illegal',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember'
		]
	},
	{
		name: "[Gen 1] Random Battle",
		section: "Past Generations",

		mod: 'gen1',
		team: 'random',
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "[Gen 1] Challenge Cup",
		section: "Past Generations",

		mod: 'gen1',
		team: 'randomCC',
		searchShow: false,
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "[Gen 1] Stadium",
		section: "Past Generations",

		mod: 'stadium',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: ['Uber',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember'
		]
	},
	{
		name: "[Gen 1] Custom Game",
		section: "Past Generations",

		mod: 'gen1',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	}
*/
];
