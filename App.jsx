import { useState, useEffect, useRef } from "react";
import FilesModule from "./FilesModule.jsx";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, ScatterChart, Scatter, FunnelChart, Funnel, LabelList, PieChart, Pie, Cell, Legend } from "recharts";

// ─── BRAND DATA ─────────────────────────────────────────────────────────────
const BRANDS = [
  { id: 1, name: "Dove", category: "Personal Care", status: "Strong", founded: 1957, revenue: 5.8, usg: 6.2, clv: 420, margin: 38, nps: 72, marketShare: 18.4, categoryGrowth: 4.2, elasticity: -1.1, awareness: 96, consideration: 78, preference: 61, purchase: 54, loyalty: 68, insight: "Authentic beauty narrative drives category leadership", risk: "Z-gen authenticity gap widening", action: "TikTok creator ecosystem + body positivity 2.0", vision1y: "Launch Dove Men+Care into SE Asia", vision5y: "Become #1 self-care brand globally", radarScores: [88,82,91,86,79,71,85,76,88,82,68,95], psychScores: [72,68,85,79,64,88], markets: [["USA",28,"🟢"],["UK",18,"🟢"],["Brazil",14,"🟡"],["Germany",12,"🟢"],["India",9,"🟡"]], strategicRec: "Dermatolog iş birlikleriyle klinik güvenilirliği artır; TikTok'ta #DoveDerm serisini 50 mikro-influencer ile 8 hafta boyunca yayına al. CeraVe'nin bilim temelli algısına karşı 'klinik + otantiklik' çift eksenini sahiplen.", bcg: "Star", funnelDeep: { byAge: { genZ: {awareness:88,consideration:64,preference:48,purchase:40,loyalty:36}, millennial: {awareness:96,consideration:80,preference:66,purchase:58,loyalty:72}, genX: {awareness:94,consideration:76,preference:60,purchase:52,loyalty:68}, boomer: {awareness:92,consideration:68,preference:50,purchase:44,loyalty:62} }, byGender: { female: {purchase:64}, male: {purchase:38} }, byIncome: { high: {purchase:72}, mid: {purchase:56}, low: {purchase:36} }, competitor: {awareness:84,consideration:72,preference:58,purchase:50,loyalty:62} } },
  { id: 2, name: "Omo/Persil", category: "Home Care", status: "Strong", founded: 1969, revenue: 4.2, usg: 3.8, clv: 280, margin: 29, nps: 64, marketShare: 22.1, categoryGrowth: 2.8, elasticity: -1.4, awareness: 91, consideration: 72, preference: 58, purchase: 52, loyalty: 71, insight: "Cleaning efficacy is table stakes; purpose drives premium", risk: "Private label erosion in developed markets", action: "Dirt is Good 2.0 + concentrated formula", vision1y: "Rollout eco-refill stations EU-wide", vision5y: "Carbon-neutral laundry leader by 2028", radarScores: [76,71,88,82,81,68,79,72,76,85,55,80], psychScores: [58,72,61,68,79,55], markets: [["Brazil",24,"🟢"],["UK",16,"🟢"],["Germany",14,"🟡"],["India",18,"🟢"],["Australia",8,"🟢"]], strategicRec: "Kapsül formatında Ariel'e karşı karbon-nötr sertifikasını fiyat priminin gerekçesi yap. 'Dirt is Good 2.0' platform harcamasını %20 artırarak sürdürülebilirlik liderliğini savun.", bcg: "Cash Cow", funnelDeep: { byAge: { genZ: {awareness:74,consideration:54,preference:42,purchase:38,loyalty:44}, millennial: {awareness:90,consideration:74,preference:60,purchase:54,loyalty:72}, genX: {awareness:94,consideration:76,preference:62,purchase:56,loyalty:74}, boomer: {awareness:88,consideration:70,preference:56,purchase:50,loyalty:70} }, byGender: { female: {purchase:60}, male: {purchase:44} }, byIncome: { high: {purchase:62}, mid: {purchase:54}, low: {purchase:44} }, competitor: {awareness:86,consideration:68,preference:54,purchase:48,loyalty:65} } },
  { id: 3, name: "Lux", category: "Beauty & Wellbeing", status: "Watch", founded: 1925, revenue: 2.1, usg: 1.2, clv: 190, margin: 31, nps: 48, marketShare: 9.8, categoryGrowth: 5.1, elasticity: -1.6, awareness: 88, consideration: 58, preference: 39, purchase: 34, loyalty: 42, insight: "Legacy glamour equity underexploited", risk: "Brand aging among 18-34 segment", action: "Luxury repositioning via celeb co-creation", vision1y: "Relaunch Lux with modern glam identity", vision5y: "Premium body care tier expansion", radarScores: [52,61,72,48,55,74,58,81,54,62,42,68], psychScores: [82,48,72,58,45,77], markets: [["India",32,"🟡"],["Pakistan",18,"🟢"],["Indonesia",14,"🟡"],["Vietnam",10,"🟢"],["South Africa",8,"🟡"]], strategicRec: "Celeb co-creation modelini Güney Asya'dan başlat; 'Modern Glamour' kimliğini 18-34 segmentine taşıyacak bir dijital-first lansman serisi hazırla. Heritage'i silme, yeniden çerçevele.", bcg: "Question Mark", funnelDeep: { byAge: { genZ: {awareness:76,consideration:44,preference:28,purchase:22,loyalty:28}, millennial: {awareness:86,consideration:60,preference:42,purchase:36,loyalty:44}, genX: {awareness:88,consideration:58,preference:38,purchase:32,loyalty:40}, boomer: {awareness:90,consideration:62,preference:44,purchase:38,loyalty:46} }, byGender: { female: {purchase:46}, male: {purchase:22} }, byIncome: { high: {purchase:48}, mid: {purchase:34}, low: {purchase:24} }, competitor: {awareness:82,consideration:66,preference:52,purchase:44,loyalty:54} } },
  { id: 4, name: "Sunsilk", category: "Personal Care", status: "Strong", founded: 1954, revenue: 1.8, usg: 4.5, clv: 165, margin: 27, nps: 56, marketShare: 12.3, categoryGrowth: 6.2, elasticity: -1.3, awareness: 82, consideration: 64, preference: 48, purchase: 42, loyalty: 55, insight: "Hair care growth engine in SE Asia", risk: "Premium gap vs P&G H&S", action: "Influencer haircare routines + Vitamin-series", vision1y: "Launch Sunsilk Botanicals range", vision5y: "#1 accessible hair care in Asia-Pacific", radarScores: [65,68,74,71,58,72,62,65,71,68,58,72], psychScores: [62,71,58,72,65,68], markets: [["Indonesia",28,"🟢"],["India",24,"🟢"],["Brazil",14,"🟡"],["Thailand",10,"🟢"],["Philippines",8,"🟢"]], strategicRec: "Pantene ve Dove arasındaki sıkışmışlıktan çıkmak için 'Vitamin & Botanicals SE Asia' platformunu net kimlik olarak sabitle. Kategori büyümesinin %60'ı Asya'dan geliyor — yerel influencer ekosistemine yatır.", bcg: "Star", funnelDeep: { byAge: { genZ: {awareness:78,consideration:62,preference:46,purchase:40,loyalty:48}, millennial: {awareness:82,consideration:66,preference:50,purchase:44,loyalty:56}, genX: {awareness:74,consideration:56,preference:42,purchase:36,loyalty:50}, boomer: {awareness:62,consideration:44,preference:32,purchase:28,loyalty:42} }, byGender: { female: {purchase:56}, male: {purchase:28} }, byIncome: { high: {purchase:54}, mid: {purchase:44}, low: {purchase:36} }, competitor: {awareness:88,consideration:72,preference:56,purchase:48,loyalty:60} } },
  { id: 5, name: "Knorr", category: "Foods", status: "Strong", founded: 1838, revenue: 4.8, usg: 5.1, clv: 310, margin: 24, nps: 62, marketShare: 16.8, categoryGrowth: 3.4, elasticity: -0.9, awareness: 94, consideration: 81, preference: 68, purchase: 62, loyalty: 74, insight: "Convenient cooking resonates in time-poor households", risk: "Clean-label trend vs processed perception", action: "Real ingredients narrative + plant-based pivot", vision1y: "Launch Knorr Plant-Based stocks range", vision5y: "World's most sustainable food brand", radarScores: [79,74,86,78,82,69,88,68,82,79,62,85], psychScores: [68,79,72,65,81,74], markets: [["Germany",22,"🟢"],["UK",16,"🟢"],["USA",14,"🟢"],["Brazil",12,"🟢"],["Turkey",8,"🟢"]], strategicRec: "Hava fritözü içeriği ve bitki bazlı stok küpleriyle 'Lazy Cooking' algısını kır; 'Real Ingredients' kampanyasını aşçılık kanallarında yayına al. Clean-label endişesini şeffaflık raporuyla önden yönet.", bcg: "Cash Cow", funnelDeep: { byAge: { genZ: {awareness:82,consideration:64,preference:50,purchase:44,loyalty:52}, millennial: {awareness:92,consideration:80,preference:68,purchase:62,loyalty:74}, genX: {awareness:96,consideration:84,preference:72,purchase:66,loyalty:78}, boomer: {awareness:94,consideration:82,preference:70,purchase:64,loyalty:76} }, byGender: { female: {purchase:66}, male: {purchase:58} }, byIncome: { high: {purchase:72}, mid: {purchase:62}, low: {purchase:52} }, competitor: {awareness:88,consideration:74,preference:62,purchase:56,loyalty:68} } },
  { id: 6, name: "Hellmann's", category: "Foods", status: "Strong", founded: 1913, revenue: 3.2, usg: 8.4, clv: 260, margin: 28, nps: 68, marketShare: 24.1, categoryGrowth: 4.8, elasticity: -0.8, awareness: 89, consideration: 76, preference: 64, purchase: 58, loyalty: 72, insight: "Nostalgia premium in condiments category", risk: "Health-conscious shift from mayo", action: "Hellmann's Light + plant mayo expansion", vision1y: "Lead mayo-adjacent category (sauces/dips)", vision5y: "Condiment ecosystem leader", radarScores: [82,78,91,74,88,66,79,72,85,88,59,82], psychScores: [72,82,68,75,85,71], markets: [["USA",38,"🟢"],["UK",18,"🟢"],["Brazil",14,"🟢"],["Germany",10,"🟢"],["France",8,"🟢"]], strategicRec: "Duke's baskısına karşı 'Real Mayo Taste Test' kampanyasını ABD'de başlat; aromalı (chipotle, truffle) ve bitki bazlı varyantlarla kategori genişlemesini hızlandır.", bcg: "Star", funnelDeep: { byAge: { genZ: {awareness:74,consideration:58,preference:44,purchase:36,loyalty:48}, millennial: {awareness:88,consideration:76,preference:64,purchase:58,loyalty:72}, genX: {awareness:90,consideration:78,preference:66,purchase:60,loyalty:74}, boomer: {awareness:86,consideration:74,preference:62,purchase:56,loyalty:70} }, byGender: { female: {purchase:62}, male: {purchase:54} }, byIncome: { high: {purchase:74}, mid: {purchase:58}, low: {purchase:40} }, competitor: {awareness:80,consideration:68,preference:56,purchase:48,loyalty:62} } },
  { id: 7, name: "Lipton", category: "Foods", status: "Watch", founded: 1890, revenue: 2.8, usg: -0.8, clv: 220, margin: 22, nps: 52, marketShare: 11.2, categoryGrowth: 1.8, elasticity: -1.2, awareness: 96, consideration: 68, preference: 44, purchase: 39, loyalty: 48, insight: "Category leader facing health drink substitution", risk: "Cold brew / kombucha cannibalizing tea occasions", action: "Functional tea positioning + RTD innovation", vision1y: "Lipton Iced Tea fitness line launch", vision5y: "Beverage wellness platform transformation", radarScores: [58,62,82,68,74,58,72,62,71,65,52,74], psychScores: [58,65,72,61,68,74], markets: [["USA",28,"🟡"],["UK",18,"🟡"],["France",14,"🟡"],["Saudi Arabia",10,"🟢"],["India",8,"🟢"]], strategicRec: "Sıcak çaydaki organik büyüme kaybını fonksiyonel RTD pivot ile dengele; Lipton Iced Tea Sport serisini fitness influencer ekosistemiyle Q3'te lansmanla. Kombucha eğilimini 'wellness tea' çatısı altında içselleştir.", bcg: "Cash Cow", funnelDeep: { byAge: { genZ: {awareness:82,consideration:44,preference:28,purchase:22,loyalty:28}, millennial: {awareness:94,consideration:64,preference:40,purchase:34,loyalty:44}, genX: {awareness:96,consideration:70,preference:46,purchase:40,loyalty:52}, boomer: {awareness:96,consideration:74,preference:52,purchase:46,loyalty:58} }, byGender: { female: {purchase:42}, male: {purchase:36} }, byIncome: { high: {purchase:44}, mid: {purchase:38}, low: {purchase:34} }, competitor: {awareness:78,consideration:62,preference:48,purchase:40,loyalty:50} } },
  { id: 8, name: "Rexona/Sure", category: "Personal Care", status: "Strong", founded: 1908, revenue: 2.4, usg: 5.8, clv: 195, margin: 32, nps: 58, marketShare: 15.6, categoryGrowth: 3.9, elasticity: -1.0, awareness: 85, consideration: 72, preference: 56, purchase: 51, loyalty: 62, insight: "48h protection claim owns the efficacy space", risk: "Aluminium-free trend disruption", action: "Rexona Natural Mineral collection", vision1y: "Expand sport performance line", vision5y: "Global deodorant efficacy authority", radarScores: [72,68,82,79,68,74,71,65,74,72,62,78], psychScores: [65,71,75,72,68,62], markets: [["Brazil",22,"🟢"],["UK",18,"🟢"],["Australia",14,"🟢"],["Germany",12,"🟢"],["Indonesia",9,"🟡"]], strategicRec: "'Tüm Vücut' formatını küresel ölçeğe taşı; Axe ile kanibalizasyonu önlemek için Rexona'yı 'performans/fonksiyon', Axe'i 'kişilik/imaj' ekseninde segmente et.", bcg: "Star", funnelDeep: { byAge: { genZ: {awareness:80,consideration:64,preference:50,purchase:44,loyalty:50}, millennial: {awareness:86,consideration:72,preference:58,purchase:52,loyalty:64}, genX: {awareness:84,consideration:70,preference:56,purchase:50,loyalty:62}, boomer: {awareness:78,consideration:62,preference:48,purchase:42,loyalty:58} }, byGender: { female: {purchase:50}, male: {purchase:52} }, byIncome: { high: {purchase:62}, mid: {purchase:52}, low: {purchase:40} }, competitor: {awareness:82,consideration:70,preference:56,purchase:50,loyalty:60} } },
  { id: 9, name: "TRESemmé", category: "Personal Care", status: "Watch", founded: 1948, revenue: 1.4, usg: 2.1, clv: 145, margin: 26, nps: 44, marketShare: 7.8, categoryGrowth: 4.5, elasticity: -1.5, awareness: 74, consideration: 54, preference: 38, purchase: 32, loyalty: 41, insight: "Salon-quality positioning in mid-market", risk: "Premium trade-down squeezing mid-tier", action: "TRESemmé Studio salon partnership", vision1y: "Premium relaunch with salon exclusives", vision5y: "Mid-tier premium hair authority", radarScores: [52,58,68,62,55,64,58,72,54,60,48,64], psychScores: [58,55,62,68,52,71], markets: [["USA",32,"🟡"],["UK",22,"🟡"],["South Africa",12,"🟢"],["Brazil",10,"🟡"],["India",8,"🟢"]], strategicRec: "Salon ortaklık modelini 3 pilot pazarda (ABD, UK, Brezilya) hızlı test et; premium trade-down baskısını 'Salon Exclusives' alt serisiyle kır. NPS'i 18 ay içinde 44'ten 58'e çıkarmayı KPI yap.", bcg: "Question Mark", funnelDeep: { byAge: { genZ: {awareness:64,consideration:44,preference:28,purchase:22,loyalty:28}, millennial: {awareness:74,consideration:56,preference:40,purchase:34,loyalty:44}, genX: {awareness:72,consideration:52,preference:36,purchase:30,loyalty:40}, boomer: {awareness:62,consideration:44,preference:32,purchase:28,loyalty:36} }, byGender: { female: {purchase:38}, male: {purchase:22} }, byIncome: { high: {purchase:42}, mid: {purchase:32}, low: {purchase:24} }, competitor: {awareness:78,consideration:62,preference:48,purchase:40,loyalty:52} } },
  { id: 10, name: "Axe/Lynx", category: "Personal Care", status: "Strong", founded: 1983, revenue: 2.2, usg: 4.2, clv: 185, margin: 34, nps: 61, marketShare: 13.4, categoryGrowth: 3.6, elasticity: -1.2, awareness: 88, consideration: 71, preference: 55, purchase: 48, loyalty: 58, insight: "Gen Z masculinity reimagined = brand renaissance", risk: "Outdated 'conquest' perception in older demos", action: "Axe Fine Fragrance + gender-fluid pivot", vision1y: "Premium fragrance collection launch", vision5y: "Global youth grooming authority", radarScores: [68,72,82,71,62,78,68,74,71,68,78,82], psychScores: [72,65,82,68,78,62], markets: [["UK",24,"🟢"],["USA",18,"🟢"],["Brazil",16,"🟢"],["France",12,"🟢"],["India",8,"🟢"]], strategicRec: "Fine Fragrance koleksiyonuyla premium segmente adım at; 'gender-fluid grooming' konumlanmasını Z kuşağı ile test et. Rexona ile net segment sınırlarını belirleyerek çakışmayı minimuma indir.", bcg: "Star", funnelDeep: { byAge: { genZ: {awareness:90,consideration:72,preference:58,purchase:50,loyalty:56}, millennial: {awareness:88,consideration:70,preference:56,purchase:48,loyalty:60}, genX: {awareness:72,consideration:54,preference:38,purchase:32,loyalty:42}, boomer: {awareness:58,consideration:38,preference:26,purchase:22,loyalty:32} }, byGender: { female: {purchase:28}, male: {purchase:68} }, byIncome: { high: {purchase:58}, mid: {purchase:48}, low: {purchase:38} }, competitor: {awareness:86,consideration:68,preference:54,purchase:46,loyalty:56} } },
  // ── BEAUTY & WELLBEING ────────────────────────────────────────────────────
  { id: 11, name: "Vaseline", category: "Beauty & Wellbeing", status: "Strong", founded: 1870, revenue: 1.9, usg: 5.4, clv: 210, margin: 35, nps: 66, marketShare: 28.4, categoryGrowth: 3.8, elasticity: -0.9, awareness: 94, consideration: 76, preference: 62, purchase: 57, loyalty: 69, insight: "Healing equity is unmatched — dermatologist trust-anchor in emerging markets", risk: "Petroleum ingredient backlash in EU clean beauty segment", action: "Vaseline Derma+ clinical innovation tier launch", vision1y: "Expand Vaseline Healing Serum range into 10 new markets", vision5y: "World's #1 skin healing masterbrand", radarScores: [74,78,88,79,65,68,82,72,84,86,58,80], psychScores: [54,74,68,81,72,60], markets: [["USA",26,"🟢"],["India",22,"🟢"],["Nigeria",18,"🟢"],["Indonesia",14,"🟢"],["Brazil",10,"🟡"]], strategicRec: "'Slugging' trendini klinik Derma+ inovasyonuyla resmileştir; Z kuşağının viral skincare ritueline kurumsal olmayan bir sesle gir. EU clean beauty baskısına karşı petrolatum'un güvenliğini kanıtlayan bağımsız klinik araştırmaları öne çıkar.", bcg: "Cash Cow", funnelDeep: { byAge: { genZ: {awareness:86,consideration:64,preference:48,purchase:42,loyalty:54}, millennial: {awareness:92,consideration:76,preference:62,purchase:56,loyalty:70}, genX: {awareness:94,consideration:78,preference:64,purchase:58,loyalty:72}, boomer: {awareness:96,consideration:80,preference:66,purchase:60,loyalty:74} }, byGender: { female: {purchase:62}, male: {purchase:50} }, byIncome: { high: {purchase:68}, mid: {purchase:58}, low: {purchase:46} }, competitor: {awareness:84,consideration:68,preference:54,purchase:48,loyalty:62} } },
  { id: 12, name: "Pond's", category: "Beauty & Wellbeing", status: "Strong", founded: 1846, revenue: 1.6, usg: 3.9, clv: 175, margin: 30, nps: 58, marketShare: 14.2, categoryGrowth: 5.4, elasticity: -1.3, awareness: 86, consideration: 68, preference: 52, purchase: 46, loyalty: 54, insight: "Heritage skincare brand with deep Asian penetration", risk: "Premium Korean beauty disruption in core SE Asia markets", action: "Pond's Bright Science derm-grade serum range", vision1y: "Lead brightening category in South & SE Asia", vision5y: "Asia's most trusted skincare megabrand", radarScores: [65,68,76,72,58,66,62,74,78,68,52,72], psychScores: [68,62,72,76,58,64], markets: [["Indonesia",28,"🟢"],["India",24,"🟢"],["Thailand",16,"🟢"],["Philippines",14,"🟢"],["Vietnam",8,"🟢"]], strategicRec: "'Bright Science' derm-grade serum serisini K-Beauty rakiplerine karşı 'kanıtlanmış Asya miras + modern bilim' çatısıyla konumlandır. Güney ve Güneydoğu Asya'da dermatolog endorse içerik yatırımını ikiye katla.", bcg: "Star", funnelDeep: { byAge: { genZ: {awareness:78,consideration:56,preference:40,purchase:34,loyalty:40}, millennial: {awareness:86,consideration:68,preference:52,purchase:46,loyalty:56}, genX: {awareness:84,consideration:66,preference:50,purchase:44,loyalty:54}, boomer: {awareness:80,consideration:62,preference:46,purchase:40,loyalty:50} }, byGender: { female: {purchase:54}, male: {purchase:30} }, byIncome: { high: {purchase:56}, mid: {purchase:46}, low: {purchase:34} }, competitor: {awareness:82,consideration:72,preference:58,purchase:50,loyalty:60} } },
  { id: 13, name: "Simple", category: "Beauty & Wellbeing", status: "Watch", founded: 1960, revenue: 0.8, usg: 2.1, clv: 130, margin: 28, nps: 54, marketShare: 8.6, categoryGrowth: 6.8, elasticity: -1.4, awareness: 72, consideration: 58, preference: 42, purchase: 36, loyalty: 44, insight: "Sensitive-skin positioning resonates with ingredient-conscious consumers", risk: "Margin squeeze from clean beauty indie brands", action: "Simple Skin Science clinical partnership + dermatologist seal", vision1y: "Relaunch Simple with microbiome-friendly formulas", vision5y: "Global leader in sensitive skin care", radarScores: [48,54,62,58,52,68,74,62,52,54,58,60], psychScores: [56,52,68,62,58,72], markets: [["UK",36,"🟢"],["Ireland",20,"🟢"],["USA",14,"🟡"],["Australia",16,"🟢"],["Germany",8,"🟡"]], strategicRec: "CeraVe ve La Roche-Posay'a karşı 'mikrobiyom dostu formülasyon' ve bağımsız dermatolog sertifikasıyla farklılaş. Hassas cilt pazarında kapsamlı olmayı bırak, hassas + reaktif cilt uzmanı ol.", bcg: "Question Mark", funnelDeep: { byAge: { genZ: {awareness:68,consideration:52,preference:38,purchase:32,loyalty:40}, millennial: {awareness:72,consideration:58,preference:44,purchase:38,loyalty:46}, genX: {awareness:70,consideration:54,preference:40,purchase:34,loyalty:42}, boomer: {awareness:62,consideration:46,preference:32,purchase:26,loyalty:36} }, byGender: { female: {purchase:42}, male: {purchase:26} }, byIncome: { high: {purchase:46}, mid: {purchase:36}, low: {purchase:28} }, competitor: {awareness:68,consideration:56,preference:44,purchase:38,loyalty:48} } },
  { id: 14, name: "Nutrafol", category: "Beauty & Wellbeing", status: "Strong", founded: 2016, revenue: 0.6, usg: 28.4, clv: 480, margin: 42, nps: 78, marketShare: 11.2, categoryGrowth: 22.1, elasticity: -0.7, awareness: 44, consideration: 38, preference: 32, purchase: 28, loyalty: 74, insight: "Science-backed hair wellness = highest CLV in Beauty portfolio", risk: "Clinical claims regulatory scrutiny intensifying", action: "Expand Nutrafol Women's Balance + Men's range DTC", vision1y: "Launch Nutrafol Pro clinical subscription tier", vision5y: "#1 hair wellness platform globally", radarScores: [88,84,52,86,72,92,68,94,44,74,82,76], psychScores: [48,86,52,88,76,92], markets: [["USA",78,"🟢"],["Canada",10,"🟢"],["UK",6,"🟢"],["Australia",4,"🟢"],["Germany",2,"🟡"]], strategicRec: "Klinik araştırma çıktılarını hekim kanalına (dermatolog, pratisyen) sistematik biçimde sun; sigorta kapsamı müzakerelerini 2025 ABD önceliği yap. Awareness boşluğunu DTC içerik pazarlamasıyla kapat.", bcg: "Star", funnelDeep: { byAge: { genZ: {awareness:34,consideration:26,preference:20,purchase:16,loyalty:60}, millennial: {awareness:42,consideration:36,preference:30,purchase:26,loyalty:72}, genX: {awareness:48,consideration:40,preference:34,purchase:30,loyalty:78}, boomer: {awareness:44,consideration:38,preference:32,purchase:28,loyalty:76} }, byGender: { female: {purchase:32}, male: {purchase:22} }, byIncome: { high: {purchase:42}, mid: {purchase:28}, low: {purchase:14} }, competitor: {awareness:38,consideration:30,preference:24,purchase:20,loyalty:58} } },
  // ── PERSONAL CARE ─────────────────────────────────────────────────────────
  { id: 15, name: "Lifebuoy", category: "Personal Care", status: "Strong", founded: 1894, revenue: 1.4, usg: 6.8, clv: 95, margin: 26, nps: 62, marketShare: 18.4, categoryGrowth: 5.2, elasticity: -0.8, awareness: 92, consideration: 78, preference: 64, purchase: 58, loyalty: 61, insight: "Health & hygiene mission brand with unparalleled developing-world penetration", risk: "Commoditization in hand-wash post-pandemic", action: "Lifebuoy Health Shield antibacterial premium range", vision1y: "Reach 1 billion hand-washes target globally", vision5y: "World's most trusted hygiene brand", radarScores: [62,58,84,78,52,64,86,56,92,74,48,88], psychScores: [46,78,62,82,58,48], markets: [["India",36,"🟢"],["Indonesia",22,"🟢"],["Pakistan",14,"🟢"],["Bangladesh",12,"🟢"],["Nigeria",8,"🟢"]], strategicRec: "Kırsal penetrasyon kalesini koru, kentsel alanda Lifebuoy Premium antibakteriyel serisini marka mimarisi içinde farklı fiyat noktasında konumlandır. Pandemi sonrası hijyen yorgunluğunu 'proaktif sağlık' anlatısına dönüştür.", bcg: "Cash Cow", funnelDeep: { byAge: { genZ: {awareness:84,consideration:66,preference:52,purchase:46,loyalty:50}, millennial: {awareness:90,consideration:76,preference:62,purchase:56,loyalty:62}, genX: {awareness:92,consideration:80,preference:66,purchase:60,loyalty:64}, boomer: {awareness:94,consideration:82,preference:68,purchase:62,loyalty:66} }, byGender: { female: {purchase:58}, male: {purchase:58} }, byIncome: { high: {purchase:64}, mid: {purchase:58}, low: {purchase:52} }, competitor: {awareness:86,consideration:72,preference:58,purchase:52,loyalty:56} } },
  { id: 16, name: "Closeup", category: "Personal Care", status: "Watch", founded: 1967, revenue: 0.7, usg: 1.4, clv: 88, margin: 24, nps: 46, marketShare: 6.8, categoryGrowth: 3.6, elasticity: -1.5, awareness: 74, consideration: 54, preference: 38, purchase: 32, loyalty: 40, insight: "Youth oral care brand with strong Asian equity", risk: "Colgate and Sensodyne growing share in whitening segment", action: "Closeup Gen Z 360 relaunch with dating-culture positioning", vision1y: "Launch Closeup Activated Charcoal premium tier", vision5y: "Asia's #1 youth oral care brand", radarScores: [44,48,58,52,55,54,46,56,64,48,62,50], psychScores: [72,44,68,52,58,46], markets: [["India",28,"🟡"],["Indonesia",22,"🟢"],["Vietnam",18,"🟢"],["Philippines",14,"🟢"],["Thailand",10,"🟡"]], strategicRec: "Colgate ve Sensodyne'in işlevsel iddialarına karşı 'confidence & connection' duygusal konumunu güçlendir; Gen Z için dating-culture odaklı TikTok-native içerik serisini pilot olarak test et.", bcg: "Question Mark", funnelDeep: { byAge: { genZ: {awareness:80,consideration:58,preference:40,purchase:34,loyalty:38}, millennial: {awareness:74,consideration:52,preference:36,purchase:30,loyalty:40}, genX: {awareness:62,consideration:44,preference:30,purchase:24,loyalty:34}, boomer: {awareness:52,consideration:36,preference:22,purchase:18,loyalty:28} }, byGender: { female: {purchase:32}, male: {purchase:32} }, byIncome: { high: {purchase:38}, mid: {purchase:32}, low: {purchase:28} }, competitor: {awareness:70,consideration:56,preference:44,purchase:38,loyalty:46} } },
  { id: 17, name: "Signal/Pepsodent", category: "Personal Care", status: "Strong", founded: 1952, revenue: 1.1, usg: 3.2, clv: 102, margin: 25, nps: 52, marketShare: 9.4, categoryGrowth: 4.1, elasticity: -1.1, awareness: 82, consideration: 66, preference: 52, purchase: 46, loyalty: 55, insight: "Trusted family oral care with strong pharmacy-channel equity", risk: "Smart electric toothbrush disrupting manual penetration", action: "Signal Pro-Expert + connected oral health ecosystem", vision1y: "Launch Signal Smart Brush in 3 key markets", vision5y: "Family oral health platform brand", radarScores: [58,56,72,68,48,58,64,58,72,62,44,66], psychScores: [52,68,58,72,54,48], markets: [["UK",22,"🟢"],["France",18,"🟢"],["Indonesia",16,"🟢"],["Turkey",14,"🟢"],["South Africa",10,"🟢"]], strategicRec: "Aile güveni platformunu koru; elektrikli diş fırçası trendine Smart Brush ortaklıklarıyla yanıt ver. Türkiye ve Endonezya gibi öncelikli pazarlarda eczane kanal liderliğini yeniden kazanmak için eczacı önerisi programı başlat.", bcg: "Cash Cow", funnelDeep: { byAge: { genZ: {awareness:72,consideration:54,preference:40,purchase:34,loyalty:40}, millennial: {awareness:82,consideration:66,preference:52,purchase:46,loyalty:56}, genX: {awareness:84,consideration:68,preference:54,purchase:48,loyalty:58}, boomer: {awareness:86,consideration:70,preference:56,purchase:50,loyalty:60} }, byGender: { female: {purchase:46}, male: {purchase:46} }, byIncome: { high: {purchase:54}, mid: {purchase:46}, low: {purchase:38} }, competitor: {awareness:80,consideration:66,preference:52,purchase:46,loyalty:56} } },
  // ── HOME CARE ─────────────────────────────────────────────────────────────
  { id: 18, name: "Cif", category: "Home Care", status: "Strong", founded: 1969, revenue: 1.8, usg: 7.2, clv: 145, margin: 31, nps: 64, marketShare: 16.8, categoryGrowth: 4.6, elasticity: -1.0, awareness: 88, consideration: 72, preference: 58, purchase: 52, loyalty: 62, insight: "Powerful-clean narrative fuels premium multi-surface positioning", risk: "Eco-format entrants disrupting spray-bottle category", action: "Cif Ecorefill concentrated formula + sustainability push", vision1y: "Expand Cif Power & Shine into SE Asia", vision5y: "Sustainable powerful-clean category leader", radarScores: [72,74,82,74,62,68,78,70,72,78,52,76], psychScores: [58,72,62,74,68,54], markets: [["UK",22,"🟢"],["France",18,"🟢"],["Germany",16,"🟢"],["Turkey",12,"🟢"],["Brazil",10,"🟢"]], strategicRec: "Eco-Refill konsantresini tüm Avrupa pazarlarında standart hale getir; probiyotik temizlik teknolojisini ana seride öne çıkar. Sürdürülebilirlik prim segmentindeki liderlik için yeşil klima sertifikasyonuna yatır.", bcg: "Star", funnelDeep: { byAge: { genZ: {awareness:72,consideration:52,preference:38,purchase:32,loyalty:42}, millennial: {awareness:86,consideration:70,preference:56,purchase:50,loyalty:62}, genX: {awareness:90,consideration:74,preference:60,purchase:54,loyalty:66}, boomer: {awareness:88,consideration:72,preference:58,purchase:52,loyalty:64} }, byGender: { female: {purchase:58}, male: {purchase:46} }, byIncome: { high: {purchase:64}, mid: {purchase:52}, low: {purchase:40} }, competitor: {awareness:82,consideration:68,preference:54,purchase:48,loyalty:58} } },
  { id: 19, name: "Domestos", category: "Home Care", status: "Strong", founded: 1929, revenue: 1.2, usg: 4.4, clv: 118, margin: 28, nps: 56, marketShare: 21.4, categoryGrowth: 2.9, elasticity: -0.8, awareness: 84, consideration: 68, preference: 54, purchase: 49, loyalty: 60, insight: "Bleach category leader with no credible challenger in core markets", risk: "Green cleaning trend reducing bleach consideration", action: "Domestos Zero Waste + plant-based active innovation", vision1y: "Launch Domestos Eco-Protect range", vision5y: "Healthy-home disinfection authority", radarScores: [64,68,84,72,52,58,62,58,74,86,44,72], psychScores: [46,68,54,76,64,48], markets: [["UK",28,"🟢"],["South Africa",20,"🟢"],["Turkey",16,"🟢"],["Poland",14,"🟢"],["Greece",10,"🟢"]], strategicRec: "'Sorumlu Hijyen' anlatısını geliştir: güçlü dezenfeksiyon + çevre saygısı denklemini kur. Bitki bazlı aktif içerikli Eco-Protect varyantını Q4'te UK ve Almanya'da lansmanla.", bcg: "Cash Cow", funnelDeep: { byAge: { genZ: {awareness:70,consideration:50,preference:36,purchase:30,loyalty:38}, millennial: {awareness:82,consideration:66,preference:52,purchase:46,loyalty:60}, genX: {awareness:86,consideration:70,preference:56,purchase:50,loyalty:64}, boomer: {awareness:88,consideration:72,preference:58,purchase:52,loyalty:66} }, byGender: { female: {purchase:54}, male: {purchase:44} }, byIncome: { high: {purchase:58}, mid: {purchase:50}, low: {purchase:44} }, competitor: {awareness:78,consideration:62,preference:48,purchase:42,loyalty:54} } },
  { id: 20, name: "Comfort", category: "Home Care", status: "Strong", founded: 1969, revenue: 1.4, usg: 5.6, clv: 132, margin: 27, nps: 60, marketShare: 14.2, categoryGrowth: 3.4, elasticity: -1.2, awareness: 82, consideration: 64, preference: 50, purchase: 44, loyalty: 58, insight: "Fabric conditioner with emotional 'care' equity in family segment", risk: "Concentrated/capsule formats require SKU strategy reset", action: "Comfort Intensive + perfume-partnership limited editions", vision1y: "Comfort Botanicals premium tier rollout", vision5y: "Fabric care emotional premium brand", radarScores: [62,64,74,70,56,62,68,64,68,66,50,68], psychScores: [58,66,62,70,54,58], markets: [["UK",20,"🟢"],["Indonesia",18,"🟢"],["Thailand",16,"🟢"],["Turkey",14,"🟢"],["Poland",12,"🟢"]], strategicRec: "Koku mühendisliği ve ünlü parfümörlerle sınırlı koleksiyon iş birliği yap; kapsül formatına geçişi sosyal medyada 'ritual upgrade' olarak çerçevele. Duygusal bağ varlığını nicel veriye dönüştürmek için NPS bazlı marka takibi başlat.", bcg: "Cash Cow", funnelDeep: { byAge: { genZ: {awareness:68,consideration:48,preference:34,purchase:28,loyalty:36}, millennial: {awareness:80,consideration:62,preference:48,purchase:42,loyalty:58}, genX: {awareness:84,consideration:66,preference:52,purchase:46,loyalty:62}, boomer: {awareness:82,consideration:64,preference:50,purchase:44,loyalty:60} }, byGender: { female: {purchase:52}, male: {purchase:34} }, byIncome: { high: {purchase:56}, mid: {purchase:44}, low: {purchase:34} }, competitor: {awareness:76,consideration:60,preference:46,purchase:40,loyalty:52} } },
  { id: 21, name: "Surf Excel", category: "Home Care", status: "Strong", founded: 1959, revenue: 1.6, usg: 8.1, clv: 155, margin: 26, nps: 66, marketShare: 24.6, categoryGrowth: 6.8, elasticity: -0.9, awareness: 96, consideration: 84, preference: 72, purchase: 66, loyalty: 74, insight: "India's most trusted laundry brand — 'Daag acche hain' purpose equity", risk: "E-commerce private labels at 50% discount penetrating tier-2 cities", action: "Surf Excel Naturals + micro-influencer regional campaigns", vision1y: "Capture 30% of India's premium laundry segment", vision5y: "India and SE Asia's #1 Purpose-led home care brand", radarScores: [74,68,92,82,68,70,74,66,78,84,58,84], psychScores: [58,78,72,82,62,56], markets: [["India",62,"🟢"],["Pakistan",18,"🟢"],["Bangladesh",10,"🟢"],["Sri Lanka",6,"🟢"],["UAE",4,"🟢"]], strategicRec: "'Daag Acche Hain' platformunu premium Surf Excel Naturals serisine taşı; Hindistan tier-2 şehirlerindeki özel etiket tehdidineine karşı mikro-influencer kampanyasıyla bölgesel savunma kur.", bcg: "Star", funnelDeep: { byAge: { genZ: {awareness:88,consideration:70,preference:56,purchase:50,loyalty:58}, millennial: {awareness:96,consideration:84,preference:72,purchase:66,loyalty:76}, genX: {awareness:96,consideration:86,preference:74,purchase:68,loyalty:78}, boomer: {awareness:94,consideration:84,preference:72,purchase:66,loyalty:76} }, byGender: { female: {purchase:70}, male: {purchase:62} }, byIncome: { high: {purchase:74}, mid: {purchase:66}, low: {purchase:56} }, competitor: {awareness:84,consideration:68,preference:54,purchase:48,loyalty:58} } },
  // ── FOODS ─────────────────────────────────────────────────────────────────
  { id: 22, name: "Magnum", category: "Foods", status: "Strong", founded: 1989, revenue: 2.4, usg: 9.2, clv: 185, margin: 34, nps: 74, marketShare: 22.4, categoryGrowth: 5.8, elasticity: -0.7, awareness: 92, consideration: 82, preference: 72, purchase: 64, loyalty: 68, insight: "Premium ice cream pleasure positioning drives one of FMCG's highest margins", risk: "Health & sugar-reduction trend threatening indulgence category", action: "Magnum Mini + Magnum Dark Chocolate premium expansion", vision1y: "Launch Magnum Vegan Chocolate globally", vision5y: "World's #1 premium ice cream brand", radarScores: [86,84,92,78,74,78,68,92,84,88,74,82], psychScores: [82,74,88,76,68,90], markets: [["UK",24,"🟢"],["Germany",18,"🟢"],["France",16,"🟢"],["USA",14,"🟢"],["Australia",10,"🟢"]], strategicRec: "Premium zevk konumunu korurken Magnum Mini ve bitki bazlı çikolata serisini eşzamanlı büyüt; sağlık trendine 'bilinçli indulgence' çerçevesiyle cevap ver. Sınırlı koleksiyonları lüks moda markalarıyla ortaklaşa piyasaya sür.", bcg: "Star", funnelDeep: { byAge: { genZ: {awareness:88,consideration:78,preference:66,purchase:58,loyalty:62}, millennial: {awareness:92,consideration:84,preference:74,purchase:66,loyalty:70}, genX: {awareness:90,consideration:80,preference:70,purchase:62,loyalty:66}, boomer: {awareness:84,consideration:74,preference:62,purchase:54,loyalty:60} }, byGender: { female: {purchase:68}, male: {purchase:60} }, byIncome: { high: {purchase:80}, mid: {purchase:64}, low: {purchase:44} }, competitor: {awareness:82,consideration:72,preference:60,purchase:52,loyalty:58} } },
  { id: 23, name: "Ben & Jerry's", category: "Foods", status: "Watch", founded: 1978, revenue: 0.9, usg: 1.8, clv: 165, margin: 28, nps: 68, marketShare: 8.4, categoryGrowth: 4.2, elasticity: -0.9, awareness: 88, consideration: 72, preference: 58, purchase: 48, loyalty: 64, insight: "Social activism brand equity is unique and defensible", risk: "Brand autonomy tensions with Unilever corporate reducing exec investment", action: "Ben & Jerry's NFT Limited Editions + climate campaign relaunch", vision1y: "Resolve governance structure for sustainable autonomy", vision5y: "The world's most values-driven FMCG brand", radarScores: [52,56,62,68,78,72,94,84,54,56,88,60], psychScores: [88,58,92,64,82,68], markets: [["USA",48,"🟡"],["UK",22,"🟡"],["Netherlands",10,"🟢"],["Germany",8,"🟡"],["Australia",6,"🟢"]], strategicRec: "Yönetişim krizini markalaşma fırsatına çevir: Unilever ile 'özerk değerler sözleşmesi' modelini kamuoyuyla paylaş. Aktivizm odaklı kimliği sadık kitleyi genişletmek için kullan; siyasi polarizasyondan uzak küresel iklim ajandası üzerinde yoğunlaş.", bcg: "Question Mark", funnelDeep: { byAge: { genZ: {awareness:90,consideration:74,preference:60,purchase:50,loyalty:66}, millennial: {awareness:88,consideration:72,preference:58,purchase:48,loyalty:64}, genX: {awareness:80,consideration:62,preference:48,purchase:38,loyalty:54}, boomer: {awareness:66,consideration:50,preference:36,purchase:28,loyalty:46} }, byGender: { female: {purchase:50}, male: {purchase:46} }, byIncome: { high: {purchase:60}, mid: {purchase:48}, low: {purchase:32} }, competitor: {awareness:76,consideration:62,preference:50,purchase:42,loyalty:54} } },
  { id: 24, name: "Maille", category: "Foods", status: "Strong", founded: 1747, revenue: 0.6, usg: 6.4, clv: 290, margin: 38, nps: 72, marketShare: 18.2, categoryGrowth: 4.4, elasticity: -0.6, awareness: 62, consideration: 52, preference: 46, purchase: 40, loyalty: 68, insight: "275-year heritage = irreplaceable premium mustard authority", risk: "Limited geographic reach constrains revenue ceiling", action: "Maille restaurant partnerships + gourmet gifting push", vision1y: "Launch Maille Artisan Collection in 8 new countries", vision5y: "Global gourmet condiment luxury brand", radarScores: [68,78,64,74,52,58,72,96,52,74,44,66], psychScores: [76,62,54,86,66,74], markets: [["France",42,"🟢"],["UK",18,"🟢"],["USA",16,"🟢"],["Germany",10,"🟢"],["Canada",8,"🟢"]], strategicRec: "Fransa dışında seçici premium restoran ortaklıkları (Michelin yıldızlı) ile küresel bilinirliği artır; gourmet gifting segmentini tatil dönemlerinde agresif pazarla. Ürün gamını hardal ötesine (vinaigrette, cornichon) genişlet.", bcg: "Cash Cow", funnelDeep: { byAge: { genZ: {awareness:44,consideration:34,preference:28,purchase:22,loyalty:54}, millennial: {awareness:60,consideration:50,preference:44,purchase:38,loyalty:66}, genX: {awareness:66,consideration:56,preference:50,purchase:44,loyalty:72}, boomer: {awareness:70,consideration:60,preference:54,purchase:48,loyalty:76} }, byGender: { female: {purchase:44}, male: {purchase:36} }, byIncome: { high: {purchase:62}, mid: {purchase:40}, low: {purchase:20} }, competitor: {awareness:58,consideration:48,preference:40,purchase:34,loyalty:58} } },
  { id: 25, name: "Pukka", category: "Foods", status: "Strong", founded: 2001, revenue: 0.4, usg: 14.2, clv: 340, margin: 44, nps: 76, marketShare: 6.2, categoryGrowth: 18.4, elasticity: -0.8, awareness: 38, consideration: 32, preference: 28, purchase: 24, loyalty: 72, insight: "Ayurvedic herbal wellness perfectly timed for functional beverage boom", risk: "Category crowding from VC-backed wellness brands", action: "Pukka Functional Adaptogens + sleep range expansion", vision1y: "Enter US wellness market with DTC subscription", vision5y: "Herbal wellness beverage platform brand", radarScores: [82,84,44,82,68,88,94,88,38,56,78,64], psychScores: [52,82,48,90,68,88], markets: [["UK",44,"🟢"],["Germany",22,"🟢"],["Netherlands",12,"🟢"],["USA",10,"🟢"],["Australia",8,"🟢"]], strategicRec: "Adaptogen ve uyku çayı trendini kaçırmadan ABD doğal gıda kanalına (Whole Foods, Target) hızlı gir; DTC abonelik modelini lansmanla. İngiliz Ayurvedik miras hikâyesini ABD pazarında güçlü bir farklılaştırıcı olarak kullan.", bcg: "Star", funnelDeep: { byAge: { genZ: {awareness:32,consideration:26,preference:22,purchase:18,loyalty:66}, millennial: {awareness:40,consideration:34,preference:30,purchase:26,loyalty:74}, genX: {awareness:36,consideration:30,preference:26,purchase:22,loyalty:70}, boomer: {awareness:30,consideration:24,preference:20,purchase:16,loyalty:66} }, byGender: { female: {purchase:28}, male: {purchase:18} }, byIncome: { high: {purchase:36}, mid: {purchase:24}, low: {purchase:12} }, competitor: {awareness:34,consideration:28,preference:24,purchase:20,loyalty:60} } },
  { id: 26, name: "Brooke Bond", category: "Foods", status: "Watch", founded: 1869, revenue: 1.1, usg: 0.4, clv: 145, margin: 20, nps: 48, marketShare: 12.8, categoryGrowth: 1.2, elasticity: -1.1, awareness: 88, consideration: 64, preference: 44, purchase: 38, loyalty: 52, insight: "Deep value-tea equity in India and East Africa", risk: "Declining tea occasion frequency in under-35 segment", action: "Brooke Bond Red Label RTD + iced tea innovation", vision1y: "Premiumize with Brooke Bond Gold artisan collection", vision5y: "Refresh as a wellness tea platform brand", radarScores: [44,48,72,66,42,46,56,52,78,64,38,66], psychScores: [46,62,48,68,54,44], markets: [["India",54,"🟡"],["Kenya",18,"🟢"],["UK",12,"🟡"],["Sri Lanka",10,"🟢"],["Tanzania",6,"🟢"]], strategicRec: "Hindistan ve Doğu Afrika'da değer-çay liderliğini koru; RTD soğuk çay formatını 18-35 segmentine yönelik pilot olarak Hindistan urban merkezlerinde test et. Marka gençleştirmesi için dijital ilk kampanyayı kırsal değerler üzerine inşa et.", bcg: "Cash Cow", funnelDeep: { byAge: { genZ: {awareness:70,consideration:44,preference:28,purchase:22,loyalty:30}, millennial: {awareness:84,consideration:60,preference:42,purchase:36,loyalty:48}, genX: {awareness:90,consideration:68,preference:48,purchase:42,loyalty:56}, boomer: {awareness:94,consideration:74,preference:54,purchase:48,loyalty:62} }, byGender: { female: {purchase:40}, male: {purchase:36} }, byIncome: { high: {purchase:44}, mid: {purchase:38}, low: {purchase:34} }, competitor: {awareness:82,consideration:62,preference:44,purchase:38,loyalty:50} } },
  { id: 27, name: "Horlicks", category: "Foods", status: "Strong", founded: 1873, revenue: 0.8, usg: 7.8, clv: 185, margin: 29, nps: 62, marketShare: 44.2, categoryGrowth: 7.4, elasticity: -0.8, awareness: 94, consideration: 78, preference: 64, purchase: 58, loyalty: 68, insight: "Near-monopoly in India's malted beverage category", risk: "Health concerns around malt drinks in emerging affluent class", action: "Horlicks Protein Plus + sports performance sub-brand", vision1y: "Enter SE Asia with Horlicks Health Stack range", vision5y: "Asia's #1 nutritional wellness beverage", radarScores: [68,66,94,78,56,64,72,66,62,92,52,78], psychScores: [54,72,62,76,60,58], markets: [["India",72,"🟢"],["Bangladesh",12,"🟢"],["Sri Lanka",8,"🟢"],["UK",4,"🟡"],["Kenya",4,"🟢"]], strategicRec: "Şehirli milenyum ebeveynlerine Horlicks Protein Plus ile ulaş; malt bileşiğine dair sağlık endişelerini şeffaf içerik etiketi ve bağımsız beslenme araştırmalarıyla yönet. Güneydoğu Asya lansmanını spor performans açısından çerçevele.", bcg: "Cash Cow", funnelDeep: { byAge: { genZ: {awareness:78,consideration:56,preference:42,purchase:36,loyalty:46}, millennial: {awareness:88,consideration:72,preference:58,purchase:52,loyalty:62}, genX: {awareness:94,consideration:80,preference:66,purchase:60,loyalty:70}, boomer: {awareness:96,consideration:82,preference:68,purchase:62,loyalty:72} }, byGender: { female: {purchase:60}, male: {purchase:56} }, byIncome: { high: {purchase:66}, mid: {purchase:58}, low: {purchase:50} }, competitor: {awareness:80,consideration:64,preference:50,purchase:44,loyalty:54} } },
  // ── PERSONAL CARE EXTENSION ───────────────────────────────────────────────
  { id: 28, name: "Degree/Sure", category: "Personal Care", status: "Strong", founded: 1948, revenue: 1.6, usg: 4.8, clv: 168, margin: 30, nps: 58, marketShare: 11.4, categoryGrowth: 3.8, elasticity: -1.1, awareness: 82, consideration: 68, preference: 52, purchase: 46, loyalty: 56, insight: "Motion-activated technology claim owns performance deodorant space", risk: "Natural mineral deodorant segment growing at 3× category", action: "Degree MotionSense + Degree Naturals dual-tier strategy", vision1y: "Launch Degree MotionSense Sport Pro premium range", vision5y: "Performance deodorant authority in Americas", radarScores: [68,64,76,70,60,68,62,66,64,70,58,68], psychScores: [60,68,64,72,58,62], markets: [["USA",52,"🟢"],["Canada",18,"🟢"],["Mexico",14,"🟢"],["Brazil",10,"🟢"],["Argentina",6,"🟢"]], strategicRec: "MotionSense teknolojisini 'aktif performans' platformunun çekirdeği yap; doğal mineral deodorant segmentine Degree Naturals yan markasıyla gir. Americas pazarında D2C kanalı açarak tüketici verisi biriktir.", bcg: "Cash Cow", funnelDeep: { byAge: { genZ: {awareness:76,consideration:58,preference:44,purchase:38,loyalty:44}, millennial: {awareness:82,consideration:68,preference:54,purchase:48,loyalty:58}, genX: {awareness:80,consideration:66,preference:52,purchase:46,loyalty:56}, boomer: {awareness:72,consideration:58,preference:44,purchase:38,loyalty:50} }, byGender: { female: {purchase:44}, male: {purchase:48} }, byIncome: { high: {purchase:56}, mid: {purchase:46}, low: {purchase:36} }, competitor: {awareness:84,consideration:70,preference:56,purchase:48,loyalty:58} } },
  // ── BEAUTY EXTENSION ───────────────────────────────────────────────────────
  { id: 29, name: "Dermalogica", category: "Beauty & Wellbeing", status: "Strong", founded: 1986, revenue: 0.5, usg: 12.4, clv: 520, margin: 48, nps: 82, marketShare: 8.8, categoryGrowth: 14.2, elasticity: -0.6, awareness: 42, consideration: 36, preference: 30, purchase: 26, loyalty: 76, insight: "Therapist-only prestige channel creates unbreachable premium moat", risk: "Sephora mass-prestige crossover risk diluting exclusivity", action: "Dermalogica Pro-App + AI skin diagnostics tool", vision1y: "Expand Dermalogica clinic footprint in ME and Asia", vision5y: "Prestige clinical skincare global authority", radarScores: [84,88,52,88,74,92,72,98,44,78,72,72], psychScores: [52,88,46,96,72,90], markets: [["USA",38,"🟢"],["UK",22,"🟢"],["Australia",16,"🟢"],["UAE",12,"🟢"],["Germany",8,"🟢"]], strategicRec: "Terapist kanalı ayrıcalığını koru, Orta Doğu ve Güneydoğu Asya'da klinik ayak izini büyüt; AI destekli cilt teşhisi uygulamasını terapi seansı öncesi müşteri aktivasyon aracına dönüştür.", bcg: "Star", funnelDeep: { byAge: { genZ: {awareness:34,consideration:28,preference:22,purchase:18,loyalty:62}, millennial: {awareness:42,consideration:36,preference:30,purchase:26,loyalty:76}, genX: {awareness:46,consideration:38,preference:32,purchase:28,loyalty:80}, boomer: {awareness:40,consideration:34,preference:28,purchase:24,loyalty:74} }, byGender: { female: {purchase:30}, male: {purchase:18} }, byIncome: { high: {purchase:44}, mid: {purchase:26}, low: {purchase:10} }, competitor: {awareness:38,consideration:32,preference:26,purchase:22,loyalty:64} } },
  { id: 30, name: "Liquid I.V.", category: "Beauty & Wellbeing", status: "Strong", founded: 2012, revenue: 0.7, usg: 22.6, clv: 380, margin: 45, nps: 79, marketShare: 9.4, categoryGrowth: 24.8, elasticity: -0.8, awareness: 36, consideration: 32, preference: 26, purchase: 22, loyalty: 72, insight: "Hydration multiplier positioning creates entirely new beverage occasion", risk: "Competition from Nuun, LMNT and VC-backed hydration startups", action: "Liquid I.V. Sugar-Free + Sports Pro subscription tier", vision1y: "Enter UK, AUS, DE with Liquid I.V. Hydration Multiplier", vision5y: "#1 functional hydration brand globally", radarScores: [86,86,48,82,82,88,68,92,38,62,86,70], psychScores: [54,84,44,90,78,86], markets: [["USA",74,"🟢"],["Canada",12,"🟢"],["UK",6,"🟢"],["Australia",4,"🟢"],["UAE",4,"🟢"]], strategicRec: "Hızlı büyümeyi UK, Almanya ve Avustralya'ya taşıyarak coğrafi riski dağıt; şekersiz ve pro-spor tier'ı önceliklendirerek sağlık bilinçli segmentin tabanını genişlet. Abonelik modeli ile CLV'yi artır.", bcg: "Star", funnelDeep: { byAge: { genZ: {awareness:40,consideration:32,preference:24,purchase:20,loyalty:68}, millennial: {awareness:38,consideration:32,preference:26,purchase:22,loyalty:72}, genX: {awareness:28,consideration:22,preference:16,purchase:14,loyalty:60}, boomer: {awareness:22,consideration:16,preference:12,purchase:10,loyalty:52} }, byGender: { female: {purchase:22}, male: {purchase:24} }, byIncome: { high: {purchase:34}, mid: {purchase:22}, low: {purchase:10} }, competitor: {awareness:32,consideration:26,preference:20,purchase:16,loyalty:58} } },
];

