

const IMG_CARD = ['img/Group 32.png', 'img/pp-Photoroom 3.png'];
const IMG_GALLERY = [
    'img/Property 1=Frame 171.png',
    'img/photo1.png',
    'img/photo2.png',
    'img/photo3.png',
    'img/photo4.png',
    'img/Property 1=Frame 173.png',
    'img/Property 1=Component 83.png',
    'img/Property 1=Component 86.png'
];

const CATEGORIES = {
    all:         'Усі товари',
    clothes:     'Одяг',
    new:         'Новинки',
    outerwear:   'Верхній одяг',
    sweatshirts: 'Світшоти',
    hoodies:     'Худі',
    tshirts:     'Футболки',
    tops:        'Топи',
    dresses:     'Сукні',
    jeans:       'Джинси, джинсові штани',
    skirts:      'Спідниці',
    shorts:      'Шорти',
    bottoms:     'Низ (джинси, спідниці, шорти)',
    accessories: 'Аксесуари',
    shoes:       'Взуття'
};

const CATEGORY_GROUPS = {
    clothes: ['outerwear', 'sweatshirts', 'hoodies', 'tshirts', 'tops', 'dresses', 'jeans', 'skirts', 'shorts'],
    bottoms: ['jeans', 'skirts', 'shorts']
};

const SIZES_JEANS = ['32', '34', '36', '38', '40', '42', '44'];
const SIZES_CLOTHES = ['XS', 'S', 'M', 'L', 'XL'];
const SIZES_SHOES = ['36', '37', '38', '39', '40', '41'];
const SIZES_ONE = ['ONE SIZE'];

const SIZE_CHARTS = {
    jeans: {
        title: 'Джинси та штани',
        columns: ['Розмір', 'Обхват талії', 'Обхват стегон', 'Міжнародний'],
        rows: [
            { size: '32', waist: [58, 61], hips: [82, 85], intl: 'XXS' },
            { size: '34', waist: [62, 65], hips: [86, 89], intl: 'XS' },
            { size: '36', waist: [66, 69], hips: [90, 93], intl: 'S' },
            { size: '38', waist: [70, 73], hips: [94, 97], intl: 'M' },
            { size: '40', waist: [74, 77], hips: [98, 101], intl: 'L' },
            { size: '42', waist: [78, 81], hips: [102, 105], intl: 'XL' },
            { size: '44', waist: [82, 85], hips: [106, 109], intl: 'XXL' }
        ]
    },
    clothes: {
        title: 'Одяг',
        columns: ['Розмір', 'Обхват талії', 'Обхват стегон', 'Обхват грудей'],
        rows: [
            { size: 'XS', waist: [62, 65], hips: [86, 89], chest: [80, 83] },
            { size: 'S',  waist: [66, 69], hips: [90, 93], chest: [84, 87] },
            { size: 'M',  waist: [70, 73], hips: [94, 97], chest: [88, 91] },
            { size: 'L',  waist: [74, 77], hips: [98, 101], chest: [92, 95] },
            { size: 'XL', waist: [78, 81], hips: [102, 105], chest: [96, 99] }
        ]
    },
    shoes: {
        title: 'Взуття',
        columns: ['Розмір', 'Довжина стопи'],
        rows: [
            { size: '36', foot: 23 },
            { size: '37', foot: 23.5 },
            { size: '38', foot: 24.5 },
            { size: '39', foot: 25 },
            { size: '40', foot: 25.5 },
            { size: '41', foot: 26.5 }
        ]
    }
};

