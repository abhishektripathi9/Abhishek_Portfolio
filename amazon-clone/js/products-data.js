/**
 * AMAZON CLONE - PRODUCT INVENTORY CATALOG
 * Comprehensive e-commerce dataset spanning all major retail departments:
 * Clothing & Apparel, Home & Kitchen, Beauty & Grooming, Sports & Fitness,
 * Electronics, Audio, Smart Home, Gaming, and Luxury Timepieces.
 */

const PRODUCTS_DATA = [
  // ==========================================
  // 1. CLOTHING, SHOES & APPAREL
  // ==========================================
  {
    id: "prod-13",
    title: "Men's Classic Oxford 100% Breathable Cotton Button-Down Casual Long Sleeve Shirt",
    shortTitle: "Men's Classic Oxford Cotton Shirt",
    category: "clothing",
    categoryName: "Clothing & Fashion",
    gender: "men",
    price: 34.99,
    originalPrice: 49.99,
    discountPercent: 30,
    rating: 4.6,
    ratingCount: 8420,
    badge: "Best Seller",
    isPrime: true,
    delivery: "FREE Delivery Tomorrow, 7 AM - 11 AM",
    stock: 24,
    isLightningDeal: true,
    dealPercentage: 72,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15c429f6dd8?w=800&q=80"
    ],
    features: [
      "100% combed long-staple breathable cotton for day-long crisp comfort and drape",
      "Tailored modern regular fit with box pleat on back and curved shirttail hem",
      "Pre-washed to minimize shrinkage; wrinkle-resistant fabric technology",
      "Durable mother-of-pearl buttons with cross-stitched reinforcement",
      "Versatile styling: pairs seamlessly with denim jeans or formal dress trousers"
    ],
    specs: {
      "Brand": "Amazon Essentials",
      "Material": "100% Premium Combed Cotton",
      "Collar Style": "Button-Down Collar",
      "Fit": "Modern Regular Fit",
      "Care Instructions": "Machine Wash Warm, Tumble Dry Low"
    }
  },
  {
    id: "prod-14",
    title: "Women's Elegant Floral Print Summer A-Line Bohemian Midi Dress with Hidden Pockets",
    shortTitle: "Women's Floral A-Line Midi Dress",
    category: "clothing",
    categoryName: "Clothing & Fashion",
    gender: "women",
    price: 39.99,
    originalPrice: 59.99,
    discountPercent: 33,
    rating: 4.7,
    ratingCount: 12150,
    badge: "Amazon's Choice",
    isPrime: true,
    delivery: "FREE Delivery Tomorrow by 2 PM",
    stock: 19,
    isLightningDeal: false,
    dealPercentage: 45,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80"
    ],
    features: [
      "Lightweight, ultra-soft breathable rayon blend with graceful drape",
      "Flattering V-neckline with elasticated smocked waist and tiered ruffled hem",
      "Dual deep side pockets that blend invisibly into the skirt seam",
      "Vibrant fade-resistant botanical floral print",
      "Perfect for casual weekend brunches, weddings, travel, and festive gatherings"
    ],
    specs: {
      "Brand": "Grace Karin",
      "Material": "95% Viscose Rayon, 5% Spandex",
      "Dress Length": "Midi Length (Below Knee)",
      "Sleeve": "Flutter Cap Sleeves",
      "Closure": "Pull-On with Elastic Smocking"
    }
  },
  {
    id: "prod-15",
    title: "Nike Air Zoom Pegasus Lightweight Breathable Performance Men's & Women's Running Sneakers",
    shortTitle: "Nike Air Zoom Pegasus Running Shoes",
    category: "clothing",
    categoryName: "Clothing & Fashion",
    gender: "unisex",
    price: 129.99,
    originalPrice: 149.99,
    discountPercent: 13,
    rating: 4.8,
    ratingCount: 21340,
    badge: "Best Seller",
    isPrime: true,
    delivery: "FREE Delivery Tomorrow, 11 AM - 3 PM",
    stock: 8,
    isLightningDeal: true,
    dealPercentage: 88,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80"
    ],
    features: [
      "Dual Zoom Air units deliver responsive spring-loaded rebound with every stride",
      "Engineered mesh upper optimizes air ventilation while anchoring the midfoot",
      "Waffle-inspired rubber outsole provides exceptional traction on asphalt and gravel tracks",
      "Plush heel collar prevents Achilles tendon chafing on long-distance runs",
      "Durable React foam midsole provides cushioned support without added weight"
    ],
    specs: {
      "Brand": "Nike",
      "Shoe Type": "Neutral Daily Road Runner",
      "Cushioning": "Nike React Foam + Zoom Air",
      "Drop": "10 mm Heel-to-Toe",
      "Weight": "285 Grams (Size 9)"
    }
  },
  {
    id: "prod-16",
    title: "Levi's Men's 511 Slim Fit Stretch Denim Jeans - Classic Indigo Heritage Wash",
    shortTitle: "Levi's 511 Slim Fit Stretch Jeans",
    category: "clothing",
    categoryName: "Clothing & Fashion",
    gender: "men",
    price: 59.50,
    originalPrice: 69.50,
    discountPercent: 14,
    rating: 4.6,
    ratingCount: 34920,
    badge: "Amazon's Choice",
    isPrime: true,
    delivery: "FREE Two-Day Delivery",
    stock: 22,
    isLightningDeal: false,
    dealPercentage: 35,
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80"
    ],
    features: [
      "The definitive modern slim jean: cut close without restricting natural movement",
      "Engineered with +All Seasons Tech for temperature-regulating breathability",
      "Classic 5-pocket styling with signature arcuate stitching on back pockets",
      "Heavy-duty copper rivets at key stress points for years of enduring wear",
      "Comfort stretch denim retains shape after repeated washes without bagging"
    ],
    specs: {
      "Brand": "Levi Strauss & Co.",
      "Fabric": "99% Cotton, 1% Elastane",
      "Fit": "Slim from Hip to Ankle",
      "Leg Opening": "14.5 Inches",
      "Closure": "Heavy-Duty Zip Fly with Shank Button"
    }
  },

  // ==========================================
  // 2. HOME, KITCHEN & DINING
  // ==========================================
  {
    id: "prod-18",
    title: "Granite Stone 10-Piece Non-Stick Induction Cookware Set with Stay-Cool Stainless Handles",
    shortTitle: "Granite Stone 10-Piece Non-Stick Cookware Set",
    category: "kitchen",
    categoryName: "Home & Kitchen",
    gender: "unisex",
    price: 119.99,
    originalPrice: 179.99,
    discountPercent: 33,
    rating: 4.7,
    ratingCount: 14200,
    badge: "Best Seller",
    isPrime: true,
    delivery: "FREE Delivery Tomorrow, 2 PM - 6 PM",
    stock: 12,
    isLightningDeal: true,
    dealPercentage: 85,
    images: [
      "https://images.unsplash.com/photo-1584990347449-39726ef3bb1a?w=800&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&q=80"
    ],
    features: [
      "Ultra non-stick granite mineral coating allows oil-free healthy cooking and instant wipe-down cleaning",
      "100% PFOA, PFOS, Lead, and Cadmium free for wholesome food safety",
      "Heavy-gauge aluminum core ensures even heat distribution with zero hot spots",
      "Ergonomic riveted stainless steel handles remain cool on stovetops",
      "Oven safe up to 500°F (260°C); compatible with induction, gas, and electric cooktops"
    ],
    specs: {
      "Brand": "Carote Granite",
      "Set Includes": "2 Frying Pans, 2 Saucepans, 1 Casserole Pot, 4 Glass Lids, 1 Steamer",
      "Coating": "Triple-Layer Reinforced Granite Mineral",
      "Oven Safe": "Yes, up to 500°F",
      "Dishwasher Safe": "Yes"
    }
  },
  {
    id: "prod-19",
    title: "De'Longhi Dedica Deluxe Espresso & Cappuccino Machine with 15-Bar Pump & Steam Wand",
    shortTitle: "De'Longhi 15-Bar Deluxe Espresso Machine",
    category: "kitchen",
    categoryName: "Home & Kitchen",
    gender: "unisex",
    price: 299.95,
    originalPrice: 349.95,
    discountPercent: 14,
    rating: 4.7,
    ratingCount: 9650,
    badge: "Amazon's Choice",
    isPrime: true,
    delivery: "FREE One-Day Delivery by 8 PM",
    stock: 6,
    isLightningDeal: false,
    dealPercentage: 50,
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=80"
    ],
    features: [
      "Compact 6-inch slim stainless steel silhouette fits beautifully on any kitchen countertop",
      "Professional 15-bar Italian pressure pump extracts rich crema and full-bodied espresso aroma",
      "Adjustable manual frothing wand creates velvety microfoam for custom latte art",
      "Rapid Thermoblock heating system reaches optimal brewing temperature in under 35 seconds",
      "Accommodates tall latte mugs via removable dual-level drip tray"
    ],
    specs: {
      "Brand": "De'Longhi",
      "Pressure": "15 Bar Italian High-Pressure Pump",
      "Water Tank Capacity": "1 Liter (35 Fluid Ounces)",
      "Heating Time": "35 Seconds Rapid Thermoblock",
      "Body Finish": "Brushed Matte Stainless Steel"
    }
  },
  {
    id: "prod-20",
    title: "Ninja Air Fryer Pro 6-in-1 with 6.5-Quart Capacity, Max Crisp Technology & Dehydrate",
    shortTitle: "Ninja Air Fryer Pro 6-in-1 (6.5 Qt)",
    category: "kitchen",
    categoryName: "Home & Kitchen",
    gender: "unisex",
    price: 129.99,
    originalPrice: 169.99,
    discountPercent: 24,
    rating: 4.8,
    ratingCount: 48120,
    badge: "Best Seller",
    isPrime: true,
    delivery: "FREE One-Day Delivery",
    stock: 15,
    isLightningDeal: true,
    dealPercentage: 90,
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1584990347449-39726ef3bb1a?w=800&q=80",
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80"
    ],
    features: [
      "Air fry with up to 75% less fat than traditional deep-frying methods",
      "Max Crisp Technology delivers 450°F superheated air for faster, crispier fries and wings",
      "Generous 6.5-quart nonstick basket holds up to 5 lbs of chicken or french fries",
      "6 cooking programs: Air Fry, Max Crisp, Roast, Bake, Reheat, and Dehydrate",
      "Ceramic-coated basket and crisper plate are nonstick and dishwasher safe"
    ],
    specs: {
      "Brand": "Ninja",
      "Capacity": "6.5 Quarts (Family Size)",
      "Temperature Range": "105°F - 450°F",
      "Power Wattage": "1750 Watts",
      "Control Type": "Digital One-Touch Touchscreen"
    }
  },
  {
    id: "prod-21",
    title: "Hydro Flask 32 oz Wide Mouth Vacuum Insulated Stainless Steel Water Bottle with Flex Straw",
    shortTitle: "Hydro Flask 32 oz Insulated Bottle",
    category: "kitchen",
    categoryName: "Home & Kitchen",
    gender: "unisex",
    price: 39.95,
    originalPrice: 44.95,
    discountPercent: 11,
    rating: 4.8,
    ratingCount: 39400,
    badge: "Amazon's Choice",
    isPrime: true,
    delivery: "FREE Delivery Tomorrow",
    stock: 35,
    isLightningDeal: false,
    dealPercentage: 40,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80"
    ],
    features: [
      "TempShield double-wall vacuum insulation keeps drinks ice cold up to 24 hours or piping hot up to 12 hours",
      "Pro-grade 18/8 stainless steel construction ensures pure taste with no flavor transfer",
      "Flex Straw Cap is 100% leakproof when closed for worry-free backpack carrying",
      "Color Last durable powder coat is sweat-free and dishwasher safe",
      "BPA-Free, Phthalate-Free, and backed by a lifetime warranty"
    ],
    specs: {
      "Brand": "Hydro Flask",
      "Capacity": "32 Ounces (946 ml)",
      "Material": "18/8 Pro-Grade Stainless Steel",
      "Insulation Duration": "24h Cold / 12h Hot",
      "Cap Type": "Leakproof Flex Straw Cap"
    }
  },

  // ==========================================
  // 3. BEAUTY, HEALTH & GROOMING
  // ==========================================
  {
    id: "prod-22",
    title: "CeraVe Daily Skin Hydration 3-Step Facial Cleanser & Hyaluronic Acid Moisturizing Set",
    shortTitle: "CeraVe Daily Skin Hydration 3-Step Set",
    category: "beauty",
    categoryName: "Beauty & Personal Care",
    gender: "unisex",
    price: 29.99,
    originalPrice: 39.99,
    discountPercent: 25,
    rating: 4.8,
    ratingCount: 58900,
    badge: "Best Seller",
    isPrime: true,
    delivery: "FREE Delivery Tomorrow, 7 AM - 11 AM",
    stock: 40,
    isLightningDeal: true,
    dealPercentage: 92,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-00995181b672?w=800&q=80"
    ],
    features: [
      "Formulated with 3 essential ceramides (1, 3, 6-II) that restore the skin's natural protective barrier",
      "Hyaluronic acid retains moisture, leaving skin radiant, hydrated, and supple",
      "MVE Delivery Technology continually releases moisturizing ingredients for 24-hour hydration",
      "Non-comedogenic, fragrance-free, paraben-free, and non-irritating",
      "Dermatologist recommended for normal, sensitive, and dry skin types"
    ],
    specs: {
      "Brand": "CeraVe",
      "Skin Type": "Normal to Dry / Sensitive",
      "Key Ingredients": "Ceramides 1, 3, 6-II + Hyaluronic Acid",
      "Fragrance": "Fragrance-Free",
      "Item Form": "Lotion & Gentle Foaming Gel"
    }
  },
  {
    id: "prod-23",
    title: "Philips Norelco Multigroomer 9000 All-in-One Waterproof Trimmer with 23 Attachments",
    shortTitle: "Philips Norelco Multigroomer 9000 (23-in-1)",
    category: "beauty",
    categoryName: "Beauty & Personal Care",
    gender: "men",
    price: 69.99,
    originalPrice: 89.99,
    discountPercent: 22,
    rating: 4.7,
    ratingCount: 24800,
    badge: "Amazon's Choice",
    isPrime: true,
    delivery: "FREE Delivery Tomorrow",
    stock: 18,
    isLightningDeal: false,
    dealPercentage: 55,
    images: [
      "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80",
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80"
    ],
    features: [
      "DualCut technology with 2x more self-sharpening steel blades for maximum precision",
      "23 attachments for all your grooming needs: beard, head, body, and nose/ear detailing",
      "Fully waterproof design allows convenient in-shower use and easy under-tap rinsing",
      "Powerful Lithium-ion battery delivers up to 6 hours of runtime per charge",
      "Reinforced stainless steel frame with ergonomic textured rubber grip"
    ],
    specs: {
      "Brand": "Philips Norelco",
      "Power Source": "Rechargeable Lithium-Ion",
      "Runtime": "Up to 6 Hours",
      "Waterproof": "100% Showerproof (IPX7)",
      "Attachments": "23 Premium Guards & Trimming Heads"
    }
  },
  {
    id: "prod-24",
    title: "Oral-B iO Series 9 Smart Electric Toothbrush with AI Pressure Sensor & Magnetic Charger",
    shortTitle: "Oral-B iO Series 9 Smart Toothbrush",
    category: "beauty",
    categoryName: "Beauty & Personal Care",
    gender: "unisex",
    price: 229.99,
    originalPrice: 299.99,
    discountPercent: 23,
    rating: 4.7,
    ratingCount: 8740,
    badge: "Top Rated",
    isPrime: true,
    delivery: "FREE One-Day Delivery",
    stock: 10,
    isLightningDeal: false,
    dealPercentage: 40,
    images: [
      "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"
    ],
    features: [
      "Revolutionary magnetic iO drive system delivers micro-vibrations for a dentist-clean feel",
      "Interactive color display communicates 7 brushing modes, timer, and battery health",
      "Smart Pressure Sensor signals red when brushing too hard, green when just right",
      "AI Recognition with 3D Teeth Tracking guides you to 100% complete mouth coverage",
      "Magnetic fast charger locks toothbrush in place and charges fully in just 3 hours"
    ],
    specs: {
      "Brand": "Oral-B",
      "Brushing Modes": "7 Modes (Daily Clean, Whiten, Gum Care, Intense, etc.)",
      "Display": "Interactive OLED Color Screen",
      "Charging Time": "3 Hours Fast Magnetic Charge",
      "Bluetooth": "Yes, iOS & Android Companion App"
    }
  },

  // ==========================================
  // 4. SPORTS, FITNESS & OUTDOORS
  // ==========================================
  {
    id: "prod-25",
    title: "Bowflex SelectTech 552 Adjustable Dumbbells Pair (5 to 52.5 lbs) with Rapid Dial Selection",
    shortTitle: "Bowflex SelectTech 552 Adjustable Dumbbells",
    category: "sports",
    categoryName: "Sports & Fitness",
    gender: "unisex",
    price: 429.00,
    originalPrice: 549.00,
    discountPercent: 22,
    rating: 4.8,
    ratingCount: 23100,
    badge: "Best Seller",
    isPrime: true,
    delivery: "FREE Doorstep Village/City Delivery",
    stock: 7,
    isLightningDeal: true,
    dealPercentage: 80,
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
    ],
    features: [
      "Replaces 15 sets of individual weights: adjust from 5 up to 52.5 lbs per dumbbell with a quick dial turn",
      "Space-efficient compact design eliminates cluttered dumbbell racks in home gyms",
      "Durable molding around metal weight plates ensures quiet, clatter-free workouts",
      "Ergonomic knurled handle provides a secure, non-slip grip during heavy lifts",
      "Includes 1-Year JRNY Membership with on-demand strength training and form tracking"
    ],
    specs: {
      "Brand": "Bowflex",
      "Weight Range": "5 to 52.5 lbs (2.3 to 24 kg) each",
      "Weight Settings": "15 Different Increments per Dumbbell",
      "Dimensions": "16.9\" L x 8.3\" W x 9\" H",
      "Tray Included": "Yes, Dual Heavy-Duty Storage Trays"
    }
  },
  {
    id: "prod-26",
    title: "Manduka PRO Extra-Thick High-Density Eco-Friendly Yoga Mat with Non-Slip Surface",
    shortTitle: "Manduka PRO Extra-Thick Yoga Mat",
    category: "sports",
    categoryName: "Sports & Fitness",
    gender: "unisex",
    price: 68.00,
    originalPrice: 85.00,
    discountPercent: 20,
    rating: 4.9,
    ratingCount: 11450,
    badge: "Amazon's Choice",
    isPrime: true,
    delivery: "FREE Delivery Tomorrow",
    stock: 25,
    isLightningDeal: false,
    dealPercentage: 45,
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80"
    ],
    features: [
      "6mm ultra-dense cushioning protects joints, knees, and spine on hard floors",
      "Closed-cell surface locks out moisture, sweat, and bacteria for hygienic longevity",
      "Proprietary dot-pattern bottom grip prevents mat sliding across wood, tile, or carpet",
      "OEKO-TEX certified emission-free manufacturing with zero harmful toxic phthalates",
      "Engineered to last a lifetime and backed by Manduka's legendary lifetime warranty"
    ],
    specs: {
      "Brand": "Manduka",
      "Thickness": "6 mm (High-Density Cushion)",
      "Dimensions": "71\" x 26\" (180 cm x 66 cm)",
      "Material": "Eco-Certified Closed-Cell PVC",
      "Weight": "7.5 lbs"
    }
  },

  // ==========================================
  // 5. AUDIO & HEADPHONES
  // ==========================================
  {
    id: "prod-1",
    title: "Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones with Auto NC Optimizer",
    shortTitle: "Sony WH-1000XM5 Noise Canceling Headphones",
    category: "audio",
    categoryName: "Audio & Headphones",
    gender: "unisex",
    price: 348.00,
    originalPrice: 399.99,
    discountPercent: 13,
    rating: 4.8,
    ratingCount: 18420,
    badge: "Amazon's Choice",
    isPrime: true,
    delivery: "FREE delivery Tomorrow, 7 AM - 11 AM",
    stock: 7,
    isLightningDeal: true,
    dealPercentage: 82,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80"
    ],
    features: [
      "Industry-leading noise cancellation optimized automatically based on your environment",
      "Magnificent Sound, engineered to perfection with the new Integrated Processor V1",
      "Crystal clear hands-free calling with 4 beamforming microphones",
      "Up to 30-hour battery life with quick charging (3 min charge for 3 hours)",
      "Ultra-comfortable, lightweight design with soft fit leather"
    ],
    specs: {
      "Brand": "Sony",
      "Color": "Midnight Black",
      "Connectivity": "Bluetooth 5.2, 3.5mm Aux",
      "Battery Life": "30 Hours",
      "Item Weight": "250 Grams"
    }
  },
  {
    id: "prod-10",
    title: "Bose SoundLink Revolve+ Series II Portable Long-Lasting Bluetooth 360 Speaker",
    shortTitle: "Bose SoundLink Revolve+ II Bluetooth Speaker",
    category: "audio",
    categoryName: "Audio & Headphones",
    gender: "unisex",
    price: 229.00,
    originalPrice: 329.00,
    discountPercent: 30,
    rating: 4.8,
    ratingCount: 16750,
    badge: "Amazon's Choice",
    isPrime: true,
    delivery: "FREE One-Day Delivery",
    stock: 14,
    isLightningDeal: false,
    dealPercentage: 60,
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80"
    ],
    features: [
      "True 360-degree acoustic coverage delivers consistent, uniform sound throughout the room",
      "IP55 water and dust resistant design withstands poolside splashes and outdoor rain",
      "Rechargeable lithium-ion battery plays up to 17 hours per charge",
      "Flexible fabric handle makes grabbing and taking your music everywhere effortless",
      "Built-in microphone for speakerphone calls and voice assistants"
    ],
    specs: {
      "Brand": "Bose",
      "Speaker Type": "360 Portable Bluetooth",
      "Battery Life": "Up to 17 Hours",
      "Water Resistance": "IP55 Rating",
      "Weight": "1.98 lbs"
    }
  },

  // ==========================================
  // 6. ELECTRONICS & COMPUTERS
  // ==========================================
  {
    id: "prod-2",
    title: "Apple MacBook Pro 16-inch M3 Max Chip - 36GB Unified Memory, 1TB SSD Storage - Space Black",
    shortTitle: "Apple MacBook Pro 16\" M3 Max",
    category: "electronics",
    categoryName: "Laptops & Computers",
    gender: "unisex",
    price: 3199.00,
    originalPrice: 3499.00,
    discountPercent: 9,
    rating: 4.9,
    ratingCount: 4210,
    badge: "Best Seller",
    isPrime: true,
    delivery: "FREE One-Day delivery by 10 PM",
    stock: 4,
    isLightningDeal: false,
    dealPercentage: 45,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80"
    ],
    features: [
      "Supercharged by M3 Max: 16-core CPU and up to 40-core GPU for monstrous performance",
      "Up to 22 hours of battery life thanks to Apple silicon power efficiency",
      "Liquid Retina XDR display with 1000 nits sustained brightness and ProMotion 120Hz",
      "Six-speaker sound system with force-cancelling woofers and Spatial Audio support",
      "Advanced 1080p FaceTime HD camera and studio-quality three-mic array"
    ],
    specs: {
      "Brand": "Apple",
      "Processor": "Apple M3 Max (16-core)",
      "RAM": "36 GB Unified Memory",
      "Storage": "1 TB Superfast SSD",
      "Display": "16.2-inch Liquid Retina XDR"
    }
  },
  {
    id: "prod-6",
    title: "Canon EOS R6 Mark II Mirrorless Camera with RF 24-105mm F4 L IS USM Lens Kit",
    shortTitle: "Canon EOS R6 Mark II Mirrorless Kit",
    category: "electronics",
    categoryName: "Cameras & Optics",
    gender: "unisex",
    price: 2499.00,
    originalPrice: 2799.00,
    discountPercent: 11,
    rating: 4.9,
    ratingCount: 880,
    badge: "Top Rated",
    isPrime: true,
    delivery: "FREE One-Day Delivery",
    stock: 5,
    isLightningDeal: false,
    dealPercentage: 20,
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80"
    ],
    features: [
      "High image quality 24.2 megapixel full-frame CMOS sensor",
      "Up to 40 fps continuous shooting with electronic shutter and Dual Pixel CMOS AF II",
      "Uncropped 6K oversampled 4K 60p movie recording with Canon Log 3",
      "In-body Image Stabilizer with up to 8 stops of shake correction",
      "Dual UHS-II SD card slots and weather-sealed magnesium-alloy body"
    ],
    specs: {
      "Brand": "Canon",
      "Sensor": "24.2 MP Full-Frame CMOS",
      "Video Capture": "4K 60p 10-Bit 4:2:2",
      "Lens Mount": "Canon RF",
      "Image Stabilization": "5-Axis Sensor-Shift IBIS"
    }
  },

  // ==========================================
  // 7. SMART HOME & AUTOMATION
  // ==========================================
  {
    id: "prod-3",
    title: "Echo Studio - High-fidelity smart speaker with 3D audio, Dolby Atmos and Alexa - Charcoal",
    shortTitle: "Echo Studio High-Fidelity Smart Speaker",
    category: "smarthome",
    categoryName: "Smart Home",
    gender: "unisex",
    price: 199.99,
    originalPrice: 249.99,
    discountPercent: 20,
    rating: 4.7,
    ratingCount: 32670,
    badge: "Amazon's Choice",
    isPrime: true,
    delivery: "FREE delivery Tomorrow by 8 PM",
    stock: 15,
    isLightningDeal: true,
    dealPercentage: 68,
    images: [
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80",
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
    ],
    features: [
      "Immersive sound with 5 directional speakers that produce powerful bass and crisp highs",
      "Dolby Atmos spatial audio processing technology adds space, clarity, and depth",
      "Automatically senses the acoustics of your room and fine-tunes playback continuously",
      "Built-in Zigbee smart home hub to control compatible Zigbee & Matter devices",
      "Stream songs from Amazon Music, Apple Music, Spotify, Pandora, and more"
    ],
    specs: {
      "Brand": "Amazon",
      "Voice Assistant": "Alexa Built-in",
      "Audio Technology": "Dolby Atmos, 3D Spatial Audio",
      "Smart Hub": "Zigbee + Matter compatible",
      "Dimensions": "8.1\" x 6.9\" (206 x 175 mm)"
    }
  },
  {
    id: "prod-7",
    title: "Roborock S8 Pro Ultra Robot Vacuum and Mop Combo with RockDock Ultra Self-Washing Base",
    shortTitle: "Roborock S8 Pro Ultra Robot Vacuum & Mop",
    category: "smarthome",
    categoryName: "Smart Home",
    gender: "unisex",
    price: 999.99,
    originalPrice: 1599.99,
    discountPercent: 37,
    rating: 4.6,
    ratingCount: 6120,
    badge: "Limited Deal",
    isPrime: true,
    delivery: "FREE delivery Tomorrow, 2 PM - 6 PM",
    stock: 6,
    isLightningDeal: true,
    dealPercentage: 77,
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&q=80",
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80"
    ],
    features: [
      "RockDock Ultra: All-in-one docking station handles auto-emptying, auto-washing, and warm air drying",
      "DuoRoller Riser Brush: Dual rubber brushes enhance suction and reduce hair tangling",
      "VibraRise 2.0 Mopping System: High-speed scrubbing at 3000 times/min with 6N downward pressure",
      "Reactive 3D Obstacle Avoidance navigates seamlessly around shoes, cables, and pet toys",
      "Extreme 6000Pa Suction power handles stubborn carpet debris effortlessly"
    ],
    specs: {
      "Brand": "Roborock",
      "Suction Power": "6000 Pa",
      "Battery Life": "180 minutes",
      "Filter Type": "Washable E11 Air Filter",
      "Control": "Alexa, Google Home, Siri, Roborock App"
    }
  },

  // ==========================================
  // 8. GAMING & VR CONSOLES
  // ==========================================
  {
    id: "prod-4",
    title: "PlayStation 5 Digital Edition Slim Console with DualSense Wireless Controller 1TB SSD",
    shortTitle: "PlayStation 5 Digital Edition Console (1TB)",
    category: "gaming",
    categoryName: "Gaming & VR",
    gender: "unisex",
    price: 449.00,
    originalPrice: 499.00,
    discountPercent: 10,
    rating: 4.9,
    ratingCount: 54180,
    badge: "Best Seller",
    isPrime: true,
    delivery: "FREE delivery Tomorrow, 11 AM - 3 PM",
    stock: 3,
    isLightningDeal: true,
    dealPercentage: 91,
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&q=80"
    ],
    features: [
      "Slim Design: Experience high-powered gaming packed into a sleek compact frame",
      "1TB of Integrated SSD Storage keeps your favorite games ready",
      "Ultra-High Speed SSD maximizes play sessions with near-instant load times",
      "Haptic Feedback and Adaptive Triggers via DualSense controller",
      "Tempest 3D AudioTech immerses you in rich, dimensional soundscapes"
    ],
    specs: {
      "Brand": "Sony Interactive Entertainment",
      "Edition": "Digital Edition Slim",
      "Storage": "1TB Custom High-Speed SSD",
      "Resolution": "Up to 4K 120Hz & 8K HDR Support",
      "Audio": "Tempest 3D AudioTech"
    }
  },
  {
    id: "prod-9",
    title: "Samsung 49-inch Odyssey OLED G9 Curved Smart Gaming Monitor 240Hz 0.03ms Dual QHD",
    shortTitle: "Samsung 49\" Odyssey OLED G9 Gaming Monitor",
    category: "gaming",
    categoryName: "Gaming & VR",
    gender: "unisex",
    price: 1199.99,
    originalPrice: 1799.99,
    discountPercent: 33,
    rating: 4.7,
    ratingCount: 3820,
    badge: "Limited Deal",
    isPrime: true,
    delivery: "FREE Scheduled Delivery Tomorrow",
    stock: 5,
    isLightningDeal: true,
    dealPercentage: 86,
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80"
    ],
    features: [
      "49-inch Dual QHD OLED display with 1800R curve provides panoramic field of view equivalent to two 27-inch monitors",
      "Blistering 240Hz refresh rate and near-instant 0.03ms response time for fluid competitive play",
      "Neo Quantum Processor Pro optimizes every frame on the OLED panel for maximum contrast",
      "DisplayHDR True Black 400 offers pure blacks and infinite depth with no pixel light bleed",
      "Built-in Smart TV apps, IoT Gaming Hub, and CoreSync ambient lighting"
    ],
    specs: {
      "Brand": "Samsung",
      "Screen Size": "49 Inches",
      "Resolution": "Dual QHD (5120 x 1440)",
      "Refresh Rate": "240 Hz",
      "Response Time": "0.03ms (GtG)"
    }
  },

  // ==========================================
  // 9. LUXURY TIMEPIECES & ACCESSORIES
  // ==========================================
  {
    id: "prod-5",
    title: "Seiko Prospex Automatic Diver's 200M Sapphire Crystal Men's Watch - Obsidian Dial",
    shortTitle: "Seiko Prospex Diver's 200M Automatic Watch",
    category: "fashion",
    categoryName: "Luxury Watches",
    gender: "men",
    price: 525.00,
    originalPrice: 650.00,
    discountPercent: 19,
    rating: 4.8,
    ratingCount: 1940,
    badge: "Amazon's Choice",
    isPrime: true,
    delivery: "FREE Two-Day Delivery",
    stock: 9,
    isLightningDeal: false,
    dealPercentage: 35,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80"
    ],
    features: [
      "Caliber 4R35 automatic movement with 41 hours of power reserve",
      "Water resistant to 200 meters (660 feet), compliant with ISO standards for scuba diving",
      "Scratch-resistant anti-reflective sapphire crystal glass lens",
      "Unidirectional rotating elapsed timing bezel with ceramic finish",
      "LumiBrite hands and markers for radiant glow-in-the-dark legibility"
    ],
    specs: {
      "Brand": "Seiko",
      "Movement": "Japanese Automatic 4R35",
      "Case Diameter": "43.8 mm",
      "Water Resistance": "200m / 660ft",
      "Band Material": "Stainless Steel Bracelet"
    }
  },
  {
    id: "prod-11",
    title: "Bellroy Classic Premium Eco-Tanned Leather Weekender Duffel Bag 45L Water-Resistant Canvas",
    shortTitle: "Bellroy Classic Premium Leather Weekender Duffel",
    category: "fashion",
    categoryName: "Luxury Watches & Leather",
    gender: "unisex",
    price: 219.00,
    originalPrice: 269.00,
    discountPercent: 19,
    rating: 4.7,
    ratingCount: 2130,
    badge: "Amazon's Choice",
    isPrime: true,
    delivery: "FREE delivery in 2 business days",
    stock: 8,
    isLightningDeal: false,
    dealPercentage: 40,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"
    ],
    features: [
      "Spacious 45L capacity with smart internal organization pockets for shoes and garments",
      "Durable water-resistant recycled fabric with premium eco-tanned leather accents",
      "Detachable padded shoulder strap with dual grab handles for versatile travel",
      "External quick-access passport pocket with magnetic closure",
      "Backed by a 3-year warranty against defects in materials and workmanship"
    ],
    specs: {
      "Brand": "Bellroy",
      "Capacity": "45 Liters",
      "Material": "Water-Resistant Weave + Eco Leather",
      "Closure": "YKK Aquaguard Zippers",
      "Dimensions": "380 x 550 x 240 mm"
    }
  },
  {
    id: "prod-27",
    title: "Garmin Forerunner 265 Running Smartwatch with Colorful AMOLED Touchscreen Display & Training Readiness",
    shortTitle: "Garmin Forerunner 265 AMOLED Running Watch",
    category: "sports",
    categoryName: "Sports & Fitness",
    gender: "unisex",
    price: 449.99,
    originalPrice: 499.99,
    discountPercent: 10,
    rating: 4.8,
    ratingCount: 3890,
    badge: "Amazon's Choice",
    isPrime: true,
    delivery: "FREE Delivery Tomorrow, 7 AM - 11 AM",
    stock: 14,
    isLightningDeal: true,
    dealPercentage: 68,
    images: [
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"
    ],
    features: [
      "Brilliant 1.3-inch AMOLED touchscreen display with lightweight 46mm bezel design",
      "Up to 13 days of battery life in smartwatch mode and up to 20 hours in GPS mode",
      "Training readiness score based on sleep quality, recovery, and HRV status",
      "Built-in multi-band GNSS with SatIQ technology for superior positional accuracy",
      "Contactless Garmin Pay and downloaded music storage from Spotify and Amazon Music"
    ],
    specs: {
      "Brand": "Garmin",
      "Screen Size": "1.3-inch AMOLED (416 x 416 px)",
      "Battery Life": "Up to 13 Days Smartwatch / 20 Hours GPS",
      "Water Rating": "5 ATM (50 meters)",
      "Sensors": "Multi-Band GPS, Wrist HR, Pulse Ox, Compass, Gyro"
    }
  },
  {
    id: "prod-28",
    title: "Dyson Airwrap Multi-Styler Complete Long for Multiple Hair Types (Prussian Blue & Rich Copper)",
    shortTitle: "Dyson Airwrap Multi-Styler Complete",
    category: "beauty",
    categoryName: "Beauty & Personal Care",
    gender: "women",
    price: 599.99,
    originalPrice: 649.99,
    discountPercent: 8,
    rating: 4.7,
    ratingCount: 9240,
    badge: "Best Seller",
    isPrime: true,
    delivery: "FREE Delivery Tomorrow, 7 AM - 11 AM",
    stock: 9,
    isLightningDeal: false,
    dealPercentage: 0,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80"
    ],
    features: [
      "Coanda airflow technology styles hair without extreme heat damage",
      "Re-engineered barrels create clockwise and anti-clockwise curls with a single barrel",
      "Smoothing dryer dries, smooths and hides flyaways with multi-functional attachment",
      "Intelligent heat control measures air temperature over 40 times a second",
      "Includes Prussian blue presentation case cushioned with soft fabric"
    ],
    specs: {
      "Brand": "Dyson",
      "Power": "1,300 Watts",
      "Airflow": "13.5 liters/sec",
      "Heat Settings": "3 precise heat settings + Cold shot",
      "Included": "6 Styling Attachments + Leather Storage Case"
    }
  },
  {
    id: "prod-29",
    title: "Apple iPad Air 11-inch (M2 Chip, Liquid Retina Display, 128GB, Wi-Fi 6E, 12MP Cameras)",
    shortTitle: "Apple iPad Air 11-inch M2 Chip",
    category: "electronics",
    categoryName: "Electronics & Tech",
    gender: "unisex",
    price: 599.00,
    originalPrice: 649.00,
    discountPercent: 8,
    rating: 4.9,
    ratingCount: 14200,
    badge: "Amazon's Choice",
    isPrime: true,
    delivery: "FREE Delivery Tomorrow, 7 AM - 11 AM",
    stock: 31,
    isLightningDeal: true,
    dealPercentage: 54,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80"
    ],
    features: [
      "Breakthrough Apple M2 chip delivers blazing-fast CPU and graphics performance",
      "Stunning 11-inch Liquid Retina display with P3 wide color, True Tone, and anti-reflective coating",
      "Landscape 12MP Ultra Wide front camera with Center Stage for natural video calls",
      "Supports Apple Pencil Pro, Apple Pencil (USB-C), and Magic Keyboard",
      "All-day battery life with fast Wi-Fi 6E connectivity and Touch ID security"
    ],
    specs: {
      "Brand": "Apple",
      "Processor": "Apple M2 Chip with 8-Core CPU / 9-Core GPU",
      "Display": "11-inch Liquid Retina IPS Display (2360 x 1640)",
      "Storage": "128GB",
      "Battery Life": "Up to 10 Hours Surfing on Wi-Fi"
    }
  },
  {
  "id": "prod-30",
  "title": "Women's Luxury Quilted Italian Leather Crossbody Handbag with Gold Chain Strap",
  "shortTitle": "Women's Quilted Leather Handbag",
  "category": "fashion",
  "categoryName": "Luxury Watches & Bags",
  "gender": "women",
  "price": 189,
  "originalPrice": 249,
  "discountPercent": 24,
  "rating": 4.8,
  "ratingCount": 5230,
  "badge": "Amazon's Choice",
  "isPrime": true,
  "delivery": "FREE Delivery Tomorrow by 1 PM",
  "stock": 14,
  "isLightningDeal": true,
  "dealPercentage": 68,
  "images": [
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80"
  ],
  "features": [
    "100% Genuine Italian full-grain pebble leather with diamond quilt stitching",
    "Gleaming 24K gold-tone electroplated turn-lock clasp and woven chain shoulder strap",
    "Dual interior accordion compartments with zippered RFID-blocking privacy pocket",
    "Reinforced structured base with protective brass feet",
    "Versatile 2-way wear: sling as an everyday crossbody or shorten into a chic evening shoulder bag"
  ],
  "specs": {
    "Brand": "Milano Luxe",
    "Material": "100% Full-Grain Italian Leather",
    "Dimensions": "10.5\" W x 6.5\" H x 3.2\" D",
    "Hardware": "Tarnish-Resistant 24K Gold PVD Coating",
    "Closure": "Turn-Lock Twist Clasp"
  }
},
  {
  "id": "prod-31",
  "title": "Men's Classic Polarized Aviator Sunglasses with Aerospace Titanium Frame & UV400 Protection",
  "shortTitle": "Men's Titanium Aviator Sunglasses",
  "category": "fashion",
  "categoryName": "Luxury Watches & Bags",
  "gender": "men",
  "price": 89.99,
  "originalPrice": 129.99,
  "discountPercent": 31,
  "rating": 4.7,
  "ratingCount": 9410,
  "badge": "Best Seller",
  "isPrime": true,
  "delivery": "FREE Delivery Tomorrow, 7 AM - 11 AM",
  "stock": 28,
  "isLightningDeal": false,
  "dealPercentage": 35,
  "images": [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80"
  ],
  "features": [
    "Ultra-lightweight aerospace-grade Japanese titanium frame (only 18 grams)",
    "HD Polarized TAC lenses eliminate 99.9% of reflective glare from roads, snow, and water",
    "100% UV400 filtering blocks harmful UVA, UVB, and blue light rays",
    "Self-adjusting medical-grade silicone nose pads prevent pressure marks and slipping",
    "Includes hardshell leather carrying case, microfiber polishing cloth, and polarization test card"
  ],
  "specs": {
    "Brand": "AeroOptics",
    "Frame Material": "Aerospace Grade Titanium",
    "Lens Material": "Triacetate Cellulose (TAC) Polarized",
    "Lens Width": "58 mm",
    "UV Rating": "UV400 Category 3 Protection"
  }
},
  {
  "id": "prod-32",
  "title": "Women's High-Waisted Butter-Soft Yoga Leggings with Tummy Control & Deep Phone Pockets",
  "shortTitle": "Women's High-Waist Yoga Leggings",
  "category": "clothing",
  "categoryName": "Clothing & Fashion",
  "gender": "women",
  "price": 32.99,
  "originalPrice": 48,
  "discountPercent": 31,
  "rating": 4.8,
  "ratingCount": 18450,
  "badge": "Best Seller",
  "isPrime": true,
  "delivery": "FREE Delivery Tomorrow by 5 PM",
  "stock": 45,
  "isLightningDeal": true,
  "dealPercentage": 81,
  "images": [
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80"
  ],
  "features": [
    "Signature CloudSoft™ brushed microfiber fabric feels weightless like a second skin",
    "High-rise compression waistband stays securely in place without rolling down during squats",
    "Two deep ergonomic side pockets comfortably hold iPhone 15 Pro Max / Galaxy S24 Ultra",
    "Four-way stretch and 100% squat-proof opaque fabric verified under gym studio lighting",
    "Gusseted crotch and flatlock ergonomic seams reduce chafing during intense HIIT workouts"
  ],
  "specs": {
    "Brand": "ZenFlex Active",
    "Material": "75% Nylon, 25% Spandex CloudSoft™",
    "Inseam": "25-inch 7/8 Length",
    "Waist": "High-Rise Seamless Compression",
    "Care": "Machine Wash Cold, Hang Dry"
  }
},
  {
  "id": "prod-33",
  "title": "Amazon Karigar Handcrafted Pure Banarasi Katan Silk Saree with Real Zari Weaving from Varanasi",
  "shortTitle": "Artisan Banarasi Katan Silk Saree",
  "category": "clothing",
  "categoryName": "Clothing & Fashion",
  "gender": "women",
  "isRuralKarigar": true,
  "sellerType": "artisan",
  "price": 119,
  "originalPrice": 179,
  "discountPercent": 34,
  "rating": 4.9,
  "ratingCount": 3820,
  "badge": "Amazon Karigar",
  "isPrime": true,
  "delivery": "FREE Doorstep Village Delivery in 2 Days",
  "stock": 12,
  "isLightningDeal": false,
  "dealPercentage": 40,
  "images": [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"
  ],
  "features": [
    "Direct from Master Weavers of Varanasi, Uttar Pradesh under Amazon Karigar Rural Program",
    "100% Certified Pure Katan Silk with intricate floral Kadwa Jaal zari border",
    "Includes Silk Mark authentic certified certificate verifying pure natural mulberry silk",
    "Includes matching unstitched blouse piece (0.8m) with matching zari sleeve border",
    "Empowers rural handloom artisan families with direct fair-trade earnings and zero middleman cut"
  ],
  "specs": {
    "Craft / Origin": "Banarasi Handloom Weave (Varanasi, UP, India)",
    "Material": "100% Certified Pure Katan Silk",
    "Length": "5.5 Meters + 0.8 Meter Blouse Piece",
    "Certification": "Govt of India Silk Mark Authorized",
    "Care": "Dry Clean Recommended"
  }
},
  {
  "id": "prod-34",
  "title": "Amazon Karigar Handcrafted Pure Leather Kolhapuri Chappals & Men's Khadi Kurta Set",
  "shortTitle": "Artisan Kolhapuri Chappals & Kurta Set",
  "category": "clothing",
  "categoryName": "Clothing & Fashion",
  "gender": "men",
  "isRuralKarigar": true,
  "sellerType": "artisan",
  "price": 54.99,
  "originalPrice": 79.99,
  "discountPercent": 31,
  "rating": 4.8,
  "ratingCount": 2940,
  "badge": "Amazon Karigar",
  "isPrime": true,
  "delivery": "FREE Doorstep Village Delivery in 2 Days",
  "stock": 20,
  "isLightningDeal": true,
  "dealPercentage": 55,
  "images": [
    "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800&q=80",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80",
    "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&q=80"
  ],
  "features": [
    "Handcrafted by hereditary rural artisans of Kolhapur, Maharashtra with vegetable-tanned leather",
    "Braided leather straps with traditional hand-punched detailing and cushioned leather footbed",
    "Paired with 100% handspun organic breathable Khadi cotton full-sleeve mandarin collar kurta",
    "Natural dyes with zero chemical synthetics; develops a richer patina with age",
    "Direct village-to-doorstep dispatch supporting rural Indian cottage craft heritage"
  ],
  "specs": {
    "Craft / Origin": "Kolhapur Leather Heritage (Maharashtra, India)",
    "Material": "Vegetable-Tanned Pure Buffalo Leather & Handspun Khadi",
    "Sole": "Hand-Stitched Genuine Leather Sole",
    "Fit": "True to Traditional Fit",
    "Artisan Support": "100% Proceeds Support Rural Artisan Guilds"
  }
}
];

