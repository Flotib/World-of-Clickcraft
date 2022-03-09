var app = new Vue({
	el: '#app',
	data: { // https://blog.logrocket.com/localstorage-javascript-complete-guide/ <-- I keep this for later
		step: 0,
		fps: 50,
		countdown: 10, //sec
		cursorX: null,
		cursorY: null,
		keyPressed: false,
		shiftPressed: false,
		damageParticlesDuration: 6,
		damageParticles: [],
		errorMessages: [],
		settingsWindow: {
			open: false,
			selectedTab: 0,
		},
		keybinds: {
			bag: 66,
			upgradeItem: 85,
			merchant: 77,
		},
		configurableValues: {
			itemQualityBorderOpacity: 70,
			itemUpgradeLevel: true,
			dynamicTooltips: true,
		},
		maxLevel: 60,
		giveItemId: 0,
		itemCheatMenu: false,
		giveItemQuantity: 1,
		hoverItem: {
			item: [],
			slotId: null,
			containerName: null,
		},
		selectedItem: {
			selection: false,
			item: {},
			slotId: null,
			containerName: null,
		},
		player: {
			name: 'Player',
			minDamage: 0,
			maxDamage: 1,
			level: 1,
			xpToNextLevel: null,
			xp: 0,
			progression: 0,
			money: BigNumber(0),
			stats: {
				rareChance: 100, // start at 100 so 1% chance to get a rare mob - could be upgraded later (1 out of ~100 mobs will be a rare)
				critChance: 5, // '%'
				strength: 0, // increases melee attack power (player min and max damage)
				agility: 0, // affects the crit chance
				intellect: 0, // increases the learning speed rate of weapons skill
				stamina: 0, // increases the mob countdown
				luck: 0,
				baseStrength: 0,
				baseAgility: 0,
				baseIntellect: 0,
				baseStamina: 0,
				baseLuck: 0,
			},
			skills : { // useful ressource: https://www.reddit.com/r/classicwow/comments/df6fr5/new_crit_chance_calculation_weapon_skillagility/
				weapons : {
					sword: {

					},
					axe: {

					},
					mace: {

					},
					Dagger: 0,
					Polearm: 0,
					FistWeapon: 0,
					Staff: 0,
					Bow: 0,
					Crossbow: 0,
					Gun: 0,
					// Wand: 0,
				},
			},
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
			offHand: {
				item: [],
				slotId: -1,
			},
			trinkets: [
				{
					item: [],
					slotId: 1,
				},
				{
					item: [],
					slotId: 2,
				}
			],
			gameStats: {
				totalClicks: 0,
				totalDamages: BigNumber(0),
				totalCriticalStrikes: 0,
				totalXP: BigNumber(0),
				totalKills: 0,
				totalMisses: 0,
				totalMoney: BigNumber(0),
				totalSpentMoney: BigNumber(0),
				moneySpentUpgradingWeapon: BigNumber(0),
				startedDate: null,
			}
		},
		upgradeItemFrame: {
			open: false,
			inheritedSlotId: null,
			inheritedContainerName: null,
			item: null,
			itemPreview: [],
		},
		merchantFrame: {
			open: false,
			selectedMerchant: 0, // id of the merchant
			cooldown: 900, //seconds
			actualCooldown: 0,
			mode: 0, // 0 = merchant; 1 = sold items
			soldItems: [null, null, null, null, null, null, null, null, null, null, null, null],
			totalPages: 1,
			page: 1,
		},
		progressionMode: true,
		...window.content,
		enemyPool: [], //Putting this variable here for now
		currentEnemy: 0, // Need to rework this later (with a function) to be able to create differents array of enemies for dungeons and "raids"
		currentEnemyPool: 0,
		disabledEnemies: [],
		showEnemyInformations: false,
		showMorePlayerStats: false,
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
			this.countdown = (this.enemies[enemy].type == 'normal' || this.enemies[enemy].type == 'rare') ? 10 : 30 // May change later
		},

		/*
		'currentEnemyPool': function () {
			if (this.currentEnemyPool == this.enemyPool.length) {
				this.currentEnemyPool = this.enemyPool.length - 1
			}
			if (this.currentEnemyPool < 0) this.currentEnemyPool = 0
			this.spawnEnemy(false)
		},
		*/

		'player.level': function () {
			this.xpToNextLevelCalc()
		},

		'player.xp': function () {
			if (this.player.xp >= this.player.xpToNextLevel) {
				this.levelup()
			}
		},

		'player.bag.bagSpace': function (slots) {
			this.updateSlots(this.player.bag.slots, slots)
		},

		'merchantFrame.open': function (value) {
			if (value === true) {
				this.progressionMode = false
			} else {
				this.progressionMode = true
			}
		},

		'merchantFrame.selectedMerchant': function () {
			this.merchantFrame.page = 1
		},

		'progressionMode': function (value) {
			this.step = 0
			if (value === false) {
			}
		},

		'player.stats.baseStrength': function (value, oldvalue) {
			this.player.stats.strength += value - oldvalue
		},
		
		'player.stats.baseAgility': function (value, oldvalue) {
			this.player.stats.agility += value - oldvalue
		},

		'player.stats.baseIntellect': function (value, oldvalue) {
			this.player.stats.intellect += value - oldvalue
		},

		'player.stats.baseStamina': function (value, oldvalue) {
			this.player.stats.stamina += value - oldvalue
		},

		'player.stats.baseLuck': function (value, oldvalue) {
			this.player.stats.luck += value - oldvalue
		},

		'player.stats.strength': function (value, oldvalue) {
			
		},
		
		'player.stats.agility': function (value, oldvalue) {
			
		},

		'player.stats.intellect': function (value, oldvalue) {
			
		},

		'player.stats.stamina': function (value, oldvalue) {
			
		},

		'player.stats.luck': function (value, oldvalue) {
			
		},

	},

	computed: {
		equipButtonStyles() {
			let graylevel = ''

			if (this.selectedItem.item.slotType.subtype == 'Two-Hand' && this.player.weapon.item.length != 0 && this.player.offHand.item.length != 0 && this.emptySpace(this.player.bag.slots) < 1) { // the level is already checked by the v-if in the html
				graylevel = 'filter: grayscale(100%) !important;'
			}

			return graylevel
		},

		unequipButtonStyles() {
			let graylevel = 'filter: grayscale(100%) !important;'

			if (this.emptySpace(this.player.bag.slots) > 0) {
				graylevel = ''
			}

			return graylevel
		},

		switchButtonStyles() {
			let graylevel = 'filter: grayscale(100%) !important;'

			if (this.player.weapon.item[0].slotType.subtype === "One-Hand" && this.player.offHand.item[0].slotType.subtype === "One-Hand") {
				graylevel = ''
			}

			return graylevel
		},

		selectedItemUpgradeConditions() {
			if (this.selectedItem.selection && this.selectedItem.item.slotType != null) {
				if (this.selectedItem.item.quality > 1) {
					if ((this.selectedItem.slotId == this.upgradeItemFrame.inheritedSlotId && this.selectedItem.containerName != this.upgradeItemFrame.inheritedContainerName) || this.selectedItem.slotId != this.upgradeItemFrame.inheritedSlotId) {
						return "yes"
					} else {
						return "middlyyes"
					}
				}
			}
			return "no"
		},

		itemUpgradeConditions() {
			if (this.upgradeItemFrame.item != null) {
				if (this.upgradeItemPrice(this.upgradeItemFrame.item).lte(this.player.money)) {
					return true
				}
			}

			return false
		},

		buttonMoveToUpgrade() {
			let graylevel = 'filter: grayscale(100%) !important;'

			if (this.selectedItemUpgradeConditions == "yes" || this.selectedItemUpgradeConditions == "middlyyes") {
				graylevel = ''
			}

			return graylevel
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
				width: size + 'px',
			}
		},

		tooltipPosition() {
			if (this.configurableValues.dynamicTooltips) {
				let e = 0
				let correctionY = 0
				let correctionX = 0
				this.cursorY
				this.cursorX

				const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

				if (document.querySelector('.item-tooltip') && this.hoverItem.slotId !== null) {
					e = document.querySelector('.item-tooltip')
					correctionY = Math.max(e.offsetHeight + 5, this.cursorY)
					correctionX = Math.min(this.cursorX, vw - e.offsetWidth - 30)
				}

				const left = correctionX + 10 + 'px'

				const top = correctionY - 2 + 'px'

				return {
					left,
					top
				}
			} else {
				const left = 10 + 'px'

				const bottom = 10 + 'px'

				return {
					left,
					bottom
				}
			}
		},

		tooltipTextWidth() {
			let e = 0
			let correctionY = 0
			let correctionX = 0
			this.cursorY
			this.cursorX

			const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

			if (document.querySelector('.item-tooltip') && this.hoverItem.slotId !== null) {
				e = document.querySelector('.item-tooltip')
				return e.offsetWidth
			} else {
				return null
			}
		},

		tooltipItemQuality() {
			let itemquality = this.hoverItem.item[0].quality

			const qualityMapping = {
				0: 'poor',
				1: 'common',
				2: 'uncommon',
				3: 'rare',
				4: 'epic',
				5: 'legendary',
				6: 'artifact',
				7: 'heirloom',
			}

			return 'quality-' + qualityMapping[itemquality]
		},

		tooltipItemWeaponType() {
			let itemWeaponType = this.hoverItem.item[0].slotType.name

			const weaponTypeMapping = {
				0: 'Sword',
				1: 'Axe',
				2: 'Mace',
				3: 'Dagger',
				4: 'Polearm',
				5: 'Fist Weapon',
				6: 'Staff',
				7: 'Bow',
				8: 'Crossbow',
				9: 'Gun',
				// 10: 'Wand', I'm not sure to add wands for the moment. I need to think about how they could work
				20: 'Shield',
			}

			return weaponTypeMapping[itemWeaponType]
		},

		tooltipItemUniqueType() {
			let itemUniqueType = this.hoverItem.item[0].unique

			const weaponTypeMapping = {
				1: 'Unique',
				2: 'Unique-Equipped',
			}

			return weaponTypeMapping[itemUniqueType]
		},

		upgradeItemQuality() {
			let itemquality = this.upgradeItemFrame.itemPreview[0].quality

			const qualityMapping = {
				0: 'poor',
				1: 'common',
				2: 'uncommon',
				3: 'rare',
				4: 'epic',
				5: 'legendary',
				6: 'artifact',
				7: 'heirloom',
			}

			return 'quality-' + qualityMapping[itemquality]
		},

		moneyStylizerPlayer() {
			let copper = BigNumber(0)
			let silver = BigNumber(0)
			let gold = BigNumber(0)
			let diamond = BigNumber(0)

			if (this.player.money != null) {
				copper = this.player.money.modulo(100)

				silver = (this.player.money.div(100)).integerValue(BigNumber.ROUND_FLOOR)
				if (this.player.money.gte(10000)) {
					silver = silver.modulo(100)
				}

				gold = (this.player.money.div(10000)).integerValue(BigNumber.ROUND_FLOOR)
				if (this.player.money.gte(BigNumber(100000000000))) {
					gold = gold.modulo(10000000)
				}

				diamond = (this.player.money.div(BigNumber(100000000000))).integerValue(BigNumber.ROUND_FLOOR)
			}
			if (diamond.eq(0)) {
				if (gold.eq(0)) {
					if (silver.eq(0)) {
						return '<span></span><span></span><span></span><span>' + copper + this.copperimg + '</span>'
					} else {
						return '<span></span><span></span><span>' + silver + this.silverimg + '</span><span>' + copper + this.copperimg + '</span>'
					}
				} else {
					return '<span></span><span>' + gold + this.goldimg + '</span><span>' + silver + this.silverimg + '</span><span>' + copper + this.copperimg + '</span>'
				}
			} else {
				return '<span>' + (diamond > 9999999 ? diamond.toPrecision(3, 1) : diamond) + this.diamondimg + '</span><span>' + gold + this.goldimg + '</span><span>' + silver + this.silverimg + '</span><span>' + copper + this.copperimg + '</span>'
			}
		},

		moneyStylizerTooltip() { // need to do the operations with BigNumber
			let money = BigNumber(0)
			if (this.hoverItem.item[0].stackSize > 1) {
				money = BigNumber(this.hoverItem.item[0].sellPrice).multipliedBy(this.hoverItem.item[0].stackSize)
			} else {
				money = BigNumber(this.hoverItem.item[0].sellPrice)
			}

			let copper = BigNumber(0)
			let silver = BigNumber(0)
			let gold = BigNumber(0)
			let diamond = BigNumber(0)

			if (money != null) {
				copper = money.modulo(100)

				silver = (money.div(100)).integerValue(BigNumber.ROUND_FLOOR)
				if (money.gte(10000)) {
					silver = silver.modulo(100)
				}

				gold = (money.div(10000)).integerValue(BigNumber.ROUND_FLOOR)
				if (money.gte(BigNumber(100000000000))) {
					gold = gold.modulo(10000000)
				}

				diamond = (money.div(BigNumber(100000000000))).integerValue(BigNumber.ROUND_FLOOR)
			}

			if (diamond.eq(0)) {
				if (gold.eq(0)) {
					if (silver.eq(0)) {
						return '<span>' + copper + this.copperimg + '</span>'
					} else {
						if (copper.eq(0)) {
							return '<span>' + silver + this.silverimg + '</span>'
						} else {
							return '<span>' + silver + this.silverimg + '</span><span>' + copper + this.copperimg + '</span>'
						}
					}
				} else { // gold.toLocaleString() works too
					if (silver.eq(0) && copper.eq(0)) {
						return '<span>' + gold + this.goldimg + '</span>'
					} else {
						return '<span>' + gold + this.goldimg + '</span><span>' + silver + this.silverimg + '</span><span>' + copper + this.copperimg + '</span>'
					}
				}
			} else {
				if (copper.eq(0)) {
					if (silver.eq(0)) {
						if (gold.eq(0)) {
							return '<span>' + (diamond > 9999999 ? diamond.toPrecision(3, 1) : diamond) + this.diamondimg + '</span>'
						} else {
							return '<span>' + (diamond > 9999999 ? diamond.toPrecision(3, 1) : diamond) + this.diamondimg + '</span>' + '<span>' + gold + this.goldimg + '</span>'
						}
					} else {
						return '<span>' + (diamond > 9999999 ? diamond.toPrecision(3, 1) : diamond) + this.diamondimg + '</span>' + '<span>' + gold + this.goldimg + '</span><span>' + silver + this.silverimg + '</span>'
					}
				} else {
					return '<span>' + (diamond > 9999999 ? diamond.toPrecision(3, 1) : diamond) + this.diamondimg + '</span>' + '<span>' + gold + this.goldimg + '</span><span>' + silver + this.silverimg + '</span><span>' + copper + this.copperimg + '</span>'
				}
			}
		},

		playerDiamondTooltip() {
			let diamond = (this.player.money.div(BigNumber(100000000000))).integerValue(BigNumber.ROUND_FLOOR)
			return '<span>' + diamond.toFormat() + this.diamondimg + '</span>'
		},

		merchantItemDiamondTooltip() {
			let money = BigNumber(this.hoverItem.item[0].sellPrice)

			let copper = BigNumber(0)
			let silver = BigNumber(0)
			let gold = BigNumber(0)
			let diamond = BigNumber(0)

			copper = money.modulo(100)

			silver = (money.div(100)).integerValue(BigNumber.ROUND_FLOOR)
			if (money.gte(10000)) {
				silver = silver.modulo(100)
			}

			gold = (money.div(10000)).integerValue(BigNumber.ROUND_FLOOR)
			if (money.gte(BigNumber(100000000000))) {
				gold = gold.modulo(10000000)
			}
			
			diamond = (money.div(BigNumber(100000000000))).integerValue(BigNumber.ROUND_FLOOR)
			
			return '<span>' + diamond.toFormat() + this.diamondimg + '</span>' + '<span>' + gold + this.goldimg + '</span><span>' + silver + this.silverimg + '</span><span>' + copper + this.copperimg + '</span>'
		},

		hoverItemIsAWeapon() {
			if (this.hoverItem.item[0].slotType != null) {
				if (this.hoverItem.item[0].slotType.type == 'weapon') {
					return true
				}
			}

			return false
		},

		requiresLevelText() {
			let textcolor
			this.hoverItem.item[0].requiredLevel > this.player.level ? textcolor = '#ff2020' : textcolor = '#fff'

			return {
				color: textcolor
			}
		},

		upgradeItemIsItemOk() {
			return this.upgradeItemFrame.itemPreview[0] != null && this.upgradeItemFrame.item != null
		},

		upgradeItemQualityUpgrade() {
			if (this.upgradeItemIsItemOk === true) {
				return this.upgradeItemFrame.item.quality < this.upgradeItemFrame.itemPreview[0].quality
			}
		},

		moveItemToUpgradeText() {
			const answerMapping = {
				'yes': "Import Selected Weapon",
				'middlyyes': "Cancel",
				'no': "Select a compatible weapon",
			}

			return answerMapping[this.selectedItemUpgradeConditions]
		},

		merchantPageCalc() {
			this.merchantFrame.totalPages = Math.ceil(this.merchants[this.merchantFrame.selectedMerchant].stock.length / 10)

			return this.merchantFrame.totalPages
		},

	},

	methods: {

		gameInit() {
			if (this.player.gameStats.startedDate == null) {
				this.player.gameStats.startedDate = new Date(Date.parse(new Date()))
			}
			this.xpToNextLevelCalc()
			this.updateSlots(this.player.bag.slots, this.player.bag.bagSpace)
			//this.initializeEnemyPool()

			for (const monster of this.enemies) {
				this.autoLevelAttri(monster)
				this.autoMoneyAttri(monster)
			}

			for (const item of this.items) {
				if (item.equipable) {
					item.upgradeLevel = 0
				}
				item.minDamage = item.baseMinDamage
				item.maxDamage = item.baseMaxDamage
				this.autoWeaponSellPriceAttri(item)
				this.autoItemPrice(item)
			}
		},

		getMouseCoords(e) {
			this.cursorX = e.pageX
			this.cursorY = e.pageY
			//console.log({'x':e.pageX, 'y':e.pageY})
		},

		between(x, min, max) {
			return x >= min && x <= max
		},

		isGrayLevel() {
			if (this.between(this.player.level, 1, 5)) return 0
			if (this.between(this.player.level, 6, 49)) {
				return (this.player.level - Math.floor(this.player.level / 10) - 5)
			}
			if (this.player.level == 50) return 40
			if (this.between(this.player.level, 51, 59)) {
				return (this.player.level - Math.floor(this.player.level / 5) - 1)
			}
			if (this.player.level == 60) return 51
		},

		difficultyColor(enemy) {
			if (enemy.level <= this.isGrayLevel()) return 'graylevel'
			if (enemy.level >= this.player.level + 10) return 'skulllevel'
			if (enemy.level <= this.player.level - 3) return 'greenlevel'
			if (enemy.level >= this.player.level + 5) return 'redlevel'
			if (enemy.level >= this.player.level + 3) return 'orangelevel'
			if (enemy.level <= this.player.level + 2) return 'yellowlevel'
			if (enemy.level >= this.player.level - 2) return 'yellowlevel'
		},

		rand(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min)
		},

		randBigNumber(min, max) {
			let rand = (BigNumber.random(10).multipliedBy(max.minus(min).plus(1)).plus(min)).integerValue(BigNumber.ROUND_FLOOR)
			return rand
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
				enemy.level = this.enemies.indexOf(enemy) + 1
			}
		},

		autoMoneyAttri(enemy) { //https://www.desmos.com/calculator?lang=fr and https://www.dcode.fr/recherche-equation-fonction
			enemy.minMoney = BigNumber(0.131559).multipliedBy(enemy.level ** 2).plus(BigNumber(0.432517).multipliedBy(enemy.level)).plus(0.436728).integerValue()
			enemy.maxMoney = BigNumber(0.142619).multipliedBy(enemy.level ** 2).plus(BigNumber(1.41888).multipliedBy(enemy.level)).plus(1.43849).integerValue()
		},

		autoWeaponSellPriceAttri(item) { // initialize me when upgrading an item
			let quality = this.itemPriceMultiplier(item)
			let requiredLevel = 1
			if (item.sellPrice == null && item.equipable && item.salable !== false) {
				if (item.slotType.type == "weapon") {
					if (item.requiredLevel != null) { // == null to include undefined
						requiredLevel = item.requiredLevel
					}
					item.sellPrice = ((BigNumber(item.minDamage).plus(item.maxDamage)).multipliedBy(10).multipliedBy(BigNumber(1.05).pow(requiredLevel)).multipliedBy(quality)).integerValue()
				} else {
					item.sellPrice = BigNumber(1) // /!\ Need to be change when trinkets will be available
				}
			}
		},

		autoItemPrice(item) {
			if (item.sellPrice == null && item.cost != null) {
				item.sellPrice = item.cost.multipliedBy(0.2)
			} else if (item.sellPrice != null && item.cost == null) {
				item.cost = item.sellPrice.multipliedBy(5)
			}
		},

		itemPriceMultiplier(item) {
			switch (item.quality) {
				case 0:
					return 0.95
				case 1:
					return 1
				case 2:
					return 1.05
				case 3:
					return 1.1
				case 4:
					return 1.2
				case 5:
					return 1.4
				case 6:
					return 1.45
				case 7:
					return 0 // heirloom for now so 0
				default:
					return 1
			}
		},

		totalMinDamage() {
			let minDamage = this.player.minDamage
			if (this.player.weapon.item.length > 0) {
				minDamage += this.player.weapon.item[0].minDamage
			}
			if (this.player.offHand.item.length > 0) {
				minDamage += this.player.offHand.item[0].minDamage / 2
			}
			return Math.floor(minDamage)
		},

		totalMaxDamage() {
			let maxDamage = this.player.maxDamage
			if (this.player.weapon.item.length > 0) {
				maxDamage += this.player.weapon.item[0].maxDamage
			}
			if (this.player.offHand.item.length > 0) {
				maxDamage += this.player.offHand.item[0].maxDamage / 2
			}
			return Math.floor(maxDamage)
		},

		damageEnemy(enemy) {
			this.specialWeapon()
			let crit = false
			let damage = this.rand(this.totalMinDamage(), this.totalMaxDamage())
			if (damage > 0 && this.rng(100 / this.player.stats.critChance)) {
				damage *= 2
				crit = true
				this.player.gameStats.totalCriticalStrikes++
			}
			this.player.gameStats.totalClicks++
			this.player.gameStats.totalDamages = this.player.gameStats.totalDamages.plus(damage)
			this.clickParticles(damage, crit)
			enemy.hp -= damage
		},

		specialWeapon() {
			weapon = this.player.weapon.item
			if ( weapon.length != 0) {
				if (weapon[0].slotType.name == "Sword") {

				} else if (weapon[0].slotType.name == "Axe") {

				} else if (weapon[0].slotType.name == "Mace") {

				} else if (weapon[0].slotType.name == "Dagger") {

				} else if (weapon[0].slotType.name == "Polearm") {

				} else if (weapon[0].slotType.name == "FistWeapon") {

				} else if (weapon[0].slotType.name == "Sword") {

				} else if (weapon[0].slotType.name == "Sword") {

				} 
			}
		},

		formatHpLabel(enemy) {
			if (enemy.hp <= 0) {
				this.enemyDeadEvent(enemy)
				return "Dead" // a bit useless I know
			}

			return Math.ceil(enemy.hp) + " / " + Math.ceil(enemy.maxHp)
		},

		killToLevelUp(enemy) {
			if (this.player.level >= this.maxLevel) {
				return 'noxp'
			}
			let x = Math.ceil((this.player.xpToNextLevel - this.player.xp) / this.monsterXp(enemy))
			return x == 'Infinity' ? 'noxp' : x
		},

		/*
		//Fills the enemy pool
		initializeEnemyPool() {
			let enemiesArray = []
			let finishedPoolArray = []
			for (let i = 1; i < this.enemies.length; i++) { //Starting from 1 to not include the placeholder wolf
				enemiesArray.push(this.enemies[i])
			}

			//Simple bubble sort so enemies don't have to be sorted by level
			//by hand in the enemy list
			while (true) {
				let flag = true
				for (let i = 0; i < enemiesArray.length - 1; i++) {
					let temp
					if (enemiesArray[i].poolLevel > enemiesArray[i + 1].poolLevel) {
						temp = enemiesArray[i]
						enemiesArray[i] = enemiesArray[i + 1]
						enemiesArray[i + 1] = temp
						flag = false
					}
				}
				if (flag) break
			}

			//Finally, add each enemy to the correct pool
			let tempArray = []
			currentLevel = enemiesArray[0].poolLevel
			enemiesArray.forEach(enemy => {
				if (enemy.poolLevel == currentLevel) tempArray.push(enemy)
				else {
					currentLevel = enemy.poolLevel
					finishedPoolArray.push(tempArray)
					tempArray = [enemy]
				}
			})
			if (tempArray.length > 0) {
				finishedPoolArray.push(tempArray)
			}
			this.enemyPool = finishedPoolArray
		},

		printEnemyPools() {
			this.enemyPool.forEach(pool => {
				let poolOut = ""
				pool.forEach(enemy => {
					poolOut += enemy.name + " "
				})
				alert(poolOut)
			})
		},

		//Toggles generating enemy on/off
		toggleEnemy(enemy) {
			if (this.disabledEnemies.includes(enemy)) this.disabledEnemies.splice(this.disabledEnemies.indexOf(enemy), 1)
			else this.disabledEnemies.push(enemy)
		},

		//Functions that will probably be needed for the mob disable box
		getCurrentEnemyPool() {
			return (this.enemyPool[this.currentEnemyPool])
		},

		getEnemyDisabled(enemy) {
			return (this.disabledEnemies.includes(enemy))
		},

		chooseEnemy() {
			let roll = this.rand(0, this.enemyPool[this.currentEnemyPool].length - 1)
			let newEnemy = this.enemyPool[this.currentEnemyPool][roll]
			if (this.disabledEnemies.includes(newEnemy)) return (this.chooseEnemy)
			return newEnemy
		},

		//Generates a new enemy, this enemy can be rare
		//Due to the way enemies are stored and the classless structure of this game
		//I had to approach this by creating a new entry in the enemies list
		//enemies[0] is now a placeholder with the stats of a wolf
		//however, it's overwritten when generating new enemies
		generateEnemy(enemy = this.chooseEnemy(), allowRare = true) {
			let generatedEnemy = this.enemies[0]
			Object.assign(generatedEnemy, enemy)
			if (this.rng(this.player.stats.rareChance) && allowRare) {
				//Lazy formula below
				generatedEnemy.name = "Rare " + generatedEnemy.name
				generatedEnemy.type = "rare"
				generatedEnemy.maxHp *= 2
				generatedEnemy.hp = generatedEnemy.maxHp
			}
			return generatedEnemy
		},

		spawnEnemy(allowRare = true) {
			Object.assign(this.enemies[0], this.enemies[1]) //Dirty hackfix
			enemy = this.generateEnemy(this.chooseEnemy(), allowRare)
			enemy.hp = enemy.maxHp
		},
		*/

		enemyDeadEvent(enemy) {
			enemy.killCount++
			this.player.gameStats.totalKills++
			if (this.player.level < this.maxLevel) {
				this.playerXp(enemy)
			}
			money = this.randBigNumber(enemy.minMoney, enemy.maxMoney)
			this.player.gameStats.totalMoney = this.player.gameStats.totalMoney.plus(money)
			this.player.money = this.player.money.plus(money)
			if (this.player.progression <= this.enemies.indexOf(enemy)) {
				this.player.progression++
			}
			this.step = 0
			enemy.hp = enemy.maxHp
			//this.spawnEnemy()
		},

		missEnemy() { // will change with the pool
			this.step = 0
			this.player.gameStats.totalMisses++
			for (const enemy of this.enemies) {
				enemy.hp = enemy.maxHp
			}
		},

		playerXp(enemy) {
			let xp = this.monsterXp(enemy)
			this.player.xp += xp
			this.player.gameStats.totalXP = this.player.gameStats.totalXP.plus(xp)
		},

		monsterXp(enemy) {
			if (this.player.level >= this.maxLevel) {
				return 0
			}

			let xp = 0
			if (this.difficultyColor(enemy) == 'graylevel') {
				return 0
			}
			if (this.player.level == enemy.level) {
				xp = this.MXP(this.player.level)
			} else if (this.player.level < enemy.level) {
				xp = this.player.level + 4 > enemy.level ? (
					this.MXP(this.player.level) * (1 + 0.05 * (enemy.level - this.player.level))
				) : (
					this.MXP(this.player.level) * 1.2)
			} else if (this.player.level > enemy.level) {
				xp = this.MXP(this.player.level) * (1 - (this.player.level - enemy.level) / this.ZD())
			}

			if (enemy.type == 'elite') {
				xp *= 2
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
			this.player.xpToNextLevel = Math.round(((8 * this.player.level) + this.Diff(this.player.level)) * this.MXP(this.player.level) / 100) * 100
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
				return 5 * (CL - 30)
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

		playerCurrentDiamondValue() {
			let diamond = (this.player.money.div(BigNumber(100000000000))).integerValue(BigNumber.ROUND_FLOOR)

			if (this.player.money.gte(100000000000)) {
				return this.itemHoverEnter({sellPrice: diamond}, 0, 'playerMoney')
			}

			return
		},

		moneyStylizer(money) {
			let copper = BigNumber(0)
			let silver = BigNumber(0)
			let gold = BigNumber(0)
			let diamond = BigNumber(0)

			if (money != null) {
				copper = money.modulo(100)

				silver = (money.div(100)).integerValue(BigNumber.ROUND_FLOOR)
				if (money.gte(10000)) {
					silver = silver.modulo(100)
				}

				gold = (money.div(10000)).integerValue(BigNumber.ROUND_FLOOR)
				if (money.gte(BigNumber(100000000000))) {
					gold = gold.modulo(10000000)
				}

				diamond = (money.div(BigNumber(100000000000))).integerValue(BigNumber.ROUND_FLOOR)
			}
			if (diamond.eq(0)) {
				if (gold.eq(0)) {
					if (silver.eq(0)) {
						return '<span></span><span></span><span></span><span>' + copper + this.copperimg + '</span>'
					} else {
						return '<span></span><span></span><span>' + silver + this.silverimg + '</span><span>' + copper + this.copperimg + '</span>'
					}
				} else {
					return '<span></span><span>' + gold + this.goldimg + '</span><span>' + silver + this.silverimg + '</span><span>' + copper + this.copperimg + '</span>'
				}
			} else {
				return '<span>' + (diamond > 9999999 ? diamond.toPrecision(3, 1) : diamond) + this.diamondimg + '</span><span>' + gold + this.goldimg + '</span><span>' + silver + this.silverimg + '</span><span>' + copper + this.copperimg + '</span>'
			}
		},

		moneyStylizerMerchant(money, quantity) {
			if (BigNumber(money).eq(0) || money == null) {
				return
			}
			money = BigNumber(money)
			if (quantity > 2) {
				money = money.multipliedBy(quantity)
			}
			let copper = BigNumber(0)
			let silver = BigNumber(0)
			let gold = BigNumber(0)
			let diamond = BigNumber(0)

			if (money != null) {
				copper = money.modulo(100)

				silver = (money.div(100)).integerValue(BigNumber.ROUND_FLOOR)
				if (money.gte(10000)) {
					silver = silver.modulo(100)
				}

				gold = (money.div(10000)).integerValue(BigNumber.ROUND_FLOOR)
				if (money.gte(BigNumber(100000000000))) {
					gold = gold.modulo(10000000)
				}

				diamond = (money.div(BigNumber(100000000000))).integerValue(BigNumber.ROUND_FLOOR)
			}

			if (diamond.eq(0)) {
				if (gold.eq(0)) {
					if (silver.eq(0)) {
						return '<span>' + copper + this.copperimg + '</span>'
					} else {
						if (copper.eq(0)) {
							return '<span>' + silver + this.silverimg + '</span>'
						} else {
							return '<span>' + silver + this.silverimg + '</span><span>' + copper + this.copperimg + '</span>'
						}
					}
				} else { // gold.toLocaleString() works too
					if (silver.eq(0) && copper.eq(0)) {
						return '<span>' + gold + this.goldimg + '</span>'
					} else {
						return '<span>' + gold + this.goldimg + '</span><span>' + silver + this.silverimg + '</span><span>' + copper + this.copperimg + '</span>'
					}
				}
			} else {
				if (diamond.gt(9999999999)) {
					return '<span>' + (diamond > 999999999999 ? diamond.toPrecision(3, 1) : diamond) + this.diamondimg + '</span>'
				}
				if (copper.eq(0)) {
					if (silver.eq(0)) {
						if (gold.eq(0)) { // change that later --> hover to show a tooltip of the real value --> hide gold, silver & copper after a certain amount
							return '<span>' + (diamond > 999999999 ? diamond.toPrecision(3, 1) : diamond) + this.diamondimg + '</span>'
						} else {
							return '<span>' + (diamond > 999999999 ? diamond.toPrecision(3, 1) : diamond) + this.diamondimg + '</span>' + '<span>' + gold + this.goldimg + '</span>'
						}
					} else {
						return '<span>' + (diamond > 99999999 ? diamond.toPrecision(3, 1) : diamond) + this.diamondimg + '</span>' + '<span>' + gold + this.goldimg + '</span><span>' + silver + this.silverimg + '</span>'
					}
				} else {
					return '<span>' + (diamond > 9999999 ? diamond.toPrecision(3, 1) : diamond) + this.diamondimg + '</span>' + '<span>' + gold + this.goldimg + '</span><span>' + silver + this.silverimg + '</span><span>' + copper + this.copperimg + '</span>'
				}
			}
		},

		merchantItemCurrentDiamondValue(money, quantity) {
			money = BigNumber(money)
			
			if (money.lte(BigNumber(999999999900000000000))) {
				return
			}
			if (quantity > 2) {
				money = money.multipliedBy(quantity)
			}

			return this.itemHoverEnter({sellPrice: money}, 0, 'merchantItemPrice')
		},

		clickParticles(damage, crit) {
			let color = '#fff'
			let duration = this.damageParticlesDuration
			let size = 32
			let anim = 'fadeouttotop'

			if (crit) {
				color = '#ff0'
				duration += 2
				size = 38
				anim = 'fadeouttotop-crit'
			}

			this.damageParticles.push({ 'posX': this.cursorX - this.rand(4, 16), 'posY': this.cursorY - 34, 'output': damage, 'duration': duration, 'id': this.player.gameStats.totalClicks, 'color': color, 'size': size + 'px', 'animation': anim}) //6sec - X:8px and Y:14px to center on the knife point
			setTimeout(() => {
				this.damageParticles.shift()
			}, (duration - 1) * 1000) //to be sure to delete it as soon as it disappear
		},

		error(message) { // todo : div in html for the error message + css animation
			this.errorMessages.push({ 'msg': message })
			setTimeout(() => {
				this.errorMessages.shift()
			}, 3000)
		},

		getItemById(id) {
			let index = this.items.findIndex(item => item.id === id)
			if (index >= 0) {
				return this.items[index]
			}
		},

		addItem(id, target, quantity) {
			let newQuantity = 0
			let indexBag = -1
			let itemClone = JSON.parse(JSON.stringify(this.items))
			let index = this.items.findIndex(item => item.id === id)
			if (index < 0) {
				return
			}

			if (this.items[index].stackMaxSize > 1) {
				for (let i = 0; i < target.length; i++) {
					if (target[i].item != null) {
						if (target[i].item.id == id && target[i].item.stackSize < target[i].item.stackMaxSize) {
							indexBag = i
							break
						}
					}
				}
			}

			if (indexBag >= 0 && this.items[index].stackMaxSize > 1 && target[indexBag].item.stackSize < target[indexBag].item.stackMaxSize) {
				if (target[indexBag].item.stackSize + quantity <= target[indexBag].item.stackMaxSize) {
					target[indexBag].item.stackSize += quantity
				} else {
					newQuantity = target[indexBag].item.stackSize + quantity - target[indexBag].item.stackMaxSize
					target[indexBag].item.stackSize = target[indexBag].item.stackMaxSize
					this.addItem(id, target, newQuantity)
				}
			} else {
				let emptySlot = this.getFirstEmptySpace(target)
				if (emptySlot === false) {
					return
				}

				if (quantity > 1) {
					if (this.items[index].stackMaxSize > 1) {
						if (quantity > this.items[index].stackMaxSize) {
							target[emptySlot].item = itemClone[index]
							target[emptySlot].item.stackSize = target[emptySlot].item.stackMaxSize
							newQuantity = quantity - this.items[index].stackMaxSize
							this.addItem(id, target, newQuantity)
						} else {
							target[emptySlot].item = itemClone[index]
							target[emptySlot].item.stackSize = quantity
						}
					} else {
						target[emptySlot].item = itemClone[index]
						newQuantity = quantity - 1
						this.addItem(id, target, newQuantity)
					}
				} else {
					target[emptySlot].item = itemClone[index]
				}
			}
		},

		updateSlots(target, slots) {
			if (target.length < slots) {
				target.push({ slotId: target.length + 1, item: null })
			} else if (target.length > slots) {
				target.pop()
			}

			if (slots != target.length) {
				this.updateSlots(target, slots)
			}
		},

		getFirstEmptySpace(bagSlots) {
			let returnValue = false
			bagSlots.forEach(slot => {
				if (slot.item === null && returnValue === false) {//<--- My solution to not being able to 
					returnValue = (bagSlots.indexOf(slot))        //      return the value immediately
				}
			})
			return returnValue
		},

		emptySpace(target) {
			let emptySlots = 0
			for (let i = 0, l = target.length; i < l; i++) {
				emptySlots += (target[i].item === null) ? 1 : 0
			}
			return emptySlots
		},

		deleteItem(container, slotId) {
			if (container.slots[slotId - 1].item != null) {
				this.clearSlot(container, slotId)
			}
			this.unselectItem()
		},

		clearSlot(container, slotId) {
			container.slots.splice(slotId - 1, 1, { slotId: slotId, item: null })
		},

		debugDeleteAllBagItems() {
			for (const slot of this.player.bag.slots) {
				this.deleteItem(this.player.bag, slot.slotId)
			}
		},

		itemSelection(item, slotId, containerName) {
			this.selectedItem.selection = true
			this.selectedItem.item = item
			if (item.sellPrice !== undefined) {
				this.selectedItem.item.sellPrice = BigNumber(item.sellPrice)
			}
			this.selectedItem.slotId = slotId
			this.selectedItem.containerName = containerName // name of the parent which contain the item, set by hand
		},

		equipItem(item, slot, click) {
			if (item.stats !== undefined) {
				item.stats.strength !== undefined ? this.player.stats.strength += item.stats.strength : ''
				item.stats.agility !== undefined ? this.player.stats.agility += item.stats.agility : ''
				item.stats.intellect !== undefined ? this.player.stats.intellect += item.stats.intellect : ''
				item.stats.stamina !== undefined ? this.player.stats.stamina += item.stats.stamina : ''
				item.stats.luck !== undefined ? this.player.stats.luck += item.stats.luck : ''
			}
			if (item.slotType.type == 'weapon') {
				// ONE-HAND PART
				if (item.slotType.subtype === 'One-Hand') {
					if (this.player.weapon.item.length != 0 && this.player.offHand.item.length == 0) { // main-hand true, offHand false --> equip offHand
						if (this.player.weapon.item[0].slotType.subtype == 'Two-Hand') {
							let actualItem = this.player.weapon.item[0]
							if (actualItem.stats !== undefined) {
								actualItem.stats.strength !== undefined ? this.player.stats.strength -= actualItem.stats.strength : ''
								actualItem.stats.agility !== undefined ? this.player.stats.agility -= actualItem.stats.agility : ''
								actualItem.stats.intellect !== undefined ? this.player.stats.intellect -= actualItem.stats.intellect : ''
								actualItem.stats.stamina !== undefined ? this.player.stats.stamina -= actualItem.stats.stamina : ''
								actualItem.stats.luck !== undefined ? this.player.stats.luck -= actualItem.stats.luck : ''
							}
							this.player.weapon.item.splice(0, 1, item)
							this.player.bag.slots.splice(slot - 1, 1, { slotId: slot, item: actualItem })
							if (click !== undefined) {
								this.itemHoverEnter(actualItem, slot, 'playerBag')
							}
						} else {
							this.itemHoverLeave()
							this.player.offHand.item.splice(0, 1, item)
							this.clearSlot(this.player.bag, slot)
						}
					} else if (this.player.weapon.item.length != 0 && this.player.offHand.item.length != 0) { // main-hand true, offHand true --> switch main-hand
						let actualItem = this.player.weapon.item[0]
						if (actualItem.stats !== undefined) {
							actualItem.stats.strength !== undefined ? this.player.stats.strength -= actualItem.stats.strength : ''
							actualItem.stats.agility !== undefined ? this.player.stats.agility -= actualItem.stats.agility : ''
							actualItem.stats.intellect !== undefined ? this.player.stats.intellect -= actualItem.stats.intellect : ''
							actualItem.stats.stamina !== undefined ? this.player.stats.stamina -= actualItem.stats.stamina : ''
							actualItem.stats.luck !== undefined ? this.player.stats.luck -= actualItem.stats.luck : ''
						}
						this.player.weapon.item.splice(0, 1, item)
						this.player.bag.slots.splice(slot - 1, 1, { slotId: slot, item: actualItem })
						if (click !== undefined) {
							this.itemHoverEnter(actualItem, slot, 'playerBag')
						}
					} else { // main-hand false, offHand true or false --> equip main-hand
						this.itemHoverLeave()
						this.player.weapon.item.splice(0, 1, item)
						this.clearSlot(this.player.bag, slot)
					}
				// TWO-HANDED PART
				} else if (item.slotType.subtype === 'Two-Hand') { 
					if (this.player.offHand.item.length != 0) {
						if (this.emptySpace(this.player.bag.slots) == 0) {
							return
						}
						let offHand = this.player.offHand.item[0]
						if (offHand.stats !== undefined) {
							offHand.stats.strength !== undefined ? this.player.stats.strength -= offHand.stats.strength : ''
							offHand.stats.agility !== undefined ? this.player.stats.agility -= offHand.stats.agility : ''
							offHand.stats.intellect !== undefined ? this.player.stats.intellect -= offHand.stats.intellect : ''
							offHand.stats.stamina !== undefined ? this.player.stats.stamina -= offHand.stats.stamina : ''
							offHand.stats.luck !== undefined ? this.player.stats.luck -= offHand.stats.luck : ''
						}
						let emptySlot = this.getFirstEmptySpace(this.player.bag.slots)
						this.player.offHand.item.splice(0, 1)
						this.player.bag.slots.splice(emptySlot, 1, { slotId: emptySlot + 1, item: offHand })
					}
					if (this.player.weapon.item.length != 0) {
						let mainHand = this.player.weapon.item[0]
						if (mainHand.stats !== undefined) {
							mainHand.stats.strength !== undefined ? this.player.stats.strength -= mainHand.stats.strength : ''
							mainHand.stats.agility !== undefined ? this.player.stats.agility -= mainHand.stats.agility : ''
							mainHand.stats.intellect !== undefined ? this.player.stats.intellect -= mainHand.stats.intellect : ''
							mainHand.stats.stamina !== undefined ? this.player.stats.stamina -= mainHand.stats.stamina : ''
							mainHand.stats.luck !== undefined ? this.player.stats.luck -= mainHand.stats.luck : ''
						}
						this.player.weapon.item.splice(0, 1, item)
						this.player.bag.slots.splice(slot - 1, 1, { slotId: slot, item: mainHand })
						if (click !== undefined) {
							this.itemHoverEnter(mainHand, slot, 'playerBag')
						}
					} else {
						this.itemHoverLeave()
						this.player.weapon.item.splice(0, 1, item)
						this.clearSlot(this.player.bag, slot)
					}
				// MAIN HAND & OFF HAND PART
				} else if (item.slotType.subtype === 'Main Hand') {
					if (this.player.weapon.item.length != 0) {
						let actualItem = this.player.weapon.item[0]
						if (actualItem.stats !== undefined) {
							actualItem.stats.strength !== undefined ? this.player.stats.strength -= actualItem.stats.strength : ''
							actualItem.stats.agility !== undefined ? this.player.stats.agility -= actualItem.stats.agility : ''
							actualItem.stats.intellect !== undefined ? this.player.stats.intellect -= actualItem.stats.intellect : ''
							actualItem.stats.stamina !== undefined ? this.player.stats.stamina -= actualItem.stats.stamina : ''
							actualItem.stats.luck !== undefined ? this.player.stats.luck -= actualItem.stats.luck : ''
						}
						this.player.weapon.item.splice(0, 1, item)
						this.player.bag.slots.splice(slot - 1, 1, { slotId: slot, item: actualItem })
						if (click !== undefined) {
							this.itemHoverEnter(actualItem, slot, 'playerBag')
						}
					} else {
						this.itemHoverLeave()
						this.player.weapon.item.splice(0, 1, item)
						this.clearSlot(this.player.bag, slot)
					}
				} else { // if Off Hand
					if (this.player.offHand.item.length != 0) {
						let actualItem = this.player.offHand.item[0]
						if (actualItem.stats !== undefined) {
							actualItem.stats.strength !== undefined ? this.player.stats.strength -= actualItem.stats.strength : ''
							actualItem.stats.agility !== undefined ? this.player.stats.agility -= actualItem.stats.agility : ''
							actualItem.stats.intellect !== undefined ? this.player.stats.intellect -= actualItem.stats.intellect : ''
							actualItem.stats.stamina !== undefined ? this.player.stats.stamina -= actualItem.stats.stamina : ''
							actualItem.stats.luck !== undefined ? this.player.stats.luck -= actualItem.stats.luck : ''
						}
						this.player.offHand.item.splice(0, 1, item)
						this.player.bag.slots.splice(slot - 1, 1, { slotId: slot, item: actualItem })
						if (click !== undefined) {
							this.itemHoverEnter(actualItem, slot, 'playerBag')
						}
					} else {
						this.itemHoverLeave()
						this.player.offHand.item.splice(0, 1, item)
						this.clearSlot(this.player.bag, slot)
					}
				}
			// TRINKETS PART
			} else if (item.slotType.type == 'trinket') {
				if (this.player.trinkets[0].item.length != 0 && this.player.trinkets[1].item.length == 0) { // trinket1 true, trinket2 false --> equip trinket2
					this.itemHoverLeave()
					this.player.trinkets[1].item.splice(0, 1, item)
					this.clearSlot(this.player.bag, slot)
				} else if (this.player.trinkets[0].item.length != 0 && this.player.trinkets[1].item.length != 0) { // trinket1 true, trinket2 true --> switch with trinket1
					let actualItem = this.player.trinkets[0].item[0]
					if (actualItem.stats !== undefined) {
						actualItem.stats.strength !== undefined ? this.player.stats.strength -= actualItem.stats.strength : ''
						actualItem.stats.agility !== undefined ? this.player.stats.agility -= actualItem.stats.agility : ''
						actualItem.stats.intellect !== undefined ? this.player.stats.intellect -= actualItem.stats.intellect : ''
						actualItem.stats.stamina !== undefined ? this.player.stats.stamina -= actualItem.stats.stamina : ''
						actualItem.stats.luck !== undefined ? this.player.stats.luck -= actualItem.stats.luck : ''
					}
					this.player.trinkets[0].item.splice(0, 1, item)
					this.player.bag.slots.splice(slot - 1, 1, { slotId: slot, item: actualItem })
					if (click !== undefined) {
						this.itemHoverEnter(actualItem, slot, 'playerBag')
					}
				} else { // trinket1 false, trinket2 true or false --> equip trinket1
					this.itemHoverLeave()
					this.player.trinkets[0].item.splice(0, 1, item)
					this.clearSlot(this.player.bag, slot)
				}
			} else {
				this.itemHoverEnter(item, slot, 'playerBag')
				return
			}

			this.unselectItem()
		},

		unequipItem(selectedItem) { // slot -> exemples : this.player.weapon, this.player.offHand, this.player.trinket[0 or 1]...
			let emptySlot = this.getFirstEmptySpace(this.player.bag.slots)
			if (selectedItem.containerName != undefined) {
				let slot
				if (selectedItem.containerName == 'playerWeapon') {
					slot = this.player.weapon
				} else if (selectedItem.containerName == 'playerOffHand') {
					slot = this.player.offHand
				} else { // trinket
					slot = this.player.trinkets[this.selectedItem.slotId-1]
				}
				let actualItem = slot.item[0] // not adapted for trinkets!!!!
				slot.item.splice(0, 1)
				if (actualItem.stats !== undefined) {
					actualItem.stats.strength !== undefined ? this.player.stats.strength -= actualItem.stats.strength : ''
					actualItem.stats.agility !== undefined ? this.player.stats.agility -= actualItem.stats.agility : ''
					actualItem.stats.intellect !== undefined ? this.player.stats.intellect -= actualItem.stats.intellect : ''
					actualItem.stats.stamina !== undefined ? this.player.stats.stamina -= actualItem.stats.stamina : ''
					actualItem.stats.luck !== undefined ? this.player.stats.luck -= actualItem.stats.luck : ''
				}
				this.player.bag.slots.splice(emptySlot, 1, { slotId: emptySlot + 1, item: actualItem })
			} else {
				let actualItem = selectedItem.item[0] // not adapted for trinkets!!!!
				selectedItem.item.splice(0, 1)
				if (actualItem.stats !== undefined) {
					actualItem.stats.strength !== undefined ? this.player.stats.strength -= actualItem.stats.strength : ''
					actualItem.stats.agility !== undefined ? this.player.stats.agility -= actualItem.stats.agility : ''
					actualItem.stats.intellect !== undefined ? this.player.stats.intellect -= actualItem.stats.intellect : ''
					actualItem.stats.stamina !== undefined ? this.player.stats.stamina -= actualItem.stats.stamina : ''
					actualItem.stats.luck !== undefined ? this.player.stats.luck -= actualItem.stats.luck : ''
				}
				this.player.bag.slots.splice(emptySlot, 1, { slotId: emptySlot + 1, item: actualItem })
			}

			this.itemHoverLeave()
			this.unselectItem()
		},

		switchWeapons() {
			let main = this.player.weapon.item[0]
			let off = this.player.offHand.item[0]
			if (main.slotType.subtype !== "One-Hand" || off.slotType.subtype !== "One-Hand") {
				return
			} else {
				this.player.weapon.item.splice(0, 1, off)
				this.player.offHand.item.splice(0, 1, main)
				if (this.selectedItem.slotId == 0) {
					this.itemSelection(this.player.offHand.item[0], this.player.offHand.slotId, 'playerOffHand')
				} else {
					this.itemSelection(this.player.weapon.item[0], this.player.weapon.slotId, 'playerWeapon')
				}
				
			}
		},

		switchTrinkets() {
			let first = this.player.trinkets[0].item[0]
			let second = this.player.trinkets[1].item[0]
			if (this.player.trinkets[0].item.length == 0) {
				this.player.trinkets[1].item.splice(0, 1)
				this.player.trinkets[0].item.splice(0, 1, second)
			} else if (this.player.trinkets[1].item.length == 0) {
				this.player.trinkets[0].item.splice(0, 1)
				this.player.trinkets[1].item.splice(0, 1, first)
			} else {
				this.player.trinkets[0].item.splice(0, 1, second)
				this.player.trinkets[1].item.splice(0, 1, first)
			}
			/* Create a stupid error
			if (this.selectedItem.slotId == this.player.trinkets[0].slotId) {
				this.itemSelection(this.player.trinket[1].item[0], this.player.trinket[1].slotType, 'playerTrinket')
			} else {
				this.itemSelection(this.player.trinket[0].item[0], this.player.trinket[0].slotType, 'playerTrinket')
			}
			*/
			this.unselectItem()
		},

		unselectItem() {
			this.selectedItem.selection = false
			this.selectedItem.item = {}
			this.selectedItem.slotId = null
			this.selectedItem.containerName = null
		},

		toggleSelectionItem(item, slotId, containerName) {
			(this.selectedItem.selection) && (this.selectedItem.slotId == slotId) && (this.selectedItem.containerName == containerName) ? this.unselectItem() : this.itemSelection(item, slotId, containerName)
		},

		itemHoverEnter(item, slotId, containerName) {
			this.hoverItem.item.splice(0, 1, item)
			this.hoverItem.slotId = slotId
			this.hoverItem.containerName = containerName
		},

		itemHoverLeave() {
			this.hoverItem.item.splice(0, 1)
			this.hoverItem.slotId = null
			this.hoverItem.containerName = null
		},

		itemIcon(item) {
			icon = 'inv_misc_questionmark'
			if (item.icon != null) {
				icon = item.icon
			}

			return icon
		},

		getQualityColor(item) {
			switch (item.quality) { // Thx Dorian!
				case 0:
					return '#9d9d9d'
				case 1:
					return '#fff'
				case 2:
					return '#1eff00'
				case 3:
					return '#0070dd'
				case 4:
					return '#a335ee'
				case 5:
					return '#ff8000'
				case 6:
					return '#e6cc80'
				case 7:
					return '#00ccff'
				default:
					return '#fff'
			}
		},

		showItemQualityBorder(item, slotId, containerName) {
			if (this.selectedItem.slotId === slotId && this.selectedItem.containerName === containerName) {
				return false
			} else if (item != null) {
				if (item.requiredLevel != null) {
					return item.requiredLevel <= this.player.level
				} else {
					return true
				}
			}
		},

		upgradeItem(item) {
			let price = BigNumber(this.upgradeItemPrice(item))
			if (price.lte(this.player.money)) {
				this.player.money = this.player.money.minus(price)
				this.player.gameStats.moneySpentUpgradingWeapon = this.player.gameStats.moneySpentUpgradingWeapon.plus(price)
				this.upgradeItemStatsCalculation(item)
			} else {
				return
			}
		},

		upgradeItemStatsCalculation(item) {
			item.upgradeLevel++
			item.upgradeLevel == 20 ? item.quality++ : ''
			item.maxDamage = Math.round(item.baseMaxDamage * 1.104 ** (item.upgradeLevel + 1))
			item.minDamage = Math.round(item.maxDamage * (item.baseMinDamage / item.baseMaxDamage))
			item.sellPrice = null
			this.autoWeaponSellPriceAttri(item)
			//item.sellPrice = BigNumber(item.sellPrice).plus(BigNumber(item.sellPrice).multipliedBy(BigNumber(item.upgradeLevel).multipliedBy(0.08))).integerValue()	
		},

		upgradeItemPrice(item) {
			let price = (BigNumber(item.sellPrice).multipliedBy(BigNumber(1.65).pow(BigNumber(item.upgradeLevel).plus(1)))).integerValue()
			return price
		},

		moveSelectedToUpgrade() {
			this.upgradeItemFrame.inheritedSlotId = this.selectedItem.slotId
			this.upgradeItemFrame.inheritedContainerName = this.selectedItem.containerName
			this.upgradeItemFrame.item = this.selectedItem.item
			this.createUpgradeItemPreview()
		},

		createUpgradeItemPreview() {
			let itemClone = JSON.parse(JSON.stringify(this.upgradeItemFrame.item))
			this.upgradeItemFrame.itemPreview.splice(0, 1, itemClone)
			this.upgradeItemStatsCalculation(this.upgradeItemFrame.itemPreview[0])
		},

		takeOffItemFromUpgrade() {
			this.upgradeItemFrame.inheritedSlotId = null
			this.upgradeItemFrame.inheritedContainerName = null
			this.upgradeItemFrame.item = null
			this.upgradeItemFrame.itemPreview.splice(0, 1)
		},

		upgradeItemButton() {
			this.upgradeItem(this.upgradeItemFrame.item)
			this.createUpgradeItemPreview()
		},

		toggleItemUpgradeFrame() {
			if (this.upgradeItemFrame.open) {
				this.closePlayerRelatedWindow()
			} else {
				this.closePlayerRelatedWindow()
				this.upgradeItemFrame.open = true
			}
		},

		closePlayerRelatedWindow() { // put all windows here
			this.takeOffItemFromUpgrade()
			this.upgradeItemFrame.open = false
		},

		isItAnUpgrade(oldstat, newstat) {
			let textcolor = '#fff'
			oldstat < newstat ? (textcolor = '#ff0') : ('')

			return {
				color: textcolor
			}
		},

		qualityText(item) {
			let qualityMapping = {
				0: 'Poor',
				1: 'Common',
				2: 'Uncommon',
				3: 'Rare',
				4: 'Epic',
				5: 'Legendary',
				6: 'Artifact',
				7: 'Heirloom',
			}

			return qualityMapping[item.quality]
		},

		toggleMerchantFrame() {
			if (this.merchantFrame.open) {
				this.merchantFrame.open = false
				this.merchantCooldown()
			} else {
				this.merchantFrame.open = true
			}
		},

		merchantCooldown() {
			this.merchantFrame.actualCooldown = this.merchantFrame.cooldown
		},

		lockedMerchant(merchant) {
			return merchant.requiredLevel > this.player.level
		},

		sellItem(item, slotId) {
			this.unselectItem()
			this.takeOffItemFromUpgrade()
			if (item.sellPrice === undefined || item.salable === false) {
				return
			}

			if (item.stackMaxSize != null) {
				this.player.money = this.player.money.plus(BigNumber(item.sellPrice).multipliedBy(BigNumber(item.stackSize)))
				this.player.gameStats.totalMoney = this.player.gameStats.totalMoney.plus(BigNumber(item.sellPrice).multipliedBy(BigNumber(item.stackSize)))
			} else {
				this.player.money = this.player.money.plus(item.sellPrice)
				this.player.gameStats.totalMoney = this.player.gameStats.totalMoney.plus(item.sellPrice)
			}

			this.merchantFrame.soldItems.unshift(item)

			if (this.merchantFrame.soldItems.length > 12) {
				this.merchantFrame.soldItems.pop()
			}

			this.deleteItem(this.player.bag, slotId)
			this.itemHoverLeave()
		},

		buyBackItem(item) {
			let isback = false
			let emptySlot = this.getFirstEmptySpace(this.player.bag.slots)
			if (emptySlot === false) {
				return
			}
			
			if (item.sellPrice == null || BigNumber(item.sellPrice).eq(0)) {
				isback = true
			} else if (item.stackMaxSize != null) {
				if (this.player.money.gte(BigNumber(item.sellPrice).multipliedBy(BigNumber(item.stackSize)))) {
					this.player.money = this.player.money.minus(BigNumber(item.sellPrice).multipliedBy(BigNumber(item.stackSize)))
					this.player.gameStats.totalMoney = this.player.gameStats.totalMoney.minus(BigNumber(item.sellPrice).multipliedBy(BigNumber(item.stackSize)))
					isback = true
				}
			} else {
				if (this.player.money.gte(item.sellPrice)) {
					this.player.money = this.player.money.minus(item.sellPrice)
					this.player.gameStats.totalMoney = this.player.gameStats.totalMoney.minus(item.sellPrice)
					isback = true
				}
			}

			if (isback == true) {
				this.player.bag.slots[emptySlot].item = item
				let index = this.merchantFrame.soldItems.indexOf(item)
				if (index > -1) {
					this.merchantFrame.soldItems.splice(index, 1)
					this.merchantFrame.soldItems.push(null)
					if (this.merchantFrame.soldItems[index] != null) {
						this.itemHoverLeave()
						this.itemHoverEnter(this.merchantFrame.soldItems[index], index, 'soldItems')
					} else {
						this.itemHoverLeave()
					}
				}
			} else {
				return
			}
		},

		buyItem(item, quantity) {
			let emptySlot = this.getFirstEmptySpace(this.player.bag.slots)
			if (item.stackMaxSize > 1 && quantity > 1) {
				for (let i = 0; i < this.player.bag.slots.length; i++) {
					if (this.player.bag.slots[i].item != null) {
						if (this.player.bag.slots[i].item.id == item.id && this.player.bag.slots[i].item.stackSize + quantity <= item.stackMaxSize) {
							emptySlot = true
						}
					}
				}
			}
			if (emptySlot === false) {
				return
			}
			
			if (item.cost == null || BigNumber(item.cost).eq(0)) {
				this.addItem(item.id, this.player.bag.slots, quantity)
			}
			else if ((item.cost.multipliedBy(quantity)).gt(this.player.money)) {
				return
			} else {
				this.player.money = this.player.money.minus((item.cost.multipliedBy(quantity)))
				this.addItem(item.id, this.player.bag.slots, quantity)
			}
		},

		deleteItem(container, slotId) {
			this.takeOffItemFromUpgrade()
			if (this.shiftPressed) {
				if (container.slots[slotId - 1].item.stackSize > 1) {
					container.slots[slotId - 1].item.stackSize -= 1
				} else if (container.slots[slotId - 1].item != null || container.slots[slotId - 1].item.stackSize == 1) {
					this.clearSlot(container, slotId)
				}
			} else if (container.slots[slotId - 1].item != null || container.slots[slotId - 1].item.stackSize == 1) {
				this.clearSlot(container, slotId)
			}
			this.unselectItem()
		},

		startDrag(event, container) {
			event.path[0].classList.add("ui-item-dragging")
			this.unselectItem()
			this.itemHoverLeave()
			event.dataTransfer.setData('slot', container.slotId)
		},

		endDrag(event) {
			event.path[0].classList.remove("ui-item-dragging")
		},

		onDrop(event, slotId) {
			event.path[0].classList.remove("ui-item-dragging")
			const slot = event.dataTransfer.getData('slot')
      		const container = this.player.bag.slots.find(container => container.slotId == slot)
			this.clearSlot(this.player.bag, slot)
			if (this.player.bag.slots[slotId-1].item != null) {
				this.player.bag.slots[slot-1].item = this.player.bag.slots[slotId-1].item
			} 
			this.player.bag.slots[slotId-1].item = container.item
		},

		prevMerchantPage() {
			this.merchantFrame.page--
		},

		nextMerchantPage() {
			this.merchantFrame.page++
		},

	},

	mounted() {

		window.addEventListener('mousemove', this.getMouseCoords)

		this.gameInit()

		document.addEventListener("keydown", (event) => {
			if (this.keyPressed) return
			this.keyPressed = true

			if (event.keyCode === this.keybinds.bag) { // 'B' toggle bag
				this.player.bag.open = !this.player.bag.open
			}
			if (event.keyCode === this.keybinds.upgradeItem) { // 'U' toggle upgrade window
				this.toggleItemUpgradeFrame()
			}
			if (event.keyCode === this.keybinds.merchant) { // 'M'
				this.toggleMerchantFrame()
			}
			if (event.keyCode === 222) { // '²'
				this.itemCheatMenu = !this.itemCheatMenu
			}
			if (event.keyCode === 16) { // shift
				this.shiftPressed = true
			}
		}, false)

		document.addEventListener("keyup", (event) => {
			this.keyPressed = false
			this.shiftPressed = false
		}, false)

		setInterval(() => {
			if (this.progressionMode) {
				if (this.step != 0 && this.step % (this.fps * this.countdown) == 0) {
					this.missEnemy()
					//this.generateEnemy()
					//this.enemies[this.currentEnemyPool] = this.chooseEnemy()
				}
			}
			this.step++
		}, 1000 / this.fps)
	},
})