const SEGMENTS = { "Beauty & Wellbeing": "#3B82F6", "Personal Care": "#06B6D4", "Home Care": "#10B981", "Foods": "#F59E0B" };
const BCG_COLORS = { Star: "#FBBF24", "Cash Cow": "#34D399", "Question Mark": "#818CF8", Dog: "#F87171" };

const FINANCIALS = {
  revenue: [
    { year: "2019", total: 51.98, beauty: 10.2, personal: 13.4, home: 11.8, foods: 16.58 },
    { year: "2020", total: 50.71, beauty: 9.8, personal: 13.2, home: 12.4, foods: 15.31 },
    { year: "2021", total: 52.44, beauty: 10.6, personal: 14.1, home: 12.8, foods: 14.94 },
    { year: "2022", total: 60.07, beauty: 12.4, personal: 16.2, home: 15.1, foods: 16.37 },
    { year: "2023", total: 59.60, beauty: 13.2, personal: 17.1, home: 14.8, foods: 14.50 },
    { year: "2024", total: 60.76, beauty: 14.1, personal: 18.2, home: 14.9, foods: 13.56 },
  ],
  margins: [
    { metric: "Gross Margin", value: 42.4 }, { metric: "EBIT Margin", value: 16.8 },
    { metric: "Net Margin", value: 11.2 }, { metric: "ROIC", value: 19.4 }, { metric: "ROE", value: 38.6 },
  ],
  competitors: [
    { name: "Unilever", revenue: 60.8, ebitMargin: 16.8, rndPct: 2.1 },
    { name: "P&G", revenue: 82.0, ebitMargin: 21.4, rndPct: 2.8 },
    { name: "Nestlé", revenue: 94.4, ebitMargin: 17.2, rndPct: 1.9 },
    { name: "L'Oréal", revenue: 41.2, ebitMargin: 19.8, rndPct: 3.4 },
  ]
};

