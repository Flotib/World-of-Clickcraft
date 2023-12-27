window.content.items = [ 
    /*  quality table --> 0:poor  1:common  2:uncommon  3:rare  4:epic  5:legendary  6:artifact  7:heirloom
        slotType.name table 
            0: Sword
            1: Axe
            2: Mace
            3: Dagger
            4: Polearm
            5: Fist Weapon
            6: Staff
            7: Bow
            8: Crossbow
            9: Gun
            20: Shield

            unique: 0 -> not unique; 1 -> Unique; 2 -> Unique-Equipped
    */
    {
        id: 1,
        name: 'One',
        equipable: true,
        quality: 3,
        unique: 0,
        slotType: {
            type: 'weapon',
            name: 0,
            subtype: 'One-Hand',
        },
        stats: {
            strength: 2,
        },
        icon: 'inv_sword_04',
        baseMinDamage: 1,
        baseMaxDamage: 2,
    },
    {
        id: 2,
        name: 'Ruined Pelt',
        quality: 0,
        equipable: false,
        icon: 'inv_misc_pelt_wolf_ruin_04',
        stackMaxSize: 20,
        stackSize: 1,
        sellPrice: BigNumber(5),
    },
    {
        id: 4,
        name: 'Three',
        equipable: true,
        slotType: {
            type: 'trinket',
            subtype: 'Neck / Ring / Trinket',
        },
        stats: {
            intellect: 3,
        },
        icon: 'inv_jewelry_ring_03',
        requiredLevel: 5,
        salable: true,
        cost: BigNumber(50000),
    },
    {
        id: 5,
        name: 'poor',
        quality: 0,
        icon: null,
    },
    {
        id: 6,
        name: 'uncommon',
        quality: 2,
        icon: null,
    },
    {
        id: 7,
        name: 'rare',
        quality: 3,
        icon: null,
    },
    {
        id: 8,
        name: 'epic',
        quality: 4,
        icon: null,
    },
    {
        id: 9,
        name: 'legendary',
        quality: 5,
        icon: null,
    },
    {
        id: 10,
        name: 'Thousand',
        equipable: true,
        quality: 4,
        slotType: {
            type: 'weapon',
            name: 0,
            subtype: 'Two-Hand',
        },
        icon: 'inv_sword_04',
        baseMinDamage: 167,
        baseMaxDamage: 209,
        requiredLevel: 60,
        quote: 'A taste of Power.',
    },
    {
        id: 11,
        name: 'Dagger test',
        equipable: true,
        quality: 2,
        slotType: {
            type: 'weapon',
            name: 3,
            subtype: 'One-Hand',
        },
        icon: 'ability_marksmanship',
        baseMinDamage: 2,
        baseMaxDamage: 5,
    },
    {
        id: 12,
        name: 'The Off Hand',
        equipable: true,
        quality: 2,
        slotType: {
            type: 'weapon',
            name: 0,
            subtype: 'Off Hand',
        },
        icon: 'inv_sword_10',
        baseMinDamage: 2,
        baseMaxDamage: 5,
    },
    {
        id: 13,
        name: 'The Main Hand',
        equipable: true,
        quality: 3,
        slotType: {
            type: 'weapon',
            name: 1,
            subtype: 'Main Hand',
        },
        icon: 'inv_axe_04',
        baseMinDamage: 4,
        baseMaxDamage: 11,
    },
    {
        id: 14,
        name: 'The Necklace',
        quality: 3,
        equipable: true,
        icon: 'inv_jewelry_necklace_01',
        slotType: {
            type: 'trinket',
            subtype: 'Neck',
        },
        stats: {
            stamina: 2,
        },
        salable: true,
    },
    {
        id: 15,
        name: 'Text test',
        equipable: true,
        quality: 3,
        unique: 0,
        slotType: {
            type: 'weapon',
            name: 0,
            subtype: 'One-Hand',
        },
        icon: 'inv_sword_04',
        baseMinDamage: 4123654163870475,
        baseMaxDamage: 6123477859174104,
        effectDescription: 'Use: Nullam ullamcorper congue nibh, vel semper urna bibendum vitae. Nunc vulputate augue in congue rhoncus. Sed faucibus dui enim, ac euismod nisl elementum consectetur. Suspendisse sagittis nisl id quam cursus finibus. Etiam ut fringilla nibh, nec fermentum diam. Ut vitae diam nisl. Donec mattis scelerisque fringilla. Donec tempor erat nibh, a elementum nisl mollis non. Vivamus sed nibh ligula. Sed cursus sem eros, sed malesuada magna vehicula vitae.',
        quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla maximus ut lectus id viverra. Vestibulum quam ante, tincidunt at leo eleifend, semper faucibus lacus. Duis orci urna, tristique ut bibendum vel, feugiat sit amet elit. Fusce consectetur, ipsum eget luctus mattis, lorem justo vehicula metus, a sollicitudin eros libero vitae orci. Pellentesque vitae commodo tellus. Nullam dolor erat, aliquet non mattis a, volutpat nec enim. Phasellus maximus pellentesque interdum. Pellentesque non nulla non est pharetra rhoncus. Donec blandit facilisis malesuada. Proin ut arcu justo.'
    },
    {
        id: 16,
        name: "Sharpened Letter Opener",
        equipable: true,
        quality: 0,
        unique: 0,
        slotType: {
            type: "weapon",
            name: 3,
            subtype: "One-Hand"
        },
        stats: {},
        icon: "inv_weapon_shortblade_05",
        baseMinDamage: 2,
        baseMaxDamage: 5,
        requiredLevel: 2,
        salable: true
    },
    {
        id: 17,
        name: "Threshadon Fang",
        equipable: true,
        quality: 0,
        unique: 0,
        slotType: {
            type: "weapon",
            name: 3,
            subtype: "One-Hand"
        },
        stats: {},
        icon: "inv_misc_bone_06",
        baseMinDamage: 5,
        baseMaxDamage: 10,
        requiredLevel: 11,
        salable: true
    },    
]