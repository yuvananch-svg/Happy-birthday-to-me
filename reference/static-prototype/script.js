const mapPoints = {
  start: ["50%", "58%"],
  anniversaryJunction: ["28%", "58%"],
  anniversary: ["28%", "27%"],
  birthdayJunction: ["75%", "58%"],
  birthday: ["75%", "25%"],
  childhoodJunction: ["18%", "58%"],
  childhood: ["18%", "45%"],
  finalJunction: ["50%", "58%"],
  finalGate: ["50%", "35%"]
};

const mapGraph = {
  start: ["anniversaryJunction", "birthdayJunction", "childhoodJunction", "finalJunction"],
  anniversaryJunction: ["start", "anniversary"],
  anniversary: ["anniversaryJunction"],
  birthdayJunction: ["start", "birthday"],
  birthday: ["birthdayJunction"],
  childhoodJunction: ["start", "childhood"],
  childhood: ["childhoodJunction"],
  finalJunction: ["start", "finalGate"],
  finalGate: ["finalJunction"]
};

const story = {
  start: {
    speaker: "Pixel Guide",
    chapter: "เมืองความทรงจำ",
    route: ["start"],
    lines: [
      "ยินดีต้อนรับสู่เมืองความทรงจำ",
      "วันนี้ไม่ใช่เควสต์ธรรมดา เพราะมีสองวันสำคัญซ้อนกันอยู่ใกล้ๆ",
      "วันที่ 9 กรกฎาคมคือครบรอบ 2 ปี 5 เดือน และวันที่ 12 กรกฎาคมคือวันเกิดของเธอ",
      "ก่อนออกเดินทาง เลือกเส้นทางแรกที่อยากเปิดอ่าน"
    ],
    choices: [
      { label: "ไปวันที่ 9 ก.ค.", next: "anniversary", log: "เลือกเส้นทางครบรอบ" },
      { label: "ไปวันที่ 12 ก.ค.", next: "birthday", log: "เลือกเส้นทางวันเกิด" },
      { label: "เปิดสมุดวัยเด็ก", next: "childhood", log: "เปิดบทวัยเด็ก" }
    ]
  },
  anniversary: {
    speaker: "Pixel Guide",
    chapter: "เส้นทาง 9 กรกฎาคม",
    route: ["start", "anniversaryJunction", "anniversary"],
    lines: [
      "ถนนเส้นนี้พาเรากลับไปวันที่ความสัมพันธ์เริ่มมีน้ำหนักมากขึ้นเรื่อยๆ",
      "ไม่จำเป็นต้องเล่าทุกอย่างตั้งแต่วันแรก แค่เลือกฉากที่พอเปิดแล้วเธอจะพูดว่า จำได้",
      "ตรงนี้ควรใส่ความทรงจำจริง: [เติมความทรงจำวันสำคัญของคู่เรา]",
      "จากความทรงจำนี้ เกมจะแตกไปได้สองอารมณ์"
    ],
    choices: [
      { label: "เล่าโมเมนต์ตลก", next: "funnyMemory", log: "เก็บโมเมนต์ตลก" },
      { label: "เล่าช่วงที่ผ่านยาก", next: "hardSeason", log: "เก็บบทที่โตไปด้วยกัน" },
      { label: "กลับจุดเริ่มต้น", next: "start", log: "กลับเมืองความทรงจำ" }
    ]
  },
  birthday: {
    speaker: "Birthday NPC",
    chapter: "เส้นทาง 12 กรกฎาคม",
    route: ["start", "birthdayJunction", "birthday"],
    lines: [
      "ป้ายข้างทางเขียนว่า 12 กรกฎาคม",
      "บทวันเกิดไม่ควรมีแค่คำว่า ขอให้มีความสุข นั่นฟังถูกแต่ยังไม่พิเศษพอ",
      "ให้เล่าว่าเธอเป็นคนแบบไหนในสายตาคุณ: [เติมนิสัยหรือคุณค่าที่คุณรักในตัวเธอ]",
      "ปลายทางมีทั้งกล่องของขวัญและจดหมาย เลือกว่าจะเปิดอะไรก่อน"
    ],
    choices: [
      { label: "ของขวัญในเกม", next: "gift", log: "พบกล่องของขวัญ" },
      { label: "จดหมายสั้น", next: "letter", log: "พบจดหมายวันเกิด" },
      { label: "กลับจุดเริ่มต้น", next: "start", log: "กลับเมืองความทรงจำ" }
    ]
  },
  childhood: {
    speaker: "Family Memory",
    chapter: "บ้านหลังแรก",
    route: ["start", "childhoodJunction", "childhood"],
    lines: [
      "ทางซ้ายคือบ้านหลังแรกในสมุดความทรงจำ",
      "บทนี้ต้องใช้ข้อมูลจริงเท่านั้น เพราะเรื่องครอบครัวแต่งแทนกันไม่ได้",
      "ให้เก็บเรื่องเล็กๆ ที่บ้านยังจำได้ เช่น ของกินที่ชอบ คนที่ดูแล หรือเรื่องที่ครอบครัวภูมิใจ",
      "เมื่อพร้อมแล้ว เลือกว่าจะเปิดวัยเด็กหรือวันที่เธอโตขึ้น"
    ],
    choices: [
      { label: "วัยเด็ก", next: "kidYears", log: "เปิดกล่องวัยเด็ก" },
      { label: "วันที่โตขึ้น", next: "growingUp", log: "เปิดบทเติบโต" },
      { label: "กลับจุดเริ่มต้น", next: "start", log: "กลับเมืองความทรงจำ" }
    ]
  },
  funnyMemory: {
    speaker: "Pixel Guide",
    chapter: "ฉากหัวเราะ",
    route: ["anniversary", "anniversaryJunction", "start", "childhoodJunction"],
    lines: [
      "บางความทรงจำไม่ได้ยิ่งใหญ่ แต่กลับจำแม่นกว่าเรื่องใหญ่ๆ",
      "อาจเป็นคำพูดติดปาก ร้านที่ไปแล้วเจอเรื่องแปลก หรือวันที่หลงทางแบบน่าหัวเราะ",
      "ใส่เหตุการณ์เฉพาะของคู่คุณตรงนี้: [เติมมุกหรือโมเมนต์ตลก]",
      "เกมมอบ badge ให้หนึ่งอัน เพราะการหัวเราะด้วยกันคือของดีมาก"
    ],
    choices: [
      { label: "เก็บเป็น badge", next: "finalGate", log: "ได้ badge: Laugh" },
      { label: "ไปวันเกิด", next: "birthday", log: "เดินต่อไปวันเกิด" },
      { label: "กลับ", next: "anniversary", log: "กลับเส้นทางครบรอบ" }
    ]
  },
  hardSeason: {
    speaker: "Pixel Guide",
    chapter: "ฉากที่ไม่ง่าย",
    route: ["anniversary", "anniversaryJunction", "start"],
    lines: [
      "เส้นทางบางช่วงไม่ควรเล่าด้วยเสียงเศร้าเกินจริง",
      "เล่าให้ตรงก็พอว่าเคยผ่านอะไร และอะไรทำให้ยังเลือกเดินต่อด้วยกัน",
      "ตรงนี้ใส่ช่วงเวลาที่โตไปด้วยกัน: [เติมเรื่องจริงที่ผ่านยากแต่สำคัญ]",
      "บทนี้ควรจบด้วยความรู้สึกว่า เราไม่ได้สมบูรณ์แบบ แต่เราเรียนรู้กันจริง"
    ],
    choices: [
      { label: "เก็บเป็น badge", next: "finalGate", log: "ได้ badge: Brave" },
      { label: "ไปวัยเด็ก", next: "childhood", log: "เดินต่อไปบ้านความทรงจำ" },
      { label: "กลับ", next: "anniversary", log: "กลับเส้นทางครบรอบ" }
    ]
  },
  gift: {
    speaker: "Birthday NPC",
    chapter: "กล่องของขวัญ",
    route: ["birthday", "birthdayJunction"],
    lines: [
      "กล่องนี้ไม่จำเป็นต้องเป็นของแพง",
      "แต่มันควรเชื่อมกับสิ่งที่เธอชอบจริง เช่น เดทหนึ่งวัน รูปหนึ่งเซ็ต หรือเพลงหนึ่งเพลง",
      "ตัวอย่างช่องข้อมูล: [เติมของขวัญหรือแผนเซอร์ไพรส์วันที่ 12 กรกฎาคม]",
      "เมื่อเปิดกล่องแล้ว จะพาไปจดหมายหรือฉากสุดท้ายก็ได้"
    ],
    choices: [
      { label: "เปิดจดหมาย", next: "letter", log: "เปิดจดหมายวันเกิด" },
      { label: "ไปฉากสุดท้าย", next: "finalGate", log: "นำของขวัญไปฉากสุดท้าย" },
      { label: "กลับ", next: "birthday", log: "กลับเส้นทางวันเกิด" }
    ]
  },
  letter: {
    speaker: "You",
    chapter: "จดหมาย",
    route: ["birthdayJunction", "start", "finalJunction"],
    lines: [
      "จดหมายถูกพับไว้ในซองเล็กๆ",
      "สุขสันต์วันเกิดนะ [ชื่อแฟน]",
      "ขอบคุณที่โตมาเป็นคนที่ฉันได้รัก และขอบคุณที่ให้ฉันได้อยู่ในหลายหน้าของชีวิตเธอ",
      "ถ้าจะทำให้แรงกว่านี้ ให้เปลี่ยนประโยคสุดท้ายเป็นภาษาของคุณเอง อย่าใช้ประโยคที่ดูดีแต่ไม่ใช่คุณ"
    ],
    choices: [
      { label: "เก็บเป็น badge", next: "finalGate", log: "ได้ badge: Love Letter" },
      { label: "ไปครอบครัว", next: "childhood", log: "เดินต่อไปบทครอบครัว" },
      { label: "กลับ", next: "birthday", log: "กลับเส้นทางวันเกิด" }
    ]
  },
  kidYears: {
    speaker: "Family Memory",
    chapter: "วัยเด็ก",
    route: ["childhood", "childhoodJunction"],
    lines: [
      "กล่องวัยเด็กเปิดออกมาเป็นภาพเล็กๆ หลายใบ",
      "อาจเป็นของเล่นที่ชอบ อาหารที่บ้านทำให้ หรือเรื่องที่ครอบครัวยังเล่าอยู่เสมอ",
      "ช่องนี้ควรใส่รูปหรือเสียงจากครอบครัว ถ้าขอมาได้จะดีมาก",
      "นี่คือบทที่ทำให้เว็บไม่ใช่แค่ของขวัญแฟน แต่เป็นบันทึกชีวิตของเธอด้วย"
    ],
    choices: [
      { label: "วัยเรียน", next: "growingUp", log: "เปิดบทวัยเรียน" },
      { label: "เก็บเป็น badge", next: "finalGate", log: "ได้ badge: Little Star" },
      { label: "กลับ", next: "childhood", log: "กลับบ้านหลังแรก" }
    ]
  },
  growingUp: {
    speaker: "Family Memory",
    chapter: "วันที่โตขึ้น",
    route: ["childhood", "childhoodJunction", "start"],
    lines: [
      "บางคนโตขึ้นอย่างเงียบๆ จนคนใกล้ตัวลืมหยุดมองว่าเธอพยายามมาแค่ไหน",
      "บทนี้ควรเล่าความฝัน ความพยายาม หรือจุดเปลี่ยนที่ทำให้เธอเป็นเธอในวันนี้",
      "เติมข้อมูลจริงตรงนี้: [เติมเรื่องการเติบโต จุดเปลี่ยน หรือสิ่งที่เธอภูมิใจ]",
      "จากตรงนี้ เรื่องของครอบครัวจะค่อยๆ เชื่อมกลับไปหาเรื่องของคุณสองคน"
    ],
    choices: [
      { label: "ไปจดหมาย", next: "letter", log: "เชื่อมสู่อวยพรวันเกิด" },
      { label: "ไปฉากสุดท้าย", next: "finalGate", log: "เดินสู่ฉากรวม" },
      { label: "กลับ", next: "childhood", log: "กลับบ้านหลังแรก" }
    ]
  },
  finalGate: {
    speaker: "Pixel Guide",
    chapter: "สะพานสองวันสำคัญ",
    route: ["start", "finalJunction", "finalGate"],
    lines: [
      "ทุกเส้นทางกลับมาที่สะพานเดียวกัน",
      "ด้านหนึ่งคือวันที่ 9 กรกฎาคม วันที่ความรักนับเวลาเพิ่มขึ้นอีกหนึ่งบท",
      "อีกด้านคือวันที่ 12 กรกฎาคม วันที่โลกได้รู้จักเธอก่อนที่คุณจะได้รู้จัก",
      "ตอนจบควรให้เธอเลือกอารมณ์เอง: หวาน หรือขำๆ"
    ],
    choices: [
      { label: "ฉากจบหวาน", next: "sweetEnding", log: "เลือกฉากจบหวาน" },
      { label: "ฉากจบขำๆ", next: "playfulEnding", log: "เลือกฉากจบขำๆ" },
      { label: "เล่นใหม่", next: "start", log: "เริ่มเควสต์ใหม่" }
    ]
  },
  sweetEnding: {
    speaker: "You",
    chapter: "Ending",
    route: ["finalGate"],
    lines: [
      "ขอบคุณที่อยู่ด้วยกันมา 2 ปี 5 เดือน",
      "และสุขสันต์วันเกิดล่วงหน้า ขอให้ปีนี้เป็นปีที่ใจดีกับเธอมากๆ",
      "ฉันรักเธอ",
      "จบเควสต์ แต่ไม่จบเรื่องของเรา"
    ],
    choices: [
      { label: "เล่นอีกครั้ง", next: "start", log: "เริ่มเควสต์ใหม่" },
      { label: "ไปจดหมาย", next: "letter", log: "กลับไปอ่านจดหมาย" },
      { label: "ดูโครงเรื่อง", next: "structure", log: "ดูโครงสร้างเกม" }
    ]
  },
  playfulEnding: {
    speaker: "Pixel Guide",
    chapter: "Ending",
    route: ["finalGate"],
    lines: [
      "เควสต์สำเร็จ",
      "ผู้เล่นได้รับรางวัล: สิทธิ์กอด 1 ครั้ง อาหารอร่อย 1 มื้อ และคนรักที่ตั้งใจทำเว็บนี้ให้จริงๆ",
      "ระบบขอแจ้งว่า reward นี้ไม่สามารถแลกคืนเป็นเงินสดได้",
      "แต่แลกเป็นเดทครั้งต่อไปได้ ถ้าผู้เล่นยิ้มตอนอ่านถึงตรงนี้"
    ],
    choices: [
      { label: "เล่นอีกครั้ง", next: "start", log: "เริ่มเควสต์ใหม่" },
      { label: "ไปของขวัญ", next: "gift", log: "กลับไปกล่องของขวัญ" },
      { label: "ดูโครงเรื่อง", next: "structure", log: "ดูโครงสร้างเกม" }
    ]
  },
  structure: {
    speaker: "System",
    chapter: "Demo Note",
    route: ["finalGate", "finalJunction", "start"],
    lines: [
      "โครงหลักมี 3 เส้นทาง: ความรัก วันเกิด และครอบครัว",
      "ทุกเส้นทางมีหลายประโยคให้กด PASS อ่านต่อก่อนเจอตัวเลือก",
      "ตัวละครเดินบน waypoint ที่กำหนดไว้เท่านั้น เพื่อไม่หลุดออกนอกถนน",
      "เวอร์ชันถัดไปควรเพิ่มรูปจริง เพลง 8-bit และระบบ inventory ของ badge"
    ],
    choices: [
      { label: "เริ่มใหม่", next: "start", log: "เริ่มเควสต์ใหม่" },
      { label: "ไปครบรอบ", next: "anniversary", log: "กลับเส้นทางครบรอบ" },
      { label: "ไปวันเกิด", next: "birthday", log: "กลับเส้นทางวันเกิด" }
    ]
  }
};

