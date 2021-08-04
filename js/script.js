var app = new Vue({
	el: '#app',
	data: {
		step: 0,
		fps: 50,
		countdown: 10, //sec
		cursorX: null,
		cursorY: null,
		damageParticlesDuration: 6,
		damageParticles: [],
		currentEnemy: 0, // Need to rework this later (with a function) to be able to create differents array of enemies for dungeons and "raids"
		showEnemyInformations: false,
		player: {
			name: 'Player',
			baseMinDamage: 0,
			baseMaxDamage: 1,
			weaponMinDamage: 1,
			weaponMaxDamage: 1,
			level: 1,
			xpToNextLevel: null,
			xp: 0,
			progression: 0,
			money: 0,
		},
		enemies: [ // It will be converted to json later if I can
			{
				name: 'Wolf',
				portrait: 'wolf1',
				maxHp: 60,
				hp: 60,
				level: null,
				type: 'normal', // 'normal', 'rare', 'rareelite', 'elite', 'boss'
				killCount: 0,
				minMoney: null,
				maxMoney: null,
				levelenvironment: 'elwynn',
			},
			{
				name: 'Kobold',
				portrait: 'wolf1',
				maxHp: 110,
				hp: 110,
				level: null,
				type: 'normal',
				killCount: 0,
				minMoney: null,
				maxMoney: null,
				levelenvironment: 'elwynn',
			},
			{
				name: 'Bandit',
				portrait: 'wolf1',
				maxHp: 190,
				hp: 190,
				level: null,
				type: 'normal',
				killCount: 0,
				minMoney: null,
				maxMoney: null,
				levelenvironment: 'elwynn',
			},
			{
				name: 'Boar',
				portrait: 'wolf1',
				maxHp: 280,
				hp: 280,
				level: null,
				type: 'normal',
				killCount: 0,
				minMoney: null,
				maxMoney: null,
				levelenvironment: 'elwynn',
			},
			{
				name: 'Forest Spider',
				portrait: 'wolf1',
				maxHp: 200,
				hp: 200,
				level: null,
				type: 'normal',
				killCount: 0,
				minMoney: null,
				maxMoney: null,
				levelenvironment: 'elwynn',
			},
			{
				name: 'Murloc',
				portrait: 'wolf1',
				maxHp: 200,
				hp: 200,
				level: null,
				type: 'normal',
				killCount: 0,
				minMoney: null,
				maxMoney: null,
				levelenvironment: 'elwynn',
			},
			{
				name: 'Bear',
				portrait: 'wolf1',
				maxHp: 200,
				hp: 200,
				level: null,
				type: 'normal',
				killCount: 0,
				minMoney: null,
				maxMoney: null,
				levelenvironment: 'elwynn',
			},
			{
				name: 'Rivepaw Gnoll',
				portrait: 'wolf1',
				maxHp: 200,
				hp: 200,
				level: null,
				type: 'normal',
				killCount: 0,
				minMoney: null,
				maxMoney: null,
				levelenvironment: 'elwynn',
			},
		],
		totalClicks: 0,
		moneyPow: 2.6,
		goldimg: '<img v-if="g>0" src="assets/img/ui/money/gold.png">',
		silverimg: '<img v-if="g>0" src="assets/img/ui/money/silver.png">',
		copperimg: '<img v-if="g>0" src="assets/img/ui/money/copper.png">',
		hoverxp: false,
		
	},
	
	watch: {
		currentEnemy: function (enemy, oldenemy) {
			this.enemies[oldenemy].hp = this.enemies[oldenemy].maxHp
			this.step = 0
			this.countdown = this.enemies[enemy].type != 'normal' ? 30 : 10 // May change later
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
		
		gameInit(){
			this.xpToNextLevelCalc()
			
			for (const monster of this.enemies) {
				this.autoLevelAttri(monster)
				this.autoMoneyAttri(monster)
			}
		},
		
		getMouseCoords(e){
			this.cursorX = e.pageX;
			this.cursorY = e.pageY;
		},
		
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
			if (enemy.level < 16) {
				if (enemy.minMoney == null) {
					enemy.minMoney = Math.round(enemy.level**1.9)
				}
				if (enemy.maxMoney == null) {
					enemy.maxMoney = Math.round(3*(enemy.level**1.6))
				}
			} else if (this.between(enemy.level, 16, 35)) {
				if (enemy.minMoney == null) {
					enemy.minMoney = Math.round((((enemy.level**this.moneyPow)/36)*2000)/(36**(this.moneyPow-1)))
				}
				if (enemy.maxMoney == null) {
					enemy.maxMoney = Math.round((((enemy.level**this.moneyPow)/40)*3100)/(40**(this.moneyPow-1)))
				}
			} else if (enemy.level > 35) {
				if (enemy.minMoney == null) {
					enemy.minMoney = Math.round((((enemy.level**this.moneyPow)/60)*10000)/(60**(this.moneyPow-1)))
				}
				if (enemy.maxMoney == null) {
					enemy.maxMoney = Math.round((((enemy.level**this.moneyPow)/70)*18000)/(70**(this.moneyPow-1)))
				}
			}
		},
		
		totalMinDamage() {
			let minDamage = this.player.baseMinDamage + this.player.weaponMinDamage
			return Math.floor(minDamage)
		},
		
		totalMaxDamage() {
			let maxDamage = this.player.baseMaxDamage + this.player.weaponMaxDamage
			return Math.floor(maxDamage)
		},
		
		damageEnemy(enemy) {
			let damage = this.rand(this.totalMinDamage(), this.totalMaxDamage())
			this.clickParticles(damage)
			enemy.hp-=damage
		},

		formatHpLabel(enemy) {
			if (enemy.hp <= 0) {
				this.enemyDeadEvent(enemy)
				return "Dead" // a bit useless I know
			}

			return Math.ceil(enemy.hp) + " / " + Math.ceil(enemy.maxHp)
		},

		killToLevelUp(enemy) {
			let x = Math.ceil((this.player.xpToNextLevel-this.player.xp)/this.monsterXp(enemy))
			return x == 'Infinity' ? 'noxp' : x
		},
		
		enemyDeadEvent(enemy) {
			enemy.hp = enemy.maxHp
			enemy.killCount++
			this.playerXp(enemy)
			this.player.money += this.rand(enemy.minMoney, enemy.maxMoney)
			if (this.player.progression <= this.enemies.indexOf(enemy)) {
				this.player.progression++
			}
			this.step = 0
		},

		playerXp(enemy) {
			this.player.xp+=this.monsterXp(enemy)
		},
		
		monsterXp(enemy) {
			let xp = 0
			if (this.difficultyColor(enemy)=='graylevel') {
				return 0
			}
			if (this.player.level == enemy.level) {
				xp =  this.MXP(this.player.level)
			} else if (this.player.level < enemy.level) {
				xp = this.player.level + 4 > enemy.level ? (
					this.MXP(this.player.level) * (1 + 0.05 * (enemy.level - this.player.level))
				) : (
					this.MXP(this.player.level) * 1.2)
			} else if (this.player.level > enemy.level) {
				xp = this.MXP(this.player.level) * (1 - (this.player.level - enemy.level)/this.ZD())
			}
			
			if (enemy.type == 'elite') {
				xp*=2
			}
			
			return Math.round(xp)
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
		
		clickParticles(damage) {
			this.damageParticles.push({'posX': this.cursorX-this.rand(4, 16), 'posY': this.cursorY-34, 'output': damage, 'duration': this.damageParticlesDuration, 'id': this.totalClicks}) //6sec - X:8px and Y:14px to center on the knife point
			setTimeout(() => {
				this.damageParticles.shift();
			}, (this.damageParticlesDuration-1)*1000); //to be sure to delete it as soon as it disappear
		},

	},

	mounted() {
		
		window.addEventListener('mousemove',this.getMouseCoords);
		
		this.gameInit()
		
		setInterval(() => {
			if (this.step % (this.fps*this.countdown) == 0) {
				this.step = 0;
				for (const enemy of this.enemies) {
					enemy.hp = enemy.maxHp
				}
			}
			this.step++
		}, 1000/this.fps)
	},
})