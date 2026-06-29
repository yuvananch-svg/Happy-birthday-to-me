import type { StoryNode, StoryNodeId } from "./story-types";

export const initialNodeId: StoryNodeId = "start";

export const storyNodes: Record<StoryNodeId, StoryNode> = {
  start: {
    id: "start",
    speaker: "Perthyw",
    chapter: "Thanyawee Thanawaritkiat",
    destination: "start",
    lines: [
      { text: "ยินดีต้อนรับผู้กล้า... วันนี้โลกของเรากำลังเข้าสู่สงคราม" },
      { text: "วันนี้ไม่ใช่เควสต์ธรรมดา เพราะมีสองวันสำคัญซ้อนกันอยู่ใกล้ๆ" },
      { text: "วันที่ 9 กรกฎาคมคือครบรอบ 2 ปี 5 เดือน และวันที่ 12 กรกฎาคมคือวันเกิดของเธอ" },
      { text: "ก่อนออกเดินทาง เลือกเส้นทางแรกที่อยากเปิดอ่าน" }
    ],
    choices: [
      { label: "ไปวันที่ 9 ก.ค.", next: "anniversary", journal: "เลือกเส้นทางครบรอบ" },
      { label: "ไปวันที่ 12 ก.ค.", next: "birthday", journal: "เลือกเส้นทางวันเกิด" },
      { label: "เปิดสมุดวัยเด็ก", next: "childhood", journal: "เปิดบทวัยเด็ก" }
    ]
  },
  anniversary: {
    id: "anniversary",
    speaker: "Perthyw",
    chapter: "เส้นทาง 9 กรกฎาคม",
    destination: "anniversary",
    lines: [
      { text: "ถนนเส้นนี้พาเรากลับไปวันที่ความสัมพันธ์เริ่มมีน้ำหนักมากขึ้นเรื่อยๆ" },
      {
        text: "นี่คือช่องสำหรับรูปแรกที่ควรเปิดช้าๆ ไม่ใช่รีบผ่าน",
        media: [
          {
            type: "image",
            src: "/memories/images/first-date.jpg",
            alt: "รูปความทรงจำเดทแรก",
            caption: "เดทแรก"
          }
        ]
      },
      {
        text: "วันแรกที่ไปด้วยกันจริงๆ เรานั่งกินข้าวยาวจนร้านปิด แล้วเดินเล่นจนลืมว่ามีรถไฟต้องกลับ — ครบ 2 ปี 5 เดือนแล้วนะเพอร์ ทุกเดือนที่ผ่านไป ฉันยิ่งมั่นใจว่าเลือกเดินทางนี้ถูกแล้ว",
        media: [
          {
            type: "image",
            src: "/memories/images/cafe-lotus.jpg",
            alt: "ร้านกาแฟที่ไปด้วยกันบ่อย",
            caption: "ร้านลมหายใจ แถวสยาม"
          }
        ]
      },
      { text: "จากความทรงจำนี้ เกมจะแตกไปได้สองอารมณ์" }
    ],
    choices: [
      { label: "เล่าโมเมนต์ตลก", next: "funnyMemory", journal: "เก็บโมเมนต์ตลก" },
      { label: "เล่าช่วงที่ผ่านยาก", next: "hardSeason", journal: "เก็บบทที่โตไปด้วยกัน" },
      { label: "กลับจุดเริ่มต้น", next: "start", journal: "กลับเมืองความทรงจำ" }
    ]
  },
  birthday: {
    id: "birthday",
    speaker: "Birthday NPC",
    chapter: "เส้นทาง 12 กรกฎาคม",
    destination: "birthday",
    lines: [
      { text: "ป้ายข้างทางเขียนว่า 12 กรกฎาคม" },
      { text: "บทวันเกิดไม่ควรมีแค่คำว่า ขอให้มีความสุข นั่นฟังถูกแต่ยังไม่พิเศษพอ" },
      {
        text: "เพอร์เป็นคนที่อ่อนโยนแต่แข็งแกร่ง พูดน้อยแต่ใส่ใจลึกๆ และทุกครั้งที่ยิ้ม โลกรอบๆ ดูสว่างขึ้นจริงๆ — เธอไม่ชอบเป็นจุดสนใจ แต่ฉันอยากให้วันนี้เธอรู้สึกว่าถูกรักแบบเต็มๆ",
        media: [
          {
            type: "image",
            src: "/memories/images/birthday-cake.jpg",
            alt: "ภาพความทรงจำวันเกิด",
            caption: "เธอในวันที่ยิ้มแล้วโลกหยุด"
          }
        ]
      },
      { text: "ปลายทางมีทั้งกล่องของขวัญและจดหมาย เลือกว่าจะเปิดอะไรก่อน" }
    ],
    choices: [
      { label: "ของขวัญในเกม", next: "gift", journal: "พบกล่องของขวัญ" },
      { label: "จดหมายสั้น", next: "letter", journal: "พบจดหมายวันเกิด" },
      { label: "กลับจุดเริ่มต้น", next: "start", journal: "กลับเมืองความทรงจำ" }
    ]
  },
  childhood: {
    id: "childhood",
    speaker: "Family Memory",
    chapter: "บ้านหลังแรก",
    destination: "childhood",
    lines: [
      { text: "ทางซ้ายคือบ้านหลังแรกในสมุดความทรงจำ" },
      {
        text: "บ้านเกิดของเพอร์มีกลิ่นข้าวต้มหอมๆ ทุกเช้า แม่ทำให้ก่อนไปโรงเรียน แล้วบอกว่า กินให้อุ่นท้องก่อนออกไปสู้โลก",
        media: [
          {
            type: "image",
            src: "/memories/images/childhood-home.jpg",
            alt: "บ้านหลังแรกในความทรงจำ",
            caption: "บ้านที่มีกลิ่นข้าวต้มทุกเช้า"
          }
        ]
      },
      { text: "คุณย่าชอบเล่าเรื่องเก่าให้ฟังตอนเย็น ว่าเพอร์ตอนเด็กวิ่งตามแมวทั้งละแวกบ้าน — ครอบครัวภูมิใจที่เธอเป็นคนขยัน ไม่เคยยอมแพ้ง่ายๆ แม้บางวันจะเหนื่อยมาก" },
      { text: "เมื่อพร้อมแล้ว เลือกว่าจะเปิดวัยเด็กหรือวันที่เธอโตขึ้น" }
    ],
    choices: [
      { label: "วัยเด็ก", next: "kidYears", journal: "เปิดกล่องวัยเด็ก" },
      { label: "วันที่โตขึ้น", next: "growingUp", journal: "เปิดบทเติบโต" },
      { label: "กลับจุดเริ่มต้น", next: "start", journal: "กลับเมืองความทรงจำ" }
    ]
  },
  funnyMemory: {
    id: "funnyMemory",
    speaker: "Perthyw",
    chapter: "ฉากหัวเราะ",
    destination: "anniversaryJunction",
    lines: [
      { text: "บางความทรงจำไม่ได้ยิ่งใหญ่ แต่กลับจำแม่นกว่าเรื่องใหญ่ๆ" },
      {
        text: "ครั้งหนึ่ง GPS พาเราหลงเข้าซอยตัน แล้วเพอร์บอกว่า ระบบนำทางนี้เหมือนหัวใจฉันเลย — รู้ทางแต่ชอบเดินวน เรามีคำเรียกกันว่า โห mode ตอนสั่งเครื่องดื่มผิดแล้วทำหน้าเฉยทั้งคู่",
        media: [
          {
            type: "image",
            src: "/memories/images/funny-memory.jpg",
            alt: "วันที่หลงทางแต่หัวเราะได้",
            caption: "ซอยตันที่จำได้ทุกปี"
          }
        ]
      },
      { text: "ในรถเปิดเพลง รักแท้ ของ ฮิวโก้ จูเนียร์ ซ้ำสามรอบติด เพราะเพอร์บอกว่า รอบที่สี่จะได้ร้องเพลงประจำคู่เรา" },
      { text: "เกมมอบ badge ให้หนึ่งอัน เพราะการหัวเราะด้วยกันคือของดีมาก" }
    ],
    rewards: [{ type: "badge", id: "laugh", label: "Laugh" }],
    choices: [
      { label: "เก็บเป็น badge", next: "finalGate", journal: "ได้ badge: Laugh" },
      { label: "ไปวันเกิด", next: "birthday", journal: "เดินต่อไปวันเกิด" },
      { label: "กลับ", next: "anniversary", journal: "กลับเส้นทางครบรอบ" }
    ]
  },
  hardSeason: {
    id: "hardSeason",
    speaker: "Perthyw",
    chapter: "ฉากที่ไม่ง่าย",
    destination: "start",
    lines: [
      { text: "เส้นทางบางช่วงไม่ควรเล่าด้วยเสียงเศร้าเกินจริง" },
      {
        text: "มีช่วงที่เราทั้งคู่เหนื่อยจากงาน มาถึงบ้านแล้วเงียบกัน ไม่ได้ทะเลาะ แต่รู้สึกห่างกันนิดหน่อย — สิ่งที่ทำให้ยังเลือกเดินต่อคือ เรานั่งคุยกันจนรู้ว่า ทั้งคู่ยังอยากอยู่ด้วยกัน",
        media: [
          {
            type: "image",
            src: "/memories/images/hard-season.jpg",
            alt: "ช่วงเวลาที่ผ่านมาด้วยกัน",
            caption: "บทที่ไม่สวย แต่ทำให้เราเข้าใจกัน"
          }
        ]
      },
      { text: "ตอนนั้นเพอร์บอกว่า เราไม่ต้องสมบูรณ์แบบ แค่ต้องจริงใจ — ประโยคนั้นยังอยู่ในหัวฉันจนถึงวันนี้" },
      { text: "บทนี้ควรจบด้วยความรู้สึกว่า เราไม่ได้สมบูรณ์แบบ แต่เราเรียนรู้กันจริง" }
    ],
    rewards: [{ type: "badge", id: "brave", label: "Brave" }],
    choices: [
      { label: "เก็บเป็น badge", next: "finalGate", journal: "ได้ badge: Brave" },
      { label: "ไปวัยเด็ก", next: "childhood", journal: "เดินต่อไปบ้านความทรงจำ" },
      { label: "กลับ", next: "anniversary", journal: "กลับเส้นทางครบรอบ" }
    ]
  },
  gift: {
    id: "gift",
    speaker: "Birthday NPC",
    chapter: "กล่องของขวัญ",
    destination: "birthdayJunction",
    lines: [
      { text: "กล่องนี้ไม่จำเป็นต้องเป็นของแพง" },
      {
        text: "ของขวัญวันที่ 12 กรกฎาคม: เดทครบวัน — ข้าวมื้อเย็นที่ร้านที่เธอชอบ แล้วเดินเล่นที่สวนลุมตอนค่ำ พร้อมอัลบั้มรูปเล่มเล็กๆ จาก 2 ปี 5 เดือนที่ผ่านมา",
        media: [
          {
            type: "image",
            src: "/memories/images/gift-box.jpg",
            alt: "กล่องของขวัญวันเกิด",
            caption: "เซอร์ไพรส์วันที่ 12 ก.ค."
          }
        ]
      },
      { text: "และเค้กช็อกโกแลตจากร้านที่เธอเคยบอกว่าอร่อย — สั่งไว้แล้ว รอแค่วันเกิดมาถึง" },
      { text: "เมื่อเปิดกล่องแล้ว จะพาไปจดหมายหรือฉากสุดท้ายก็ได้" }
    ],
    choices: [
      { label: "เปิดจดหมาย", next: "letter", journal: "เปิดจดหมายวันเกิด" },
      { label: "ไปฉากสุดท้าย", next: "finalGate", journal: "นำของขวัญไปฉากสุดท้าย" },
      { label: "กลับ", next: "birthday", journal: "กลับเส้นทางวันเกิด" }
    ]
  },
  letter: {
    id: "letter",
    speaker: "You",
    chapter: "จดหมาย",
    destination: "finalJunction",
    lines: [
      {
        text: "จดหมายถูกพับไว้ในซองเล็กๆ",
        media: [
          {
            type: "image",
            src: "/memories/images/love-letter.jpg",
            alt: "จดหมายวันเกิด",
            caption: "จดหมายถึงเพอร์"
          }
        ]
      },
      { text: "สุขสันต์วันเกิดนะ Perthyw" },
      { text: "ขอบคุณที่โตมาเป็นคนที่ฉันได้รัก และขอบคุณที่ให้ฉันได้อยู่ในหลายหน้าของชีวิตเธอ — 2 ปี 5 เดือนที่ผ่านมา ฉันเรียนรู้ว่าความรักไม่ใช่แค่ช่วงที่สนุก แต่คือการเลือกอยู่ข้างกันทั้งวันธรรมดาและวันที่ยาก" },
      { text: "ปีนี้ขอให้เธอได้พักบ้าง ได้ทำในสิ่งที่ชอบ และรู้เสมอว่ามีคนที่ภูมิใจในตัวเธอมากที่สุด — ฉันเอง" }
    ],
    rewards: [{ type: "badge", id: "love-letter", label: "Love Letter" }],
    choices: [
      { label: "เก็บเป็น badge", next: "finalGate", journal: "ได้ badge: Love Letter" },
      { label: "ไปครอบครัว", next: "childhood", journal: "เดินต่อไปบทครอบครัว" },
      { label: "กลับ", next: "birthday", journal: "กลับเส้นทางวันเกิด" }
    ]
  },
  kidYears: {
    id: "kidYears",
    speaker: "Family Memory",
    chapter: "วัยเด็ก",
    destination: "childhoodJunction",
    lines: [
      {
        text: "กล่องวัยเด็กเปิดออกมาเป็นภาพเล็กๆ หลายใบ",
        media: [
          {
            type: "gallery",
            items: [
              {
                src: "/memories/images/kid-years.jpg",
                alt: "วัยเด็กของเพอร์",
                caption: "ตอนเล็กๆ"
              },
              {
                src: "/memories/images/family-gallery.jpg",
                alt: "ครอบครัว",
                caption: "คนที่เลี้ยงดู"
              }
            ]
          }
        ]
      },
      { text: "ตอนเด็กเพอร์ชอบกินขนมปังกรอบจุกๆ ที่แม่ซื้อมาจากตลาดเช้า มีตุ๊กตาหมีตัวหนึ่งชื่อ หมีน้อย ที่เธอหอบไปทุกที่ แม้ตอนนอนยังกอดไว้ไม่ปล่อย" },
      { text: "วันที่ฝนตกหนัก เธอกับพี่ชายกระโดดลงแอ่งน้ำฝน แล้วแม่ตะโกนว่า เดี๋ยวไข้ แต่ทั้งคู่หัวเราะจนลืมฟัง" },
      { text: "นี่คือบทที่ทำให้เว็บไม่ใช่แค่ของขวัญแฟน แต่เป็นบันทึกชีวิตของเธอด้วย" }
    ],
    rewards: [{ type: "badge", id: "little-star", label: "Little Star" }],
    choices: [
      { label: "วัยเรียน", next: "growingUp", journal: "เปิดบทวัยเรียน" },
      { label: "เก็บเป็น badge", next: "finalGate", journal: "ได้ badge: Little Star" },
      { label: "กลับ", next: "childhood", journal: "กลับบ้านหลังแรก" }
    ]
  },
  growingUp: {
    id: "growingUp",
    speaker: "Family Memory",
    chapter: "วันที่โตขึ้น",
    destination: "start",
    lines: [
      { text: "บางคนโตขึ้นอย่างเงียบๆ จนคนใกล้ตัวลืมหยุดมองว่าเธอพยายามมาแค่ไหน" },
      {
        text: "ช่วงมัธยม เพอร์ตั้งใจเรียนจนดึก มีวันที่เหนื่อยมากแต่ยังไม่ยอมทิ้งความฝันเรื่องการทำงานที่ชอบ — ครอบครัวภูมิใจตอนที่เธอได้รับรางวัลนักเรียนดีเด่น",
        media: [
          {
            type: "image",
            src: "/memories/images/growing-up.jpg",
            alt: "วันที่เธอโตขึ้น",
            caption: "ความพยายามที่ไม่มีใครเห็นทุกวัน"
          }
        ]
      },
      { text: "จุดเปลี่ยนคือวันที่เธอตัดสินใจออกจาก comfort zone ลองสิ่งใหม่ แล้วค้นพบว่าตัวเองกล้ากว่าที่คิด" },
      { text: "จากตรงนี้ เรื่องของครอบครัวจะค่อยๆ เชื่อมกลับไปหาเรื่องของคุณสองคน" }
    ],
    choices: [
      { label: "ไปจดหมาย", next: "letter", journal: "เชื่อมสู่อวยพรวันเกิด" },
      { label: "ไปฉากสุดท้าย", next: "finalGate", journal: "เดินสู่ฉากรวม" },
      { label: "กลับ", next: "childhood", journal: "กลับบ้านหลังแรก" }
    ]
  },
  finalGate: {
    id: "finalGate",
    speaker: "Perthyw",
    chapter: "สะพานสองวันสำคัญ",
    destination: "finalGate",
    lines: [
      { text: "ทุกเส้นทางกลับมาที่สะพานเดียวกัน" },
      { text: "ด้านหนึ่งคือวันที่ 9 กรกฎาคม วันที่ความรักนับเวลาเพิ่มขึ้นอีกหนึ่งบท" },
      { text: "อีกด้านคือวันที่ 12 กรกฎาคม วันที่โลกได้รู้จักเธอก่อนที่คุณจะได้รู้จัก" },
      { text: "ตอนจบควรให้เธอเลือกอารมณ์เอง: หวาน หรือขำๆ" }
    ],
    choices: [
      { label: "ฉากจบหวาน", next: "sweetEnding", journal: "เลือกฉากจบหวาน" },
      { label: "ฉากจบขำๆ", next: "playfulEnding", journal: "เลือกฉากจบขำๆ" },
      { label: "เล่นใหม่", next: "start", journal: "เริ่มเควสต์ใหม่" }
    ]
  },
  sweetEnding: {
    id: "sweetEnding",
    speaker: "You",
    chapter: "Ending",
    destination: "finalGate",
    lines: [
      {
        text: "ขอบคุณที่อยู่ด้วยกันมา 2 ปี 5 เดือน",
        media: [
          {
            type: "image",
            src: "/memories/images/placeholder.jpg",
            alt: "ความทรงจำของเรา",
            caption: "เราสองคน"
          }
        ]
      },
      { text: "Perthyw สุขสันต์วันเกิดล่วงหน้า ขอให้ปีนี้เป็นปีที่ใจดีกับเธอมากๆ" },
      { text: "ไม่ว่าเธอจะเลือกเส้นทางไหนในเกมนี้ ในชีวิตจริงฉันก็เลือกเธอทุกครั้ง" },
      { text: "ฉันรักเธอ — จบเควสต์ แต่ไม่จบเรื่องของเรา" }
    ],
    choices: [
      { label: "เล่นอีกครั้ง", next: "start", journal: "เริ่มเควสต์ใหม่" },
      { label: "ไปจดหมาย", next: "letter", journal: "กลับไปอ่านจดหมาย" },
      { label: "ไปวันเกิด", next: "birthday", journal: "กลับเส้นทางวันเกิด" }
    ]
  },
  playfulEnding: {
    id: "playfulEnding",
    speaker: "Perthyw",
    chapter: "Ending",
    destination: "finalGate",
    lines: [
      { text: "เควสต์สำเร็จ" },
      { text: "ผู้เล่นได้รับรางวัล: สิทธิ์กอด 1 ครั้ง อาหารอร่อย 1 มื้อ และคนรักที่ตั้งใจทำเว็บนี้ให้จริงๆ" },
      { text: "ระบบขอแจ้งว่า reward นี้ไม่สามารถแลกคืนเป็นเงินสดได้" },
      { text: "แต่แลกเป็นเดทครั้งต่อไปได้ ถ้าผู้เล่นยิ้มตอนอ่านถึงตรงนี้" }
    ],
    choices: [
      { label: "เล่นอีกครั้ง", next: "start", journal: "เริ่มเควสต์ใหม่" },
      { label: "ไปของขวัญ", next: "gift", journal: "กลับไปกล่องของขวัญ" },
      { label: "ไปครบรอบ", next: "anniversary", journal: "กลับเส้นทางครบรอบ" }
    ]
  }
};
