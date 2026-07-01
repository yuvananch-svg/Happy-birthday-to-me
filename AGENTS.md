# AGENTS.md

## Project Identity

โปรเจกต์นี้คือเว็บเกมของขวัญสำหรับ **Happy anniversary and birthday** ให้แฟนของผู้ใช้ โดย direction ล่าสุดเปลี่ยนจาก branching visual novel / Pokemon-like demo ไปเป็น:

**Stardew-like Memory Farm**

เกมเป็น pixel-style free-walk memory game ที่แฟนของผู้ใช้ตื่นขึ้นมาในโลกฟาร์มบนดอยหลังจากสูญเสียความทรงจำ ต้องเดินตามหา **9 Memory Fragments** เพื่อค่อยๆ จำชีวิต ครอบครัว แมว ความรัก และสุดท้ายเดินทางไปเจอผู้ใช้ในฉากจบ

งานนี้ต้องให้ความสำคัญกับอารมณ์, ความทรงจำจริง, ความอบอุ่น และความเล่นได้จริงบน desktop/iPad มากกว่าการทำระบบเกมซับซ้อนแบบ Stardew เต็มรูปแบบ

## User Preference

- ผู้ใช้ชอบการทำงานจริงจัง ตรงประเด็น ไม่อวย
- ถ้าข้อมูลยังไม่พอ ให้ถาม ไม่แต่งข้อมูลส่วนตัวปลอม
- คุณภาพสำคัญกว่าความเร็ว
- ให้เสนออีกมุมที่ผู้ใช้อาจยังไม่ทันคิด แต่ต้องอธิบายเหตุผล
- ตอนนี้ผู้ใช้ต้องการค่อยๆ วางงานจากภาพใหญ่ → task ใหญ่ → งานย่อย ไม่กระโดดไป implement ทันทีถ้ายังไม่ได้สั่ง

## Current Direction Lock

Direction ล่าสุดที่ต้องยึด:

- เกมเป็น **single continuous map** เดินได้อิสระ
- ไม่ใช้หลายแมพใน version แรก ยกเว้นห้องนอน opening ที่เป็นฉากเริ่มต้นและมีประตูออกสู่โลกหลัก
- มี register gate แบบน่ารักก่อนเข้าเกม แต่ไม่เน้น security จริงจัง
- Desktop ใช้ `WASD` / Arrow
- iPad ใช้ on-screen joystick
- ต้องแยก input mode ให้ถูกตามอุปกรณ์
- ไม่มีระบบเลือด เงิน ร้านค้า combat farming simulation หรือ calendar แบบ Stardew จริง
- มี day/night cycle ทุก 15 นาทีด้วย tint/light transition
- แถบขวาเป็น timeline quest sidebar แสดง current quest + next 1-2 teaser + completed memories
- ของที่ปลดล็อกแล้วต้องกดดูซ้ำได้เสมอจาก completed memory/sidebar
- รูป วิดีโอ จดหมาย ของขวัญ เปิดเป็น popup กลางจอ
- ฉากจบเป็น Golden Bridge เวียดนาม ตอนพระอาทิตย์ตก
- **9 Memory Fragments** (ล็อก 2026-07-01) — ไม่มีศาลา ตา/ยาย หรือ F10–F11 อีกต่อไป
- **8 playable scene areas** บน outdoor continuous map + ห้องนอน opening แยก (9 fragments กระจายในโซนเหล่านี้; ป่า = F4+F5)

## Game Creation Approach

Direction การสร้างเกมที่ต้องยึดตอนนี้ (จาก analysis ล่าสุด):

### Scene / Map

- ใช้ generated scene image ขนาดใหญ่เป็น background map ได้; camera crop/follow ผู้เล่น
- ฉากต้องเป็น **game-ready playable map** ไม่ใช่แค่ภาพสวย/illustration
- สไตล์ pixel art แบบ Stardew-like / 90s cozy
- **Character size ต้องนิยามชัดก่อน** แล้วออกแบบ scene scale รอบขนาดตัวละคร
- Camera zoom ต้องรู้สึกสัดส่วน: ขนาดตัวละครบนจอควรคงที่เมื่อ zoom scene

