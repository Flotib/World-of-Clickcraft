var app = new Vue({
	el: '#app',
	data: {
		step: 0,
		currentEnemy: 0,
		player: {
			damageMin: 1, //test
			damageMax: 2000,
			level: 1,
			xpToNextLevel: null,
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
		hoverxp: false,
		
	},
	
	watch: {
		currentEnemy: function (enemy, oldenemy) {
			this.enemies[oldenemy].hp = this.enemies[oldenemy].maxHp
			this.step = 0
		},
		
		'player.level': function () {
			this.xpToNextLevelCalc()
		},
		
		'player.xp': function () {
			if (this.player.xp >= this.player.xpToNextLevel) {
				this.levelup()
			}
		},
	},

	computed: {
		
	},

	methods: {
		
		between(x, min, max) {
			return x >= min && x <= max
		},
		
		difficultyColor(enemy) { //One day I'll rework this shit
			if (this.between(this.player.level, 1, 9)) {
				if (this.player.level - 5 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 4 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.between(this.player.level, 10, 19)) {
				if (this.player.level - 6 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 5 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.between(this.player.level, 20, 29)) {
				if (this.player.level - 7 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 6 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.between(this.player.level, 30, 39)) {
				if (this.player.level - 8 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 7 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.between(this.player.level, 40, 49)) {
				if (this.player.level - 9 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 8 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.player.level == 50) {
				if (this.player.level - 10 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 9 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.between(this.player.level, 51, 54)) {
				if (this.player.level - 11 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 10 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.between(this.player.level, 55, 56)) {
				if (this.player.level - 12 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 11 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.player.level == 57) {
				if (this.player.level - 9 >= enemy.level) {
					return 'graylevel'
				} else if (this.player.level - 8 <= enemy.level && this.player.level - 3 >= enemy.level) {
					return 'greenlevel' }
			} else if (this.between(this.player.level, 58, 59)) {
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
			this.monsterXp(enemy)
			this.player.money += this.rand(enemy.minMoney, enemy.maxMoney)
			if (this.player.progression <= this.enemies.indexOf(enemy)) {
				this.player.progression++
			}
			this.step = 0
		},
		
		monsterXp(enemy) {
			let xp = 0
			if (this.difficultyColor(enemy)=='graylevel') {
				return
			}
			if (this.player.level == enemy.level) {
				xp =  this.MXP(this.player.level)
			} else if (this.player.level < enemy.level) {
				xp = this.MXP(this.player.level) * (1 + 0.05 * (enemy.level - this.player.level))
			} else if (this.player.level > enemy.level) {
				xp = this.MXP(this.player.level) * (1 - (this.player.level - enemy.level)/this.ZD())
			}
			
			if (enemy.type == 'elite') {
				xp*=2
			}
			
			this.player.xp+=Math.round(xp)
		},
		
		ZD() {
			if (this.between(this.player.level, 1, 7)) {
				return 5
			} else if (this.between(this.player.level, 8, 9)) {
				return 6
			} else if (this.between(this.player.level, 10, 11)) {
				return 7
			} else if (this.between(this.player.level, 12, 15)) {
				return 8
			} else if (this.between(this.player.level, 16, 19)) {
				return 9
			} else if (this.between(this.player.level, 20, 29)) {
				return 11
			} else if (this.between(this.player.level, 30, 39)) {
				return 12
			} else if (this.between(this.player.level, 40, 44)) {
				return 13
			} else if (this.between(this.player.level, 45, 49)) {
				return 14
			} else if (this.between(this.player.level, 50, 54)) {
				return 15
			} else if (this.between(this.player.level, 55, 59)) {
				return 16
			} else if (this.player.level >= 60) {
				return 17
			}
		},
		
		questXp(quest) {
			
		},
		
		xpToNextLevelCalc() {
			this.player.xpToNextLevel = Math.round(((8 * this.player.level) + this.Diff(this.player.level)) * this.MXP(this.player.level)/100)*100
		},
		
		Diff(CL) {
			if (CL <= 28) {
				return 0
			} else if (CL == 29) {
				return 1
			} else if (CL == 30) {
				return 3
			} else if (CL == 31) {
				return 6
			} else if (CL >= 32 && CL <= 59) {
				return 5*(CL-30)
			}
		},
		
		MXP(CL) {
			return 45 + (5 * CL)
		},
		
		levelup() {
			this.player.level++
			this.player.xp = this.player.xp - this.player.xpToNextLevel
			this.xpToNextLevelCalc()
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
					return '<span></span><span>'+silver+this.silverimg+'</span><span>'+String(copper).padStart(2, '0')+this.copperimg+'</span>'
				}
			} else { // gold.toLocaleString() works too
				return '<span>'+gold.toLocaleString().split(/\s/).join(' ')+this.goldimg+'</span><span>'+String(silver).padStart(2, '0')+this.silverimg+'</span><span>'+String(copper).padStart(2, '0')+this.copperimg+'</span>'
			}
		},
		
	},

	mounted() {
		
		this.xpToNextLevelCalc()
		
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