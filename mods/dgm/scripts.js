exports.BattleScripts = {
	init: function () {
		//New Uber Moves
		this.modData('Learnsets', 'kyuremblack').learnset.boltstrike = ["6L0"];
		this.modData('Learnsets', 'kyuremblack').learnset.iciclecrash = ["6L0"];
		this.modData('Learnsets', 'kyuremwhite').learnset.blueflare = ["6L0"];
		this.modData('Learnsets', 'kyuremwhite').learnset.iciclecrash = ["6L0"];
		this.modData('Learnsets', 'xerneas').learnset.lightofruin = ["6L0"];
		
		//OU Tier New Learnsets
		delete this.modData('Learnsets', 'aegislash').learnset.sacredsword;
		delete this.modData('Learnsets', 'darkrai').learnset.sludgebomb;
		this.modData('Learnsets', 'diancie').learnset.playrough = ["6L0"];
		this.modData('Learnsets', 'diancie').learnset.powergem = ["6L0"];	
		delete this.modData('Learnsets', 'genesect').learnset.rockpolish;
		delete this.modData('Learnsets', 'genesect').learnset.thunder;
		delete this.modData('Learnsets', 'greninja').learnset.lowkick;
		delete this.modData('Learnsets', 'greninja').learnset.gunkshot;
		delete this.modData('Learnsets', 'kangaskhan').learnset.seismictoss;
		delete this.modData('Learnsets', 'kangaskhan').learnset.poweruppunch;
		this.modData('Learnsets', 'rotomwash').learnset.whirlpool = ["6L0"];
		
		//UU Tier New Learnsets
		this.modData('Learnsets', 'blissey').learnset.wish = ["6L0"];
		this.modData('Learnsets', 'darmanitan').learnset.calmmind = ["6L0"];
		this.modData('Learnsets', 'espeon').learnset.aurasphere = ["6L0"];
		this.modData('Learnsets', 'nidoqueen').learnset.powergem = ["6L0"];
		this.modData('Learnsets', 'rotomheat').learnset.heatwave = ["6L0"];
		this.modData('Learnsets', 'shuckle').learnset.leechseed = ["6L0"];
		this.modData('Learnsets', 'slurpuff').learnset.slackoff = ["6S666"];
		this.modData('Learnsets', 'umbreon').learnset.switcheroo = ["6L0"];
		this.modData('Learnsets', 'vaporeon').learnset.recover = ["6L0"];
		this.modData('Learnsets', 'zoroark').learnset.fireblast = ["6L0"];
		this.modData('Learnsets', 'zoroark').learnset.sludgebomb = ["6L0"];
		
		//RU Tier New Learnsets
		this.modData('Learnsets', 'braviary').learnset.skyuppercut = ["6L0"];
		this.modData('Learnsets', 'camerupt').learnset.slackoff = ["6L0"];
		this.modData('Learnsets', 'camerupt').learnset.powergem = ["6L0"];
		this.modData('Learnsets', 'druddigon').learnset.stoneedge = ["6L0"];
		this.modData('Learnsets', 'glalie').learnset.earthpower = ["6L0"];
		this.modData('Learnsets', 'glalie').learnset.hypervoice = ["6L0"];
		this.modData('Learnsets', 'glalie').learnset.focusblast = ["6L0"];
		this.modData('Learnsets', 'jolteon').learnset.nastyplot = ["6L0"];
		this.modData('Learnsets', 'jolteon').learnset.paraboliccharge = ["6L0"];
		this.modData('Learnsets', 'meloetta').learnset.lunardance = ["6L0"];
		this.modData('Learnsets', 'meloetta').learnset.dragondance = ["6L0"];
		this.modData('Learnsets', 'meloetta').learnset.vacuumwave = ["6L0"];
		this.modData('Learnsets', 'meloetta').learnset.machpunch = ["6L0"];
		this.modData('Learnsets', 'rotommow').learnset.leaftornado = ["6L0"];
		this.modData('Learnsets', 'skuntank').learnset.clearsmog = ["6L0"];
		this.modData('Learnsets', 'spiritomb').learnset.stealthrock = ["6L0"];
		this.modData('Learnsets', 'spiritomb').learnset.darkvoid = ["6L0"];
		this.modData('Learnsets', 'spiritomb').learnset.stoneedge = ["6L0"];
		this.modData('Learnsets', 'spiritomb').learnset.powergem = ["6L0"];
		this.modData('Learnsets', 'steelix').learnset.headsmash = ["6L0"];
		this.modData('Learnsets', 'steelix').learnset.coil = ["6L0"];

		
		//NU Tier New Learnsets
		this.modData('Learnsets', 'arbok').learnset.dragonrush = ["6L0"];
		this.modData('Learnsets', 'arbok').learnset.dragondance = ["6L0"];
		this.modData('Learnsets', 'arbok').learnset.dragonpulse = ["6L0"];
		this.modData('Learnsets', 'arbok').learnset.dracometeor = ["6L0"];

		this.modData('Learnsets', 'archeops').learnset.powergem = ["6L0"];

		this.modData('Learnsets', 'articuno').learnset.defog = ["6L0"];
		this.modData('Learnsets', 'articuno').learnset.healbell = ["6L0"];

		this.modData('Learnsets', 'audino').learnset.moonblast = ["6L0"];

		this.modData('Learnsets', 'aurorus').learnset.recover = ["6L0"];
		this.modData('Learnsets', 'aurorus').learnset.powergem = ["6L0"];

		this.modData('Learnsets', 'beautifly').learnset.airslash = ["6L0"];
		this.modData('Learnsets', 'beautifly').learnset.ominouswind = ["6L0"];

		this.modData('Learnsets', 'beheeyem').learnset.powergem = ["6L0"];

		this.modData('Learnsets', 'bellossom').learnset.quiverdance = ["6L0"];
		this.modData('Learnsets', 'bellossom').learnset.weatherball = ["6L0"];

		this.modData('Learnsets', 'carracosta').learnset.rapidspin = ["6L0"];

		this.modData('Learnsets', 'cherrim').learnset.flamethrower = ["6L0"];
		this.modData('Learnsets', 'cherrim').learnset.fireblast = ["6L0"];
		this.modData('Learnsets', 'cherrim').learnset.flameburst = ["6L0"];
		this.modData('Learnsets', 'cherrim').learnset.flareblitz = ["6L0"];

		this.modData('Learnsets', 'dedenne').learnset.dazzlinggleam = ["6L0"];

		this.modData('Learnsets', 'emolga').learnset.nastyplot = ["6L0"];
		this.modData('Learnsets', 'emolga').learnset.defog = ["6L0"];

		this.modData('Learnsets', 'flareon').learnset.swordsdance = ["6L0"];

		this.modData('Learnsets', 'glaceon').learnset.freezedry = ["6L0"];

		this.modData('Learnsets', 'gogoat').learnset.grassyterrain = ["6L0"];

		this.modData('Learnsets', 'grumpig').learnset.slackoff = ["6L0"];

		this.modData('Learnsets', 'leavanny').learnset.twinneedle = ["6L0"];
		this.modData('Learnsets', 'leavanny').learnset.naturepower = ["6L0"];

		this.modData('Learnsets', 'lilligant').learnset.psychic = ["6L0"];
		this.modData('Learnsets', 'lilligant').learnset.earthpower = ["6L0"];

		this.modData('Learnsets', 'magmortar').learnset.darkpulse = ["6L0"];
		this.modData('Learnsets', 'magmortar').learnset.aurasphere = ["6L0"];

		this.modData('Learnsets', 'minun').learnset.disable = ["6L0"];
		this.modData('Learnsets', 'minun').learnset.electricterrain = ["6L0"];
		this.modData('Learnsets', 'minun').learnset.followme = ["6L0"];
		this.modData('Learnsets', 'minun').learnset.afteryou = ["6L0"];
		this.modData('Learnsets', 'minun').learnset.electrify = ["6L0"];
		this.modData('Learnsets', 'minun').learnset.mefirst = ["6L0"];
		delete this.modData('Learnsets', 'minun').learnset.encore;

		this.modData('Learnsets', 'mismagius').learnset.moonblast = ["6L0"];
		this.modData('Learnsets', 'mismagius').learnset.moonlight = ["6L0"];

		this.modData('Learnsets', 'mrmime').learnset.drainingkiss = ["6L0"];

		this.modData('Learnsets', 'muk').learnset.superpower = ["6L0"];
		this.modData('Learnsets', 'muk').learnset.knockoff = ["6L0"];
		this.modData('Learnsets', 'muk').learnset.slackoff = ["6L0"];

		this.modData('Learnsets', 'musharna').learnset.recover = ["6L0"];

		this.modData('Learnsets', 'pachirisu').learnset.wish = ["6L0"];
		this.modData('Learnsets', 'pachirisu').learnset.healbell = ["6L0"];
		this.modData('Learnsets', 'pachirisu').learnset.foulplay = ["6L0"];

		this.modData('Learnsets', 'phione').learnset.tailglow = ["6L0"];
		this.modData('Learnsets', 'phione').learnset.heartswap = ["6L0"];

		this.modData('Learnsets', 'plusle').learnset.electricterrain = ["6L0"];
		this.modData('Learnsets', 'plusle').learnset.followme = ["6L0"];
		this.modData('Learnsets', 'plusle').learnset.flamethrower = ["6L0"];
		this.modData('Learnsets', 'plusle').learnset.overheat = ["6L0"];

		this.modData('Learnsets', 'politoed').learnset.whirlpool = ["6L0"];

		this.modData('Learnsets', 'rotom').learnset.hypervoice = ["6L0"];

		this.modData('Learnsets', 'rotomfan').learnset.hurricane = ["6L0"];

		this.modData('Learnsets', 'spinda').learnset.topsyturvy = ["6L0"];

		this.modData('Learnsets', 'throh').learnset.meditate = ["6L0"];
		this.modData('Learnsets', 'throh').learnset.slackoff = ["6L0"];


		this.modData('Learnsets', 'vanilluxe').learnset.chargebeam = ["6L0"];
		this.modData('Learnsets', 'vanilluxe').learnset.recover = ["6L0"];

		this.modData('Learnsets', 'watchog').learnset.suckerpunch = ["6L0"];
		this.modData('Learnsets', 'watchog').learnset.nightslash = ["6L0"];

		this.modData('Learnsets', 'weezing').learnset.recover = ["6L0"];

		this.modData('Learnsets', 'wobbuffet').learnset.recover = ["6L0"];
		this.modData('Learnsets', 'wobbuffet').learnset.magiccoat = ["6L0"];

		this.modData('Learnsets', 'zebstrika').learnset.flareblitz = ["6L0"];
		
		this.modData('Learnsets', 'bellossom').learnset.leechseed = ["6L0"];
		this.modData('Learnsets', 'hoopa').learnset.shadowsneak = ["6L0"];
		
		//Pokemon that got new abilities and had wish was crashing team validator. oops.
		this.modData('Learnsets', 'minun').learnset.wish = ["6L0"];
		this.modData('Learnsets', 'plusle').learnset.wish = ["6L0"];
		this.modData('Learnsets', 'eevee').learnset.wish = ["6L0"];
		this.modData('Learnsets', 'audino').learnset.wish = ["6L0"];
		this.modData('Learnsets', 'lickilicky').learnset.wish = ["6L0"];
		this.modData('Learnsets', 'delphox').learnset.wish = ["6L0"];
		this.modData('Learnsets', 'wish').learnset.wish = ["6L0"];

		//Universal Release Buttons
		for (var i in this.data.FormatsData) {
			this.modData('FormatsData', i).unreleasedHidden = false;
		};
		for (var i in this.data.Items) {
			this.modData('Items', i).isUnreleased = false;
		};
		for (var i in this.data.Moves) {
			this.modData('Moves', i).isUnreleased = false;
		};
		for (var a in this.data.FormatsData) {
			this.modData('FormatsData', a).isUnreleased = false;
		};
	}
};