### Character Assets

- ตัวละครต้องมี 4 มุมสม่ำเสมอ: front / back / left / right
- หน้าตา, outfit, ผม, แว่น, ขนาดตัว ต้องสอดคล้องทุกมุม
- ใช้ generated body sprites สำหรับ head/body/skirt ได้; ขา (legs) ใน prototype อาจ generate ด้วย code เพื่อแก้ alignment และ walking animation
- Production น่าจะใช้ walking sprite frames จริงดีกว่า; prototype ใช้ code legs ได้

### Prototype vs Production

- **Prototype phase**: อนุญาต free walk / ไม่ block เพื่อ tune scale และ movement feel ก่อน
- **Production**: ต้องมี **collision layer แยกจากภาพ** — JSON/rect map สำหรับ walls, furniture, interactable blockers
- Hotspots/interactables ควรเป็น **data-driven** ไม่ hardcode จากภาพอย่างเดียว

### Weaknesses / Risks

- ภาพฉาก 4K ขนาดใหญ่ → load/performance โดยเฉพาะ iPad/mobile; ต้อง optimize, lazy-load, compress
- AI-generated scene/object scale อาจ drift; **ต้องนิยาม character size และ object scale ชัดเจน**
- Pixel art scaling อาจ blur/shimmer กับ fractional transform; snap หรือเลือก scale carefully
- DOM prototype อาจชน performance limit; canvas/Phaser อาจดีกว่าใน production
- Production **ห้าม rely บนภาพ visual อย่างเดียว** สำหรับ collision — ต้องใช้ separate collision layer
- Interactables/hotspots ควร data-driven เพื่อ maintainability

## Current Prototype State

มีไฟล์ prototype เดิม:

- `index.html`
- `styles.css`
- `script.js`
- `STORY_STRUCTURE.md`

มีเดโม่ movement ล่าสุด:

- `walk-demo.html`
- `walk-demo.css`
- `walk-demo.js`

มีเดโม่ opening ล่าสุด:

- `opening-demo.html`
- `opening-demo.css`
- `opening-demo.js`

เดโม่ movement ทำแล้ว:

- แมพใหญ่กว่า viewport
- camera follow
- collision พื้นฐาน
- desktop keyboard movement
- touch joystick สำหรับ iPad/mobile
- desktop ซ่อน joystick แล้ว
- browser verification ผ่าน: desktop เป็น `input-keyboard`, touch emulation เป็น `input-touch`, ไม่มี console errors

เดโม่ opening ทำแล้ว:

- ฉากเปิดในห้องนอน
- ตัวฮีโร่ตื่นบนเตียงหลังเสียความทรงจำ
- แม่เดินเข้ามาพร้อมกะละมัง, ตกใจ, กะละมังหล่น
- dialogue PASS ทีละประโยค
- มุกแม่หลังลูกเรอ: “โอ้ยลูกก อันนี้ก็ดังเกิน”
- จดหมายจากผู้ใช้บนโต๊ะข้างเตียง
- กรอบรูปเบลอเป็น interactable สำหรับ Fragment 1
- popup จดหมายและ popup memory
- ปลดล็อก Fragment 1/9: จำแม่ได้
- sidebar แสดง current quest, next 2 teaser, completed memory
- desktop ใช้ WASD/Arrow + E/PASS, ซ่อน joystick
- touch/iPad emulation แสดง joystick + INTERACT
- ต่อออกจากประตูไป outdoor mini-map แบบย่อ มีบ้าน สวนผักผลไม้ บ่อน้ำ/ร้านก๋วยเตี๋ยว และป่า
- เล่นต่อถึง Fragment 5/9 แล้ว:
  - F2 กดสตรอเบอรี่ในสวนเพื่อจำสวนผักผลไม้บนดอย
  - F3 กดร้านก๋วยเตี๋ยวริมบ่อน้ำ
  - F4 เจอฟ่อนนอนในป่า ฟ่อนคุยแบบ “เหมียว (แปลความหมาย)” แล้วเดินนำไปหารูป ฟ่อนเดินตามหลังปลดล็อก
  - F5 หาอาหารแมวและของเล่นครบ ฟูกระโดดออกจากพุ่ม ฟูเดินนำไปหารูป แล้วเดินตามหลังปลดล็อก