const COUNTRIES = [
  { name: "USA", flag: "🇺🇸", gdp: 27.4, penetration: 68, premium: 72, digital: 88, sustainability: 79, loyalty: 74, growth: 82, opportunity: "Health & wellness premiumization", threat: "Private label expansion in grocery", culture: "Convenience-first + health-premium split", psychology: "Status signaling through brand heritage" },
  { name: "India", flag: "🇮🇳", gdp: 3.9, penetration: 54, premium: 42, digital: 74, sustainability: 48, loyalty: 78, growth: 91, opportunity: "800M+ aspirational middle class", threat: "Ultra-local competition (Patanjali)", culture: "Family approval and trust are paramount", psychology: "Value-conscious with aspirational brand ladder" },
  { name: "Brazil", flag: "🇧🇷", gdp: 2.1, penetration: 72, premium: 58, digital: 79, sustainability: 56, loyalty: 71, growth: 68, opportunity: "Beauty passion + social media virality", threat: "FX volatility compressing margins", culture: "Beauty rituals are cultural identity", psychology: "Social proof and sensory experience drivers" },
  { name: "Germany", flag: "🇩🇪", gdp: 4.1, penetration: 61, premium: 68, digital: 72, sustainability: 91, loyalty: 82, growth: 45, opportunity: "Sustainability leadership premium", threat: "Regulatory tightening on ingredients", culture: "Sustainability certificates are mandatory", psychology: "Quality trust > brand glamour" },
  { name: "China", flag: "🇨🇳", gdp: 18.6, penetration: 58, premium: 78, digital: 94, sustainability: 62, loyalty: 58, growth: 74, opportunity: "Super-app commerce integration", threat: "Local C-beauty brands at rapid scale", culture: "Social commerce and KOL-driven discovery", psychology: "Luxury aspiration meets digital-native skepticism" },
  { name: "Turkey", flag: "🇹🇷", gdp: 1.1, penetration: 74, premium: 48, digital: 82, sustainability: 44, loyalty: 74, growth: 58, opportunity: "Young demographic + social commerce surge", threat: "Hyperinflation compressing disposable income", culture: "Family and community brand endorsement", psychology: "Heritage trust mixed with novelty seeking" },
  { name: "UK", flag: "🇬🇧", gdp: 3.1, penetration: 82, premium: 74, digital: 88, sustainability: 86, loyalty: 68, growth: 48, opportunity: "Premium sustainability tier in household & personal care", threat: "Cost-of-living crisis driving down-trading to private label", culture: "Dry wit and pragmatism — claims must be proven not asserted", psychology: "Eco-guilt is a genuine purchase driver in ABC1 demographic" },
  { name: "Nigeria", flag: "🇳🇬", gdp: 0.5, penetration: 44, premium: 28, digital: 62, sustainability: 32, loyalty: 66, growth: 94, opportunity: "Africa's largest consumer market entering middle-class growth phase", threat: "FX devaluation and import cost inflation on branded goods", culture: "Community validation and aspirational branding are purchase triggers", psychology: "Brand as social currency — visible consumption signals status" },
  { name: "Indonesia", flag: "🇮🇩", gdp: 1.4, penetration: 66, premium: 44, digital: 78, sustainability: 48, loyalty: 72, growth: 82, opportunity: "270M consumers + halal certification as premium differentiator", threat: "Local Indonesian FMCG brands rising on nationalist sentiment", culture: "Halal trust and family-first values dominate category decisions", psychology: "Community-endorsed brands outperform in trust metrics 3× global avg" },
  { name: "Mexico", flag: "🇲🇽", gdp: 1.3, penetration: 70, premium: 52, digital: 72, sustainability: 46, loyalty: 74, growth: 64, opportunity: "Near-shoring boom driving income growth in northern urban centres", threat: "Regulatory sugar/salt labelling reforms impacting food brands", culture: "Family size packs and ritual occasions anchor brand loyalty", psychology: "Brand nostalgia and family heritage are the strongest loyalty drivers" },
];

const ESG_DATA = {
  climate: [
    { kpi: "Scope 1+2 Emissions (Mt CO₂)", target: 0, current: 1.2, base: 6.4, unit: "Mt", direction: "lower" },
    { kpi: "Renewable Energy Usage", target: 100, current: 74, base: 38, unit: "%", direction: "higher" },
  ],
  plastic: [
    { kpi: "Virgin Plastic Reduction", target: 50, current: 32, base: 0, unit: "%", direction: "higher" },
    { kpi: "Recycled Content in Packaging", target: 50, current: 28, base: 9, unit: "%", direction: "higher" },
  ],
  social: [
    { kpi: "Gender Pay Equity", target: 100, current: 98.4, base: 94, unit: "%", direction: "higher" },
    { kpi: "Smallholder Farmers Supported", target: 5000000, current: 3800000, base: 1200000, unit: "", direction: "higher" },
  ]
};

