/**
 * UDAANMART - COMPREHENSIVE INTERNATIONALIZATION (i18n) & GLOBAL DELIVERY ENGINE
 * Automatically switches full-page language & currency whenever country/location is selected.
 * Translates: Header, Subnav, Hero Carousel, Quad Cards, Deals Strip, Product Cards,
 * Cart Drawer, QuickView Modal, Checkout Wizard, and Footer.
 */

const UDAAN_TRANSLATIONS = {
  hi: {
    name: 'हिन्दी (Hindi)',
    flag: '🇮🇳',
    deliver_to: 'डिलीवरी स्थान',
    search_placeholder: 'UdaanMart पर प्रोडक्ट, ब्रांड या डील खोजें...',
    all_departments: 'सभी विभाग',
    all_products: 'सभी उत्पाद',
    men: '👨 पुरुष (Men)',
    women: '👩 महिलाएं (Women)',
    karigar: '🏡 ग्रामीण कारीगर (Karigar)',
    clothing: '👗 कपड़े और फैशन',
    kitchen: '🍳 घर और रसोई',
    beauty: '💄 सौंदर्य और देखभाल',
    sports: '🏋️ खेलकूद और फिटनेस',
    electronics: '💻 इलेक्ट्रॉनिक्स',
    audio: '🎧 ऑडियो और साउंड',
    smarthome: '🏠 स्मार्ट होम',
    gaming: '🎮 गेमिंग',
    luxury: '⌚ लक्जरी घड़ियाँ',
    wishlist: '❤️ विशलिस्ट',
    seller_hub: '🚀 सेलर पोर्टल (बेचें)',
    prime_delivery_banner: '⚡ दुनिया के हर देश और भारत के 1,55,000+ गाँवों में घर तक मुफ़्त डिलीवरी',
    hello_account: 'नमस्ते, अभिषेक',
    account_lists: 'खाता और सूचियाँ ▾',
    returns: 'वापसी',
    orders: '& ऑर्डर',
    cart: 'कार्ट',
    add_to_cart: 'कार्ट में डालें',
    buy_now: '⚡ अभी खरीदें',
    quickview: 'क्विक व्यू 👁️',

    // Hero Slides
    hero_tag_1: '⚡ फेस्टिव महा बचत',
    hero_title_1: 'टॉप इलेक्ट्रॉनिक्स और स्मार्ट गैजेट्स',
    hero_desc_1: 'प्रीमियम हेडफ़ोन, 4K टीवी, स्मार्टफ़ोन और होम गैजेट्स पर 60% तक की भारी छूट।',
    hero_cta_1a: 'इलेक्ट्रॉनिक्स खरीदें →',
    hero_cta_1b: '⚡ आज की डील्स',

    hero_tag_2: '✨ फ़ैशन और लाइफस्टाइल',
    hero_title_2: 'अपना रोज़मर्रा का स्टाइल निखारें',
    hero_desc_2: 'पुरुषों और महिलाओं के लिए ट्रेंडी कपड़े, डिज़ाइनर घड़ियाँ, जूते और एक्सेसरीज़।',
    hero_cta_2a: 'फ़ैशन एक्सप्लोर करें →',
    hero_cta_2b: 'लक्ज़री घड़ियाँ व बैग्स',

    hero_tag_3: '🇮🇳 उड़ानमार्ट कारीगर',
    hero_title_3: 'मास्टर ग्रामीण बुनकरों और शिल्पकारों से सीधा',
    hero_desc_3: '100% शुद्ध बनारसी सिल्क साड़ियां, कोल्हापुरी चप्पलें और जयपुर की नीली मिट्टी के बर्तन।',
    hero_cta_3a: 'कारीगर उत्पाद देखें →',
    hero_cta_3b: 'हथकरघा संग्रह',

    // Category Quad Tiles
    tile_1_title: '👗 कपड़े और रोज़मर्रा का फ़ैशन',
    tile_1_link: 'शर्ट, कुर्तियां और डेनिम देखें →',
    tile_2_title: '🍳 घर और रसोई का सामान',
    tile_2_link: 'कुकवेयर, मिक्सर और बर्तन देखें →',
    tile_3_title: '💄 सौंदर्य, स्किनकेयर और ग्रूमिंग',
    tile_3_link: 'डाइसन, स्किन क्रीम व ट्रिमर देखें →',
    tile_4_title: '🏋️ खेलकूद, फ़िटनेस व जिम',
    tile_4_link: 'डम्बल, स्मार्टवॉच व योगा मैट →',
    tile_5_title: '💻 हाई-परफॉर्मेंस लैपटॉप व टेक',
    tile_5_link: 'मैकबुक प्रो, आईपैड व कैमरा →',
    tile_6_title: '🎧 प्रो ऑडियो व साउंड सिस्टम्स',
    tile_6_link: 'सोनी हेडफोन व बोस स्पीकर्स →',
    tile_7_title: '🏠 स्मार्ट होम व रोबोट वैक्यूम',
    tile_7_link: 'इको स्पीकर्स व रोबोट क्लीनर्स →',
    tile_8_title: '🎮 प्रो गेमिंग व लक्जरी स्टाइल',
    tile_8_link: 'PS5, गेमिंग कंसोल व घड़ियाँ →',

    // Deals of the day
    deal_title: '⚡ आज की धमाकेदार डील्स',
    deal_sub: 'सीमित समय के ऑफ़र - स्टॉक खत्म होने से पहले तुरंत ऑर्डर करें',

    // Cart Drawer
    cart_drawer_title: 'शॉपिंग कार्ट',
    cart_empty_title: 'आपकी UdaanMart कार्ट खाली है',
    cart_empty_desc: 'आपकी कार्ट अभी खाली है। ताज़ा डील्स और ट्रेंडिंग प्रोडक्ट्स देखें।',
    cart_empty_btn: 'अभी खरीदारी शुरू करें',
    cart_subtotal: 'उप-योग (Subtotal):',
    cart_checkout_btn: 'चेकआउट के लिए आगे बढ़ें →',

    // Checkout
    btn_to_payment: 'भुगतान विधि चुनें →',
    btn_place_order: 'ऑर्डर दें और भुगतान करें 🔒',

    // Modals
    choose_location: '🌍 अपना डिलीवरी स्थान चुनें',
    worldwide_guarantee: '100% मुफ़्त डिलीवरी गारंटी:',
    worldwide_desc: 'भारत के 1,55,000+ पिन कोड, ग्राम पंचायतों व कस्बों में इंडिया पोस्ट स्पीड पोस्ट से और विश्व के 195+ देशों में फेडेक्स/डीएचएल से सीधे घर तक डिलीवरी।',
    apply_btn: 'स्थान लागू करें',

    // Footer
    footer_col_1: 'हमारे बारे में',
    footer_col_2: 'हमारे साथ व्यापार करें',
    footer_col_3: 'भुगतान उत्पाद',
    footer_col_4: 'मदद और सहायता',
    back_to_top: 'वापस ऊपर जाएँ ↑',
    footer_tagline: '© 2026 UdaanMart. सर्वाधिकार सुरक्षित।'
  },

  en: {
    name: 'English',
    flag: '🇺🇸',
    deliver_to: 'Deliver to',
    search_placeholder: 'Search UdaanMart, products, brands, or deals...',
    all_departments: 'All Departments',
    all_products: 'All Products',
    men: "👨 Men's Fashion",
    women: "👩 Women's Fashion",
    karigar: '🏡 Rural Karigar',
    clothing: '👗 Clothing & Fashion',
    kitchen: '🍳 Home & Kitchen',
    beauty: '💄 Beauty & Care',
    sports: '🏋️ Sports & Outdoors',
    electronics: '💻 Electronics',
    audio: '🎧 Audio & Sound',
    smarthome: '🏠 Smart Home',
    gaming: '🎮 Gaming',
    luxury: '⌚ Luxury',
    wishlist: '❤️ Wish List',
    seller_hub: '🚀 Seller Central (Sell)',
    prime_delivery_banner: '⚡ Fast, Free Delivery Worldwide to 195+ Countries & 155,000+ Villages',
    hello_account: 'Hello, Abhishek',
    account_lists: 'Account & Lists ▾',
    returns: 'Returns',
    orders: '& Orders',
    cart: 'Cart',
    add_to_cart: 'Add to Cart',
    buy_now: '⚡ Buy Now',
    quickview: 'Quick View 👁️',

    hero_tag_1: '⚡ Festive Mega Savings',
    hero_title_1: 'Top Electronics & Smart Gadgets',
    hero_desc_1: 'Save up to 60% on premium audio, 4K displays, smartphones, and accessories with free same-day express delivery.',
    hero_cta_1a: 'Shop Electronics →',
    hero_cta_1b: '⚡ Lightning Deals',

    hero_tag_2: '✨ Fashion & Lifestyle',
    hero_title_2: 'Elevate Your Everyday Style',
    hero_desc_2: 'Explore curated collections for Men & Women, luxury timepieces, denim, footwear, and designer accessories.',
    hero_cta_2a: 'Explore Fashion →',
    hero_cta_2b: 'Luxury Watches & Bags',

    hero_tag_3: '🇮🇳 UdaanMart Karigar',
    hero_title_3: 'Direct from Master Indian Artisans',
    hero_desc_3: 'Authentic pure Banarasi silk sarees, Kolhapuri craft, Jaipur blue pottery, and handcrafted heritage pieces.',
    hero_cta_3a: 'Support Rural Artisans →',
    hero_cta_3b: 'Browse Handlooms',

    tile_1_title: '👗 Clothing & Everyday Fashion',
    tile_1_link: 'Shop shirts, dresses & denim →',
    tile_2_title: '🍳 Kitchen & Everyday Essentials',
    tile_2_link: 'Explore cookware, espresso & fryers →',
    tile_3_title: '💄 Beauty, Skincare & Grooming',
    tile_3_link: 'Discover Dyson, CeraVe & trimmers →',
    tile_4_title: '🏋️ Sports, Fitness & Active Life',
    tile_4_link: 'Shop dumbbells, Garmin & yoga mats →',
    tile_5_title: '💻 High-Performance Tech',
    tile_5_link: 'Explore MacBook Pro, iPad & Canon →',
    tile_6_title: '🎧 Pro Audio & Sound Systems',
    tile_6_link: 'Shop Sony ANC & Bose speakers →',
    tile_7_title: '🏠 Smart Home & Robot Cleaners',
    tile_7_link: 'Explore Roborock & Echo devices →',
    tile_8_title: '🎮 Pro Gaming & Luxury Style',
    tile_8_link: 'View PS5, OLED screens & watches →',

    deal_title: '⚡ Deals of the Day',
    deal_sub: 'Limited-time lightning discounts on top electronics and apparel',

    cart_drawer_title: 'Shopping Cart',
    cart_empty_title: 'Your UdaanMart Cart is empty',
    cart_empty_desc: 'Your shopping cart is currently waiting for something great. Explore lightning deals or popular electronics.',
    cart_empty_btn: 'Start Shopping Now',
    cart_subtotal: 'Subtotal:',
    cart_checkout_btn: 'Proceed to Checkout →',

    btn_to_payment: 'Continue to Payment Method →',
    btn_place_order: 'Place Your Order and Pay 🔒',

    choose_location: '🌍 Choose Your Delivery Location',
    worldwide_guarantee: '100% Worldwide & Village Delivery Guaranteed:',
    worldwide_desc: 'Delivering to EVERY PIN code & Gram Panchayat across India via India Post Speed Post, and across 195+ countries worldwide via DHL/FedEx.',
    apply_btn: 'Apply Location',

    footer_col_1: 'Get to Know Us',
    footer_col_2: 'Make Money with Us',
    footer_col_3: 'Payment Products',
    footer_col_4: 'Let Us Help You',
    back_to_top: 'Back to top ↑',
    footer_tagline: '© 2026 UdaanMart. All rights reserved.'
  },

  es: {
    name: 'Español',
    flag: '🇪🇸',
    deliver_to: 'Enviar a',
    search_placeholder: 'Buscar en UdaanMart productos, marcas o chollos...',
    all_departments: 'Departamentos',
    all_products: 'Todos los productos',
    men: '👨 Moda Hombre',
    women: '👩 Moda Mujer',
    karigar: '🏡 Artesanía Rural',
    clothing: '👗 Ropa y Moda',
    kitchen: '🍳 Hogar y Cocina',
    beauty: '💄 Belleza y Salud',
    sports: '🏋️ Deportes y Fitness',
    electronics: '💻 Electrónica',
    audio: '🎧 Audio y Sonido',
    smarthome: '🏠 Hogar Inteligente',
    gaming: '🎮 Videojuegos',
    luxury: '⌚ Lujo y Relojes',
    wishlist: '❤️ Lista de deseos',
    seller_hub: '🚀 Vender en UdaanMart',
    prime_delivery_banner: '⚡ Envío rápido y gratuito a todos los países y zonas rurales',
    hello_account: 'Hola, Abhishek',
    account_lists: 'Cuenta y Listas ▾',
    returns: 'Devoluciones',
    orders: 'y Pedidos',
    cart: 'Cesta',
    add_to_cart: 'Añadir a la cesta',
    buy_now: '⚡ Comprar ya',
    quickview: 'Vista rápida 👁️',

    hero_tag_1: '⚡ Mega Ofertas',
    hero_title_1: 'Electrónica y Dispositivos Inteligentes',
    hero_desc_1: 'Ahorra hasta un 60% en audio premium, televisores 4K y smartphones con envío rápido.',
    hero_cta_1a: 'Comprar Electrónica →',
    hero_cta_1b: '⚡ Ofertas Flash',

    hero_tag_2: '✨ Moda y Estilo',
    hero_title_2: 'Mejora tu estilo diario',
    hero_desc_2: 'Ropa de diseño, relojes de lujo, zapatillas y accesorios para hombre y mujer.',
    hero_cta_2a: 'Ver Moda →',
    hero_cta_2b: 'Relojes y Bolsos',

    hero_tag_3: '🇮🇳 Artesanía UdaanMart',
    hero_title_3: 'Directo de maestros artesanos',
    hero_desc_3: 'Auténticas sedas Banarasi, calzado artesanal y cerámica tradicional.',
    hero_cta_3a: 'Apoyar Artesanos →',
    hero_cta_3b: 'Ver Telar',

    tile_1_title: '👗 Ropa y Moda Diaria',
    tile_1_link: 'Ver camisas, vestidos y jeans →',
    tile_2_title: '🍳 Hogar y Cocina',
    tile_2_link: 'Explorar sartenes y cafeteras →',
    tile_3_title: '💄 Belleza y Cuidado Personal',
    tile_3_link: 'Ver Dyson, cremas y afeitadoras →',
    tile_4_title: '🏋️ Deportes y Vida Activa',
    tile_4_link: 'Ver pesas, Garmin y yoga →',
    tile_5_title: '💻 Portátiles y Tecnología',
    tile_5_link: 'Ver MacBook Pro y cámaras →',
    tile_6_title: '🎧 Audio Pro y Altavoces',
    tile_6_link: 'Auriculares Sony y altavoces Bose →',
    tile_7_title: '🏠 Hogar Inteligente',
    tile_7_link: 'Robots aspiradores y Echo →',
    tile_8_title: '🎮 Gaming Pro y Relojes',
    tile_8_link: 'Ver PS5 y relojes de lujo →',

    deal_title: '⚡ Ofertas del Día',
    deal_sub: 'Grandes descuentos por tiempo limitado en tecnología y moda',

    cart_drawer_title: 'Cesta de Compra',
    cart_empty_title: 'Tu cesta está vacía',
    cart_empty_desc: 'Tu cesta de compras te espera con grandes ofertas en tecnología y moda.',
    cart_empty_btn: 'Empezar a comprar',
    cart_subtotal: 'Subtotal:',
    cart_checkout_btn: 'Tramitar pedido →',

    btn_to_payment: 'Continuar al pago →',
    btn_place_order: 'Confirmar pedido y pagar 🔒',

    choose_location: '🌍 Selecciona tu ubicación de entrega',
    worldwide_guarantee: '100% Garantía de Entrega Global y Rural:',
    worldwide_desc: 'Entrega en más de 195 países y 155,000+ pueblos y códigos postales con mensajería exprés.',
    apply_btn: 'Aplicar ubicación',

    footer_col_1: 'Conócenos',
    footer_col_2: 'Gana dinero con nosotros',
    footer_col_3: 'Métodos de pago',
    footer_col_4: 'Ayuda y soporte',
    back_to_top: 'Volver arriba ↑',
    footer_tagline: '© 2026 UdaanMart. Todos los derechos reservados.'
  },

  fr: {
    name: 'Français',
    flag: '🇫🇷',
    deliver_to: 'Livrer à',
    search_placeholder: 'Rechercher sur UdaanMart, produits, marques...',
    all_departments: 'Tous les rayons',
    all_products: 'Tous les produits',
    men: '👨 Mode Homme',
    women: '👩 Mode Femme',
    karigar: '🏡 Artisans Ruraux',
    clothing: '👗 Mode & Vêtements',
    kitchen: '🍳 Maison & Cuisine',
    beauty: '💄 Beauté & Santé',
    sports: '🏋️ Sports & Loisirs',
    electronics: '💻 Électronique',
    audio: '🎧 Audio & Hi-Fi',
    smarthome: '🏠 Maison connectée',
    gaming: '🎮 Jeux vidéo',
    luxury: '⌚ Luxe & Montres',
    wishlist: "❤️ Liste d'envies",
    seller_hub: '🚀 Espace Vendeur',
    prime_delivery_banner: '⚡ Livraison rapide et gratuite dans 195+ pays et villages',
    hello_account: 'Bonjour, Abhishek',
    account_lists: 'Compte et listes ▾',
    returns: 'Retours',
    orders: 'et Commandes',
    cart: 'Panier',
    add_to_cart: 'Ajouter au panier',
    buy_now: '⚡ Acheter cet article',
    quickview: 'Aperçu 👁️',

    hero_tag_1: '⚡ Méga Économies',
    hero_title_1: 'High-Tech & Gadgets Intelligents',
    hero_desc_1: 'Jusqu’à 60% de réduction sur l’audio premium, les téléviseurs 4K et smartphones avec livraison express.',
    hero_cta_1a: 'Acheter Électronique →',
    hero_cta_1b: '⚡ Ventes Flash',

    hero_tag_2: '✨ Mode & Style',
    hero_title_2: 'Sublimez votre style quotidien',
    hero_desc_2: 'Découvrez les collections homme et femme, montres de luxe et accessoires de créateurs.',
    hero_cta_2a: 'Explorer la mode →',
    hero_cta_2b: 'Montres et Sacs',

    hero_tag_3: '🇮🇳 Artisans UdaanMart',
    hero_title_3: 'En direct des maîtres artisans',
    hero_desc_3: 'Saris en soie pure, chaussures traditionnelles et céramiques artisanales.',
    hero_cta_3a: 'Soutenir les artisans →',
    hero_cta_3b: 'Voir tissages',

    tile_1_title: '👗 Vêtements & Mode',
    tile_1_link: 'Chemises, robes et jeans →',
    tile_2_title: '🍳 Maison & Cuisine',
    tile_2_link: 'Appareils et ustensiles →',
    tile_3_title: '💄 Beauté & Soins',
    tile_3_link: 'Dyson, soins et rasoirs →',
    tile_4_title: '🏋️ Sport & Fitness',
    tile_4_link: 'Haltères, montres et yoga →',
    tile_5_title: '💻 Ordinateurs & Tech',
    tile_5_link: 'MacBook Pro et appareils photo →',
    tile_6_title: '🎧 Audio Pro & Enceintes',
    tile_6_link: 'Casques Sony et enceintes Bose →',
    tile_7_title: '🏠 Maison Connectée',
    tile_7_link: 'Robots aspirateurs et Echo →',
    tile_8_title: '🎮 Gaming Pro & Luxe',
    tile_8_link: 'Consoles PS5 et montres →',

    deal_title: '⚡ Ventes Flash du Jour',
    deal_sub: 'Réductions exceptionnelles pour une durée limitée',

    cart_drawer_title: 'Votre Panier',
    cart_empty_title: 'Votre panier est vide',
    cart_empty_desc: 'Votre panier attend vos articles préférés. Découvrez nos offres spéciales.',
    cart_empty_btn: 'Commencer mes achats',
    cart_subtotal: 'Sous-total :',
    cart_checkout_btn: 'Passer la commande →',

    btn_to_payment: 'Continuer vers le paiement →',
    btn_place_order: 'Confirmer la commande et payer 🔒',

    choose_location: '🌍 Choisissez votre lieu de livraison',
    worldwide_guarantee: '100% Garantie de Livraison Mondiale :',
    worldwide_desc: 'Livraison express à domicile dans plus de 195 pays et 155 000+ codes postaux ruraux.',
    apply_btn: 'Appliquer le lieu',

    footer_col_1: 'À propos',
    footer_col_2: 'Vendez avec nous',
    footer_col_3: 'Moyens de paiement',
    footer_col_4: 'Besoin d’aide ?',
    back_to_top: 'Haut de page ↑',
    footer_tagline: '© 2026 UdaanMart. Tous droits réservés.'
  },

  de: {
    name: 'Deutsch',
    flag: '🇩🇪',
    deliver_to: 'Liefern an',
    search_placeholder: 'UdaanMart durchsuchen, Produkte, Marken oder Deals...',
    all_departments: 'Alle Kategorien',
    all_products: 'Alle Produkte',
    men: '👨 Herrenmode',
    women: '👩 Damenmode',
    karigar: '🏡 Kunsthandwerk',
    clothing: '👗 Kleidung & Mode',
    kitchen: '🍳 Küche, Haushalt & Wohnen',
    beauty: '💄 Beauty & Drogerie',
    sports: '🏋️ Sport & Fitness',
    electronics: '💻 Elektronik & Foto',
    audio: '🎧 Audio & Kopfhörer',
    smarthome: '🏠 Smart Home',
    gaming: '🎮 Games & Konsolen',
    luxury: '⌚ Luxus & Uhren',
    wishlist: '❤️ Wunschzettel',
    seller_hub: '🚀 Verkaufen bei UdaanMart',
    prime_delivery_banner: '⚡ Schnelle, kostenlose weltweite Lieferung in 195+ Länder',
    hello_account: 'Hallo, Abhishek',
    account_lists: 'Konto und Listen ▾',
    returns: 'Warenrücksendungen',
    orders: '& Bestellungen',
    cart: 'Einkaufswagen',
    add_to_cart: 'In den Einkaufswagen',
    buy_now: '⚡ Jetzt kaufen',
    quickview: 'Schnellansicht 👁️',

    hero_tag_1: '⚡ Mega-Rabatte',
    hero_title_1: 'Top-Elektronik & Smart Gadgets',
    hero_desc_1: 'Bis zu 60% Rabatt auf Premium-Audio, 4K-TVs und Smartphones mit kostenlosem Expressversand.',
    hero_cta_1a: 'Elektronik entdecken →',
    hero_cta_1b: '⚡ Blitzangebote',

    hero_tag_2: '✨ Mode & Lifestyle',
    hero_title_2: 'Heben Sie Ihren Stil hervor',
    hero_desc_2: 'Herren- und Damenmode, Designer-Uhren, Schuhe und Accessoires.',
    hero_cta_2a: 'Mode entdecken →',
    hero_cta_2b: 'Uhren & Taschen',

    hero_tag_3: '🇮🇳 UdaanMart Kunsthandwerk',
    hero_title_3: 'Direkt von traditionellen Meistern',
    hero_desc_3: 'Echte Banarasi-Seide, traditionelle Schuhe und handgefertigte Keramik.',
    hero_cta_3a: 'Handwerk unterstützen →',
    hero_cta_3b: 'Kollektion ansehen',

    tile_1_title: '👗 Mode & Kleidung',
    tile_1_link: 'Hemden, Kleider und Jeans →',
    tile_2_title: '🍳 Küche & Haushalt',
    tile_2_link: 'Kochgeschirr und Kaffeemaschinen →',
    tile_3_title: '💄 Beauty & Körperpflege',
    tile_3_link: 'Dyson, Pflege und Rasierer →',
    tile_4_title: '🏋️ Sport & Fitness',
    tile_4_link: 'Hanteln, Uhren und Matten →',
    tile_5_title: '💻 Laptops & Technik',
    tile_5_link: 'MacBook Pro und Kameras →',
    tile_6_title: '🎧 Audio & Lautsprecher',
    tile_6_link: 'Sony Kopfhörer und Bose Lautsprecher →',
    tile_7_title: '🏠 Smart Home Geräte',
    tile_7_link: 'Saugroboter und Echo Geräte →',
    tile_8_title: '🎮 Pro Gaming & Uhren',
    tile_8_link: 'PS5 Konsolen und Luxusuhren →',

    deal_title: '⚡ Angebote des Tages',
    deal_sub: 'Stark reduzierte Blitzangebote für Elektronik und Mode',

    cart_drawer_title: 'Einkaufswagen',
    cart_empty_title: 'Ihr Einkaufswagen ist leer',
    cart_empty_desc: 'Ihr Einkaufswagen wartet auf tolle Angebote und Produkte.',
    cart_empty_btn: 'Jetzt einkaufen',
    cart_subtotal: 'Zwischensumme:',
    cart_checkout_btn: 'Zur Kasse gehen →',

    btn_to_payment: 'Weiter zur Zahlungsmethode →',
    btn_place_order: 'Bestellung absenden und bezahlen 🔒',

    choose_location: '🌍 Lieferadresse wählen',
    worldwide_guarantee: '100% Weltweite Liefergarantie:',
    worldwide_desc: 'Zuverlässige Lieferung in über 195 Länder und 155.000+ ländliche Postleitzahlen per Kurier und Expresspost.',
    apply_btn: 'Adresse übernehmen',

    footer_col_1: 'Über uns',
    footer_col_2: 'Geld verdienen mit uns',
    footer_col_3: 'Zahlungsarten',
    footer_col_4: 'Hilfe & Kontakt',
    back_to_top: 'Nach oben ↑',
    footer_tagline: '© 2026 UdaanMart. Alle Rechte vorbehalten.'
  },

  ja: {
    name: '日本語',
    flag: '🇯🇵',
    deliver_to: 'お届け先',
    search_placeholder: 'UdaanMartで商品、ブランド、セールを検索...',
    all_departments: 'すべて',
    all_products: 'すべての商品',
    men: '👨 メンズファッション',
    women: '👩 レディースファッション',
    karigar: '🏡 伝統職人手作り工芸',
    clothing: '👗 服＆ファッション小物',
    kitchen: '🍳 ホーム＆キッチン',
    beauty: '💄 ビューティー＆ヘルスケア',
    sports: '🏋️ スポーツ＆アウトドア',
    electronics: '💻 家電＆パソコン',
    audio: '🎧 イヤホン・オーディオ',
    smarthome: '🏠 スマート家電',
    gaming: '🎮 ゲーム＆VR',
    luxury: '⌚ ラグジュアリー時計',
    wishlist: '❤️ ほしい物リスト',
    seller_hub: '🚀 出品サービス (売る)',
    prime_delivery_banner: '⚡ 日本全国および世界195カ国の村落・都市へスピード無料配送',
    hello_account: 'こんにちは、Abhishek',
    account_lists: 'アカウント＆リスト ▾',
    returns: '返品もこちら',
    orders: '注文履歴',
    cart: 'カート',
    add_to_cart: 'カートに入れる',
    buy_now: '⚡ 今すぐ購入',
    quickview: 'クイックビュー 👁️',

    hero_tag_1: '⚡ 特大メガセール',
    hero_title_1: '最新家電・スマートガジェット',
    hero_desc_1: '高級ヘッドホン、4Kテレビ、スマートフォンが最大60%OFF。即日無料配送。',
    hero_cta_1a: '家電を見る →',
    hero_cta_1b: '⚡ タイムセール',

    hero_tag_2: '✨ ファッション＆ライフスタイル',
    hero_title_2: '毎日のスタイルをアップグレード',
    hero_desc_2: 'メンズ＆レディースの注目ブランド、高級時計、スニーカー、アクセサリー。',
    hero_cta_2a: 'ファッションを見る →',
    hero_cta_2b: '時計・バッグ',

    hero_tag_3: '🇮🇳 職人手作りコレクション',
    hero_title_3: '伝統職人による手織り・手作り品',
    hero_desc_3: '本場シルクサリー、職人手作りシューズ、ジャイプル陶器を産地直送。',
    hero_cta_3a: '職人を応援する →',
    hero_cta_3b: '手織り品を見る',

    tile_1_title: '👗 ファッション＆日常着',
    tile_1_link: 'シャツ、ワンピース、デニム →',
    tile_2_title: '🍳 キッチン＆生活用品',
    tile_2_link: '調理器具、コーヒーメーカー →',
    tile_3_title: '💄 美容・スキンケア',
    tile_3_link: 'ダイソン、コスメ、シェーバー →',
    tile_4_title: '🏋️ スポーツ＆フィットネス',
    tile_4_link: 'ダンベル、ガーミン、ヨガマット →',
    tile_5_title: '💻 高性能PC・カメラ',
    tile_5_link: 'MacBook Pro、iPad、カメラ →',
    tile_6_title: '🎧 プロオーディオ・スピーカー',
    tile_6_link: 'ソニー製イヤホン＆ボーズ →',
    tile_7_title: '🏠 スマート家電・ロボット掃除機',
    tile_7_link: 'ロボット掃除機＆スマートスピーカー →',
    tile_8_title: '🎮 プロゲーム＆高級時計',
    tile_8_link: 'PS5本体＆ラグジュアリー時計 →',

    deal_title: '⚡ 本日の特大タイムセール',
    deal_sub: '人気ガジェット・ファッションの数量限定特別割引',

    cart_drawer_title: 'ショッピングカート',
    cart_empty_title: 'カートは空です',
    cart_empty_desc: '現在カートに商品はありません。お得なタイムセール商品をご覧ください。',
    cart_empty_btn: 'お買い物を続ける',
    cart_subtotal: '小計 (税込):',
    cart_checkout_btn: 'レジに進む →',

    btn_to_payment: 'お支払い方法へ進む →',
    btn_place_order: '注文を確定して支払う 🔒',

    choose_location: '🌍 お届け先を選択',
    worldwide_guarantee: '100% ドアステップ配達保証:',
    worldwide_desc: '日本全国すべての市町村・農村部、および世界195カ国へ国際スピード郵便および宅配便で確実にお届けします。',
    apply_btn: '場所を設定する',

    footer_col_1: '会社概要',
    footer_col_2: '出品について',
    footer_col_3: 'お支払い方法',
    footer_col_4: 'ヘルプ＆サポート',
    back_to_top: 'トップへ戻る ↑',
    footer_tagline: '© 2026 UdaanMart. 無断転載を禁じます。'
  },

  ar: {
    name: 'العربية',
    flag: '🇦🇪',
    deliver_to: 'التوصيل إلى',
    search_placeholder: 'ابحث في أودان مارت عن المنتجات والماركات والعروض...',
    all_departments: 'جميع الأقسام',
    all_products: 'جميع المنتجات',
    men: '👨 أزياء رجالية',
    women: '👩 أزياء نسائية',
    karigar: '🏡 حرفيون قرويون تقليديون',
    clothing: '👗 ملابس وموضة',
    kitchen: '🍳 المنزل والمطبخ',
    beauty: '💄 الجمال والعناية',
    sports: '🏋️ رياضة ولياقة',
    electronics: '💻 إلكترونيات وأجهزة',
    audio: '🎧 صوتيات وسماعات',
    smarthome: '🏠 أجهزة المنزل الذكي',
    gaming: '🎮 ألعاب فيديو',
    luxury: '⌚ ساعات فاخرة',
    wishlist: '❤️ قائمة الرغبات',
    seller_hub: '🚀 بوابة البائعين',
    prime_delivery_banner: '⚡ توصيل سريع ومجاني لجميع دول العالم و155,000+ قرية',
    hello_account: 'مرحبًا، أبهيشيك',
    account_lists: 'الحساب والقوائم ▾',
    returns: 'المرتجعات',
    orders: 'والطلبات',
    cart: 'عربة التسوق',
    add_to_cart: 'أضف إلى السلة',
    buy_now: '⚡ اشتري الآن',
    quickview: 'نظرة سريعة 👁️',

    hero_tag_1: '⚡ عروض كبرى توفيرية',
    hero_title_1: 'أفضل الإلكترونيات والأجهزة الذكية',
    hero_desc_1: 'وفر حتى 60% على السماعات والشاشات والهواتف الذكية مع توصيل سريع ومجاني.',
    hero_cta_1a: 'تسوق الإلكترونيات →',
    hero_cta_1b: '⚡ عروض خاطفة',

    hero_tag_2: '✨ الأزياء والأناقة',
    hero_title_2: 'ارتق بأسلوبك اليومي',
    hero_desc_2: 'تشكيلة راقية للرجال والنساء، ساعات فاخرة وأحذية وإكسسوارات أنيقة.',
    hero_cta_2a: 'استكشف الأزياء →',
    hero_cta_2b: 'ساعات وحقائب',

    hero_tag_3: '🇮🇳 منتجات حرفية تقليدية',
    hero_title_3: 'مباشرة من أمهر الحرفيين الريفيين',
    hero_desc_3: 'أوشحة وساري حرير طبيعي 100%، أحذية تقليدية، وخزف وفخار يدوي.',
    hero_cta_3a: 'ادعم الحرفيين →',
    hero_cta_3b: 'تصفح المشغولات',

    tile_1_title: '👗 الأزياء والملابس اليومية',
    tile_1_link: 'تسوق القمصان والفساتين والجينز →',
    tile_2_title: '🍳 مستلزمات المنزل والمطبخ',
    tile_2_link: 'أواني الطهي ومحضرات القهوة →',
    tile_3_title: '💄 الجمال والعناية الشخصية',
    tile_3_link: 'منتجات دايسون وكريمات العناية →',
    tile_4_title: '🏋️ الرياضة والرشاقة البدنية',
    tile_4_link: 'الأثقال وساعات جارمن واليوغا →',
    tile_5_title: '💻 حواسيب وأجهزة فائقة الأداء',
    tile_5_link: 'أجهزة ماك بوك وآيباد وكاميرات →',
    tile_6_title: '🎧 أنظمة الصوت والسماعات',
    tile_6_link: 'سماعات سوني ومكبرات بوز →',
    tile_7_title: '🏠 الأجهزة المنزلية والروبوتات',
    tile_7_link: 'مكانس روبوت وأجهزة إيكو →',
    tile_8_title: '🎮 ألعاب الفيديو والساعات الفاخرة',
    tile_8_link: 'أجهزة PS5 وشاشات وساعات فاخرة →',

    deal_title: '⚡ عروض اليوم المميزة',
    deal_sub: 'خصومات حصرية ولفترة محدودة على أفضل المنتجات',

    cart_drawer_title: 'عربة التسوق',
    cart_empty_title: 'عربة التسوق فارغة',
    cart_empty_desc: 'عربة التسوق تنتظر اختيارك للمنتجات والعروض المميزة.',
    cart_empty_btn: 'ابدأ التسوق الآن',
    cart_subtotal: 'المجموع الفرعي:',
    cart_checkout_btn: 'متابعة الشراء والتوصيل →',

    btn_to_payment: 'المتابعة لاختيار طريقة الدفع →',
    btn_place_order: 'تأكيد الطلب والدفع 🔒',

    choose_location: '🌍 اختر موقع التوصيل',
    worldwide_guarantee: 'ضمان التوصيل لجميع دول العالم 100%:',
    worldwide_desc: 'نقوم بالتوصيل لجميع المدن والقرى والمناطق الريفية والنائية عبر الشحن الجوي السريع والبريد الدولي.',
    apply_btn: 'تطبيق الموقع',

    footer_col_1: 'تعرف علينا',
    footer_col_2: 'كن شريكاً واكسب معنا',
    footer_col_3: 'طرق الدفع والشراء',
    footer_col_4: 'المساعدة والدعم',
    back_to_top: 'العودة إلى الأعلى ↑',
    footer_tagline: '© 2026 UdaanMart. جميع الحقوق محفوظة.'
  }
};