- browser verification ผ่านด้วย Chrome headless: canvas nonblank, desktop `input-keyboard`, touch `input-touch`, joystick visibility ถูกต้อง, flow ถึง Fragment 5 ไม่มี console errors

ไฟล์เดโม่ถูก sync ไปที่:

`/Users/yuvananchan-arkat/Desktop/Proj. Birth/`

## Story Premise

แฟนของผู้ใช้ตื่นขึ้นมาบนเตียงในห้องนอน ห่มผ้า หลังจากหลับไปนานเพราะอุบัติเหตุประหลาดจาก “ลำไยหล่นโดนหัว” จนสูญเสียความทรงจำ

ฉากแรกเป็น cutscene:

1. ตัวฮีโร่ตื่นขึ้นมาในห้องนอน
2. พูดประมาณว่า “ที่นี่ที่ไหน... ทำไมเราจำอะไรไม่ได้เลย”
3. แม่เดินเข้ามาพร้อมกะละมังเพื่อจะเช็ดตัวให้
4. แม่ตกใจที่เห็นลูกตื่นจนทำกะละมังหล่น/โยนทิ้ง
5. แม่กับลูกคุยกัน ลูกจำแม่ไม่ได้
6. แม่เสียใจแต่พยายามใจเย็น
7. แม่ยื่นน้ำให้ลูกกิน
8. แฟนเรอเสียงดัง
9. แม่พูดมุกเฉพาะ: “โอ้ยลูกก อันนี้ก็ดังเกิน”
10. แม่บอกให้ดูจดหมายที่โต๊ะข้างเตียง
11. จดหมายจากผู้ใช้เป็น guide object ที่บอกว่าเธอต้องตามหา 9 Memory Fragments
12. ผู้เล่นสำรวจห้องต่อและเจอกรอบรูปเบลอเกี่ยวกับแม่
13. กด interact แล้วปลดล็อก Memory Fragment 1
14. แฟนเริ่มจำแม่ได้
15. แม่แนะนำให้ไปตามหาความทรงจำถัดไป

สำคัญ: **จดหมายจากผู้ใช้ไม่ใช่ fragment แรก**  
Memory Fragment แรกคือ **จำแม่ได้**

## Opening Bedroom Requirements

ห้องนอนควรมี:

- เตียง
- ผ้าห่ม
- ตู้เสื้อผ้า
- โต๊ะทำงาน
- โต๊ะข้างเตียง
- พรม/ของตกแต่ง
- เตียงนอนของแมวทั้งสอง แม้ในบ้านยังไม่มีแมว
- ประตูห้องนอน

Interactable objects:

- โต๊ะข้างเตียง: จดหมายจากผู้ใช้
- กรอบรูปเบลอ: memory เกี่ยวกับแม่
- ประตู: จุดเปลี่ยนจากห้องนอนไปนอกบ้าน/โลกหลัก

Visual rules:

- ของที่ interact ได้ต้องเด่นกว่าของตกแต่ง
- ใช้ขอบขาวหรือ highlight
- มีแสงสะท้อน/shimmer เบาๆ
- ก่อนกดดู ภาพในกรอบต้องดูเบลอหรือไม่ชัด
- กดแล้วค่อย popup รูปเต็ม

## Letter Draft From User

ใช้เป็นร่างจดหมาย opening ได้ แต่ภายหลังผู้ใช้อาจปรับ:

