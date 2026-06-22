# Anniversary Quest - Demo Structure

## Concept

เว็บเป็นเกมเล่าเรื่องแบบ retro pixel RPG ที่ให้แฟนคุณเดินผ่าน 3 เส้นทางหลัก แล้วรวมเข้าฉากสุดท้าย:

1. วันที่ 9 กรกฎาคม: ครบรอบ 2 ปี 5 เดือน
2. วันที่ 12 กรกฎาคม: วันเกิดแฟน
3. บ้านความทรงจำ: เรื่องราววัยเด็ก ครอบครัว และการเติบโต

เดโม่นี้ตั้งใจทำเป็นโครง playable prototype ไม่ใช่เนื้อเรื่องจริง ข้อความที่อยู่ในวงเล็บ `[เติม...]` คือจุดที่ต้องใช้ข้อมูลจริงจากคุณหรือครอบครัวแฟนเท่านั้น

## Interaction Model

- แต่ละฉากมีหลายประโยคใน `lines`
- ผู้เล่นกด `PASS`, `Space`, หรือ `Enter` เพื่ออ่านประโยคถัดไป
- ถ้าข้อความกำลังพิมพ์อยู่ การกด `PASS` จะข้าม typing effect และแสดงประโยคเต็ม
- ตัวเลือก 3 ข้อจะแสดงเฉพาะหลังอ่านประโยคของฉากนั้นครบแล้ว
- เมื่อมีตัวเลือก ผู้เล่นกดปุ่มหรือกดเลข `1`, `2`, `3` ได้

## Map Model

แผนที่เป็นกราฟถนน ไม่ใช่ตำแหน่งอิสระ ตัวละครจะเดินจาก waypoint ปัจจุบันไป waypoint ปลายทางด้วย `findRoute()`:

```text
              9 JUL
                |
HOME - START - GATE
                |
              12 JUL
```

ในโค้ดจริงมี junction เพิ่มเพื่อให้เส้นทางเดินชัดขึ้น:

```text
anniversary <- anniversaryJunction
                                  |
childhood <- childhoodJunction - start - birthdayJunction -> birthday
                                  |
                           finalJunction -> finalGate
```

ข้อดีคือเวลาเพิ่มฉากใหม่ ให้กำหนดปลายทางบนแผนที่ แล้วปล่อยให้ระบบหา route เอง ตัวละครจะไม่เดินหลุดออกนอกถนน

## Main Flow

```text
Start: เมืองความทรงจำ
  -> Anniversary Path
    -> Funny Memory
    -> Hard Season
    -> Final Gate

  -> Birthday Path
    -> Gift
    -> Letter
    -> Final Gate

  -> Childhood Path
    -> Kid Years
    -> Growing Up
    -> Final Gate

Final Gate
  -> Sweet Ending
  -> Playful Ending
  -> Replay
```

## Content You Need To Collect

- รูปคู่ 6-10 รูป: วันแรกๆ, วันที่ตลก, วันที่ผ่านเรื่องยาก, รูปที่ชอบที่สุด
- เรื่องครอบครัวแฟน 3-5 เรื่อง: วัยเด็ก, บ้าน, คนที่เลี้ยงดู, เรื่องที่ครอบครัวภูมิใจ
- ประโยคเฉพาะของคู่คุณ: มุก คำเรียกกัน สถานที่ประจำ เพลงประจำ
- ของขวัญหรือกิจกรรมจริงในวันที่ 12 กรกฎาคม
- จดหมายสุดท้าย 1 ฉบับ ไม่ต้องยาว แต่ต้องเป็นภาษาของคุณจริงๆ

## Better Version After Demo

- เพิ่มระบบ inventory เช่น badge: Laugh, Brave, Little Star, Love Letter
- ใส่รูปเป็น memory card ที่ปลดล็อกตามตัวเลือก
- เพิ่มเพลง 8-bit แบบเปิดปิดได้
- เพิ่มฉากแผนที่หลายเมือง เช่น เมืองวันแรก, บ้านวัยเด็ก, สะพานวันเกิด
- เพิ่มรหัสลับจากวันสำคัญ เช่น 0907 หรือ 1207 เพื่อปลดล็อกจดหมายพิเศษ
- เพิ่ม waypoint ใหม่สำหรับสถานที่จริง เช่น ร้านแรกที่ไปด้วยกัน หรือบ้านของครอบครัว

## Next.js Implementation Notes

The Next.js version uses `lib/story/story-data.ts` as the source of truth for story nodes. Media files are referenced from `/public/memories/images` and `/public/memories/videos`.

Register access is controlled by `.env.local`:

- `ANNIVERSARY_ALLOWED_NAME`
- `ANNIVERSARY_ALLOWED_CODE`
- `ANNIVERSARY_COOKIE_SECRET`

Do not commit `.env.local`.