const PRODUCTS = [
    {
        id: 'flared-cross', name: 'Flared Jeans Cross', category: 'jeans',
        price: 2199, color: 'чорний', sizes: SIZES_JEANS, soldOut: ['44'],
        short: 'Клеш із хрестоподібними вставками',
        details: {
            'Фасон': 'клеш',
            'Особливості': 'хрестоподібна вставка спереду та ззаду',
            'Тип застібки': 'блискавка',
            'Посадка': 'низька талія',
            'Шлевки для ременя': '☑',
            'Склад тканини': '75% бавовна, 23% поліестер, 2% еластан'
        },
        model: 'Модель має 36 розмір, її зріст 170 см',
        isNew: false, popularity: 100, image: IMG_CARD[0]
    },
    {
        id: 'bootcut', name: 'BootCut', category: 'jeans',
        price: 2499, color: 'синій', sizes: SIZES_JEANS, soldOut: ['32'],
        short: 'Класичний bootcut з потертостями',
        details: { 'Фасон': 'bootcut', 'Посадка': 'середня талія', 'Тип застібки': 'ґудзик + блискавка', 'Склад тканини': '98% бавовна, 2% еластан' },
        isNew: false, popularity: 95, image: IMG_CARD[1]
    },
    {
        id: 'baggy-y2k', name: 'Baggy Y2K', category: 'jeans',
        price: 1999, color: 'сірий', sizes: SIZES_JEANS,
        short: 'Широкі джинси у стилі 2000-х',
        details: { 'Фасон': 'baggy', 'Посадка': 'низька талія', 'Особливості': 'подвійні шлевки, широкі кишені', 'Склад тканини': '100% бавовна' },
        isNew: true, popularity: 90, image: IMG_CARD[0]
    },
    {
        id: 'straight-grunge', name: 'Straight Grunge', category: 'jeans',
        price: 1799, color: 'чорний', sizes: SIZES_JEANS,
        short: 'Прямі джинси з необробленим низом',
        details: { 'Фасон': 'прямий', 'Посадка': 'висока талія', 'Особливості': 'необроблений край', 'Склад тканини': '99% бавовна, 1% еластан' },
        isNew: false, popularity: 70, image: IMG_CARD[1]
    },
    {
        id: 'skinny-rock', name: 'Skinny Rock', category: 'jeans',
        price: 1599, color: 'чорний', sizes: SIZES_JEANS, soldOut: ['42', '44'],
        short: 'Скінні з металевою фурнітурою',
        details: { 'Фасон': 'скінні', 'Посадка': 'середня талія', 'Склад тканини': '92% бавовна, 6% поліестер, 2% еластан' },
        isNew: false, popularity: 60, image: IMG_CARD[0]
    },

    {
        id: 'hoodie-cross', name: 'Hoodie Cross', category: 'tops',
        price: 1899, color: 'чорний', sizes: SIZES_CLOTHES,
        short: 'Худі з великим принтом-хрестом',
        details: {
            'Крій': 'oversize',
            'Особливості': 'капюшон, кишеня-кенгуру, принт спереду',
            'Склад тканини': '80% бавовна, 20% поліестер'
        },
        model: 'Вільний крій — беріть свій звичайний розмір',
        isNew: true, popularity: 88,
        image: 'img/hudi.jpg',
        gallery: ['img/hudi.jpg']
    },
    {
        id: 'hoodie-67', name: 'Oversize Hoodie 67', category: 'hoodies',
        price: 2099, color: 'сірий', sizes: SIZES_CLOTHES, soldOut: ['XS'],
        short: 'Тепле худі з принтом 67',
        details: { 'Крій': 'oversize', 'Особливості': 'фліс усередині', 'Склад тканини': '70% бавовна, 30% поліестер' },
        isNew: false, popularity: 75, image: IMG_CARD[0]
    },

    {
        id: 'sweatshirt-gothic', name: 'Sweatshirt Gothic', category: 'sweatshirts',
        price: 1499, color: 'чорний', sizes: SIZES_CLOTHES,
        short: 'Світшот з готичним написом',
        details: { 'Крій': 'вільний', 'Склад тканини': '100% бавовна' },
        isNew: false, popularity: 65, image: IMG_CARD[1]
    },
    {
        id: 'crewneck-basic', name: 'Crewneck Basic', category: 'sweatshirts',
        price: 1199, color: 'бежевий', sizes: SIZES_CLOTHES,
        short: 'Базовий світшот на кожен день',
        details: { 'Крій': 'прямий', 'Склад тканини': '85% бавовна, 15% поліестер' },
        isNew: true, popularity: 55, image: IMG_CARD[0]
    },

    {
        id: 'tee-six-seven', name: 'Tee Six Seven', category: 'tshirts',
        price: 699, color: 'білий', sizes: SIZES_CLOTHES,
        short: 'Футболка з логотипом SIX SEVEN',
        details: { 'Крій': 'regular', 'Склад тканини': '100% бавовна' },
        isNew: false, popularity: 85, image: IMG_CARD[1]
    },
    {
        id: 'tee-cross', name: 'Tee Cross Print', category: 'tshirts',
        price: 799, color: 'чорний', sizes: SIZES_CLOTHES,
        short: 'Футболка з принтом-хрестом',
        details: { 'Крій': 'oversize', 'Склад тканини': '100% бавовна' },
        isNew: true, popularity: 78, image: IMG_CARD[0]
    },
    {
        id: 'longsleeve-mesh', name: 'Longsleeve Mesh', category: 'tshirts',
        price: 899, color: 'чорний', sizes: SIZES_CLOTHES,
        short: 'Лонгслів із сітки',
        details: { 'Крій': 'приталений', 'Склад тканини': '95% поліамід, 5% еластан' },
        isNew: false, popularity: 50, image: IMG_CARD[1]
    },

    {
        id: 'top-eyelet', name: 'Top Eyelet', category: 'tops',
        price: 899, color: 'білий', sizes: SIZES_CLOTHES,
        short: 'Майка з люверсами',
        details: { 'Крій': 'прямий', 'Особливості': 'металеві люверси', 'Склад тканини': '100% бавовна' },
        isNew: false, popularity: 72, image: IMG_CARD[0]
    },
    {
        id: 'corset-top', name: 'Corset Top', category: 'tops',
        price: 1099, color: 'чорний', sizes: SIZES_CLOTHES, soldOut: ['XL'],
        short: 'Корсетний топ на шнурівці',
        details: { 'Крій': 'приталений', 'Тип застібки': 'шнурівка', 'Склад тканини': '65% поліестер, 35% віскоза' },
        isNew: true, popularity: 80, image: IMG_CARD[1]
    },

    {
        id: 'slip-dress', name: 'Slip Dress Night', category: 'dresses',
        price: 1699, color: 'чорний', sizes: SIZES_CLOTHES,
        short: 'Сукня-комбінація міді',
        details: { 'Довжина': 'міді', 'Склад тканини': '100% віскоза' },
        isNew: false, popularity: 68, image: IMG_CARD[0]
    },
    {
        id: 'mini-lace', name: 'Mini Dress Lace', category: 'dresses',
        price: 1499, color: 'чорний', sizes: SIZES_CLOTHES,
        short: 'Міні-сукня з мереживом',
        details: { 'Довжина': 'міні', 'Особливості': 'мереживні вставки', 'Склад тканини': '90% поліестер, 10% еластан' },
        isNew: true, popularity: 62, image: IMG_CARD[1]
    },

    {
        id: 'denim-maxi-skirt', name: 'Denim Maxi Skirt', category: 'skirts',
        price: 1599, color: 'синій', sizes: SIZES_CLOTHES,
        short: 'Джинсова спідниця максі з розрізом',
        details: { 'Довжина': 'максі', 'Особливості': 'розріз спереду', 'Склад тканини': '100% бавовна' },
        isNew: false, popularity: 66, image: IMG_CARD[0]
    },
    {
        id: 'mini-cargo-skirt', name: 'Mini Skirt Cargo', category: 'skirts',
        price: 1199, color: 'сірий', sizes: SIZES_CLOTHES,
        short: 'Міні-спідниця карго',
        details: { 'Довжина': 'міні', 'Особливості': 'накладні кишені', 'Склад тканини': '100% бавовна' },
        isNew: false, popularity: 58, image: IMG_CARD[1]
    },

    {
        id: 'denim-shorts', name: 'Denim Shorts Raw', category: 'shorts',
        price: 999, color: 'синій', sizes: SIZES_JEANS,
        short: 'Джинсові шорти з необробленим краєм',
        details: { 'Посадка': 'висока талія', 'Склад тканини': '100% бавовна' },
        isNew: false, popularity: 54, image: IMG_CARD[0]
    },
    {
        id: 'jorts-baggy', name: 'Jorts Baggy', category: 'shorts',
        price: 1299, color: 'сірий', sizes: SIZES_JEANS,
        short: 'Довгі широкі джинсові шорти',
        details: { 'Посадка': 'низька талія', 'Довжина': 'до коліна', 'Склад тканини': '100% бавовна' },
        isNew: true, popularity: 64, image: IMG_CARD[1]
    },

    {
        id: 'denim-jacket-cross', name: 'Denim Jacket Cross', category: 'outerwear',
        price: 2999, color: 'чорний', sizes: SIZES_CLOTHES,
        short: 'Джинсова куртка з нашивками',
        details: { 'Крій': 'oversize', 'Тип застібки': 'ґудзики', 'Склад тканини': '100% бавовна' },
        isNew: true, popularity: 82, image: IMG_CARD[0]
    },
    {
        id: 'leather-moto', name: 'Leather Jacket Moto', category: 'outerwear',
        price: 3999, color: 'чорний', sizes: SIZES_CLOTHES, soldOut: ['XS', 'S'],
        short: 'Косуха з екошкіри',
        details: { 'Крій': 'приталений', 'Тип застібки': 'косою блискавкою', 'Склад тканини': '100% поліуретан (екошкіра)' },
        isNew: false, popularity: 76, image: IMG_CARD[1]
    },

    {
        id: 'bag-mini-denim', name: 'Bag Cross Charm', category: 'accessories',
        price: 1299, color: 'чорний', sizes: SIZES_ONE,
        short: 'Сумка з підвіскою-хрестом',
        details: {
            'Матеріал': 'екошкіра',
            'Розмір': '32 × 24 × 12 см',
            'Особливості': 'дві кишені на блискавках спереду, підвіска-хрест',
            'Тип застібки': 'блискавка + декоративна пряжка'
        },
        model: 'Універсальний розмір',
        isNew: true, popularity: 84,
        image: 'img/bag.jpg',
        gallery: ['img/bag.jpg']
    },

    {
        id: 'sneakers-canvas', name: 'Zip High-Tops', category: 'shoes',
        price: 2799, color: 'чорний', sizes: SIZES_SHOES, soldOut: ['41'],
        short: 'Високі кеди на блискавках',
        details: {
            'Матеріал верху': 'натуральна шкіра',
            'Підошва': 'гума, білий носок',
            'Тип застібки': 'дві блискавки + шнурівка',
            'Висота': 'вище щиколотки'
        },
        model: 'Розмір відповідає довжині стопи — див. size chart',
        isNew: true, popularity: 92,
        image: 'img/shoes1 (1).jpg',
        gallery: ['img/shoes1 (1).jpg', 'img/shoes1 (2).jpg']
    }
];