```text
ถึงเธอ

ถ้าเธอกำลังอ่านจดหมายฉบับนี้อยู่ แปลว่าเธอคงตื่นขึ้นมาแล้ว
หลังจากหลับไปนาน เพราะอุบัติเหตุประหลาดจากลำไยลูกหนึ่งที่ตกลงมาโดนหัวเธอ

ฉันไม่รู้ว่าตอนนี้เธอยังจำฉันได้ไหม
จำเราได้หรือเปล่า
หรือจำคนที่เคยรักและคอยอยู่ข้างเธอได้มากแค่ไหน

แต่ไม่เป็นไรนะ
ถ้าความทรงจำของเธอกระจัดกระจายหายไประหว่างทาง
ก็ขอให้ค่อยๆ เดินตามหามันกลับมาทีละชิ้น

ในโลกใบนี้มีเศษความทรงจำทั้งหมด 9 ชิ้น
บางชิ้นอยู่ในบ้าน
บางชิ้นอยู่ตามทางที่เธอเคยเดินผ่าน
บางชิ้นอยู่กับคนที่รักเธอ
และบางชิ้นอยู่ในวันที่เราสองคนเคยผ่านอะไรมาด้วยกัน

เมื่อเธอรวบรวมมันได้ครบ
ขอให้มาหาฉันที่สถานที่แห่งความทรงจำของเรา

ฉันหวังว่าเมื่อถึงตอนนั้น
เธอจะจำได้ว่ามันคือที่ไหน

เพราะฉันจะยังรอเธออยู่ที่นั่น
ในเวลาที่พระอาทิตย์ค่อยๆ ลับขอบฟ้า

รักและคิดถึงเสมอ
```

## Emotional Goal

หลังเล่นจบ แฟนควรรู้สึกว่า:

- ชีวิตตัวเองผ่านมาเยอะมาก
- หลายเรื่องอาจลืมไปแล้ว
- บางเรื่องดี บางเรื่องเศร้าบ้าง แต่ทั้งหมดคือตัวตนของตัวเอง
- เกมนี้พาเธอกลับไปคิดถึงเรื่องราวเหล่านั้นอย่างอ่อนโยน
- เกมไม่ควรเศร้าหนัก แค่มีสุข เศร้าบ้าง และอบอุ่น

North star:

**“เกมนี้คือโลกเล็กๆ ที่เตือนว่าเธอเคยผ่านอะไรมา โตมายังไง และมีคนที่รักเธอเห็นคุณค่าของเรื่องราวเหล่านั้น”**

## World Progression

**8 playable scene areas** (+ ห้องนอน opening แยก) — ล็อก 2026-07-01:

| # | Scene area | Notes |
|---|---|---|
| 1 | ห้องนอน | Opening scene แยก — มีประตูออกสู่โลกหลัก |
| 2 | สวนผัก | Vegetable / fruit garden บนดอย |
| 3 | ร้านก๋วยเตี๋ยวริมบึง | Pond + noodle shop |
| 4 | ป่า | Forest — F4 ฟ่อน + F5 ฟู อยู่โซนเดียวกัน |
| 5 | แคมป์ | Tent / road trip |
| 6 | เขื่อน | Dam behind university |
| 7 | ทุ่งดอกไม้ | Flower field + sightseeing car |
| 8 | สะพานมือ | Golden Bridge เวียดนาม — final area |

Outdoor world เป็น **single continuous map** (ยกเว้นห้องนอน opening)  
**บ้าน** และ **ทางขึ้นเขา** ไม่ใช่โซนแยก — พับเข้า flow ของแมพต่อเนื่อง

## Known Memory Fragments

**9 fragments ทั้งหมด** (ล็อก 2026-07-01):

