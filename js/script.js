var app = new Vue({
	el: '#app',
	data: {
		step: 0,
		currentEnemy: 0,
		player: {
			damageMin: 1, //test
			damageMax: 2000,
			level: 1,
			xpToNextLevel: 400, // function later 
			xp: 0,
			progression: 0,
			money: 0,
		},
		enemies: [
			{
				name: 'Wolf',
				portrait: 'wolf1',
				maxHp: 120,
				hp: 120,
				level: null,
				type: 'normal', // 'normal', 'rare', 'rareelite', 'elite'
				killCount: 0,
				minMoney: null,
				maxMoney: null,
			},
			{
				name: 'Boar',
				portrait: 'wolf1',
				maxHp: 200,
				hp: 200,
				level: null,
				type: 'normal',
				killCount: 0,
				minMoney: null,
				maxMoney: null,
			},
		],
		totalClicks: 0,
		goldimg: '<img v-if="g>0" src="assets/img/ui/money/gold.png">',
		silverimg: '<img v-if="g>0" src="assets/img/ui/money/silver.png">',
		copperimg: '<img v-if="g>0" src="assets/img/ui/money/copper.png">',
		
	},
	
	watch: {
		currentEnemy: function (enemy, oldenemy) {
			this.enemies[oldenemy].hp = this.enemies[oldenemy].maxHp
			this.step = 0
		},
		
		'player.level': function () {
			this.difficultyColor(this.enemies[this.currentEnemy])
		},
	},

	computed: {
		
	},

	methods: {
		
		difficultyColor(enemy) { //One day I'll rework this shit
			if (this.player.level >= 1 && this.player.level <= 9) {
				if (this.player.level - 5 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 4 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.player.level >= 10 && this.player.level <= 19) {
				if (this.player.level - 6 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 5 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.player.level >= 20 && this.player.level <= 29) {
				if (this.player.level - 7 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 6 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.player.level >= 30 && this.player.level <= 39) {
				if (this.player.level - 8 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 7 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.player.level >= 40 && this.player.level <= 49) {
				if (this.player.level - 9 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 8 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.player.level == 50) {
				if (this.player.level - 10 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 9 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.player.level >= 51 && this.player.level <= 54) {
				if (this.player.level - 11 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 10 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.player.level >= 55 && this.player.level <= 56) {
				if (this.player.level - 12 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 11 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.player.level == 57) {
				if (this.player.level - 9 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 8 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.player.level >= 58 && this.player.level <= 59) {
				if (this.player.level - 12 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 11 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.player.level == 60) {
				if (this.player.level - 9 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 8 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			}
			
			if (this.player.level - 2 <= enemy.level && this.player.level + 2 >= enemy.level) {
				return 'yellowlevel'
			} else if (this.player.level + 3 <= enemy.level && this.player.level + 4 >= enemy.level) {
				return 'orangelevel'
			} else if (this.player.level + 5 <= enemy.level && this.player.level + 9 >= enemy.level) {
				return 'redlevel'
			} else if (this.player.level + 10 <= enemy.level) {
				return 'skulllevel' 
			}
		},
		
		rand(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		},

		autoLevelAttri(enemy) {
			if (enemy.level == null) {
				enemy.level = this.enemies.indexOf(enemy)+1
			}
		},
		
		autoMoneyAttri(enemy) { //https://www.desmos.com/calculator?lang=fr
			if (enemy.minMoney == null) {
				enemy.minMoney = Math.round((4*(enemy.level**2))/60+(enemy.level**2)/5+enemy.level)
			}
			if (enemy.maxMoney == null) {
				enemy.maxMoney = Math.round((5*(enemy.level**2))/60+(enemy.level**2)/5+3*enemy.level)
			}
		},
		
		damageEnemy(enemy) {
			enemy.hp-=this.rand(this.player.damageMin, this.player.damageMax)
		},

		formatHpLabel(enemy) {
			if (enemy.hp <= 0) {
				this.enemyDeadEvent(enemy)
				return "Dead"
			}

			return Math.ceil(enemy.hp) + " / " + Math.ceil(enemy.maxHp)
		},
		
		enemyDeadEvent(enemy) {
			enemy.hp = enemy.maxHp
			enemy.killCount++
			this.player.money += this.rand(enemy.minMoney, enemy.maxMoney)
			if (this.player.progression <= this.enemies.indexOf(enemy)) {
				this.player.progression++
			}
			this.step = 0
		},
		
		moneyStylizer(money) {
			let copper = money % 100
			let silver = Math.floor(money/100)
			if (silver >= 100) {
				silver = silver % 100
			}
			let gold = Math.floor(money/10000)
			
			
			if (gold == 0) {
				if (silver == 0) {
					return '<span></span><span></span><span>'+copper+this.copperimg+'</span>'
				} else {
					return '<span></span><span>'+String(silver).padStart(2, '0')+this.silverimg+'</span><span>'+String(copper).padStart(2, '0')+this.copperimg+'</span>'
				}
			} else {
				return '<span>'+gold+this.goldimg+'</span><span>'+String(silver).padStart(2, '0')+this.silverimg+'</span><span>'+String(copper).padStart(2, '0')+this.copperimg+'</span>'
			}
		},
		
	},

	mounted() {
		
		for (const monster of this.enemies) {
			this.autoLevelAttri(monster)
			this.autoMoneyAttri(monster)
		}
	
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