const speaker = document.querySelector("#speaker");
const chapter = document.querySelector("#chapter");
const dialogue = document.querySelector("#dialogue");
const choices = document.querySelector("#choices");
const hero = document.querySelector("#hero");
const journalList = document.querySelector("#journalList");
const passButton = document.querySelector("#passButton");
const progressHint = document.querySelector("#progressHint");

let currentNodeKey = "start";
let lineIndex = 0;
let typeTimer;
let fullLine = "";
let isTyping = false;
let choicesVisible = false;
let routeTimer;
let currentPointKey = "start";

function findRoute(from, to) {
  if (from === to) return [from];

  const queue = [[from]];
  const visited = new Set([from]);

  while (queue.length > 0) {
    const route = queue.shift();
    const last = route[route.length - 1];
    const neighbors = mapGraph[last] || [];

    for (const neighbor of neighbors) {
      if (visited.has(neighbor)) continue;

      const nextRoute = [...route, neighbor];
      if (neighbor === to) return nextRoute;

      visited.add(neighbor);
      queue.push(nextRoute);
    }
  }

  return [from, to];
}

function setHeroPosition(pointKey) {
  const point = mapPoints[pointKey] || mapPoints.start;
  hero.style.setProperty("--x", point[0]);
  hero.style.setProperty("--y", point[1]);
}