class UdaanI18nEngine {
  constructor() {
    this.currentLang = localStorage.getItem('udaan_lang_v1') || 'hi';
    this.translations = UDAAN_TRANSLATIONS;
    this.init();
  }

  init() {
    this.applyLanguage(this.currentLang, false);
    this.bindLanguageSelector();
  }

  t(key) {
    const dict = this.translations[this.currentLang] || this.translations.en;
    return dict[key] || this.translations.en[key] || key;
  }

  applyLanguage(lang, announce = true) {
    if (!this.translations[lang]) {
      lang = 'en';
    }
    this.currentLang = lang;
    localStorage.setItem('udaan_lang_v1', lang);
    document.documentElement.setAttribute('lang', lang);

    // Apply RTL for Arabic if selected
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.removeAttribute('dir');
    }

    const dict = this.translations[lang];

    // 1. Navigation Header
    this.setTextSafe('.delivery-line-1', dict.deliver_to);
    this.setAttrSafe('#navbar-search-input', 'placeholder', dict.search_placeholder);
    this.setTextSafe('#nav-account-btn .nav-item-small', dict.hello_account);
    this.setTextSafe('#nav-account-btn .nav-item-bold', dict.account_lists);
    this.setTextSafe('#nav-orders-btn .nav-item-small', dict.returns);
    this.setTextSafe('#nav-orders-btn .nav-item-bold', dict.orders);
    this.setTextSafe('.nav-cart-label', dict.cart);
    this.setTextSafe('.prime-special-banner', dict.prime_delivery_banner);
    this.setTextSafe('.seller-hub-text', dict.seller_hub);

