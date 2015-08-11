exports.BattleFormats = {
     onStart: function () {
       // Set up god, because the Pokemon positions during battle switch around.
       for (var i = 0; i < this.sides.length; i++) {
         this.sides[i].god = this.sides[i].pokemon[0];
       }
     },
};