// Complete department categories covering all major retail sectors
const DEPARTMENTS = [
  { id: "all", name: "All Departments", icon: "grid", description: "Browse complete catalog" },
  { id: "clothing", name: "Clothing, Shoes & Apparel", icon: "shirt", description: "Men, women & everyday fashion" },
  { id: "kitchen", name: "Home, Kitchen & Dining", icon: "utensils", description: "Cookware, appliances & dining" },
  { id: "beauty", name: "Beauty & Personal Grooming", icon: "sparkles", description: "Skincare, haircare & grooming" },
  { id: "sports", name: "Sports, Fitness & Outdoors", icon: "dumbbell", description: "Gym gear, yoga & outdoor fitness" },
  { id: "electronics", name: "Electronics & Computers", icon: "laptop", description: "Laptops, cameras & PC gear" },
  { id: "audio", name: "Audio & Headphones", icon: "headphones", description: "Speakers, earbuds & studio sound" },
  { id: "smarthome", name: "Smart Home & Automation", icon: "home", description: "Alexa, lighting & robotic cleaning" },
  { id: "gaming", name: "Gaming & VR Consoles", icon: "gamepad", description: "PS5, monitors & controllers" },
  { id: "fashion", name: "Luxury Watches & Bags", icon: "watch", description: "Automatic timepieces & leather bags" }
];

// Currency conversion definitions
const CURRENCIES = {
  USD: { symbol: "$", rate: 1.0, code: "USD", name: "USD - US Dollar" },
  EUR: { symbol: "€", rate: 0.92, code: "EUR", name: "EUR - Euro" },
  GBP: { symbol: "£", rate: 0.79, code: "GBP", name: "GBP - British Pound" },
  INR: { symbol: "₹", rate: 83.5, code: "INR", name: "INR - Indian Rupee" },
  JPY: { symbol: "¥", rate: 152.0, code: "JPY", name: "JPY - Japanese Yen" },
  CAD: { symbol: "CA$", rate: 1.36, code: "CAD", name: "CAD - Canadian Dollar" }
};