const DEFAULT_REVIEWS = {
    'flared-cross': [
        { id: 'r1', author: 'Антоніна', rating: 5, text: 'Давно шукала ідеальні клеш джинси, і ці — просто знахідка! На мої параметри (ОТ 65, ОБ 94) розмір 36 ідеально підійшов.', date: '2026-10-02', likes: 12, dislikes: 0 },
        { id: 'r2', author: 'Марія', rating: 4, text: 'Якість хороша, вставки виглядають круто. Трохи задовгі — довелося підшити.', date: '2026-10-18', likes: 5, dislikes: 1 }
    ],
    'bootcut': [
        { id: 'r3', author: 'Софія', rating: 5, text: 'Сидять ідеально, тканина щільна, але тягнеться.', date: '2026-09-21', likes: 3, dislikes: 0 }
    ],
    'hoodie-cross': [
        { id: 'r4', author: 'Даша', rating: 5, text: 'Дуже тепле і м’яке, принт не тріскається після прання.', date: '2026-11-01', likes: 2, dislikes: 0 }
    ]
};

const CITIES = {
    'Київ':             ['№1', '№314', '№323', '№456', '№12', '№87'],
    'Львів':            ['№1', '№5', '№22', '№41'],
    'Одеса':            ['№2', '№9', '№33', '№70'],
    'Дніпро':           ['№3', '№14', '№28'],
    'Харків':           ['№1', '№17', '№55', '№102'],
    'Запоріжжя':        ['№4', '№19'],
    'Вінниця':          ['№2', '№11', '№25'],
    'Полтава':          ['№1', '№8'],
    'Івано-Франківськ': ['№3', '№6'],
    'Чернігів':         ['№1', '№10']
};

const DELIVERY = {
    price: 80,
    freeFrom: 2000
};