| Fragment | Zone | Memory / Event | Interaction |
|---|---|---|---|
| F1 | ห้องนอน | จำแม่ได้ | กดกรอบรูปเบลอในห้อง |
| F2 | สวนผักผลไม้ | บ้านบนดอย ปลูกผลไม้ เช่น สตรอเบอรี่ และความทรงจำวัยเด็ก | กดสตรอเบอรี่พิเศษ |
| F3 | บ่อน้ำ | เดทช่วงแรก กินก๋วยเตี๋ยวริมบ่อน้ำที่มหาวิทยาลัย | กดร้านก๋วยเตี๋ยว |
| F4 | ป่า (ฟ่อน) | ตามหาฟ่อน | กดฟ่อนที่นอนหลับอยู่ |
| F5 | ป่า (ฟู) | ฟูออกมาหลังหา item ครบ | หาอาหารแมว/ของเล่น แล้วฟูกระโดดออกจากพุ่ม |
| F6 | แคมป์ | Road trip นอนเต็นท์บนดอย ทำอาหาร กินหมูกระทะ | กดเต็นท์แคมป์ |
| F7 | เขื่อนหลังมหาวิทยาลัย | ไปพักใจช่วงเครียดจากเรียน ปูเสื่อนอนเงียบๆ | หาไอเทม “เสื่อ” ก่อน |
| F8 | ทุ่งดอกไม้ | เที่ยวสวนดอกไม้ ขับรถชมทุ่งดอกไม้ | คุยกับคนขายตั๋ว แล้วกดรถ |
| F9 | Golden Bridge เวียดนาม | Final memory, ทริปต่างประเทศครั้งแรก ฝ่าฝน หนาว ดูแลกัน | Cutscene + video popup |

**เอาออกแล้ว (ห้ามใส่กลับ):** ศาลา / ตา/ยาย (เดิม F7), F10, F11, และ fragment numbering เก่าที่ข้ามไป F12

## NPC Policy

NPC หลักจริง:

- ผู้ใช้
- แม่
- ฟ่อน
- ฟู

NPC อื่น:

- เป็นตัวละครประจำ checkpoint
- ไม่ต้องมีบทบาทลึก
- ใช้เพื่อไกด์ interaction หรือสถานที่ เช่น คนขายตั๋วรถในทุ่งดอกไม้
- ไม่ต้องกำหนดเป็นพี่/น้อง/เพื่อนจริงในรอบนี้

## Mother NPC

บุคลิก:

- ใจเย็น
- เป็นครอบครัวภาคเหนือ โตมากับบริบทบนดอย
- ระหว่าง draft ใช้ภาษากลางก่อน
- ภายหลังผู้ใช้จะช่วยแปลงบางประโยคเป็นภาษาเหนือ

Memory:

- แม่ทำอาหารให้กิน
- แม่คอยดูแลตั้งแต่เด็กจนโต
- แม่เป็นความทรงจำแรกที่ทำให้แฟนเริ่มจำตัวเองได้

มุกเฉพาะ:

```text
โอ้ยลูกก อันนี้ก็ดังเกิน
```

ใช้หลังแม่ยื่นน้ำให้กินแล้วแฟนเรอ

**Canonical assets (locked 2026-06-27):**

| Use | Local path | Source URL |
|---|---|---|
| Full-body NPC (transparent) | `public/npc/mother-fullbody-nobg.png` | [Higgsfield full-body](https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260627_165321_f6310576-c9e5-4b11-98be-672872a6d125.png) |
| F1 memory / in-scene photo frame | `public/memories/images/mother-f1.png` | [Higgsfield portrait](https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260627_165035_a2ad359b-14ac-46a8-81b4-0f811a7f1fa6.png) |
| Dialogue portrait | `public/npc/mother-portrait.png` | (separate asset) |

Registry: `lib/game/scenes/bedroom/assets.ts`

## Cat Arc

ฟ่อน:

1. ฟ่อนนอนหลับอยู่ในพื้นที่หนึ่งของป่า
2. ผู้เล่นเดินไปกดที่ฟ่อน
3. ฟ่อนตื่น
4. Cutscene คุยกัน
5. ฟ่อนพูด “เหมียว...” และมีวงเล็บแปลความหมาย
6. ฟ่อนเดินนำไปหารูปแฟนกับฟ่อน
7. ปลดล็อก memory
8. ฟ่อนเดินตามแฟนไปจนจบเกม
9. ฟ่อนไม่มีบทบาทใหม่จน final group scene

ฟู:

1. ผู้เล่นต้องรวบรวม item ให้ครบก่อน เช่น อาหารแมว/ของเล่น
2. เมื่อครบแล้ว ฟูกระโดดออกจากพุ่มหญ้า
3. Cutscene คุยกัน
4. ฟูเดินนำไปหารูปแฟนกับฟู
5. ปลดล็อก memory
6. ฟูเดินตามเหมือนฟ่อน
7. ตอนจบทั้งฟ่อนและฟูอยู่ในซีนรวมตัวถ่ายรูป

## Final Sequence

เมื่อครบ 9 fragments:

1. เกมเข้าสู่ cutscene ทั้งหมด
2. ฉาก Golden Bridge เวียดนาม ตอนพระอาทิตย์ตก
3. แฟนเดินมาเจอ NPC ผู้ใช้
4. ทั้งสองจับมือกัน
5. เดินไปนั่งที่ริมผา
6. เปิด video popup ยาว
7. วิดีโอเป็นช่วงเวลาที่ไปเที่ยวเวียดนามด้วยกัน
8. หลังวิดีโอจบ อาจมี final letter / final line
9. จบด้วย title/theme: `Happy anniversary and birthday`

Final sequence เป็น cinematic memory payoff ไม่ใช่แค่จดหมาย

## Popup / Replay Rules

- รูปเดี่ยวเปิด popup กลางจอ
- Gallery เปิด popup กลางจอ
- Video เปิด popup กลางจอ
- จดหมายเปิด popup กลางจอ
- ของขวัญเปิด popup กลางจอ
- ทุก memory ที่ปลดล็อกแล้วต้องกดดูซ้ำได้จาก completed quest / sidebar

## 12 Main Task Areas

### 1. Product & Story Bible

กำหนดโลก, premise เสียความทรงจำ, 9 Memory Fragments, timeline, NPC, แมว, tone บทพูด, final ending

### 2. Next.js App Shell + Register Gate

ทำเว็บหลัก, `/register`, `/game`, soft register ด้วยชื่อ+รหัสแบบน่ารัก ไม่เน้น security จริงจัง

### 3. Game Engine Foundation

ตั้ง engine สำหรับเกมเดินอิสระ เช่น Phaser หรือ canvas prototype ต่อไป, camera follow/zoom, game loop, responsive canvas; prototype ใช้ DOM ได้ แต่ production ควรพิจารณา canvas/Phaser ถ้า performance ไม่พอ

### 4. Single Continuous Farm Map

สร้างแมพเดียวขนาดใหญ่จาก generated scene images + camera crop; มีบ้าน ฟาร์ม บ่อน้ำ ป่า ทางขึ้นเขา ทุ่งดอกไม้ สะพานปลายทาง; prototype อนุญาต free walk, production ต้องมี collision layer แยก (JSON/rect map) และ data-driven interactables

### 5. Player Controls

คอมใช้ `WASD/Arrow`, iPad ใช้ on-screen joystick, แยก input mode ให้ถูกตามอุปกรณ์

### 6. NPC & Interaction System

ระบบ NPC/วัตถุที่กดคุยหรือสำรวจได้ มี dialogue, interact range, idle dialogue, quest-specific dialogue

### 7. Timeline Quest System

ระบบ 9 Memory Fragments แบบเรียงตามลำดับเวลา แถบขวาแสดง current quest + next 1-2 teaser + completed memories

### 8. Memory Popup & Replay System

รูป วิดีโอ จดหมาย ของขวัญ เปิดเป็น popup กลางจอ และดูซ้ำได้จาก completed quest/sidebar

### 9. Cat Companion System

ฟ่อน/ฟู quest, หาแมว, หาอาหารหรือของเล่น, แมวเดินนำไปหา memory, จากนั้นเดินตามผู้เล่น

### 10. Day/Night Cycle

ฉากกลางวัน/กลางคืนทุก 15 นาที มี tint/light transition แต่ไม่มีระบบเวลาแบบ Stardew เต็มรูปแบบ

### 11. Final Sequence

เมื่อเก็บครบ 9 fragments ปลดล็อกพื้นที่สุดท้าย เจอ NPC ผู้ใช้ อ่าน/ดู final memory และจบเกม

### 12. Asset Pipeline + Deploy