    // 2. Subnav links
    this.setTextSafe('#nav-hamburger-btn span:not(.hamburger-icon-lines)', dict.all_departments);
    this.setTextSafe('.nav-sub-item[data-filter-category="all"]', dict.all_products);
    this.setTextSafe('.nav-sub-item[data-filter-gender="men"]', dict.men);
    this.setTextSafe('.nav-sub-item[data-filter-gender="women"]', dict.women);
    this.setTextSafe('.nav-sub-item[data-filter-gender="karigar"]', dict.karigar);
    this.setTextSafe('.nav-sub-item[data-filter-category="clothing"]', dict.clothing);
    this.setTextSafe('.nav-sub-item[data-filter-category="kitchen"]', dict.kitchen);
    this.setTextSafe('.nav-sub-item[data-filter-category="beauty"]', dict.beauty);
    this.setTextSafe('.nav-sub-item[data-filter-category="sports"]', dict.sports);
    this.setTextSafe('.nav-sub-item[data-filter-category="electronics"]', dict.electronics);
    this.setTextSafe('.nav-sub-item[data-filter-category="audio"]', dict.audio);
    this.setTextSafe('.nav-sub-item[data-filter-category="smarthome"]', dict.smarthome);
    this.setTextSafe('.nav-sub-item[data-filter-category="gaming"]', dict.gaming);
    this.setTextSafe('.nav-sub-item[data-filter-category="fashion"]', dict.luxury);
    this.setTextSafe('#nav-wishlist-link', dict.wishlist);