function walkRoute(route) {
  clearTimeout(routeTimer);
  const steps = route && route.length ? route : ["start"];
  let stepIndex = 0;

  setHeroPosition(steps[stepIndex]);

  function nextStep() {
    stepIndex += 1;
    if (stepIndex >= steps.length) {
      currentPointKey = steps[steps.length - 1];
      return;
    }

    setHeroPosition(steps[stepIndex]);
    routeTimer = setTimeout(nextStep, 390);
  }

  if (steps.length === 1) {
    currentPointKey = steps[0];
    return;
  }

  routeTimer = setTimeout(nextStep, 390);
}

function typeLine(text) {
  clearInterval(typeTimer);
  dialogue.textContent = "";
  fullLine = text;
  isTyping = true;

  let index = 0;
  typeTimer = setInterval(() => {
    dialogue.textContent += text[index];
    index += 1;

    if (index >= text.length) {
      clearInterval(typeTimer);
      isTyping = false;
    }
  }, 18);
}

function completeCurrentLine() {
  clearInterval(typeTimer);
  dialogue.textContent = fullLine;
  isTyping = false;
}

function addLog(text) {
  if (!text) return;

  const item = document.createElement("li");
  item.textContent = text;
  journalList.prepend(item);

  while (journalList.children.length > 7) {
    journalList.removeChild(journalList.lastElementChild);
  }
}

