var app = new Vue({
	el: '#app',
	data: {
		step: 0,
		fps: 50,
		countdown: 10, //sec
		cursorX: null,
		cursorY: null,
		keyPressed: false,
		damageParticlesDuration: 6,
		damageParticles: [],
		errorMessages: [],
		currentEnemy: 0, // Need to rework this later (with a function) to be able to create differents array of enemies for dungeons and "raids"
		currentEnemyPool: 0,
		disabledEnemies: [],
		showEnemyInformations: false,
		giveItemId: 0,
		rareChance: 50, // start at 50 so 2% chance to get a rare mob - could be upgraded later
		selectedItem: {
			selection: false,
			item: {},
			slotId: null,
			container: null,
		},
		player: {
			name: 'Player',
			baseMinDamage: 0,
			baseMaxDamage: 1,
			minDamage: null,
			maxDamage: null,
			level: 1,
			xpToNextLevel: null,
			xp: 0,
			progression: 0,
			money: 0,
			diamond: 0,
			bag: {
				open: true,
				level: 1,
				bagSpace: 8,
				slots: [],
			},
			weapon: {
				item: [],
				slotId: 0,
			},
			trinket: {
				item: [],
				slotId: 1,
			},
			trinket2: {
				item: [],
				slotId: 2,
			},
		},
		enemies: [ // It will be converted to json later if I can
			{
				name: 'Wolf', //Placeholder wolf
				portrait: 'wolf1',
				maxHp: 60,
				hp: 60,
				level: null,
				poolLevel: 0,
				type: 'normal', // 'normal', 'rare', 'rareelite', 'elite', 'boss'
				killCount: 0,
				minMoney: null,
				maxMoney: null,
				levelenvironment: 'elwynn',
			},
			{
				name: 'Wolf',
				portrait: 'wolf1',
				maxHp: 60,
				hp: 60,
				level: null,
				poolLevel: 0,
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
				poolLevel: 0,
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
				poolLevel: 5,
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
				poolLevel: 5,
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
				poolLevel: 10,
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
				poolLevel: 10,
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
				poolLevel: 10,
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
				poolLevel: 10,
				type: 'normal',
				killCount: 0,
				minMoney: null,
				maxMoney: null,
				levelenvironment: 'elwynn',
			},
		],
		items: [
			{
				id: 1,
				name: 'One',
				equipable: true,
				slotType: 'weapon',
				icon: 'inv_sword_04',
				baseMinDamage: 1,
				minDamage: 1,
				baseMaxDamage: 2,
				maxDamage: 2,
			},
			{
				id: 2,
				name: 'Two',
				equipable: false,
				icon: null,
			},
			{
				id: 4,
				name: 'Three',
				equipable: true,
				slotType: 'trinket', // player will have 2 more equipables for 2 trinkets
				icon: null,
			},
		],
		enemyPool: [], //Putting this variable here for now
		totalClicks: 0,
		moneyPow: 2.6,
		goldimg: '<img src="assets/img/ui/money/gold.png">',
		silverimg: '<img src="assets/img/ui/money/silver.png">',
		copperimg: '<img src="assets/img/ui/money/copper.png">',
		diamondimg: '<img src="assets/img/ui/money/diamond.png">',
		hoverxp: false,
	},
	
	watch: {
		currentEnemy: function (enemy, oldenemy) {
			this.enemies[oldenemy].hp = this.enemies[oldenemy].maxHp
			this.step = 0
			this.countdown = this.enemies[enemy].type != 'normal' ? 30 : 10 // May change later
		},

		'currentEnemyPool': function () {
			if(this.currentEnemyPool == this.enemyPool.length) this.currentEnemyPool = this.enemyPool.length - 1
			if(this.currentEnemyPool < 0) this.currentEnemyPool = 0
			this.spawnEnemy(false)
		},

		'player.level': function () {
			this.xpToNextLevelCalc()
		},
		
		'player.xp': function () {
			if (this.player.xp >= this.player.xpToNextLevel) {
				this.levelup()
			}
		},

		'player.money': function () {
			let diamondvalue = 100000000000
			if (this.player.money >= diamondvalue) {
				this.player.diamond++
				this.player.money-=diamondvalue
			}
		},

		'player.bag.bagSpace': function (slots, oldslots) {
			this.updateSlots(this.player.bag.slots, slots)
		},
		
	},

	computed: {
		unequipButtonStyles() {
			let color = 'gray'

			if (this.player.weapon.item.length > 0 && this.getFirstEmptySpace(this.player.bag.slots) !== false && this.selectedItem.container == 'playerWeapon') {
				color = 'green'
			}

			return {
				backgroundColor: color,
			}
		},

		equipButtonStyles() {
			let color = 'gray'

			if (this.selectedItem.container == 'playerBag' && this.selectedItem.item.equipable) {
				color = 'green'
			}

			return {
				backgroundColor: color,
			}
		},

		bagWidth() {
			let size = 208

			if (this.player.bag.bagSpace > 24) {
				size = 216
				if (this.player.bag.bagSpace > 52) {
					size = 320
				}
			}

			return {
				width: size+'px',
			}
		},
	},

	methods: {
		
		gameInit(){
			this.xpToNextLevelCalc()
			this.updateSlots(this.player.bag.slots, this.player.bag.bagSpace)
			//this.initializeEnemyPool()
			
			for (const monster of this.enemies) {
				this.autoLevelAttri(monster)
				this.autoMoneyAttri(monster)
			}
		},
		
		getMouseCoords(e){
			this.cursorX = e.pageX
			this.cursorY = e.pageY
		},
		
		between(x, min, max) {
			return x >= min && x <= max
		},

		isGrayLevel(){
			if(this.between(this.player.level, 1, 5)) return 0
			if(this.between(this.player.level, 6, 49)){
				return(this.player.level - Math.floor(this.player.level / 10) - 5)
			}
			if(this.player.level == 50) return 40
			if(this.between(this.player.level, 51, 59)){
				return(this.player.level - Math.floor(this.player.level / 5) - 1)
			}
			if(this.player.level == 60) return 51
		},

		difficultyColor(enemy) {	
			if(enemy.level <= this.isGrayLevel()) return 'graylevel'	
			if(enemy.level >= this.player.level + 10) return 'skulllevel'
			if(enemy.level <= this.player.level - 3) return 'greenlevel'
			if(enemy.level >= this.player.level + 5) return 'redlevel'
			if(enemy.level >= this.player.level + 3) return 'orangelevel'
			if(enemy.level <= this.player.level + 2) return 'yellowlevel'
			if(enemy.level >= this.player.level - 2) return 'yellowlevel'
		},
		
		rand(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min)
		},

		rng(chance) { // 1 / chance * 100 = % - /!\ chance is not a percentage
			let loot = false
			if (this.rand(1, chance) == this.rand(1, chance)) {
				loot = true
			}

			return loot
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
			let minDamage = this.player.baseMinDamage
			if (this.player.weapon.item.length > 0) {
		
			}

			return Math.floor(minDamage)
		},
		
		totalMaxDamage() {
			let maxDamage = this.player.baseMaxDamage


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

		//Fills the enemy pool
		initializeEnemyPool(){
			let enemiesArray = [];
			let finishedPoolArray = [];
			this.enemies.forEach(enemy => {
				enemiesArray.push(enemy)
			});

			//Simple bubble sort so enemies don't have to be sorted by level
			//by hand in the enemy list
			while(true){
				let flag = true;
				for(let i=0; i<enemiesArray.length - 1;i++){
					let temp;
					if(enemiesArray[i].poolLevel > enemiesArray[i+1].poolLevel){
						temp = enemiesArray[i];
						enemiesArray[i] = enemiesArray[i+1];
						enemiesArray[i+1] = temp;
						flag = false;
					}
				}
				if(flag) break
			}

			//Finally, add each enemy to the correct pool
			let tempArray = []; currentLevel = enemiesArray[0].poolLevel;
			enemiesArray.forEach(enemy => {
				if(enemy.poolLevel == currentLevel && enemy.poolLevel < 1000) tempArray.push(enemy)
				else{
					currentLevel = enemy.poolLevel;
					finishedPoolArray.push(tempArray); 
					tempArray = [enemy];
				}
			});
			if(tempArray.length > 0) finishedPoolArray.push(tempArray); 
			this.enemyPool = finishedPoolArray;
		},

		printEnemyPools(){
			this.enemyPool.forEach(pool => {
				let poolOut = ""
				pool.forEach(enemy => {
					poolOut += enemy.name + " "
				});
				alert(poolOut)
			});
		},

		//Toggles generating enemy on/off
		toggleEnemy(enemy){
			if(this.disabledEnemies.includes(enemy)) this.disabledEnemies.splice(this.disabledEnemies.indexOf(enemy), 1);
			else this.disabledEnemies.push(enemy)
		},

		//Functions that will probably be needed for the mob disable box
		getCurrentEnemyPool(){
			return(this.enemyPool[this.currentEnemyPool]);
		},

		getEnemyDisabled(enemy){
			return(this.disabledEnemies.includes(enemy));
		},
		
		chooseEnemy(){
			let roll = this.rand(0, this.enemyPool[this.currentEnemyPool].length - 1)
			console.log(roll)
			let newEnemy = this.enemyPool[this.currentEnemyPool][roll]
			if(this.disabledEnemies.includes(newEnemy)) return(this.chooseEnemy)
			return newEnemy
		},

		//Generates a new enemy, this enemy can be rare
		//Due to the way enemies are stored and the classless structure of this game
		//I had to approach this by creating a new entry in the enemies list
		//enemies[0] is now a placeholder with the stats of a wolf
		//however, it's overwritten when generating new enemies
		generateEnemy(enemy=this.chooseEnemy(), allowRare=true){
			let generatedEnemy = this.enemies[0];
			Object.assign(generatedEnemy, enemy);
			if(this.rng(this.rareChance) && allowRare){ 
				//Lazy formula below
				generatedEnemy.name = "Rare " + generatedEnemy.name;
				generatedEnemy.type = "rare"; 
				generatedEnemy.maxHp *= 2; generatedEnemy.hp = generatedEnemy.maxHp;
			}
			return generatedEnemy;
		},

		spawnEnemy(allowRare=true){
			Object.assign(this.enemies[0], this.enemies[1]); //Dirty hackfix
			enemy = this.generateEnemy(this.chooseEnemy(), allowRare)
			enemy.hp = enemy.maxHp;
		},

		enemyDeadEvent(enemy) {
			this.spawnEnemy()
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
		
		moneyStylizer(money, diamond) {
			let copper = money % 100
			let silver = Math.floor(money/100)
			if (silver >= 100) {
				silver = silver % 100
			}
			let gold = Math.floor(money/10000)
			
			if (diamond == 0 || diamond == null) {
				if (gold == 0) {
					if (silver == 0) {
						return '<span></span><span></span><span></span><span>'+copper+this.copperimg+'</span>'
					} else {
						return '<span></span><span></span><span>'+silver+this.silverimg+'</span><span>'+String(copper).padStart(2, '0')+this.copperimg+'</span>'
					}
				} else { // gold.toLocaleString() works too
					return '<span></span><span>'+gold.toLocaleString().split(/\s/).join(' ')+this.goldimg+'</span><span>'+String(silver).padStart(2, '0')+this.silverimg+'</span><span>'+String(copper).padStart(2, '0')+this.copperimg+'</span>'
				}
			} else {
				return '<span>'+diamond.toLocaleString().split(/\s/).join(' ')+this.diamondimg+'</span><span>'+gold.toLocaleString().split(/\s/).join(' ')+this.goldimg+'</span><span>'+String(silver).padStart(2, '0')+this.silverimg+'</span><span>'+String(copper).padStart(2, '0')+this.copperimg+'</span>'
			}
		},
		
		clickParticles(damage) {
			this.damageParticles.push({'posX': this.cursorX-this.rand(4, 16), 'posY': this.cursorY-34, 'output': damage, 'duration': this.damageParticlesDuration, 'id': this.totalClicks}) //6sec - X:8px and Y:14px to center on the knife point
			setTimeout(() => {
				this.damageParticles.shift()
			}, (this.damageParticlesDuration-1)*1000) //to be sure to delete it as soon as it disappear
		},

		error(message) { // todo : div in html for the error message + css animation
			this.errorMessages.push({'msg': message})
			setTimeout(() => {
				this.errorMessages.shift()
			}, 3000)
		},
		
		/*buyItem(item, price) { We will see that later :)
			if (price > this.player.money) {
				if (this.player.diamond==0) {
					this.error('Not enough money.')
					return
				} else {
					this.player.diamond
					this.player.money
				}
			} else {
				this.player.money-=price
			}

			// add item to player
		},*/

		getItemName(id) {
			let index = this.items.findIndex(item => item.id === id)
			if (index >= 0) {
				return this.items[index].name
			}
		},

		addItem(id, target) {
			let emptySlot = this.getFirstEmptySpace(target)
			if(emptySlot === false) return

			let index = this.items.findIndex(item => item.id === id)
			if (index < 0) {
				return
			}
			let oldslotId = this.player.bag.slots[emptySlot].slotId
			target[emptySlot].slotId = oldslotId
			let item = JSON.parse(JSON.stringify(this.items))
			target[emptySlot].content = item[index]
		},

		updateSlots(target, slots) {
			if (target.length < slots) {
				target.push({ slotId: target.length + 1, content: null })
			} else if (target.length > slots) {
				target.pop()
			}

			if (slots != target.length) {
				this.updateSlots(target, slots)
			}
		},

		getFirstEmptySpace(bagSlots){
			let returnValue = false
			bagSlots.forEach(slot => {
				if(slot.content === null && returnValue === false){//<--- My solution to not being able to 
					returnValue = (bagSlots.indexOf(slot))        //      return the value immediately
				}
			}); return returnValue
		},

		emptySpace(target) {
			let emptySlots = 0
			for (let i = 0, l = target.length; i < l; i++) {
				emptySlots += (target[i].content === null) ? 1 : 0
			}
			return emptySlots
		},
		
		deleteItem(container, slotId) {
			if (container.slots[slotId - 1].content != null) {
				this.clearSlot(container, slotId)
			}
			this.unselectItem()
		},

		clearSlot(container, slotId){
			container.slots.splice(slotId - 1, 1, { slotId: slotId, content: null })
		},

		itemSelection(item, slotId, container) {
			this.selectedItem.selection = true
			this.selectedItem.item = item
			this.selectedItem.slotId = slotId
			this.selectedItem.container = container // name of the parent which contain the item
		},

		equipItem(item, slot) {
			if (item.slotType == 'weapon') {
				if (this.player.weapon.item.length != 0) {
					let actualItem = this.player.weapon.item[0]
					actualItem.equipable = true
					this.player.weapon.item.splice(0, 1, item)
					this.player.bag.slots.splice(slot - 1, 1, { slotId: slot, content: actualItem })
					this.player.weapon.item.equipable = false
				} else {
					this.player.weapon.item.splice(0, 1, item)
					this.clearSlot(this.player.bag, slot)
					this.player.weapon.item.equipable = false
				}
			}
			this.unselectItem()
		},

		unequipItem(item) {
			let emptySlot = this.getFirstEmptySpace(this.player.bag.slots)

			if (item.container == 'playerWeapon') {
				let actualItem = this.player.weapon.item[0]
				actualItem.equipable = true
				this.player.weapon.item.splice(0, 1)
				this.player.bag.slots.splice(emptySlot, 1, { slotId: emptySlot + 1, content: actualItem })
			}
			
			this.unselectItem()
		},

		unselectItem() {
			this.selectedItem.selection = false
			this.selectedItem.item = {}
			this.selectedItem.slotId = null
			this.selectedItem.container = null
		},

		itemIcon(item) {
			icon = 'inv_misc_questionmark'
			if (item.icon != null) {
				icon = item.icon
			}

			return icon
		}

	},

	mounted() {
		
		window.addEventListener('mousemove',this.getMouseCoords)

		this.gameInit()

		document.addEventListener("keydown", (event) => {
			if (this.keyPressed) return;
			this.keyPressed = true;

			if (event.keyCode == 66) { // 'B' toggle bag
				this.player.bag.open = !this.player.bag.open
			}
		}, false);

		document.addEventListener("keyup", (event) => {
			this.keyPressed = false;
		}, false);

		setInterval(() => {
			if (this.step % (this.fps*this.countdown) == 0) {
				this.step = 0
				for (const enemy of this.enemies) {
					enemy.hp = enemy.maxHp
				}
				//this.enemies[this.currentEnemyPool] = this.chooseEnemy()
			}
			this.step++
		}, 1000/this.fps)
	},
})