    // 3. Hero Carousel Slides
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides && heroSlides.length >= 3) {
      // Slide 1
      this.setTextSafeElement(heroSlides[0].querySelector('.hero-tag'), dict.hero_tag_1);
      this.setTextSafeElement(heroSlides[0].querySelector('.hero-title'), dict.hero_title_1);
      this.setTextSafeElement(heroSlides[0].querySelector('.hero-desc'), dict.hero_desc_1);
      const s1Btns = heroSlides[0].querySelectorAll('.hero-cta-btn');
      if (s1Btns[0]) s1Btns[0].textContent = dict.hero_cta_1a;
      if (s1Btns[1]) s1Btns[1].textContent = dict.hero_cta_1b;

      // Slide 2
      this.setTextSafeElement(heroSlides[1].querySelector('.hero-tag'), dict.hero_tag_2);
      this.setTextSafeElement(heroSlides[1].querySelector('.hero-title'), dict.hero_title_2);
      this.setTextSafeElement(heroSlides[1].querySelector('.hero-desc'), dict.hero_desc_2);
      const s2Btns = heroSlides[1].querySelectorAll('.hero-cta-btn');
      if (s2Btns[0]) s2Btns[0].textContent = dict.hero_cta_2a;
      if (s2Btns[1]) s2Btns[1].textContent = dict.hero_cta_2b;

      // Slide 3
      this.setTextSafeElement(heroSlides[2].querySelector('.hero-tag'), dict.hero_tag_3);
      this.setTextSafeElement(heroSlides[2].querySelector('.hero-title'), dict.hero_title_3);
      this.setTextSafeElement(heroSlides[2].querySelector('.hero-desc'), dict.hero_desc_3);
      const s3Btns = heroSlides[2].querySelectorAll('.hero-cta-btn');
      if (s3Btns[0]) s3Btns[0].textContent = dict.hero_cta_3a;
      if (s3Btns[1]) s3Btns[1].textContent = dict.hero_cta_3b;
    }

    // 4. Category Quad Cards
    const tiles = document.querySelectorAll('.tile-card');
    if (tiles && tiles.length >= 8) {
      for (let i = 1; i <= 8; i++) {
        const titleKey = `tile_${i}_title`;
        const linkKey = `tile_${i}_link`;
        const card = tiles[i - 1];
        if (card) {
          const tEl = card.querySelector('.tile-title');
          const lEl = card.querySelector('.tile-link');
          if (tEl && dict[titleKey]) tEl.textContent = dict[titleKey];
          if (lEl && dict[linkKey]) lEl.textContent = dict[linkKey];
        }
      }
    }

    // 5. Deals of the Day Banner
    this.setTextSafe('.deal-banner-heading', dict.deal_title);
    this.setTextSafe('.deal-banner-sub', dict.deal_sub);

    // 6. Cart Drawer
    this.setTextSafe('.cart-drawer-title', dict.cart_drawer_title);
    this.setTextSafe('.cart-empty-title', dict.cart_empty_title);
    this.setTextSafe('.cart-empty-desc', dict.cart_empty_desc);
    this.setTextSafe('.cart-drawer-empty .amz-btn-primary', dict.cart_empty_btn);
    this.setTextSafe('.cd-subtotal-label', dict.cart_subtotal);
    this.setTextSafe('#cart-drawer-checkout-btn', dict.cart_checkout_btn);

    // 7. Checkout Wizard Buttons
    this.setTextSafe('#btn-to-payment', dict.btn_to_payment);
    this.setTextSafe('#btn-place-order', dict.btn_place_order);

    // 8. Location Modal
    this.setTextSafe('#location-modal .modal-title', dict.choose_location);
    this.setTextSafe('#location-guarantee-heading', dict.worldwide_guarantee);
    this.setTextSafe('#location-guarantee-desc', dict.worldwide_desc);
    this.setTextSafe('#btn-apply-location', dict.apply_btn);

    // 9. Footer
    const footerColTitles = document.querySelectorAll('.footer-col-title');
    if (footerColTitles.length >= 4) {
      footerColTitles[0].textContent = dict.footer_col_1;
      footerColTitles[1].textContent = dict.footer_col_2;
      footerColTitles[2].textContent = dict.footer_col_3;
      footerColTitles[3].textContent = dict.footer_col_4;
    }
    this.setTextSafe('#footer-back-to-top', dict.back_to_top);
    this.setTextSafe('.footer-bottom-bar div:first-child', dict.footer_tagline);

    // 10. Update Language Dropdown in Navbar
    const langSelect = document.getElementById('language-selector');
    if (langSelect) {
      langSelect.value = lang;
    }
    const langFlag = document.getElementById('nav-current-lang-flag');
    if (langFlag) {
      langFlag.textContent = dict.flag;
    }

    // 11. Refresh product catalog cards (translates "Add to Cart", "⚡ Buy Now", "Quick View")
    if (window.amzSearchFilter) {
      window.amzSearchFilter.refreshCatalog();
    }

    if (announce && window.amzCart) {
      window.amzCart.showToast(`${dict.flag} Language updated to ${dict.name}!`, 'info');
    }
  }

  setTextSafe(selector, text) {
    if (!text) return;
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  setTextSafeElement(el, text) {
    if (el && text) el.textContent = text;
  }

  setAttrSafe(selector, attr, val) {
    if (!val) return;
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, val);
  }

  bindLanguageSelector() {
    const langSelect = document.getElementById('language-selector');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        this.applyLanguage(e.target.value, true);
      });
    }
  }

  /**
   * Intelligently detects country from city, village name, state, or PIN/ZIP code,
   * returning matching language, currency, and verified delivery partner.
   */
  detectCountryAndDetails(inputStr) {
    if (!inputStr) {
      return { lang: 'hi', currency: 'INR', flag: '🇮🇳', region: 'India (भारत)', carrier: 'India Post Speed Post & Rural Delivery' };
    }

    const s = inputStr.toLowerCase().trim();

    // 1. India Detection (Cities, States, Gram Panchayats, Villages, or 6-digit PIN)
    const isIndia = s.includes('india') || s.includes('bharat') || s.includes('mumbai') || 
                    s.includes('delhi') || s.includes('bangalore') || s.includes('bengaluru') || 
                    s.includes('chennai') || s.includes('kolkata') || s.includes('hyderabad') || 
                    s.includes('pune') || s.includes('jaipur') || s.includes('lucknow') || 
                    s.includes('varanasi') || s.includes('azamgarh') || s.includes('patna') || 
                    s.includes('ahmedabad') || s.includes('surat') || s.includes('kanpur') || 
                    s.includes('nagpur') || s.includes('indore') || s.includes('bhopal') || 
                    s.includes('village') || s.includes('gram') || s.includes('tehsil') ||
                    /\b[1-9][0-9]{5}\b/.test(s);

    if (isIndia) {
      return {
        lang: 'hi',
        currency: 'INR',
        flag: '🇮🇳',
        region: 'India (155,000+ Villages & Cities)',
        carrier: 'India Post Speed Post & Rural Express Van (FREE)'
      };
    }

    // 2. Japan Detection
    if (s.includes('japan') || s.includes('tokyo') || s.includes('osaka') || 
        s.includes('kyoto') || s.includes('yokohama') || /\b[0-9]{3}-?[0-9]{4}\b/.test(s)) {
      return {
        lang: 'ja',
        currency: 'JPY',
        flag: '🇯🇵',
        region: 'Japan (日本全国)',
        carrier: 'Japan Post & Global Express Courier (FREE)'
      };
    }

    // 3. Germany / DACH Detection
    if (s.includes('germany') || s.includes('deutschland') || s.includes('berlin') || 
        s.includes('munich') || s.includes('frankfurt') || s.includes('hamburg') || 
        s.includes('cologne') || s.includes('vienna') || s.includes('austria')) {
      return {
        lang: 'de',
        currency: 'EUR',
        flag: '🇩🇪',
        region: 'Germany / Deutschland',
        carrier: 'DHL Express & Deutsche Post (FREE)'
      };
    }

    // 4. France / Francophone Detection
    if (s.includes('france') || s.includes('paris') || s.includes('lyon') || 
        s.includes('marseille') || s.includes('bordeaux') || s.includes('nice') || s.includes('monaco')) {
      return {
        lang: 'fr',
        currency: 'EUR',
        flag: '🇫🇷',
        region: 'France & Europe',
        carrier: 'La Poste Colissimo & Express Courier (FREE)'
      };
    }

    // 5. Spain & Latin America Detection
    if (s.includes('spain') || s.includes('españa') || s.includes('madrid') || 
        s.includes('barcelona') || s.includes('valencia') || s.includes('seville') || 
        s.includes('mexico') || s.includes('bogota') || s.includes('buenos aires')) {
      return {
        lang: 'es',
        currency: 'EUR',
        flag: '🇪🇸',
        region: 'Spain & Latin America',
        carrier: 'Correos Express & Global Courier (FREE)'
      };
    }

    // 6. UAE & Middle East Detection
    if (s.includes('uae') || s.includes('dubai') || s.includes('abu dhabi') || 
        s.includes('saudi') || s.includes('riyadh') || s.includes('jeddah') || 
        s.includes('qatar') || s.includes('doha') || s.includes('kuwait') || s.includes('oman')) {
      return {
        lang: 'ar',
        currency: 'USD',
        flag: '🇦🇪',
        region: 'Middle East & Gulf',
        carrier: 'Aramex & Emirates Express Air Delivery (FREE)'
      };
    }

    // 7. United Kingdom Detection
    if (s.includes('uk') || s.includes('united kingdom') || s.includes('london') || 
        s.includes('manchester') || s.includes('birmingham') || s.includes('scotland') || 
        s.includes('glasgow') || s.includes('edinburgh') || s.includes('england')) {
      return {
        lang: 'en',
        currency: 'GBP',
        flag: '🇬🇧',
        region: 'United Kingdom',
        carrier: 'Royal Mail Special Delivery & DPD Express (FREE)'
      };
    }

    // 8. Canada Detection
    if (s.includes('canada') || s.includes('toronto') || s.includes('vancouver') || 
        s.includes('montreal') || s.includes('ottawa') || s.includes('calgary')) {
      return {
        lang: 'en',
        currency: 'CAD',
        flag: '🇨🇦',
        region: 'Canada',
        carrier: 'Canada Post Xpresspost & FedEx Express (FREE)'
      };
    }

    // 9. Australia Detection
    if (s.includes('australia') || s.includes('sydney') || s.includes('melbourne') || 
        s.includes('brisbane') || s.includes('perth')) {
      return {
        lang: 'en',
        currency: 'USD',
        flag: '🇦🇺',
        region: 'Australia',
        carrier: 'Australia Post Express & DHL Global (FREE)'
      };
    }

    // 10. Default / Universal Global Delivery (USA, Europe, Worldwide)
    return {
      lang: 'en',
      currency: 'USD',
      flag: '🌐',
      region: 'Worldwide Doorstep Delivery',
      carrier: 'FedEx Global Priority & Postal Air Delivery (FREE)'
    };
  }
}

// Instantiate globally
window.udaanI18n = new UdaanI18nEngine();