const COMPETITOR_RADAR = [
  { axis: "Market Share", Unilever: 72, PG: 88, Nestle: 71, Henkel: 52 },
  { axis: "Brand Power", Unilever: 85, PG: 82, Nestle: 76, Henkel: 62 },
  { axis: "Innovation", Unilever: 74, PG: 86, Nestle: 78, Henkel: 68 },
  { axis: "Sustainability", Unilever: 91, PG: 74, Nestle: 68, Henkel: 72 },
  { axis: "Digital Maturity", Unilever: 78, PG: 85, Nestle: 72, Henkel: 64 },
  { axis: "Profitability", Unilever: 68, PG: 85, Nestle: 76, Henkel: 71 },
];

const AI_ALERTS = [
  { level: "Critical", brand: "Lipton", metric: "USG %", value: -0.8, message: "Organic growth turned negative. Cold brew and functional drinks are cannibalizing core tea occasions. Immediate portfolio response needed.", action: "Launch Lipton Iced Tea Sport + Wellness sub-range within 90 days." },
  { level: "Warning", brand: "Lux", metric: "Funnel Conversion", value: "39%", message: "Consideration-to-preference conversion dropped 14 pts vs prior year. Brand aging signal among 18-34 segment detected.", action: "Accelerate Lux Modern Glamour repositioning campaign Q3." },
  { level: "Warning", brand: "TRESemmé", metric: "NPS Score", value: 44, message: "NPS 18 pts below category average. Competitive products from Pantene and Garnier outperforming on perceived innovation.", action: "Launch TRESemmé Studio Exclusives + salon partnership activations." },
  { level: "Opportunity", brand: "Hellmann's", metric: "USG %", value: 8.4, message: "Fastest organic growth in Foods segment. Plant-based mayo trial rates 3× category average. Momentum window open for 12 months.", action: "Accelerate Hellmann's Vegan range into 15 new markets." },
  { level: "Opportunity", brand: "Dove", metric: "Z-Gen Resonance", value: 68, message: "Authentic beauty index highest in category. TikTok engagement rate 2.4× vs benchmark. Viral potential untapped.", action: "Commission 200 micro-creators for Dove Real Beauty Challenge." },
  { level: "Critical", brand: "Omo/Persil", metric: "Private Label Delta", value: "-4.2%", message: "Share gap to private label narrowed by 4.2pts in 6 months across DE, FR, UK. Efficacy differentiation under pressure.", action: "Relaunch Concentrated Omo with carbon-neutral certification as premium anchor." },
];

// ─── SUBCOMPONENTS ───────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub, color = "#3B82F6" }) => (
  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "18px 22px", flex: 1, minWidth: 140 }}>
    <div style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 700, color, fontFamily: "'IBM Plex Mono', monospace" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{sub}</div>}
  </div>
);

const Badge = ({ text, color }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{text}</span>
);

const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 24 }}>
    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F9FAFB", letterSpacing: "-0.02em" }}>{children}</h2>
    {sub && <p style={{ margin: "6px 0 0", color: "#6B7280", fontSize: 13 }}>{sub}</p>}
  </div>
);

// ─── PAGES ───────────────────────────────────────────────────────────────────