เตรียม pixel sprites/portraits, รูปจริง, วิดีโอ, compression, private GitHub repo, Vercel deploy, ทดสอบ desktop/iPad

## Data Still Needed From User

เพื่อแตกงานย่อยต่อ ต้องถามผู้ใช้เรื่องเหล่านี้:

1. **Memory แม่ / F1**
   - กรอบรูปในห้องเป็นรูปอะไร
   - เช่น แม่ทำอาหาร, แม่กับแฟนตอนเด็ก, แม่กับแฟนในบ้าน, หรืออาหารฝีมือแม่

2. **F2 ผลไม้บนดอย**
   - ยืนยันชื่อผลไม้ นอกจากสตรอเบอรี่
   - ผู้ใช้พิมพ์ว่า “เค้กกับสตอเบอรี่” ต้องถามว่า “เค้ก” หมายถึงผลไม้อะไร หรือเป็นเค้กจริง
   - อยากให้ cutscene พูดถึงวัยเด็กบนดอยแบบไหน

3. **F3 บ่อน้ำ/ก๋วยเตี๋ยว**
   - รอรูปจากผู้ใช้
   - ต้องรู้ว่าโทนคัทซีนควรตลก อบอุ่น หรือโรแมนติก

4. **F4 ฟ่อน**
   - ฟ่อนซ่อนอยู่ตรงไหนในป่า
   - รูปแฟนกับฟ่อนมีลักษณะไหน
   - บทแปลคำว่า “เหมียว” อยากให้สื่ออะไร

5. **F5 ฟู**
   - ใช้ item อะไร: อาหารแมว ของเล่น หรือทั้งคู่
   - item ซ่อนอยู่โซนไหน
   - รูปแฟนกับฟูเป็นรูปไหน

6. **F6 แคมป์/เต็นท์**
   - มีรูปหรือวิดีโออะไรบ้าง
   - popup ควรเริ่มด้วยวิดีโอหรือ gallery
   - อยากเน้นทำอาหาร หมูกระทะ หรือ road trip

7. **F7 เขื่อนหลังมหาวิทยาลัย**
   - NPC ไกด์คือใคร
   - item “เสื่อ” อยู่ตรงไหน
   - โทน memory เน้นพักใจจากการเรียน หรือความสัมพันธ์ช่วงเรียน

8. **F8 ทุ่งดอกไม้**
    - สวนดอกไม้มีชื่อจริงไหม
    - รถชมสวนหน้าตาแบบไหน
    - มีรูป/วิดีโอไหม

9. **Final Video / Golden Bridge (F9)**
    - รอวิดีโอเวียดนาม
    - จะใช้วิดีโอเดียวหรือ montage หลายคลิป
    - ต้องเลือก final line หลังวิดีโอจบ

10. **ภาษาเหนือของแม่**
    - ตอนนี้ draft เป็นภาษากลาง
    - ต้องให้ผู้ใช้ช่วยแปลงบางประโยคเป็นภาษาเหนือภายหลัง

11. **Reference ภาพจริงสำหรับ pixel**
    - รูปผู้ใช้ หน้าตรง/ครึ่งตัว/เต็มตัว
    - รูปแม่ หน้าตรง/ครึ่งตัว/เต็มตัว
    - รูปฟ่อนตอนเด็กและปัจจุบัน
    - รูปฟู
    - ถ้ามีด้านข้างหรือหลายมุม จะช่วยทำ sprite ได้ดีกว่า

## Immediate Next Best Step

**Task 1.1: Lock Memory Fragment Table** — ✅ ล็อกแล้ว (2026-07-01): 9 fragments, 8 scene areas (+ ห้องนอน opening แยก), ไม่มีศาลา/ตา/ยาย

งานถัดไป:

- ยืนยัน F2 ผลไม้
- เลือก media/object ของ F1–F9 ให้ชัด
- แตกงานย่อยของ Product & Story Bible เป็นไฟล์:

- `STORY_BIBLE.md`
- `MEMORY_FRAGMENTS.md`
- `NPC_CAST.md`
- `ASSET_LIST.md`
