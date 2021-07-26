function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

var app = new Vue({
	el: '#app',
	data: {
		step: 0,
		player: {
			damage: 120, //test
			level: 1,
			xpToNextLevel: 400, // function later
			xp: 0,
			progression: 0,
		},
		enemies: [
			{
				name: 'Wolf',
				portrait: 'wolf1',
				maxHp: 120,
				hp: 120,
				level: null, //if null == this.enemies.indexOf(enemy)+1
				type: 'normal', // 'normal', 'rare', 'rareelite', 'elite'
			},
		],
		totalClicks: 0,
	},
	
	watch: {
		// totalClicks: function () {console.log('test')}, test
	},

	computed: {
		
	},

	methods: {

		formatHpLabel(enemy) {
			if (enemy.hp <= 0) {
				this.enemyDeadEvent(enemy)
				return "Dead"
			}

			return Math.ceil(enemy.hp) + " / " + Math.ceil(enemy.maxHp)
		},
		
		enemyDeadEvent(enemy) {
			console.log(this.enemies.indexOf(enemy)+1) //test
			enemy.hp = enemy.maxHp
			this.step = 0
		},
		
	},

	mounted() {
	
		setInterval(() => {
			if (this.step % 500 == 0) {
				this.step = 0;
				for (const enemy of this.enemies) {
					enemy.hp = enemy.maxHp
				}
			}
			this.step++
		}, 1000/50)
	},
})