const OverviewPage = ({ effectiveBrands = BRANDS, simEnabled = false, uploads = [], onUpload, onDeleteUpload }) => {
  const avgUSG = (effectiveBrands.reduce((s, b) => s + b.usg, 0) / effectiveBrands.length).toFixed(1);
  const stars = effectiveBrands.filter(b => b.bcg === "Star").length;
  const strong = effectiveBrands.filter(b => b.status === "Strong").length;
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const FILE_TYPES = {
    report: { exts: ["pdf","doc","docx","ppt","pptx","xlsx","csv","txt"], icon: "📄", color: "#3B82F6", label: "Report" },
    video:  { exts: ["mp4","mov","avi","webm","mkv"],                    icon: "🎬", color: "#F472B6", label: "Video"  },
    image:  { exts: ["png","jpg","jpeg","gif","webp","svg"],             icon: "🖼", color: "#34D399", label: "Image"  },
  };

  const detectType = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    for (const [type, cfg] of Object.entries(FILE_TYPES)) {
      if (cfg.exts.includes(ext)) return type;
    }
    return "report";
  };

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      const type = detectType(file.name);
      const url = URL.createObjectURL(file);
      onUpload && onUpload({ id: Date.now() + Math.random(), name: file.name, type, url, size: file.size, date: new Date().toLocaleDateString("tr-TR") });
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const fmtSize = (bytes) => bytes > 1048576 ? (bytes/1048576).toFixed(1)+"MB" : (bytes/1024).toFixed(0)+"KB";

  const TIMELINE = [
    { year: "2019", event: "Unilever Future Fit Strategy", note: "12 Power Brands divested, focus on 30 high-growth platforms" },
    { year: "2021", event: "Compass Strategy Launch", note: "Portfolio reshaping: beauty & wellbeing becomes largest division" },
    { year: "2022", event: "€670M Efficiency Programme", note: "400 fewer brands, 6-category simplification" },
    { year: "2023", event: "Hein Schumacher CEO", note: "Performance culture shift, results-first mandate" },
    { year: "2024", event: "Power Brands Acceleration", note: "30 Power Brands delivering 75%+ of revenue" },
    { year: "2025", event: "Growth Action Plan", note: "Volume-led USG, D2C and digital commerce scaling" },
  ];

  return (
    <div>
      <SectionTitle sub="Executive snapshot — 30 Power Brands performance at a glance">Overview</SectionTitle>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        <StatCard label="FY2024 Revenue" value="€60.8B" sub="+2.0% vs FY2023" color="#34D399" />
        <StatCard label="Avg. Organic Growth" value={`${avgUSG}%`} sub="Underlying Sales Growth" color="#FBBF24" />
        <StatCard label="BCG Stars" value={`${stars}/30`} sub="High-growth, high-share" color="#818CF8" />
        <StatCard label="Portfolio Health" value={`${strong}/30`} sub="Brands rated Strong" color="#3B82F6" />
        <StatCard label="EBIT Margin" value="16.8%" sub="FY2024 reported" color="#F472B6" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>REVENUE TREND BY SEGMENT (€B)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={FINANCIALS.revenue.slice(-4)}>
              <XAxis dataKey="year" tick={{ fill: "#6B7280", fontSize: 11 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1F2937", border: "none", borderRadius: 8, color: "#F9FAFB" }} />
              <Bar dataKey="beauty" stackId="a" fill="#3B82F6" name="Beauty" />
              <Bar dataKey="personal" stackId="a" fill="#06B6D4" name="Personal Care" />
              <Bar dataKey="home" stackId="a" fill="#10B981" name="Home Care" />
              <Bar dataKey="foods" stackId="a" fill="#F59E0B" name="Foods" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>PORTFOLIO BCG DISTRIBUTION {simEnabled && <span style={{ fontSize: 10, color: "#A78BFA", fontWeight: 400 }}>⚡ Simulated</span>}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(BCG_COLORS).map(([label, color]) => {
              const count = effectiveBrands.filter(b => b.bcg === label).length;
              return (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <div style={{ fontSize: 13, color: "#D1D5DB", width: 120 }}>{label}</div>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 8 }}>
                    <div style={{ width: `${(count / effectiveBrands.length) * 100}%`, background: color, height: "100%", borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 13, color, fontWeight: 700, minWidth: 24 }}>{count}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#FBBF24", marginBottom: 6 }}>⚡ KEY STRATEGIC INSIGHT</div>
            <div style={{ fontSize: 12, color: "#D1D5DB", lineHeight: 1.6 }}>Power Brands deliver 75%+ of revenue. Nutrafol, Liquid I.V. and Pukka are high-velocity emerging platforms. Lipton and Lux require Q3 intervention plans.</div>
          </div>
        </div>
      </div>

      {/* SOLUTION ARCHITECTURE + UPLOAD PORTAL */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>PLATFORM SOLUTION ARCHITECTURE</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {uploads.length > 0 && (
              <div style={{ fontSize: 10, color: "#34D399", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>
                {uploads.length} file{uploads.length > 1 ? "s" : ""} attached
              </div>
            )}
            <button onClick={() => fileInputRef.current?.click()}
              style={{ fontSize: 11, color: "#60A5FA", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 7, padding: "4px 12px", cursor: "pointer", fontWeight: 600 }}>
              + Upload
            </button>
            <input ref={fileInputRef} type="file" multiple accept="*/*" style={{ display: "none" }} onChange={e => { handleFiles(e.target.files); e.target.value = ""; }} />
          </div>
        </div>

        {/* Architecture flow */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
          {[["Brand Data Layer", "30 brands × 40+ fields", "#3B82F6"], ["→", "", ""], ["Analytics Engine", "BCG · Funnel · Radar · Simulation", "#06B6D4"], ["→", "", ""], ["AI Intelligence", "Rule-based alerts + AI Analyst", "#8B5CF6"], ["→", "", ""], ["Decision Layer", "Exec dashboard · Country analytics", "#34D399"]].map(([t, d, c], i) => (
            t === "→" ? <div key={i} style={{ color: "#374151", fontSize: 18 }}>→</div> :
            <div key={t} style={{ background: `${c}11`, border: `1px solid ${c}33`, borderRadius: 10, padding: "10px 16px", flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: c }}>{t}</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 3 }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7, marginBottom: uploads.length > 0 ? 16 : 0 }}>
          Built on React + Recharts. Stateless data layer designed for drop-in Supabase or REST API replacement. 12 analytical modules powered by a single 30-brand data model — extending to real-time requires no architectural changes.
        </div>

        {/* Drop zone — shown when no uploads yet */}
        {uploads.length === 0 && (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              marginTop: 14,
              border: `1.5px dashed ${dragOver ? "#60A5FA" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 10,
              padding: "18px 20px",
              textAlign: "center",
              cursor: "pointer",
              background: dragOver ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.01)",
              transition: "all 0.15s",
            }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>📎</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Drop reports, videos or images here — they'll appear as solution assets below</div>
            <div style={{ fontSize: 11, color: "#374151", marginTop: 4 }}>PDF · DOCX · PPTX · MP4 · PNG · JPG · and more</div>
          </div>
        )}

        {/* Uploaded files grid */}
        {uploads.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              Solution Assets
            </div>
            {/* Tabs by type */}
            {["report","video","image"].map(type => {
              const group = uploads.filter(u => u.type === type);
              if (group.length === 0) return null;
              const cfg = FILE_TYPES[type];
              return (
                <div key={type} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: cfg.color, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{cfg.icon}</span>
                    <span>{cfg.label.toUpperCase()}S</span>
                    <span style={{ background: `${cfg.color}22`, border: `1px solid ${cfg.color}44`, borderRadius: 4, padding: "1px 6px", fontSize: 10 }}>{group.length}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                    {group.map(file => (
                      <div key={file.id} style={{
                        background: `${cfg.color}09`,
                        border: `1px solid ${cfg.color}2a`,
                        borderRadius: 9,
                        padding: "10px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        position: "relative",
                      }}>
                        {/* Preview for images */}
                        {file.type === "image" && (
                          <img src={file.url} alt={file.name}
                            style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 6, marginBottom: 4, border: "1px solid rgba(255,255,255,0.07)" }} />
                        )}
                        {/* Preview for video */}
                        {file.type === "video" && (
                          <video src={file.url} controls style={{ width: "100%", height: 80, borderRadius: 6, marginBottom: 4, background: "#000" }} />
                        )}
                        {/* Report icon */}
                        {file.type === "report" && (
                          <div style={{ fontSize: 24, marginBottom: 2 }}>{cfg.icon}</div>
                        )}
                        <div style={{ fontSize: 12, color: "#D1D5DB", fontWeight: 600, wordBreak: "break-all", lineHeight: 1.3 }}>{file.name}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 10, color: "#6B7280" }}>{fmtSize(file.size)} · {file.date}</span>
                          <div style={{ display: "flex", gap: 4 }}>
                            {file.type === "report" && (
                              <a href={file.url} download={file.name}
                                style={{ fontSize: 10, color: cfg.color, background: `${cfg.color}15`, border: `1px solid ${cfg.color}33`, borderRadius: 4, padding: "2px 6px", textDecoration: "none", cursor: "pointer" }}>
                                ↓
                              </a>
                            )}
                            <button onClick={() => onDeleteUpload && onDeleteUpload(file.id)}
                              style={{ fontSize: 10, color: "#F87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 4, padding: "2px 6px", cursor: "pointer" }}>
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Add more drop zone at bottom */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `1px dashed ${dragOver ? "#60A5FA" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 8,
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
                background: dragOver ? "rgba(59,130,246,0.05)" : "transparent",
                fontSize: 11,
                color: "#4B5563",
                transition: "all 0.15s",
                marginTop: 4,
              }}>
              + Drop more files
            </div>
          </div>
        )}
      </div>

      {/* KEY INSIGHTS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>KEY INSIGHTS — FY2024</div>
          {[["🚀 Acceleration Plays", "Hellmann's (+8.4% USG), Nutrafol (+28%), Liquid I.V. (+23%), Pukka (+14%) are portfolio growth engines.", "#34D399"],
            ["⚠️ Intervention Required", "Lipton (-0.8% USG), Lux (funnel -14pts), TRESemmé (NPS 18pts below avg) need structural fixes.", "#F87171"],
            ["💡 Premium Opportunity", "Dermalogica, Maille and Nutrafol achieving 42–48% margins — premium-mix shift could add 200bps to group EBIT.", "#FBBF24"],
            ["🌍 Emerging Market Alpha", "India, Nigeria, Indonesia collectively represent 40%+ of growth potential. Surf Excel and Lifebuoy are key vectors.", "#818CF8"],
          ].map(([t, d, c]) => (
            <div key={t} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: c, marginBottom: 4 }}>{t}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>

        {/* STRATEGIC TIMELINE */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 2 }}>STRATEGIC TIMELINE</div>
          <div style={{ fontSize: 10, color: "#4B5563", marginBottom: 12 }}>Revenue milestones & strategy events 2019–2025</div>
          {/* Revenue sparkline bars */}
          <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 36, marginBottom: 6, padding: "0 2px" }}>
            {FINANCIALS.revenue.map((r, i) => {
              const max = Math.max(...FINANCIALS.revenue.map(x => x.total));
              const h = Math.round((r.total / max) * 100);
              const isLast = i === FINANCIALS.revenue.length - 1;
              return (
                <div key={r.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
                  <div style={{ width: "80%", background: isLast ? "#34D399" : "rgba(59,130,246,0.35)", borderRadius: "2px 2px 0 0", height: `${h}%`, minHeight: 4, transition: "height 0.4s" }} />
                </div>
              );
            })}
          </div>
          {/* Timeline connector + dots */}
          <div style={{ position: "relative", display: "flex", marginBottom: 4 }}>
            <div style={{ position: "absolute", top: 5, left: "4%", right: "4%", height: 2, background: "linear-gradient(90deg, #3B82F6, #34D399)", borderRadius: 2 }} />
            {TIMELINE.map((t, i) => (
              <div key={t.year} style={{ flex: 1, display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
                <div style={{ width: i === TIMELINE.length - 1 ? 12 : 8, height: i === TIMELINE.length - 1 ? 12 : 8, borderRadius: "50%", background: i === TIMELINE.length - 1 ? "#34D399" : "#3B82F6", border: "2px solid #0D1117", boxShadow: i === TIMELINE.length - 1 ? "0 0 8px #34D39966" : "none" }} />
              </div>
            ))}
          </div>
          {/* Year labels */}
          <div style={{ display: "flex", marginBottom: 14 }}>
            {TIMELINE.map((t, i) => (
              <div key={t.year} style={{ flex: 1, textAlign: "center", fontSize: 9, color: i === TIMELINE.length - 1 ? "#34D399" : "#3B82F6", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>{t.year}</div>
            ))}
          </div>
          {/* Event list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {TIMELINE.map((t, i) => {
              const rev = FINANCIALS.revenue.find(r => r.year === t.year);
              return (
                <div key={t.year} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 8px", borderRadius: 7, background: i === TIMELINE.length - 1 ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.02)", borderLeft: `2px solid ${i === TIMELINE.length - 1 ? "#34D399" : "rgba(59,130,246,0.3)"}` }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: i === TIMELINE.length - 1 ? "#34D399" : "#3B82F6", fontFamily: "'IBM Plex Mono', monospace", minWidth: 28, flexShrink: 0 }}>{t.year}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#D1D5DB" }}>{t.event}</div>
                    <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>{t.note}</div>
                  </div>
                  {rev && <span style={{ fontSize: 9, color: "#34D399", fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0, alignSelf: "center" }}>€{rev.total}B</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {[
          { label: "Critical Alerts", count: AI_ALERTS.filter(a => a.level === "Critical").length, color: "#F87171", bg: "rgba(248,113,113,0.1)" },
          { label: "Watch Brands", count: effectiveBrands.filter(b => b.status === "Watch").length, color: "#FBBF24", bg: "rgba(251,191,36,0.1)" },
          { label: "Growth Opportunities", count: AI_ALERTS.filter(a => a.level === "Opportunity").length, color: "#34D399", bg: "rgba(52,211,153,0.1)" },
        ].map(item => (
          <div key={item.label} style={{ background: item.bg, border: `1px solid ${item.color}22`, borderRadius: 12, padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: item.color, fontFamily: "'IBM Plex Mono', monospace" }}>{item.count}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BrandPortfolioPage = ({ selectedBrand, setSelectedBrand, effectiveBrands = BRANDS }) => {
  const brand = effectiveBrands.find(b => b.id === selectedBrand) || effectiveBrands[0];
  const radarAxes = ["Financial Momentum","Profitability","Market Leadership","Consumer Loyalty","Digital Engagement","Innovation","Sustainability","Premium Potential","Geo Diversity","Competitive Moat","Z-Gen Resonance","Strategic Weight"];

  return (
    <div>
      <SectionTitle sub="Select a brand to explore its full 40-field strategic profile">Brand Portfolio</SectionTitle>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {BRANDS.map(b => (
          <button key={b.id} onClick={() => setSelectedBrand(b.id)}
            style={{ background: selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.05)", border: `1px solid ${selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.1)"}`, color: selectedBrand === b.id ? "#fff" : "#9CA3AF", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontWeight: selectedBrand === b.id ? 700 : 400 }}>
            {b.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F9FAFB" }}>{brand.name}</h3>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <Badge text={brand.category} color={SEGMENTS[brand.category]} />
                <Badge text={brand.status} color={brand.status === "Strong" ? "#34D399" : "#FBBF24"} />
                <Badge text={brand.bcg} color={BCG_COLORS[brand.bcg]} />
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#34D399", fontFamily: "'IBM Plex Mono', monospace" }}>€{brand.revenue}B</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>FY Revenue</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[["USG %", brand.usg + "%", "#FBBF24"], ["NPS", brand.nps, "#818CF8"], ["Margin", brand.margin + "%", "#34D399"], ["CLV", "€" + brand.clv, "#3B82F6"], ["Mkt Share", brand.marketShare + "%", "#06B6D4"], ["Elasticity", brand.elasticity, "#F472B6"]].map(([k, v, c]) => (
              <div key={k} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: c, fontFamily: "'IBM Plex Mono', monospace" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.6, marginBottom: 12 }}>
            <span style={{ color: "#60A5FA", fontWeight: 600 }}>Insight: </span>{brand.insight}
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.6, marginBottom: 12 }}>
            <span style={{ color: "#F87171", fontWeight: 600 }}>Risk: </span>{brand.risk}
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.6 }}>
            <span style={{ color: "#34D399", fontWeight: 600 }}>Action: </span>{brand.action}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 10 }}>12-AXIS BRAND HEALTH RADAR</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarAxes.map((a, i) => ({ subject: a.split(" ")[0], value: brand.radarScores[i] }))}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#6B7280", fontSize: 9 }} />
              <Radar dataKey="value" stroke={SEGMENTS[brand.category]} fill={SEGMENTS[brand.category]} fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 14 }}>CONSUMER FUNNEL (AIDA)</div>
          {[["Awareness", brand.awareness, "#3B82F6"], ["Consideration", brand.consideration, "#06B6D4"], ["Preference", brand.preference, "#8B5CF6"], ["Purchase", brand.purchase, "#FBBF24"], ["Loyalty", brand.loyalty, "#34D399"]].map(([stage, val, color]) => (
            <div key={stage} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>{stage}</span>
                <span style={{ fontSize: 12, color, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{val}%</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6 }}>
                <div style={{ width: `${val}%`, background: color, height: "100%", borderRadius: 4, transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 12 }}>TOP 5 MARKETS</div>
          {brand.markets.map(([country, share, flag]) => (
            <div key={country} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>{flag}</span>
              <span style={{ fontSize: 13, color: "#D1D5DB", width: 100 }}>{country}</span>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6 }}>
                <div style={{ width: `${share}%`, background: SEGMENTS[brand.category], height: "100%", borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 12, color: "#9CA3AF", minWidth: 30, textAlign: "right" }}>{share}%</span>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: "#6B7280" }}>5-YEAR VISION</div>
            <div style={{ fontSize: 12, color: "#D1D5DB", marginTop: 4 }}>{brand.vision5y}</div>
          </div>
          {brand.strategicRec && (
            <div style={{ marginTop: 10, padding: "12px 14px", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#A78BFA", fontWeight: 700, marginBottom: 6 }}>🧠 STRATEGIC RECOMMENDATION</div>
              <div style={{ fontSize: 12, color: "#D1D5DB", lineHeight: 1.6 }}>{brand.strategicRec}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FinancialsPage = ({ effectiveBrands = BRANDS, simEnabled = false }) => {
  const totalRevSim = effectiveBrands.reduce((s, b) => s + b.revenue, 0);
  const avgMarginSim = (effectiveBrands.reduce((s, b) => s + b.margin, 0) / effectiveBrands.length).toFixed(1);
  const revDelta = ((totalRevSim - 60.76) / 60.76 * 100).toFixed(1);
  return (
  <div>
    <SectionTitle sub="Consolidated financial statements & segment performance">Financials {simEnabled && <span style={{ fontSize: 12, color: "#A78BFA", fontWeight: 400 }}>⚡ Simulated</span>}</SectionTitle>
    {simEnabled && (
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 10, padding: "12px 20px", flex: 1 }}>
          <div style={{ fontSize: 11, color: "#A78BFA", marginBottom: 4 }}>SIMULATED PORTFOLIO REVENUE</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#F9FAFB", fontFamily: "'IBM Plex Mono', monospace" }}>€{totalRevSim.toFixed(2)}B</div>
          <div style={{ fontSize: 11, color: Number(revDelta) >= 0 ? "#34D399" : "#F87171", marginTop: 2 }}>{Number(revDelta) >= 0 ? "▲" : "▼"} {Math.abs(Number(revDelta))}% vs actual</div>
        </div>
        <div style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 10, padding: "12px 20px", flex: 1 }}>
          <div style={{ fontSize: 11, color: "#A78BFA", marginBottom: 4 }}>SIMULATED AVG MARGIN</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#F9FAFB", fontFamily: "'IBM Plex Mono', monospace" }}>{avgMarginSim}%</div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Portfolio weighted average</div>
        </div>
      </div>
    )}
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
      {FINANCIALS.margins.map(m => <StatCard key={m.metric} label={m.metric} value={`${m.value}%`} color={m.value > 30 ? "#34D399" : "#FBBF24"} />)}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>TOTAL REVENUE TREND (€B)</div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={FINANCIALS.revenue}>
            <XAxis dataKey="year" tick={{ fill: "#6B7280", fontSize: 11 }} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} domain={[48, 65]} />
            <Tooltip contentStyle={{ background: "#1F2937", border: "none", borderRadius: 8, color: "#F9FAFB" }} />
            <Line type="monotone" dataKey="total" stroke="#34D399" strokeWidth={3} dot={{ fill: "#34D399", r: 5 }} name="Total (€B)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>COMPETITOR BENCHMARK (€B)</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={FINANCIALS.competitors} layout="vertical">
            <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 10 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: "#D1D5DB", fontSize: 12 }} width={60} />
            <Tooltip contentStyle={{ background: "#1F2937", border: "none", borderRadius: 8, color: "#F9FAFB" }} />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[0,4,4,0]} name="Revenue €B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
  );
};

const BCGPage = ({ effectiveBrands = BRANDS, simEnabled = false }) => {
  const scatter = effectiveBrands.map(b => ({ x: b.marketShare, y: b.categoryGrowth, name: b.name, bcg: b.bcg, size: b.revenue * 10 }));
  return (
    <div>
      <SectionTitle sub="Portfolio mapping by relative market share vs. category growth rate">BCG Growth Matrix {simEnabled && <span style={{ fontSize: 12, color: "#A78BFA", fontWeight: 400 }}>⚡ Simulated</span>}</SectionTitle>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {Object.entries(BCG_COLORS).map(([label, color]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>{label}: {BRANDS.filter(b => b.bcg === label).length}</span>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
        <div style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 8 }}>
            {[["⭐ STARS", "#FBBF24"], ["❓ QUESTION MARKS", "#818CF8"], ["🐄 CASH COWS", "#34D399"], ["🐕 DOGS", "#F87171"]].map(([l, c]) => (
              <div key={l} style={{ background: "rgba(255,255,255,0.02)", border: `1px dashed ${c}33`, borderRadius: 8, padding: "6px 12px", fontSize: 11, color: c, fontWeight: 600, textAlign: "center" }}>{l}</div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <XAxis dataKey="x" name="Market Share %" type="number" tick={{ fill: "#6B7280", fontSize: 10 }} label={{ value: "Relative Market Share %", position: "bottom", fill: "#6B7280", fontSize: 11 }} />
              <YAxis dataKey="y" name="Category Growth %" type="number" tick={{ fill: "#6B7280", fontSize: 10 }} label={{ value: "Category Growth %", angle: -90, position: "insideLeft", fill: "#6B7280", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1F2937", border: "none", borderRadius: 8, color: "#F9FAFB" }} formatter={(v, n) => [v, n]} cursor={{ strokeDasharray: "3 3", stroke: "#374151" }} />
              {Object.entries(BCG_COLORS).map(([label, color]) => (
                <Scatter key={label} name={label} data={scatter.filter(d => d.bcg === label)} fill={color} fillOpacity={0.85} />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const CompetitionPage = () => (
  <div>
    <SectionTitle sub="6-axis competitive benchmarking vs. P&G, Nestlé, and Henkel">Competitive Analysis</SectionTitle>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>6-AXIS RADAR COMPARISON</div>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={COMPETITOR_RADAR}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#9CA3AF" }} />
            <Radar name="Unilever" dataKey="Unilever" stroke="#34D399" fill="#34D399" fillOpacity={0.18} />
            <Radar name="P&G" dataKey="PG" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
            <Radar name="Nestlé" dataKey="Nestle" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} />
            <Radar name="Henkel" dataKey="Henkel" stroke="#818CF8" fill="#818CF8" fillOpacity={0.08} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>COMPETITIVE INTELLIGENCE</div>
        {[["🌱 Sustainability Lead vs All Peers", "Unilever scores 91 on Sustainability — highest of all tracked FMCG companies. Regulatory premium growing as EU Green Claims Directive tightens.", "#34D399"],
          ["🧠 Purpose Moat", "Dove Real Beauty, Knorr Regenerative Agriculture — brand purpose drives pricing power. P&G functional positioning is harder to differentiate at this level.", "#3B82F6"],
          ["🌍 Emerging Market Alpha", "Unilever has 2× the penetration of P&G in India, Indonesia, Nigeria. Surf Excel, Lifebuoy, Pond's are structural moats in high-growth geographies.", "#FBBF24"],
          ["⚔️ Nestlé Food Threat", "Nestlé's Maggi, Nescafé and KitKat ecosystem creates direct category pressure on Knorr and Hellmann's in key growth markets. Premium food innovation is a contested battleground.", "#F87171"],
          ["⚡ Digital Commerce Gap", "Henkel and P&G are outpacing Unilever in D2C and retail media ROI. Platform investment acceleration is Q1 2025 board priority.", "#F472B6"],
        ].map(([t, d, c]) => (
          <div key={t} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: c, marginBottom: 4 }}>{t}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.5 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── DEEP FUNNEL PAGE ────────────────────────────────────────────────────────
const FunnelPage = ({ selectedBrand, setSelectedBrand }) => {
  const [tab, setTab] = useState("classic");
  const brand = BRANDS.find(b => b.id === selectedBrand) || BRANDS[0];
  const fd = brand.funnelDeep;
  const stages = [
    { name: "Awareness", value: brand.awareness },
    { name: "Consideration", value: brand.consideration },
    { name: "Preference", value: brand.preference },
    { name: "Purchase", value: brand.purchase },
    { name: "Loyalty", value: brand.loyalty },
  ];
  const stageColors = ["#3B82F6","#06B6D4","#8B5CF6","#FBBF24","#34D399"];

  const getBiggestDrop = () => {
    let max = 0; let stage = "";
    for (let i = 1; i < stages.length; i++) {
      const d = stages[i-1].value - stages[i].value;
      if (d > max) { max = d; stage = stages[i].name; }
    }
    return { stage, drop: max };
  };

  const segmentData = fd ? [
    { seg: "Gen Z", ...fd.byAge.genZ },
    { seg: "Millennials", ...fd.byAge.millennial },
    { seg: "Gen X", ...fd.byAge.genX },
    { seg: "Boomers", ...fd.byAge.boomer },
  ] : [];

  return (
    <div>
      <SectionTitle sub="AIDA funnel — 3-layer analysis: classic, segment breakdown, root cause diagnosis">Brand Funnel</SectionTitle>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {BRANDS.map(b => (
          <button key={b.id} onClick={() => setSelectedBrand(b.id)}
            style={{ background: selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.05)", border: `1px solid ${selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.1)"}`, color: selectedBrand === b.id ? "#fff" : "#9CA3AF", borderRadius: 6, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>
            {b.name}
          </button>
        ))}
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {[["classic","Classic AIDA"],["segments","Segment Breakdown"],["diagnosis","Root Cause"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ padding: "7px 18px", borderRadius: 7, border: "none", background: tab === id ? "#1D4ED8" : "transparent", color: tab === id ? "#fff" : "#6B7280", fontSize: 12, fontWeight: tab === id ? 700 : 400, cursor: "pointer" }}>
            {label}
          </button>
        ))}
      </div>

      {/* TAB 1: CLASSIC */}
      {tab === "classic" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 20 }}>{brand.name} — Consumer Journey</div>
            {stages.map((s, i) => {
              const drop = i > 0 ? stages[i-1].value - s.value : 0;
              return (
                <div key={s.name} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "#D1D5DB", fontWeight: 600 }}>{s.name}</span>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      {drop > 0 && <span style={{ fontSize: 11, color: "#F87171" }}>−{drop}pp</span>}
                      <span style={{ fontSize: 14, color: stageColors[i], fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{s.value}%</span>
                    </div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6, height: 10 }}>
                    <div style={{ width: `${s.value}%`, background: stageColors[i], height: "100%", borderRadius: 6 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 16 }}>FUNNEL QUICK STATS</div>
            {[["End-to-End Conversion", `${((brand.purchase / brand.awareness) * 100).toFixed(1)}%`, "#FBBF24"],
              ["Consideration→Purchase", `${((brand.purchase / brand.consideration) * 100).toFixed(1)}%`, "#3B82F6"],
              ["Biggest Drop Stage", getBiggestDrop().stage + " (−" + getBiggestDrop().drop + "pp)", "#F87171"],
            ].map(([k, v, c]) => (
              <div key={k} style={{ marginBottom: 14, padding: "12px 16px", background: `${c}0d`, border: `1px solid ${c}22`, borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: "#6B7280" }}>{k}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: c, fontFamily: "'IBM Plex Mono', monospace", marginTop: 4 }}>{v}</div>
              </div>
            ))}
            <div style={{ padding: "12px 16px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: "#34D399", fontWeight: 700 }}>RECOMMENDED ACTION</div>
              <div style={{ fontSize: 12, color: "#D1D5DB", marginTop: 4, lineHeight: 1.5 }}>{brand.action}</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEGMENT BREAKDOWN */}
      {tab === "segments" && (
        <div>
          {fd ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>PURCHASE RATE BY AGE GROUP</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={segmentData.map(d => ({ name: d.seg, purchase: d.purchase, awareness: d.awareness }))}>
                    <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "#1F2937", border: "none", borderRadius: 8, color: "#F9FAFB" }} />
                    <Bar dataKey="awareness" fill="rgba(59,130,246,0.3)" name="Awareness" radius={[3,3,0,0]} />
                    <Bar dataKey="purchase" fill="#FBBF24" name="Purchase" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 14 }}>
                  {segmentData.map(d => (
                    <div key={d.seg} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>{d.seg} full funnel</span>
                        <span style={{ fontSize: 12, color: "#FBBF24", fontFamily: "'IBM Plex Mono', monospace" }}>{((d.purchase / d.awareness) * 100).toFixed(0)}% conv.</span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4, height: 4 }}>
                        <div style={{ width: `${(d.purchase / d.awareness) * 100}%`, background: "#FBBF24", height: "100%", borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 12 }}>PURCHASE BY GENDER</div>
                  {[["Female", fd.byGender.female.purchase, "#F472B6"], ["Male", fd.byGender.male.purchase, "#3B82F6"]].map(([g, v, c]) => (
                    <div key={g} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>{g}</span>
                        <span style={{ fontSize: 14, color: c, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{v}%</span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4, height: 7 }}>
                        <div style={{ width: `${v}%`, background: c, height: "100%", borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 12 }}>PURCHASE BY INCOME TIER</div>
                  {[["High Income", fd.byIncome.high.purchase, "#34D399"], ["Mid Income", fd.byIncome.mid.purchase, "#FBBF24"], ["Low Income", fd.byIncome.low.purchase, "#F87171"]].map(([tier, v, c]) => (
                    <div key={tier} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>{tier}</span>
                        <span style={{ fontSize: 14, color: c, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{v}%</span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4, height: 7 }}>
                        <div style={{ width: `${v}%`, background: c, height: "100%", borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 12, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 14, color: "#FBBF24", marginBottom: 8 }}>Segment data available for: Dove, Omo/Persil, Lux, Sunsilk, Knorr</div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>Select one of those brands to view demographic breakdown, or select another brand for Classic AIDA view.</div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ROOT CAUSE DIAGNOSIS */}
      {tab === "diagnosis" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>BRAND vs CATEGORY BENCHMARK</div>
            {fd ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stages.map((s, i) => ({ stage: s.name.slice(0,4), brand: s.value, benchmark: fd.competitor[s.name.toLowerCase()] || s.value - 5 }))}>
                  <XAxis dataKey="stage" tick={{ fill: "#6B7280", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} domain={[0,100]} />
                  <Tooltip contentStyle={{ background: "#1F2937", border: "none", borderRadius: 8, color: "#F9FAFB" }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="brand" fill={SEGMENTS[brand.category]} name={brand.name} radius={[3,3,0,0]} />
                  <Bar dataKey="benchmark" fill="rgba(107,114,128,0.5)" name="Category Avg" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ fontSize: 12, color: "#6B7280", textAlign: "center", paddingTop: 60 }}>Select Dove, Omo, Lux, Sunsilk or Knorr for benchmark data</div>
            )}
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>DIAGNOSIS & RECOMMENDATIONS</div>
            <div style={{ marginBottom: 14, padding: "12px 16px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#F87171", marginBottom: 6 }}>🔴 PRIMARY BOTTLENECK</div>
              <div style={{ fontSize: 12, color: "#D1D5DB", lineHeight: 1.5 }}>
                {getBiggestDrop().stage} stage has the largest conversion gap at −{getBiggestDrop().drop}pp.
                {getBiggestDrop().stage === "Preference" ? " Likely cause: insufficient brand differentiation vs. alternatives at moment of decision." :
                 getBiggestDrop().stage === "Consideration" ? " Likely cause: low salience or SOV in the category — media investment review required." :
                 getBiggestDrop().stage === "Purchase" ? " Likely cause: distribution or availability gap, or price barrier at shelf." :
                 getBiggestDrop().stage === "Loyalty" ? " Likely cause: weak post-purchase experience or repeat incentive — CRM or loyalty mechanic needed." :
                 " Review brand awareness investment and reach strategy."}
              </div>
            </div>
            {fd && (() => {
              const gaps = stages.map((s, i) => ({
                stage: s.name,
                gap: s.value - (fd.competitor[s.name.toLowerCase()] || s.value)
              })).filter(g => g.gap < 0);
              return gaps.length > 0 ? (
                <div style={{ marginBottom: 14, padding: "12px 16px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#FBBF24", marginBottom: 6 }}>⚠️ COMPETITIVE GAPS</div>
                  {gaps.map(g => (
                    <div key={g.stage} style={{ fontSize: 12, color: "#D1D5DB", marginBottom: 4 }}>{g.stage}: {Math.abs(g.gap)}pp below category average</div>
                  ))}
                </div>
              ) : null;
            })()}
            <div style={{ padding: "12px 16px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#34D399", marginBottom: 6 }}>✅ STRATEGIC RECOMMENDATION</div>
              <div style={{ fontSize: 12, color: "#D1D5DB", lineHeight: 1.5 }}>{brand.action}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── BRAND SIMULATION STUDIO ─────────────────────────────────────────────────
const SimulationStudio = ({ selectedBrand, setSelectedBrand, simState, setSimState, simEnabled, setSimEnabled }) => {
  const baseBrand = BRANDS.find(b => b.id === selectedBrand) || BRANDS[0];

  const [controls, setControls] = useState({ price: 0, marketing: 0, innovation: 5, distribution: 0, cogs: 0 });

  const compute = (b, c) => {
    const volumeMultiplier = 1 + (c.price * b.elasticity / 100);
    const newRevenue = b.revenue * (1 + c.price / 100) * volumeMultiplier;
    const newMargin = Math.max(0, b.margin - c.cogs * 0.6);
    const newAwareness = Math.min(100, Math.round(b.awareness * (1 + c.marketing * 0.12 / 100)));
    const newConsideration = Math.min(100, Math.round(b.consideration * (1 + c.marketing * 0.15 / 100)));
    const newPreference = Math.min(100, Math.round(b.preference + (c.innovation - 5) * 2));
    const newPurchase = Math.min(100, Math.round(b.purchase * (1 + c.distribution * 0.4 / 100)));
    const newLoyalty = Math.min(100, Math.round(b.loyalty + (c.innovation - 5) * 1.5));
    const newProfit = newRevenue * newMargin / 100;
    const baseProfit = b.revenue * b.margin / 100;
    return { newRevenue, newMargin, newAwareness, newConsideration, newPreference, newPurchase, newLoyalty, newProfit, baseProfit };
  };

  const result = compute(baseBrand, controls);

  const resetSim = () => {
    setControls({ price: 0, marketing: 0, innovation: 5, distribution: 0, cogs: 0 });
    setSimEnabled(false);
    setSimState(null);
  };

  const applyGlobally = () => {
    const updated = { ...baseBrand, revenue: Number(result.newRevenue.toFixed(2)), margin: Number(result.newMargin.toFixed(1)), awareness: result.newAwareness, consideration: result.newConsideration, preference: result.newPreference, purchase: result.newPurchase, loyalty: result.newLoyalty };
    setSimState({ brandId: baseBrand.id, data: updated });
    setSimEnabled(true);
  };

  const revDelta = ((result.newRevenue - baseBrand.revenue) / baseBrand.revenue * 100).toFixed(1);
  const profDelta = ((result.newProfit - result.baseProfit) / result.baseProfit * 100).toFixed(1);
  const mgnDelta = (result.newMargin - baseBrand.margin).toFixed(1);

  const sliders = [
    { key: "price", label: "Price Change", min: -20, max: 20, unit: "%", color: "#FBBF24", desc: "Affects volume via elasticity" },
    { key: "marketing", label: "Marketing Investment Δ", min: -30, max: 50, unit: "%", color: "#3B82F6", desc: "Drives Awareness & Consideration" },
    { key: "innovation", label: "Innovation Score", min: 1, max: 10, unit: "/10", color: "#8B5CF6", desc: "Lifts Preference & Loyalty" },
    { key: "distribution", label: "Distribution Width Δ", min: -10, max: 30, unit: "%", color: "#34D399", desc: "Boosts Purchase rate" },
    { key: "cogs", label: "COGS Change", min: -10, max: 30, unit: "%", color: "#F87171", desc: "Compresses gross margin" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <SectionTitle sub="Multi-lever P&L simulator — changes propagate globally to Overview, BCG, and Financials">Brand Simulation Studio</SectionTitle>
        <div style={{ display: "flex", gap: 8 }}>
          {simEnabled && (
            <div style={{ padding: "6px 14px", background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.4)", borderRadius: 8, fontSize: 11, color: "#FBBF24", display: "flex", alignItems: "center", gap: 6 }}>
              <span>⚡</span> Simulation active — other pages show simulated data
            </div>
          )}
          <button onClick={resetSim} style={{ padding: "6px 14px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, fontSize: 11, color: "#F87171", cursor: "pointer" }}>
            Reset
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {BRANDS.map(b => (
          <button key={b.id} onClick={() => { setSelectedBrand(b.id); setControls({ price: 0, marketing: 0, innovation: 5, distribution: 0, cogs: 0 }); setSimEnabled(false); setSimState(null); }}
            style={{ background: selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.05)", border: `1px solid ${selectedBrand === b.id ? SEGMENTS[b.category] : "rgba(255,255,255,0.1)"}`, color: selectedBrand === b.id ? "#fff" : "#9CA3AF", borderRadius: 6, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>
            {b.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* LEFT: CONTROL PANEL */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 4 }}>{baseBrand.name} — Control Panel</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 20 }}>Elasticity: <span style={{ color: "#FBBF24", fontFamily: "'IBM Plex Mono', monospace" }}>{baseBrand.elasticity}</span> · Base Revenue: <span style={{ color: "#34D399", fontFamily: "'IBM Plex Mono', monospace" }}>€{baseBrand.revenue}B</span></div>
          {sliders.map(s => (
            <div key={s.key} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div>
                  <span style={{ fontSize: 12, color: "#D1D5DB", fontWeight: 600 }}>{s.label}</span>
                  <span style={{ fontSize: 10, color: "#4B5563", marginLeft: 8 }}>{s.desc}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: s.color, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {controls[s.key] > 0 && s.key !== "innovation" ? "+" : ""}{controls[s.key]}{s.unit}
                </span>
              </div>
              <input type="range" min={s.min} max={s.max} value={controls[s.key]}
                onChange={e => setControls(prev => ({ ...prev, [s.key]: Number(e.target.value) }))}
                style={{ width: "100%", accentColor: s.color, cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#374151", marginTop: 2 }}>
                <span>{s.min}{s.unit}</span><span>0</span><span>{s.max}{s.unit}</span>
              </div>
            </div>
          ))}
          <button onClick={applyGlobally}
            style={{ width: "100%", padding: "12px", background: "linear-gradient(90deg, #1D4ED8, #7C3AED)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
            ⚡ Apply Simulation Globally
          </button>
        </div>

        {/* RIGHT: IMPACT DASHBOARD */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>P&L IMPACT SUMMARY</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                ["Revenue Δ", (revDelta > 0 ? "+" : "") + revDelta + "%", Number(revDelta) >= 0 ? "#34D399" : "#F87171"],
                ["Profit Δ", (profDelta > 0 ? "+" : "") + profDelta + "%", Number(profDelta) >= 0 ? "#34D399" : "#F87171"],
                ["Margin Δ", (mgnDelta > 0 ? "+" : "") + mgnDelta + "pp", Number(mgnDelta) >= 0 ? "#34D399" : "#F87171"],
                ["New Revenue", `€${result.newRevenue.toFixed(2)}B`, "#FBBF24"],
                ["New Profit", `€${result.newProfit.toFixed(2)}B`, "#FBBF24"],
                ["New Margin", `${result.newMargin.toFixed(1)}%`, "#FBBF24"],
              ].map(([k, v, c]) => (
                <div key={k} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: c, fontFamily: "'IBM Plex Mono', monospace" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 14 }}>FUNNEL IMPACT</div>
            {[
              ["Awareness", baseBrand.awareness, result.newAwareness, "#3B82F6"],
              ["Consideration", baseBrand.consideration, result.newConsideration, "#06B6D4"],
              ["Preference", baseBrand.preference, result.newPreference, "#8B5CF6"],
              ["Purchase", baseBrand.purchase, result.newPurchase, "#FBBF24"],
              ["Loyalty", baseBrand.loyalty, result.newLoyalty, "#34D399"],
            ].map(([stage, base, sim, color]) => {
              const delta = sim - base;
              return (
                <div key={stage} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>{stage}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "#6B7280" }}>{base}%</span>
                      <span style={{ fontSize: 10, color: delta > 0 ? "#34D399" : delta < 0 ? "#F87171" : "#6B7280" }}>{delta > 0 ? "▲" : delta < 0 ? "▼" : "="}{Math.abs(delta)}pp</span>
                      <span style={{ fontSize: 12, color, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{sim}%</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 2 }}>
                    <div style={{ flex: base, background: color + "44", height: 5, borderRadius: 3 }} />
                    <div style={{ flex: Math.max(0, sim - base), background: color, height: 5, borderRadius: 3 }} />
                    <div style={{ flex: 100 - sim, background: "rgba(255,255,255,0.04)", height: 5, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginBottom: 10 }}>REVENUE SENSITIVITY CURVE</div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={[-20,-15,-10,-5,0,5,10,15,20].map(p => {
                const ve = p * baseBrand.elasticity;
                const nr = baseBrand.revenue * (1 + p/100) * (1 + ve/100);
                return { price: p + "%", revenue: Number(nr.toFixed(2)) };
              })}>
                <XAxis dataKey="price" tick={{ fill: "#6B7280", fontSize: 9 }} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 9 }} />
                <Tooltip contentStyle={{ background: "#1F2937", border: "none", borderRadius: 6, fontSize: 11, color: "#F9FAFB" }} formatter={v => ["€" + v + "B"]} />
                <Line type="monotone" dataKey="revenue" stroke={SEGMENTS[baseBrand.category]} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const PerceptionPage = () => {
  return (
    <div>
      <SectionTitle sub="2D brand positioning map — consumer perception vs. competitive landscape">Perception Map</SectionTitle>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 }}>
        <div style={{ position: "relative", height: 420, background: "rgba(255,255,255,0.01)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", fontSize: 11, color: "#4B5563" }}>High Quality / Premium</div>
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", fontSize: 11, color: "#4B5563" }}>Accessible / Value</div>
          <div style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "#4B5563" }}>Traditional</div>
          <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "#4B5563" }}>Modern / Innovative</div>
          {[
            { name: "Dove", x: 62, y: 32, cat: "Personal Care" },
            { name: "Axe/Lynx", x: 72, y: 56, cat: "Personal Care" },
            { name: "Dermalogica", x: 80, y: 20, cat: "Beauty & Wellbeing" },
            { name: "Nutrafol", x: 78, y: 22, cat: "Beauty & Wellbeing" },
            { name: "Liquid I.V.", x: 76, y: 58, cat: "Beauty & Wellbeing" },
            { name: "Lux", x: 70, y: 38, cat: "Beauty & Wellbeing" },
            { name: "Vaseline", x: 54, y: 35, cat: "Beauty & Wellbeing" },
            { name: "Pond's", x: 56, y: 45, cat: "Beauty & Wellbeing" },
            { name: "Pukka", x: 74, y: 28, cat: "Foods" },
            { name: "Magnum", x: 66, y: 30, cat: "Foods" },
            { name: "Maille", x: 78, y: 28, cat: "Foods" },
            { name: "Hellmann's", x: 58, y: 38, cat: "Foods" },
            { name: "Knorr", x: 42, y: 48, cat: "Foods" },
            { name: "Lipton", x: 36, y: 52, cat: "Foods" },
            { name: "Omo/Persil", x: 44, y: 44, cat: "Home Care" },
            { name: "Cif", x: 60, y: 50, cat: "Home Care" },
            { name: "Surf Excel", x: 48, y: 60, cat: "Home Care" },
            { name: "Rexona", x: 62, y: 50, cat: "Personal Care" },
            { name: "Lifebuoy", x: 32, y: 58, cat: "Personal Care" },
            { name: "P&G", x: 72, y: 24, isCompetitor: true },
            { name: "L'Oréal", x: 84, y: 18, isCompetitor: true },
            { name: "Colgate", x: 54, y: 42, isCompetitor: true },
          ].map(b => {
            const color = b.isCompetitor ? "#6B7280" : SEGMENTS[b.cat];
            return (
              <div key={b.name} style={{ position: "absolute", left: `${b.x}%`, top: `${b.y}%`, transform: "translate(-50%, -50%)", textAlign: "center", zIndex: 1 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: b.isCompetitor ? "transparent" : color, margin: "0 auto 3px", border: b.isCompetitor ? `2px dashed #6B7280` : `2px solid ${color}88` }} />
                <div style={{ fontSize: 9, color: b.isCompetitor ? "#4B5563" : color, fontWeight: 600, whiteSpace: "nowrap", textShadow: "0 1px 3px #0D1117" }}>{b.name}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
          {Object.entries(SEGMENTS).map(([seg, color]) => (
            <div key={seg} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
              <span style={{ fontSize: 11, color: "#6B7280" }}>{seg}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", border: "2px dashed #6B7280" }} />
            <span style={{ fontSize: 11, color: "#6B7280" }}>Competitors</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CountryPage = () => {
  const [selected, setSelected] = useState(0);
  const country = COUNTRIES[selected];
  return (
    <div>
      <SectionTitle sub="Deep-dive market intelligence for 10 priority geographies">Country Analytics</SectionTitle>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {COUNTRIES.map((c, i) => (
          <button key={c.name} onClick={() => setSelected(i)}
            style={{ background: selected === i ? "#3B82F6" : "rgba(255,255,255,0.05)", border: `1px solid ${selected === i ? "#3B82F6" : "rgba(255,255,255,0.1)"}`, color: selected === i ? "#fff" : "#9CA3AF", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            {c.flag} {c.name}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>{country.flag} <span style={{ fontWeight: 700, fontSize: 18, color: "#F9FAFB" }}>{country.name}</span></div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 20 }}>GDP: ${country.gdp}T</div>
          {[["Market Penetration", country.penetration, "#3B82F6"], ["Premium Readiness", country.premium, "#8B5CF6"], ["Digital Commerce", country.digital, "#06B6D4"], ["Sustainability Index", country.sustainability, "#10B981"], ["Brand Loyalty", country.loyalty, "#FBBF24"], ["Growth Potential", country.growth, "#F472B6"]].map(([k, v, c]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>{k}</span>
                <span style={{ fontSize: 12, color: c, fontWeight: 700 }}>{v}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6 }}>
                <div style={{ width: `${v}%`, background: c, height: "100%", borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 }}>
          {[["🎯 Strategic Opportunity", country.opportunity, "#34D399"], ["⚠️ Key Threat", country.threat, "#F87171"], ["🏮 Cultural Code", country.culture, "#FBBF24"], ["🧠 Consumer Psychology", country.psychology, "#818CF8"]].map(([label, value, color]) => (
            <div key={label} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.6 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ESGPage = () => (
  <div>
    <SectionTitle sub="Progress against Unilever's 2030 Sustainability Commitments">ESG Dashboard</SectionTitle>
    <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
      {[["Net Zero Target", "2039", "#34D399"], ["Plastics Reduced", "32%", "#3B82F6"], ["Renewable Energy", "74%", "#FBBF24"], ["Sustainable Sourcing", "68%", "#8B5CF6"]].map(([k, v, c]) => (
        <StatCard key={k} label={k} value={v} color={c} />
      ))}
    </div>
    {Object.entries(ESG_DATA).map(([category, metrics]) => (
      <div key={category} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>{category}</div>
        {metrics.map(m => {
          const pct = m.direction === "higher" ? Math.min((m.current / m.target) * 100, 100) : Math.max(100 - (m.current / m.base) * 100, 0);
          return (
            <div key={m.kpi} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#D1D5DB" }}>{m.kpi}</span>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#6B7280" }}>Target: {m.target}{m.unit}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#34D399", fontFamily: "'IBM Plex Mono', monospace" }}>{m.current.toLocaleString()}{m.unit}</span>
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6, height: 8 }}>
                <div style={{ width: `${pct}%`, background: "linear-gradient(90deg, #34D399, #3B82F6)", height: "100%", borderRadius: 6 }} />
              </div>
              <div style={{ fontSize: 10, color: "#6B7280", marginTop: 3 }}>{pct.toFixed(0)}% toward target</div>
            </div>
          );
        })}
      </div>
    ))}
  </div>
);

const PersonaPage = () => {
  const personaData = [
    ["18-35","Self-expression","Authenticity","Ingredient skepticism"],
    ["28-50","Cleanliness","Family care","Private label"],
    ["22-38","Glamour","Aspiration","Aging perception"],
    ["20-40","Hair health","Confidence","Premium gap"],
    ["30-55","Cooking joy","Family bond","Clean label trend"],
    ["25-45","Taste pleasure","Nostalgia","Health shift"],
    ["35-60","Wellness ritual","Comfort","Energy drink shift"],
    ["18-40","Active performance","Confidence","Natural trend"],
    ["22-38","Style authority","Salon quality","Mid-tier squeeze"],
    ["16-30","Identity & cool","Belonging","Old perception"],
    ["25-55","Skin healing","Trust & care","Petroleum backlash"],
    ["20-45","Skin brightening","Beauty ideal","K-beauty disruption"],
    ["18-40","Sensitivity care","Gentleness","Indie clean brands"],
    ["30-55","Hair science","Evidence-based","Regulatory risk"],
    ["18-40","Family hygiene","Safety","Commoditization"],
    ["16-28","Fresh & confident","Romance","Whitening competition"],
    ["25-55","Family oral care","Dentist trust","Electric brushes"],
    ["28-50","Powerful clean","Home pride","Eco-format shift"],
    ["25-50","Germ-free home","Family protection","Green trend"],
    ["28-55","Softness & scent","Care & nurture","Format complexity"],
    ["22-50","Tough on stains","Family love","E-commerce private label"],
    ["18-45","Indulgence","Pleasure","Health trend"],
    ["22-45","Values & ethics","Activism","Corporate tension"],
    ["30-60","Gourmet taste","Heritage","Geographic limits"],
    ["28-55","Wellness ritual","Holistic health","Category crowding"],
    ["35-65","Traditional comfort","Heritage","Youth relevance"],
    ["25-45","Nutrition & energy","Health growth","Malt perception"],
    ["18-40","Performance sport","Active identity","Natural competition"],
    ["30-55","Clinical results","Expert trust","Exclusivity risk"],
    ["20-40","Hydration & energy","Active lifestyle","Startup competition"],
  ];

  return (
    <div>
      <SectionTitle sub="Buyer persona atlas — demographics, psychographics and emotional connection across 30 brands">Persona Atlas</SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {["Brand", "Segment", "Age Range", "NPS", "Primary Driver", "Emotional Bond", "Key Risk", "CLV €"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#6B7280", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BRANDS.map((b, i) => {
              const p = personaData[i] || ["25-45","Quality","Trust","Competition"];
              return (
                <tr key={b.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: "#F9FAFB" }}>{b.name}</td>
                  <td style={{ padding: "12px 14px" }}><Badge text={b.category} color={SEGMENTS[b.category]} /></td>
                  <td style={{ padding: "12px 14px", color: "#9CA3AF", fontFamily: "'IBM Plex Mono', monospace" }}>{p[0]}</td>
                  <td style={{ padding: "12px 14px", color: b.nps > 70 ? "#34D399" : b.nps > 55 ? "#FBBF24" : "#F87171", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{b.nps}</td>
                  <td style={{ padding: "12px 14px", color: "#D1D5DB" }}>{p[1]}</td>
                  <td style={{ padding: "12px 14px", color: "#9CA3AF" }}>{p[2]}</td>
                  <td style={{ padding: "12px 14px", color: "#F87171", fontSize: 11 }}>{p[3]}</td>
                  <td style={{ padding: "12px 14px", color: "#FBBF24", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{b.clv}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// ─── ANALYTICS ENGINE (Rule-based, data-driven) ───────────────────────────────

const generateQueries = (brands) => {
  const queries = [];

  // 1. Negative USG
  const negUSG = brands.filter(b => b.usg < 0);
  negUSG.forEach(b => queries.push({
    id: `usg-neg-${b.id}`, level: "Critical", category: "Growth",
    brand: b.name, metric: `USG: ${b.usg}%`,
    question: `${b.name} organic growth turned negative (${b.usg}%). Category average is ${(brands.filter(x=>x.category===b.category).reduce((s,x)=>s+x.usg,0)/brands.filter(x=>x.category===b.category).length).toFixed(1)}%. Is this structural or temporary?`,
    diagnostic: `While other brands in ${b.category} show positive USG trends, ${b.name} is the sole negative performer. This signals in-category share loss, competitor gains, or a fundamental shift in consumer behavior.`,
    probe: ["Is there evidence of category-level share loss vs. competitor gains?", "Has price-pack architecture been reviewed recently?", "Are there distribution gaps in key markets?"]
  }));

  // 2. Low NPS brands (>15pts below category average)
  const categoryNPS = {};
  brands.forEach(b => {
    if (!categoryNPS[b.category]) categoryNPS[b.category] = [];
    categoryNPS[b.category].push(b.nps);
  });
  brands.forEach(b => {
    const catAvg = categoryNPS[b.category].reduce((s,v)=>s+v,0) / categoryNPS[b.category].length;
    if (b.nps < catAvg - 15) queries.push({
      id: `nps-low-${b.id}`, level: "Warning", category: "Consumer Experience",
      brand: b.name, metric: `NPS: ${b.nps} (avg: ${catAvg.toFixed(0)})`,
      question: `${b.name} NPS is ${(catAvg - b.nps).toFixed(0)} points below category average. Is the root cause product quality, brand perception, or pricing?`,
      diagnostic: `Category average NPS is ${catAvg.toFixed(0)} while ${b.name} sits at only ${b.nps}. This gap will accelerate customer attrition if not addressed within the next planning cycle.`,
      probe: ["Has post-purchase NPS surveying been conducted?", "Have top negative review themes been analyzed?", "Has a competitor NPS benchmark been completed?"]
    });
  });

  // 3. High awareness, low conversion (awareness-purchase gap > 50pts)
  brands.forEach(b => {
    const gap = b.awareness - b.purchase;
    if (gap > 50) queries.push({
      id: `funnel-gap-${b.id}`, level: "Warning", category: "Funnel Efficiency",
      brand: b.name, metric: `Gap: ${gap}pp (A:${b.awareness}% → P:${b.purchase}%)`,
      question: `${b.name} has a ${gap}pp awareness-to-purchase gap. Where is conversion breaking down — consideration, preference, or shelf access?`,
      diagnostic: `A large awareness pool (${b.awareness}%) isn't converting to revenue. The key breakpoint is the consideration→preference transition (${b.consideration - b.preference}pp drop), indicating brand loss at the moment of choice.`,
      probe: ["How does consideration→preference conversion compare to category average?", "Has a price-value perception study been conducted?", "Are shelf visibility and pack appeal metrics being tracked?"]
    });
  });

  // 4. High growth but low awareness (unscaled opportunity)
  brands.forEach(b => {
    if (b.usg > 10 && b.awareness < 50) queries.push({
      id: `scale-opp-${b.id}`, level: "Opportunity", category: "Scale Potential",
      brand: b.name, metric: `USG: +${b.usg}% | Awareness: ${b.awareness}%`,
      question: `${b.name} has strong growth momentum (+${b.usg}% USG) but awareness is only ${b.awareness}%. Is this a scaling opportunity or a natural niche ceiling?`,
      diagnostic: `Current growth comes from a constrained consumer base. If awareness scales from ${b.awareness}% to 70% while maintaining conversion rates, revenue could grow by approximately ${((70/b.awareness-1)*100).toFixed(0)}%.`,
      probe: ["Is the core buyer profile fully defined?", "Is there a channel model ready for awareness investment?", "Can the premium price point hold at broader audience scale?"]
    });
  });

  // 5. Margin erosion risk (low margin + high elasticity)
  brands.forEach(b => {
    if (b.margin < 25 && Math.abs(b.elasticity) > 1.3) queries.push({
      id: `margin-risk-${b.id}`, level: "Critical", category: "Profitability",
      brand: b.name, metric: `Margin: ${b.margin}% | Elast: ${b.elasticity}`,
      question: `${b.name} has a dangerous combination of low margin (${b.margin}%) and high price elasticity (${b.elasticity}). How can price defense be sustained?`,
      diagnostic: `High price elasticity means any price increase will cause significant volume loss. The ${b.margin}% margin leaves limited operational leverage for investment or defense.`,
      probe: ["Is there a COGS reduction roadmap in place?", "Can a premium sub-segment be created?", "Is innovation velocity sufficient to counter private label pressure?"]
    });
  });

  // 6. BCG mismatch (Star brand with low NPS)
  brands.forEach(b => {
    if (b.bcg === "Star" && b.nps < 55) queries.push({
      id: `bcg-nps-${b.id}`, level: "Warning", category: "Portfolio Strategy",
      brand: b.name, metric: `BCG: Star | NPS: ${b.nps}`,
      question: `${b.name} is classified as a BCG Star but has below-average NPS (${b.nps}). Is growth driven by volume or pricing power?`,
      diagnostic: `A Star brand with low NPS represents fragile growth — scaling without customer satisfaction risks loyalty erosion and long-term churn acceleration.`,
      probe: ["Has volume vs. price contribution been disaggregated?", "Is repeat purchase rate being monitored?", "Is there a loyalty mechanic in place?"]
    });
  });

  return queries.slice(0, 12); // Max 12 queries
};

const generateRecommendations = (brands) => {
  const recs = [];

  // Critical intervention brands
  const criticalBrands = brands.filter(b => b.usg < 1 || b.nps < 50);
  criticalBrands.forEach(b => {
    const actions = [];
    if (b.usg < 0) actions.push({ type: "Pricing", text: `Rebalance price-volume equation: test ${b.elasticity > -1.2 ? "cautious" : "aggressive"} promotional mechanics across key markets`, priority: "P1" });
    if (b.nps < 50) actions.push({ type: "CX", text: `NPS rescue plan: identify top 3 complaint themes within 30 days and determine whether product fix or comms fix is needed`, priority: "P1" });
    if (b.awareness - b.purchase > 45) actions.push({ type: "Funnel", text: `Conversion audit: take awareness→purchase breakpoint into field research; launch shopper study within 60 days`, priority: "P1" });
    if (actions.length > 0) recs.push({ brand: b.name, category: b.category, bcg: b.bcg, status: "critical", horizon: "0–90 Days", actions });
  });

  // Growth opportunities
  const growthBrands = brands.filter(b => b.usg > 8 && b.margin > 35);
  growthBrands.forEach(b => {
    recs.push({
      brand: b.name, category: b.category, bcg: b.bcg, status: "opportunity", horizon: "3–12 Months",
      actions: [
        { type: "Scale", text: `Support ${b.name}'s growth momentum with geographic expansion: ${b.markets.filter(m=>m[2]==="🟢").length} green markets confirmed, increase media in ${b.markets.filter(m=>m[2]==="🟡").length} amber markets`, priority: "P2" },
        { type: "Portfolio", text: `Evaluate premium sub-segment or adjacent category launch: use CLV €${b.clv} as base to build LTV expansion model`, priority: "P2" },
        { type: "D2C", text: `High margin structure (${b.margin}%) makes this brand suitable for D2C — pilot a subscription model to increase CLV`, priority: "P3" }
      ]
    });
  });

  // Defensive Cash Cows
  const cashCows = brands.filter(b => b.bcg === "Cash Cow" && b.usg < 3);
  cashCows.forEach(b => {
    recs.push({
      brand: b.name, category: b.category, bcg: b.bcg, status: "defense", horizon: "6–18 Months",
      actions: [
        { type: "Defend", text: `Accelerate innovation roadmap to counter private label and competitor pressure: current ${b.usg}% growth is not sustainable for a Cash Cow`, priority: "P2" },
        { type: "Efficiency", text: `COGS optimization to redirect freed-up margin toward brand reinvestment (current margin: ${b.margin}%)`, priority: "P2" }
      ]
    });
  });

  return recs;
};

const generateBrainInsights = (brands) => {
  const totalRev = brands.reduce((s,b)=>s+b.revenue,0);
  const avgUSG = brands.reduce((s,b)=>s+b.usg,0)/brands.length;
  const avgNPS = brands.reduce((s,b)=>s+b.nps,0)/brands.length;
  const avgMargin = brands.reduce((s,b)=>s+b.margin,0)/brands.length;

  const stars = brands.filter(b=>b.bcg==="Star");
  const cashCows = brands.filter(b=>b.bcg==="Cash Cow");
  const qMarks = brands.filter(b=>b.bcg==="Question Mark");

  const topUSG = [...brands].sort((a,b)=>b.usg-a.usg).slice(0,3);
  const bottomUSG = [...brands].sort((a,b)=>a.usg-b.usg).slice(0,3);
  const topCLV = [...brands].sort((a,b)=>b.clv-a.clv).slice(0,3);
  const topMargin = [...brands].sort((a,b)=>b.margin-a.margin).slice(0,3);

  const categoryPerf = {};
  brands.forEach(b=>{
    if(!categoryPerf[b.category]) categoryPerf[b.category]={rev:0,usg:0,count:0,nps:0};
    categoryPerf[b.category].rev+=b.revenue;
    categoryPerf[b.category].usg+=b.usg;
    categoryPerf[b.category].nps+=b.nps;
    categoryPerf[b.category].count++;
  });

  return {
    portfolio: { totalRev, avgUSG, avgNPS, avgMargin, starCount: stars.length, cashCowCount: cashCows.length, qMarkCount: qMarks.length },
    topUSG, bottomUSG, topCLV, topMargin,
    categoryPerf,
    keyFindings: [
      {
        icon: "🚀", title: "Growth Engines",
        finding: `Portfolio growth leaders: ${topUSG.map(b=>`${b.name} (+${b.usg}%)`).join(", ")}. These 3 brands represent ${((topUSG.reduce((s,b)=>s+b.revenue,0)/totalRev)*100).toFixed(0)}% of total portfolio revenue.`,
        signal: "positive"
      },
      {
        icon: "⚠️", title: "Growth Drags",
        finding: `${bottomUSG.map(b=>`${b.name} (${b.usg}%)`).join(", ")} are pulling down portfolio-wide growth. Immediate intervention plans required.`,
        signal: "negative"
      },
      {
        icon: "💎", title: "CLV Champions",
        finding: `Highest Customer Lifetime Value: ${topCLV.map(b=>`${b.name} (€${b.clv})`).join(", ")}. These brands should receive priority investment in premium CRM and subscription model pilots.`,
        signal: "positive"
      },
      {
        icon: "📊", title: "Margin Leaders",
        finding: `Highest margin brands: ${topMargin.map(b=>`${b.name} (${b.margin}%)`).join(", ")}. Portfolio average margin is ${avgMargin.toFixed(1)}% — these brands are driving premium mix expansion.`,
        signal: "positive"
      },
      {
        icon: "🔄", title: "Portfolio Balance",
        finding: `${stars.length} Stars, ${cashCows.length} Cash Cows, ${qMarks.length} Question Marks. ${cashCows.length > stars.length ? "Cash Cow dominance may threaten future growth investment capacity." : "Star-heavy portfolio maintains strong growth dynamics."}`,
        signal: cashCows.length > stars.length ? "warning" : "positive"
      },
      {
        icon: "🌍", title: "Category Dynamics",
        finding: (() => {
          const sorted = Object.entries(categoryPerf).sort((a,b)=>(b[1].usg/b[1].count)-(a[1].usg/a[1].count));
          return `Fastest growing category: ${sorted[0][0]} (avg ${(sorted[0][1].usg/sorted[0][1].count).toFixed(1)}% USG). Slowest: ${sorted[sorted.length-1][0]} (avg ${(sorted[sorted.length-1][1].usg/sorted[sorted.length-1][1].count).toFixed(1)}% USG).`;
        })(),
        signal: "neutral"
      }
    ]
  };
};

// ─── Q&A QUESTION BANK ────────────────────────────────────────────────────────

const QA_QUESTIONS = [
  {
    id: "q1", topic: "Growth",
    question: "Which brands are at highest risk of market share loss?",
    rule: "Rule: USG < 2% AND NPS < 55 → High Risk",
    answer: (brands) => {
      const risk = brands.filter(b => b.usg < 2 && b.nps < 55).sort((a,b) => a.usg - b.usg);
      return {
        headline: `${risk.length} brands identified at high market share risk`,
        body: risk.length > 0
          ? risk.map(b => `• ${b.name} (USG: ${b.usg}%, NPS: ${b.nps}) — ${b.risk}`).join("\n")
          : "No brands currently at high risk based on available data.",
        dataPoints: risk.map(b => ({ label: b.name, value: b.usg < 0 ? 0 : b.usg, color: "#F87171" })),
        followUp: ["What actions are required for the top risk brand?", "Which category has the most at-risk brands?"]
      };
    }
  },
  {
    id: "q2", topic: "Funnel",
    question: "Where is the biggest funnel efficiency gap across the portfolio?",
    rule: "Rule: Max(Awareness − Purchase) across all brands",
    answer: (brands) => {
      const sorted = [...brands].sort((a,b) => (b.awareness - b.purchase) - (a.awareness - a.purchase));
      const top3 = sorted.slice(0, 3);
      return {
        headline: `${top3[0].name} has the largest awareness-to-purchase gap at ${top3[0].awareness - top3[0].purchase}pp`,
        body: top3.map(b => `• ${b.name}: ${b.awareness}% awareness → ${b.purchase}% purchase (${b.awareness - b.purchase}pp loss)\n  Action: ${b.action}`).join("\n\n"),
        dataPoints: top3.map(b => ({ label: b.name, value: b.awareness - b.purchase, color: "#FBBF24" })),
        followUp: ["What is the consideration→preference drop for the top gap brand?", "Which funnel stage shows the most consistent drop across all brands?"]
      };
    }
  },
  {
    id: "q3", topic: "Investment",
    question: "Which brands need emergency investment in the next 90 days?",
    rule: "Rule: USG < 0 OR NPS < 48 → P1 Emergency",
    answer: (brands) => {
      const emergency = brands.filter(b => b.usg < 0 || b.nps < 48);
      return {
        headline: `${emergency.length} brand${emergency.length !== 1 ? "s" : ""} require P1 emergency investment`,
        body: emergency.map(b => `• ${b.name} — ${b.usg < 0 ? `Negative growth (${b.usg}%)` : ""}${b.nps < 48 ? ` Critical NPS (${b.nps})` : ""}\n  Action: ${b.action}`).join("\n\n"),
        dataPoints: emergency.map(b => ({ label: b.name, value: b.nps, color: "#F87171" })),
        followUp: ["What is the recommended spend allocation for emergency brands?", "Which competitive moves triggered these declines?"]
      };
    }
  },
  {
    id: "q4", topic: "Profitability",
    question: "Which category has the best revenue-to-margin ratio?",
    rule: "Rule: Category with highest (Total Revenue × Avg Margin) score",
    answer: (brands) => {
      const cats = {};
      brands.forEach(b => {
        if (!cats[b.category]) cats[b.category] = { rev: 0, margin: 0, count: 0 };
        cats[b.category].rev += b.revenue;
        cats[b.category].margin += b.margin;
        cats[b.category].count++;
      });
      const scored = Object.entries(cats).map(([cat, d]) => ({
        cat, score: d.rev * (d.margin / d.count), rev: d.rev, margin: d.margin / d.count
      })).sort((a,b) => b.score - a.score);
      return {
        headline: `${scored[0].cat} leads with €${scored[0].rev.toFixed(1)}B revenue at ${scored[0].margin.toFixed(1)}% avg margin`,
        body: scored.map(s => `• ${s.cat}: €${s.rev.toFixed(1)}B revenue × ${s.margin.toFixed(1)}% margin = score ${s.score.toFixed(1)}`).join("\n"),
        dataPoints: scored.map(s => ({ label: s.cat, value: Math.round(s.margin), color: "#34D399" })),
        followUp: ["Which brands in this category are dragging down the average margin?", "How does this compare to P&G category margin structure?"]
      };
    }
  },
  {
    id: "q5", topic: "Loyalty",
    question: "Where does consumer loyalty break down the most?",
    rule: "Rule: Brands with Purchase > Loyalty + 5pp (post-purchase churn signal)",
    answer: (brands) => {
      const loyaltyGap = brands.filter(b => b.purchase > b.loyalty + 5).sort((a,b) => (b.purchase - b.loyalty) - (a.purchase - a.loyalty));
      return {
        headline: `${loyaltyGap.length} brands show post-purchase loyalty deficits`,
        body: loyaltyGap.length > 0
          ? loyaltyGap.map(b => `• ${b.name}: Purchase ${b.purchase}% → Loyalty ${b.loyalty}% (−${b.purchase - b.loyalty}pp churn signal)`).join("\n")
          : "All brands maintain healthy loyalty relative to purchase rates.",
        dataPoints: loyaltyGap.slice(0,5).map(b => ({ label: b.name, value: b.loyalty, color: "#818CF8" })),
        followUp: ["What loyalty mechanics are currently in place?", "Is there a CLV difference between loyal vs. occasional buyers?"]
      };
    }
  },
  {
    id: "q6", topic: "Growth",
    question: "Which emerging brands have the highest untapped growth potential?",
    rule: "Rule: USG > 10% AND CLV > 300 AND Awareness < 55% → High Potential",
    answer: (brands) => {
      const potential = brands.filter(b => b.usg > 10 && b.clv > 300 && b.awareness < 55).sort((a,b) => b.usg - a.usg);
      return {
        headline: `${potential.length} brands identified as high-potential scale plays`,
        body: potential.length > 0
          ? potential.map(b => `• ${b.name}: USG +${b.usg}% | CLV €${b.clv} | Awareness ${b.awareness}%\n  Scale action: ${b.action}`).join("\n\n")
          : "No brands meet all three high-potential criteria simultaneously.",
        dataPoints: potential.map(b => ({ label: b.name, value: b.usg, color: "#34D399" })),
        followUp: ["What is the cost of awareness investment for the top brand?", "Which geographic markets offer the fastest awareness scaling?"]
      };
    }
  },
  {
    id: "q7", topic: "Portfolio",
    question: "What is the overall portfolio health assessment?",
    rule: "Rule: Composite score of USG, NPS, Margin and BCG distribution",
    answer: (brands) => {
      const avgUSG = (brands.reduce((s,b) => s+b.usg,0)/brands.length).toFixed(1);
      const avgNPS = (brands.reduce((s,b) => s+b.nps,0)/brands.length).toFixed(0);
      const avgMargin = (brands.reduce((s,b) => s+b.margin,0)/brands.length).toFixed(1);
      const stars = brands.filter(b=>b.bcg==="Star").length;
      const watch = brands.filter(b=>b.status==="Watch").length;
      const health = Number(avgUSG) > 4 && Number(avgNPS) > 60 ? "Strong" : Number(avgUSG) > 2 ? "Moderate" : "At Risk";
      return {
        headline: `Portfolio health: ${health} — Avg USG ${avgUSG}%, Avg NPS ${avgNPS}`,
        body: `• Avg Organic Growth: ${avgUSG}% (target: >5%)\n• Avg NPS: ${avgNPS} (benchmark: 60+)\n• Avg Gross Margin: ${avgMargin}%\n• BCG Stars: ${stars}/30 brands\n• Watch-status brands: ${watch} requiring active monitoring`,
        dataPoints: [
          { label: "Avg USG %", value: Number(avgUSG), color: "#34D399" },
          { label: "Avg NPS", value: Number(avgNPS) / 10, color: "#818CF8" },
          { label: "Avg Margin", value: Number(avgMargin), color: "#FBBF24" }
        ],
        followUp: ["Which portfolio segment is underperforming the most?", "How does this compare to prior year portfolio health?"]
      };
    }
  },
  {
    id: "q8", topic: "Geography",
    question: "Which markets offer the highest revenue opportunity for expansion?",
    rule: "Rule: COUNTRIES sorted by Growth Potential × Digital Commerce readiness",
    answer: () => {
      const ranked = [...COUNTRIES].sort((a,b) => (b.growth * b.digital) - (a.growth * a.digital)).slice(0,5);
      return {
        headline: `${ranked[0].name} ${ranked[0].flag} leads with growth score ${ranked[0].growth} × digital index ${ranked[0].digital}`,
        body: ranked.map((c,i) => `${i+1}. ${c.flag} ${c.name}: Growth ${c.growth} | Digital ${c.digital}\n   Opportunity: ${c.opportunity}`).join("\n\n"),
        dataPoints: ranked.map(c => ({ label: c.name, value: c.growth, color: "#3B82F6" })),
        followUp: ["Which Unilever brands are currently underweight in the #1 market?", "What are the top barriers to entry in this market?"]
      };
    }
  },
];

// ─── AI ANALYST PAGE (Rule-based, 4 Modules) ─────────────────────────────────

const AIAnalystPage = () => {
  const [activeTab, setActiveTab] = useState("insights");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [selectedRec, setSelectedRec] = useState(null);
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [selectedQA, setSelectedQA] = useState(null);
  const [filterTopic, setFilterTopic] = useState("all");

  const queries = generateQueries(BRANDS);
  const recommendations = generateRecommendations(BRANDS);
  const brainInsights = generateBrainInsights(BRANDS);

  const levelColors = { Critical: "#F87171", Warning: "#FBBF24", Opportunity: "#34D399" };
  const statusColors = { critical: "#F87171", opportunity: "#34D399", defense: "#FBBF24" };
  const statusLabels = { critical: "Emergency Action", opportunity: "Growth Opportunity", defense: "Defensive Play" };
  const signalColors = { positive: "#34D399", negative: "#F87171", warning: "#FBBF24", neutral: "#60A5FA" };
  const topicColors = { Growth: "#34D399", Funnel: "#FBBF24", Investment: "#F87171", Profitability: "#10B981", Loyalty: "#818CF8", Portfolio: "#3B82F6", Geography: "#06B6D4" };

  const filteredQueries = queries.filter(q =>
    (filterLevel === "all" || q.level === filterLevel) &&
    (filterCat === "all" || q.category === filterCat)
  );

  const uniqueCategories = [...new Set(queries.map(q => q.category))];
  const uniqueTopics = [...new Set(QA_QUESTIONS.map(q => q.topic))];
  const filteredQA = QA_QUESTIONS.filter(q => filterTopic === "all" || q.topic === filterTopic);

  return (
    <div>
      <SectionTitle sub="Rule-based query engine · Action plan system · Portfolio insight analysis">
        Analytics Engine
      </SectionTitle>

      {/* KPI Strip */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Critical Signals" value={queries.filter(q=>q.level==="Critical").length} sub="Immediate action" color="#F87171" />
        <StatCard label="Warnings" value={queries.filter(q=>q.level==="Warning").length} sub="Within 30 days" color="#FBBF24" />
        <StatCard label="Opportunities" value={queries.filter(q=>q.level==="Opportunity").length} sub="Growth signals" color="#34D399" />
        <StatCard label="Action Plans" value={recommendations.length} sub="Strategic playbooks" color="#818CF8" />
        <StatCard label="Portfolio Health" value={`${brainInsights.portfolio.avgUSG.toFixed(1)}%`} sub="Avg USG" color="#60A5FA" />
      </div>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 5, width: "fit-content" }}>
        {[["insights","📊 Portfolio Insights","#60A5FA"],["query","🔍 Smart Query","#FBBF24"],["recs","💡 Action Plans","#818CF8"],["qa","❓ Q&A","#34D399"]].map(([id, label, color]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: activeTab === id ? `${color}22` : "transparent", color: activeTab === id ? color : "#6B7280", fontSize: 13, fontWeight: activeTab === id ? 700 : 400, cursor: "pointer", borderBottom: activeTab === id ? `2px solid ${color}` : "2px solid transparent", transition: "all 0.15s" }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── PORTFOLIO INSIGHTS MODULE ─────────────────────────────────────── */}
      {activeTab === "insights" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
            {[
              ["Total Revenue", `€${brainInsights.portfolio.totalRev.toFixed(1)}B`, "#34D399"],
              ["Avg NPS", brainInsights.portfolio.avgNPS.toFixed(0), "#818CF8"],
              ["Avg Margin", `${brainInsights.portfolio.avgMargin.toFixed(1)}%`, "#FBBF24"],
              ["Star Brands", `${brainInsights.portfolio.starCount}/30`, "#60A5FA"],
            ].map(([l,v,c]) => (
              <div key={l} style={{ background: `${c}0f`, border: `1px solid ${c}30`, borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>{l}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: c, fontFamily: "'IBM Plex Mono', monospace" }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {brainInsights.keyFindings.map((f, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${signalColors[f.signal]}25`, borderLeft: `4px solid ${signalColors[f.signal]}`, borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>{f.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#F9FAFB" }}>{f.title}</span>
                  <span style={{ marginLeft: "auto", fontSize: 9, color: signalColors[f.signal], background: `${signalColors[f.signal]}18`, padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>{f.signal.toUpperCase()}</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#C9D1D9", lineHeight: 1.7 }}>{f.finding}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.07em" }}>Category Performance Comparison</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    {["Category", "Brands", "Total Revenue", "Avg USG", "Avg NPS", "Avg Margin", "Status"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 14px", color: "#6B7280", fontSize: 11, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.07)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(brainInsights.categoryPerf).map(([cat, data]) => {
                    const avgUSG = data.usg / data.count;
                    const avgNPS = data.nps / data.count;
                    const perf = avgUSG > 5 ? { label: "Strong", color: "#34D399" } : avgUSG > 2 ? { label: "Moderate", color: "#FBBF24" } : { label: "Weak", color: "#F87171" };
                    return (
                      <tr key={cat} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "12px 14px" }}><Badge text={cat} color={SEGMENTS[cat]} /></td>
                        <td style={{ padding: "12px 14px", color: "#9CA3AF", fontFamily: "'IBM Plex Mono', monospace" }}>{data.count}</td>
                        <td style={{ padding: "12px 14px", color: "#34D399", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>€{data.rev.toFixed(1)}B</td>
                        <td style={{ padding: "12px 14px", color: avgUSG > 0 ? "#34D399" : "#F87171", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>{avgUSG.toFixed(1)}%</td>
                        <td style={{ padding: "12px 14px", color: "#818CF8", fontFamily: "'IBM Plex Mono', monospace" }}>{avgNPS.toFixed(0)}</td>
                        <td style={{ padding: "12px 14px", color: "#FBBF24", fontFamily: "'IBM Plex Mono', monospace" }}>{(BRANDS.filter(b=>b.category===cat).reduce((s,b)=>s+b.margin,0)/data.count).toFixed(1)}%</td>
                        <td style={{ padding: "12px 14px" }}><Badge text={perf.label} color={perf.color} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#34D399", marginBottom: 14 }}>🏆 Top CLV Brands</div>
              {brainInsights.topCLV.map((b, i) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: i===0?"#FBBF24":i===1?"#9CA3AF":"#92400E", display:"flex", alignItems:"center", justifyContent:"center", fontSize: 11, fontWeight: 800, color: "#0D1117", flexShrink: 0 }}>{i+1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#F9FAFB", fontWeight: 600 }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{b.category}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#34D399", fontFamily: "'IBM Plex Mono', monospace" }}>€{b.clv}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#F87171", marginBottom: 14 }}>⚡ Lowest USG Brands</div>
              {brainInsights.bottomUSG.map((b, i) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize: 11, fontWeight: 800, color: "#F87171", flexShrink: 0 }}>{i+1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#F9FAFB", fontWeight: 600 }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{b.category} · {b.bcg}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: b.usg < 0 ? "#F87171" : "#FBBF24", fontFamily: "'IBM Plex Mono', monospace" }}>{b.usg > 0 ? "+" : ""}{b.usg}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SMART QUERY MODULE ─────────────────────────────────────────────── */}
      {activeTab === "query" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#6B7280" }}>Level:</span>
            {["all", "Critical", "Warning", "Opportunity"].map(l => (
              <button key={l} onClick={() => setFilterLevel(l)}
                style={{ padding: "4px 14px", borderRadius: 6, border: `1px solid ${filterLevel===l ? (levelColors[l]||"#60A5FA") : "rgba(255,255,255,0.1)"}`, background: filterLevel===l ? `${(levelColors[l]||"#60A5FA")}18` : "transparent", color: filterLevel===l ? (levelColors[l]||"#60A5FA") : "#6B7280", fontSize: 11, cursor: "pointer", fontWeight: filterLevel===l ? 700 : 400 }}>
                {l === "all" ? "All" : l}
              </button>
            ))}
            <span style={{ fontSize: 12, color: "#6B7280", marginLeft: 8 }}>Topic:</span>
            {["all", ...uniqueCategories].map(c => (
              <button key={c} onClick={() => setFilterCat(c)}
                style={{ padding: "4px 14px", borderRadius: 6, border: `1px solid ${filterCat===c ? "#60A5FA" : "rgba(255,255,255,0.1)"}`, background: filterCat===c ? "rgba(96,165,250,0.15)" : "transparent", color: filterCat===c ? "#60A5FA" : "#6B7280", fontSize: 11, cursor: "pointer", fontWeight: filterCat===c ? 700 : 400 }}>
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: selectedQuery !== null ? "1fr 1fr" : "1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredQueries.map((q, i) => {
                const color = levelColors[q.level];
                const isSelected = selectedQuery === i;
                return (
                  <div key={q.id} onClick={() => setSelectedQuery(isSelected ? null : i)}
                    style={{ background: isSelected ? `${color}0f` : "rgba(255,255,255,0.03)", border: `1px solid ${isSelected ? color+"55" : "rgba(255,255,255,0.07)"}`, borderLeft: `4px solid ${color}`, borderRadius: 12, padding: "16px 20px", cursor: "pointer", transition: "all 0.15s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <Badge text={q.level} color={color} />
                        <Badge text={q.category} color="#60A5FA" />
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#F9FAFB" }}>{q.brand}</span>
                      </div>
                      <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color, background: `${color}15`, padding: "2px 8px", borderRadius: 5, flexShrink: 0 }}>{q.metric}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "#C9D1D9", lineHeight: 1.6 }}>{q.question}</p>
                    {isSelected && <div style={{ marginTop: 4, fontSize: 11, color: "#60A5FA" }}>← See details on the right</div>}
                  </div>
                );
              })}
              {filteredQueries.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "#4B5563", fontSize: 13 }}>No queries match the selected filters.</div>
              )}
            </div>

            {selectedQuery !== null && filteredQueries[selectedQuery] && (() => {
              const q = filteredQueries[selectedQuery];
              const color = levelColors[q.level];
              return (
                <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}33`, borderRadius: 14, padding: 24, position: "sticky", top: 0, alignSelf: "start" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <Badge text={q.level} color={color} />
                    <Badge text={q.category} color="#60A5FA" />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#F9FAFB", marginBottom: 6 }}>{q.brand}</div>
                  <div style={{ fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", color, marginBottom: 20 }}>{q.metric}</div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Diagnostic</div>
                    <p style={{ margin: 0, fontSize: 13, color: "#C9D1D9", lineHeight: 1.7, background: "rgba(255,255,255,0.03)", padding: "12px 16px", borderRadius: 8, borderLeft: `3px solid ${color}` }}>{q.diagnostic}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Investigation Questions</div>
                    {q.probe.map((p, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, padding: "10px 14px", background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 8 }}>
                        <span style={{ fontSize: 14, color, flexShrink: 0 }}>?</span>
                        <span style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.5 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── ACTION PLANS MODULE ────────────────────────────────────────────── */}
      {activeTab === "recs" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: selectedRec !== null ? "1fr 1fr" : "1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["critical","opportunity","defense"].map(status => {
                const group = recommendations.filter(r => r.status === status);
                if (group.length === 0) return null;
                const color = statusColors[status];
                return (
                  <div key={status}>
                    <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, marginTop: 4 }}>
                      {status === "critical" ? "🔴" : status === "opportunity" ? "🟢" : "🟡"} {statusLabels[status]} ({group.length})
                    </div>
                    {group.map((rec, i) => {
                      const globalIdx = recommendations.indexOf(rec);
                      const isSelected = selectedRec === globalIdx;
                      return (
                        <div key={i} onClick={() => setSelectedRec(isSelected ? null : globalIdx)}
                          style={{ background: isSelected ? `${color}0f` : "rgba(255,255,255,0.03)", border: `1px solid ${isSelected ? color+"55" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: "16px 20px", cursor: "pointer", marginBottom: 10, transition: "all 0.15s" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <span style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB" }}>{rec.brand}</span>
                              <Badge text={rec.category} color={SEGMENTS[rec.category]} />
                              <Badge text={rec.bcg} color="#818CF8" />
                            </div>
                            <span style={{ fontSize: 11, color, background: `${color}15`, padding: "2px 8px", borderRadius: 5, fontWeight: 700 }}>{rec.horizon}</span>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {rec.actions.map((a, j) => (
                              <span key={j} style={{ fontSize: 10, color: "#60A5FA", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 4, padding: "2px 8px", fontWeight: 600 }}>{a.type}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {selectedRec !== null && recommendations[selectedRec] && (() => {
              const rec = recommendations[selectedRec];
              const color = statusColors[rec.status];
              const priorityColors = { P1: "#F87171", P2: "#FBBF24", P3: "#34D399" };
              return (
                <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}33`, borderRadius: 14, padding: 24, alignSelf: "start", position: "sticky", top: 0 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <Badge text={statusLabels[rec.status]} color={color} />
                    <Badge text={rec.horizon} color="#60A5FA" />
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#F9FAFB", marginBottom: 4 }}>{rec.brand}</div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                    <Badge text={rec.category} color={SEGMENTS[rec.category]} />
                    <Badge text={rec.bcg} color="#818CF8" />
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Action Plan</div>
                  {rec.actions.map((action, i) => (
                    <div key={i} style={{ marginBottom: 14, padding: "14px 16px", background: `${priorityColors[action.priority]}08`, border: `1px solid ${priorityColors[action.priority]}25`, borderRadius: 10 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: priorityColors[action.priority], background: `${priorityColors[action.priority]}20`, padding: "2px 8px", borderRadius: 4 }}>{action.priority}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#60A5FA" }}>{action.type}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: "#D1D5DB", lineHeight: 1.6 }}>{action.text}</p>
                    </div>
                  ))}
                  <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 8, fontSize: 11, color: "#4B5563", lineHeight: 1.6 }}>
                    ⏱ Recommendation time horizon: <span style={{ color: "#60A5FA", fontWeight: 600 }}>{rec.horizon}</span> · Rule-based brand data analysis
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── Q&A MODULE ─────────────────────────────────────────────────────── */}
      {activeTab === "qa" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#6B7280" }}>Topic:</span>
            {["all", ...uniqueTopics].map(t => {
              const tc = topicColors[t] || "#60A5FA";
              return (
                <button key={t} onClick={() => setFilterTopic(t)}
                  style={{ padding: "4px 14px", borderRadius: 6, border: `1px solid ${filterTopic===t ? tc : "rgba(255,255,255,0.1)"}`, background: filterTopic===t ? `${tc}18` : "transparent", color: filterTopic===t ? tc : "#6B7280", fontSize: 11, cursor: "pointer", fontWeight: filterTopic===t ? 700 : 400 }}>
                  {t === "all" ? "All Topics" : t}
                </button>
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: selectedQA !== null ? "5fr 6fr" : "1fr 1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{filteredQA.length} Questions Available</div>
              {filteredQA.map((q) => {
                const isSelected = selectedQA === q.id;
                const topicColor = topicColors[q.topic] || "#60A5FA";
                return (
                  <div key={q.id} onClick={() => setSelectedQA(isSelected ? null : q.id)}
                    style={{ background: isSelected ? `${topicColor}0f` : "rgba(255,255,255,0.03)", border: `1px solid ${isSelected ? topicColor+"44" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.15s" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                      <Badge text={q.topic} color={topicColor} />
                      {isSelected && <span style={{ fontSize: 10, color: topicColor, marginLeft: "auto" }}>▶ Active</span>}
                    </div>
                    <div style={{ fontSize: 13, color: "#F9FAFB", fontWeight: 600, lineHeight: 1.5 }}>{q.question}</div>
                    <div style={{ fontSize: 10, color: "#4B5563", marginTop: 6, fontFamily: "'IBM Plex Mono', monospace" }}>{q.rule}</div>
                  </div>
                );
              })}
            </div>

            {selectedQA ? (() => {
              const qDef = QA_QUESTIONS.find(q => q.id === selectedQA);
              if (!qDef) return null;
              const answer = qDef.answer(BRANDS);
              const topicColor = topicColors[qDef.topic] || "#60A5FA";
              return (
                <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${topicColor}33`, borderRadius: 14, padding: 24, alignSelf: "start", position: "sticky", top: 0 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <Badge text={qDef.topic} color={topicColor} />
                    <span style={{ fontSize: 10, color: "#4B5563", alignSelf: "center", fontFamily: "'IBM Plex Mono', monospace" }}>Rule-based analysis</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#F9FAFB", fontWeight: 700, marginBottom: 6, lineHeight: 1.4 }}>{qDef.question}</div>
                  <div style={{ fontSize: 10, color: "#4B5563", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 20, padding: "6px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>{qDef.rule}</div>

                  <div style={{ padding: "12px 16px", background: `${topicColor}0d`, border: `1px solid ${topicColor}30`, borderRadius: 10, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: topicColor, fontWeight: 700, marginBottom: 4 }}>ANALYSIS RESULT</div>
                    <div style={{ fontSize: 14, color: "#F9FAFB", fontWeight: 600 }}>{answer.headline}</div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Data Breakdown</div>
                    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "14px 16px" }}>
                      {answer.body.split("\n").map((line, i) => (
                        <div key={i} style={{ fontSize: 12, color: line.startsWith("•") || /^\d+\./.test(line) ? "#D1D5DB" : "#9CA3AF", lineHeight: 1.7 }}>{line || "\u00a0"}</div>
                      ))}
                    </div>
                  </div>

                  {answer.dataPoints && answer.dataPoints.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Quick Metrics</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {answer.dataPoints.slice(0,5).map((dp, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 11, color: "#9CA3AF", minWidth: 100 }}>{dp.label}</span>
                            <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 3, height: 5 }}>
                              <div style={{ width: `${Math.min(Math.abs(dp.value) * 1.2, 100)}%`, background: dp.color, height: "100%", borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 11, color: dp.color, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, minWidth: 36, textAlign: "right" }}>{dp.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Follow-up Questions</div>
                    {answer.followUp.map((fq, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, padding: "8px 12px", background: `${topicColor}08`, border: `1px solid ${topicColor}20`, borderRadius: 8 }}>
                        <span style={{ fontSize: 12, color: topicColor, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: 12, color: "#C9D1D9" }}>{fq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })() : (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 14, padding: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 12 }}>
                <div style={{ fontSize: 36 }}>❓</div>
                <div style={{ fontSize: 14, color: "#4B5563", fontWeight: 600 }}>Select a question</div>
                <div style={{ fontSize: 12, color: "#374151" }}>Click any question card on the left to get a rule-based answer derived from the 30-brand portfolio dataset</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("overview");
  const [selectedBrand, setSelectedBrand] = useState(1);
  const [simEnabled, setSimEnabled] = useState(false);
  const [simState, setSimState] = useState(null); // { brandId, data }
  const [userRole, setUserRole] = useState("brandManager");
  const [uploads, setUploads] = useState([]);

  const handleUpload = (file) => setUploads(prev => [...prev, file]);
  const handleDeleteUpload = (id) => setUploads(prev => prev.filter(f => f.id !== id));

  const ROLES = {
    cfo:          { label: "CFO / C-Level",       icon: "👔", color: "#FBBF24", defaultPage: "financials" },
    brandManager: { label: "Brand Manager",        icon: "📈", color: "#3B82F6", defaultPage: "portfolio" },
    strategist:   { label: "Strategy Director",   icon: "🌍", color: "#34D399", defaultPage: "overview" },
    esg:          { label: "ESG Officer",          icon: "🌱", color: "#10B981", defaultPage: "esg" },
  };

  const handleRoleChange = (role) => {
    setUserRole(role);
    setPage(ROLES[role].defaultPage);
  };

  // Build effective brands array (sim replaces one brand when active)
  const effectiveBrands = simEnabled && simState
    ? BRANDS.map(b => b.id === simState.brandId ? simState.data : b)
    : BRANDS;

  const navItems = [
    { id: "overview",    label: "Overview",           icon: "◈", roles: ["cfo","brandManager","strategist","esg"] },
    { id: "portfolio",   label: "Brand Portfolio",    icon: "◉", roles: ["brandManager","strategist"] },
    { id: "financials",  label: "Financials",         icon: "◆", roles: ["cfo","strategist"] },
    { id: "bcg",         label: "BCG Matrix",         icon: "◎", roles: ["cfo","strategist"] },
    { id: "competition", label: "Competition",        icon: "◇", roles: ["strategist","cfo"] },
    { id: "funnel",      label: "Brand Funnel",       icon: "▽", roles: ["brandManager","strategist"] },
    { id: "simulation",  label: "Simulation Studio",  icon: "⚡", roles: ["brandManager","cfo","strategist"] },
    { id: "perception",  label: "Perception Map",     icon: "⊙", roles: ["brandManager","strategist"] },
    { id: "country",     label: "Country Analytics",  icon: "⊞", roles: ["strategist","esg"] },
    { id: "esg",         label: "ESG",                icon: "◈", roles: ["esg","cfo","strategist"] },
    { id: "persona",     label: "Persona Atlas",      icon: "◉", roles: ["brandManager","strategist"] },
    { id: "ai",          label: "AI Analyst",         icon: "⊛", roles: ["cfo","brandManager","strategist","esg"] },
    { id: "files",       label: "Files",              icon: "◧", roles: ["cfo","brandManager","strategist","esg"] },
  ];
  const visibleNav = navItems.filter(item => item.roles.includes(userRole));

  // Bridge: expose handleUpload globally so FilesModule can trigger it
  useEffect(() => { window.__filesModuleUpload = handleUpload; return () => { delete window.__filesModuleUpload; }; }, []);

  const renderPage = () => {
    switch(page) {
      case "overview": return <OverviewPage effectiveBrands={effectiveBrands} simEnabled={simEnabled} uploads={uploads} onUpload={handleUpload} onDeleteUpload={handleDeleteUpload} />;
      case "portfolio": return <BrandPortfolioPage selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} effectiveBrands={effectiveBrands} />;
      case "financials": return <FinancialsPage effectiveBrands={effectiveBrands} simEnabled={simEnabled} />;
      case "bcg": return <BCGPage effectiveBrands={effectiveBrands} simEnabled={simEnabled} />;
      case "competition": return <CompetitionPage />;
      case "funnel": return <FunnelPage selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} />;
      case "simulation": return <SimulationStudio selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} simState={simState} setSimState={setSimState} simEnabled={simEnabled} setSimEnabled={setSimEnabled} />;
      case "perception": return <PerceptionPage />;
      case "country": return <CountryPage />;
      case "esg": return <ESGPage />;
      case "persona": return <PersonaPage />;
      case "ai": return <AIAnalystPage />;
      case "files": return <FilesModule uploads={uploads} onDeleteUpload={handleDeleteUpload} />;
      default: return <OverviewPage effectiveBrands={effectiveBrands} simEnabled={simEnabled} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0D1117", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", color: "#F9FAFB" }}>
      {/* SIDEBAR */}
      <div style={{ width: 220, background: "#13161C", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 11, color: "#6B7280", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Unilever</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#F9FAFB", lineHeight: 1.3 }}>30 Power Brands</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>Strategy Platform v9.0</div>
          <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(SEGMENTS).map(([, c]) => <div key={c} style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />)}
          </div>
        </div>
        <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
          {visibleNav.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 20px", background: page === item.id ? (item.id === "simulation" ? "rgba(124,58,237,0.2)" : "rgba(59,130,246,0.15)") : "transparent", border: "none", borderLeft: page === item.id ? `3px solid ${item.id === "simulation" ? "#7C3AED" : "#3B82F6"}` : "3px solid transparent", color: page === item.id ? (item.id === "simulation" ? "#A78BFA" : "#60A5FA") : "#6B7280", fontSize: 12, fontWeight: page === item.id ? 700 : 400, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
              <span style={{ fontSize: 10, opacity: 0.7 }}>{item.icon}</span>
              {item.label}
              {item.id === "simulation" && simEnabled && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#FBBF24", flexShrink: 0 }} />}
            </button>
          ))}
        </nav>
        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {/* ROLE SELECTOR */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Active Role</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {Object.entries(ROLES).map(([key, r]) => (
                <button key={key} onClick={() => handleRoleChange(key)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 7, border: `1px solid ${userRole === key ? r.color + "55" : "rgba(255,255,255,0.06)"}`, background: userRole === key ? r.color + "18" : "transparent", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 12 }}>{r.icon}</span>
                  <span style={{ fontSize: 11, color: userRole === key ? r.color : "#6B7280", fontWeight: userRole === key ? 700 : 400 }}>{r.label}</span>
                  {userRole === key && <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: r.color, flexShrink: 0 }} />}
                </button>
              ))}
            </div>
          </div>
          <div style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 2 }}>BUILT BY</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#60A5FA" }}>Furkan</div>
            <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>Brand & AI Strategy</div>
          </div>
          <div style={{ fontSize: 10, color: "#374151" }}>React · Recharts · IBM Plex</div>
          <div style={{ fontSize: 10, color: "#374151", marginTop: 2 }}>Apr 2026 · v9.0</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* SIMULATION BANNER */}
        {simEnabled && simState && (
          <div style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.2), rgba(29,78,216,0.2))", borderBottom: "1px solid rgba(124,58,237,0.3)", padding: "8px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#A78BFA", fontWeight: 700 }}>⚡ SIMULATION ACTIVE</span>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                {BRANDS.find(b => b.id === simState.brandId)?.name} data is simulated — all pages reflect your scenario
              </span>
            </div>
            <button onClick={() => { setSimEnabled(false); setSimState(null); }}
              style={{ fontSize: 11, color: "#F87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>
              × Reset to Actuals
            </button>
          </div>
        )}
        {/* ROLE BANNER */}
        <div style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "8px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 13 }}>{ROLES[userRole].icon}</span>
            <span style={{ fontSize: 12, color: ROLES[userRole].color, fontWeight: 700 }}>{ROLES[userRole].label} View</span>
            <span style={{ fontSize: 11, color: "#4B5563" }}>— {visibleNav.length} modules active</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.entries(ROLES).map(([key, r]) => (
              <button key={key} onClick={() => handleRoleChange(key)}
                style={{ padding: "3px 10px", borderRadius: 5, border: `1px solid ${userRole === key ? r.color + "55" : "rgba(255,255,255,0.08)"}`, background: userRole === key ? r.color + "18" : "transparent", color: userRole === key ? r.color : "#4B5563", fontSize: 10, fontWeight: userRole === key ? 700 : 400, cursor: "pointer" }}>
                {r.icon} {r.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, maxWidth: 1100, margin: "0 auto", padding: "32px 32px", width: "100%" }}>
          {renderPage()}
        </div>
        {/* FOOTER */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0D1117", padding: "16px 32px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "#374151" }}>© 2026 Unilever 30 Power Brands Strategy Platform</span>
              <span style={{ fontSize: 11, color: "#374151" }}>Data: Unilever FY2024 Annual Report &amp; Public Market Data</span>
              <span style={{ fontSize: 11, color: "#374151" }}>Last Updated: April 2026</span>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <a href="#" style={{ fontSize: 11, color: "#3B82F6", textDecoration: "none", padding: "4px 12px", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 6 }}>GitHub</a>
              <a href="#" style={{ fontSize: 11, color: "#3B82F6", textDecoration: "none", padding: "4px 12px", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 6 }}>LinkedIn</a>
              <a href="#" style={{ fontSize: 11, color: "#fff", textDecoration: "none", padding: "4px 12px", background: "#3B82F6", borderRadius: 6, fontWeight: 600 }}>Let's Work Together →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