function updateHint(node) {
  if (choicesVisible) {
    progressHint.textContent = "เลือกคำตอบ หรือกดเลข 1-3";
    passButton.textContent = "READ";
    return;
  }

  const current = lineIndex + 1;
  const total = node.lines.length;
  progressHint.textContent = `ประโยค ${current}/${total} - กด PASS หรือ Space`;
  passButton.textContent = isTyping ? "SKIP" : "PASS";
}

function showChoices(node) {
  choicesVisible = true;
  choices.classList.remove("is-hidden");
  choices.innerHTML = "";

  node.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.textContent = `${index + 1}. ${choice.label}`;
    button.addEventListener("click", () => render(choice.next, choice.log));
    choices.appendChild(button);
  });

  updateHint(node);
}

function advanceLine() {
  const node = story[currentNodeKey];

  if (isTyping) {
    completeCurrentLine();
    updateHint(node);
    return;
  }

  if (choicesVisible) return;

  if (lineIndex < node.lines.length - 1) {
    lineIndex += 1;
    typeLine(node.lines[lineIndex]);
    updateHint(node);
    return;
  }

  showChoices(node);
}

function render(nodeKey, logText) {
  const node = story[nodeKey];
  if (!node) return;

  currentNodeKey = nodeKey;
  lineIndex = 0;
  choicesVisible = false;
  speaker.textContent = node.speaker;
  chapter.textContent = node.chapter;
  choices.innerHTML = "";
  choices.classList.add("is-hidden");

  addLog(logText);
  const destination = node.route[node.route.length - 1];
  walkRoute(findRoute(currentPointKey, destination));
  typeLine(node.lines[lineIndex]);
  updateHint(node);
}

passButton.addEventListener("click", advanceLine);

document.addEventListener("keydown", (event) => {
  const node = story[currentNodeKey];

  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    advanceLine();
    return;
  }

  if (!choicesVisible) return;

  const numeric = Number(event.key);
  if (numeric >= 1 && numeric <= node.choices.length) {
    const choice = node.choices[numeric - 1];
    render(choice.next, choice.log);
  }
});

render("start");
