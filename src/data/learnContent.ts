export interface LearnArticle {
  id: string
  title: string
  summary: string
  body: string
}

export interface LearnCategory {
  id: string
  title: string
  emoji: string
  articles: LearnArticle[]
}

export const learnCategories: LearnCategory[] = [
  {
    id: 'understanding-your-cycle',
    title: 'Understanding your cycle',
    emoji: '🌙',
    articles: [
      {
        id: 'four-phases',
        title: 'The four phases of a cycle',
        summary: 'A simple look at the menstrual, follicular, ovulation, and luteal phases.',
        body: 'A menstrual cycle is usually described as a sequence of phases, rather than a single event. The menstrual phase is when bleeding happens and the uterine lining is shed. The follicular phase follows, when the body starts preparing a new egg and hormone levels begin to rise.\n\nOvulation is the brief window when an egg is released, often around the middle of a cycle. After that comes the luteal phase, when the body shifts into a more settled, hormone-rich pattern in case pregnancy happens.\n\nThese phases can overlap with symptoms, energy, mood, and fertility signs. The exact timing varies from person to person, and many people notice it changes a little from cycle to cycle as life stress, sleep, and other factors shift.\n\nA cycle is not a test of health or worth. It is a normal biological rhythm that can be tracked for patterns, not judged by a single month.'
      },
      {
        id: 'normal-range',
        title: 'What counts as a normal range',
        summary: 'Typical cycle and period ranges are broad, and variation is common.',
        body: 'Cycle length and period length are usually discussed as a range rather than a strict target. A cycle is commonly considered to last about 21 to 35 days from the start of one period to the start of the next, though some people are a bit shorter or longer. Periods commonly last around 3 to 7 days, and flow can range from light to moderate or heavy across different cycles.\n\nIt is also normal for a cycle to change slightly with stress, travel, exercise, illness, or different routines. What matters more than a single number is whether your pattern is usually consistent for you, and whether it changes clearly or unexpectedly over time.\n\nOne missed period or one heavier-than-usual period does not necessarily mean anything specific by itself. Patterns matter more than isolated dates. If the pattern is unusually unpredictable or includes pain or bleeding that stands out, that is worth discussing with a doctor.'
      },
      {
        id: 'prediction-limitations',
        title: 'How Luna estimates your cycle',
        summary: 'Predictions are calendar-based estimates, useful for spotting patterns but not exact forecasts.',
        body: 'This app uses your logged period dates and average cycle patterns to estimate when a next period or fertile window may happen. That means the dates are based on patterns in your history, not direct hormone measurements, ultrasound, or a medical assessment.\n\nThese estimates are helpful for noticing rhythm and planning ahead, but they are not certainties. Cycles can shift, and a person may have a period earlier or later than expected for many reasons. A prediction is best understood as an estimate, not a guarantee.\n\nThat is why the app keeps the language clear and calm: helpful guidance, not a diagnosis. A calendar estimate can be useful context, but it should not replace a clinician’s advice when something feels different or unusual.'
      }
    ]
  },
  {
    id: 'what-affects-your-cycle',
    title: 'What affects your cycle',
    emoji: '🌿',
    articles: [
      {
        id: 'stress-and-cycle',
        title: 'Stress can shift timing',
        summary: 'Stress may affect cycle timing, but it usually changes patterns rather than causing a single clear outcome.',
        body: 'Stress is one of the most common reasons a cycle can move earlier or later than usual. The body is very responsive to emotional and physical strain, and that can influence hormone rhythms over time. It is not a sign that something is wrong, just a common factor that can change timing.\n\nStress can also make symptoms feel stronger, especially mood swings, sleep changes, and bloating. A stressful week may not change the whole cycle dramatically, but it can make the pattern less predictable for a month or two.\n\nThis is why a cycle can feel “off” without being a medical emergency. A calm, factual view is usually the most helpful: track the pattern, notice if it keeps repeating, and talk to a clinician if it becomes consistently unusual.'
      },
      {
        id: 'weight-and-nutrition',
        title: 'Weight changes and nutrition',
        summary: 'Enough energy, consistent eating, and body changes can all influence cycle regularity.',
        body: 'Changes in body weight, eating patterns, or energy availability can affect the hormones that drive the cycle. In some people, significant weight loss, restricted eating, or long periods of low energy can make periods less regular or stop them altogether. In other cases, weight gain can also shift timing.\n\nNutrition matters too, not because one food causes a cycle issue, but because the body needs steady fuel and micronutrients to support regular hormone function. Hard dieting, high-intensity training, or very erratic eating can all affect the rhythm.\n\nThis does not mean a person is doing something wrong. It simply means the body is responding to the broader pattern of health, stress, and lifestyle. This is one reason that exercise, weight, and nutrition are often discussed together when looking at cycle changes.'
      },
      {
        id: 'exercise',
        title: 'Exercise and recovery',
        summary: 'Exercise is often helpful, but very intense training and poor recovery can affect cycle regularity.',
        body: 'Regular movement is generally good for well-being, but intense or prolonged training can sometimes affect cycle timing. The body may respond to a higher physical load, lower rest, or reduced energy availability by shifting when the next period starts or how regular the cycle feels.\n\nThis is not a moral issue or a sign of “doing too much.” It is a biological response to stress and recovery. In some people, dropping training volume or improving recovery can help cycles settle again.\n\nWhen exercise is part of a broader pattern with sleep changes or nutrition, it is often wise to consider all of them together rather than focusing on one factor in isolation.'
      },
      {
        id: 'sleep-and-travel',
        title: 'Sleep and travel',
        summary: 'Jet lag, shift work, and disrupted sleep can temporarily throw off your rhythm.',
        body: 'Sleep patterns have a strong relationship with hormone rhythm. Jet lag, shift work, and inconsistent nighttime routines can all make a cycle feel less predictable for a short time. Some people notice a later period, a heavier flow, or more intense symptoms after a period of disrupted sleep or travel.\n\nThis does not automatically mean anything serious. In many cases, the cycle returns to a more familiar pattern once the schedule stabilizes. A person may also notice more fatigue, mood changes, or bloating during a disrupted period.\n\nTemporary changes are common. If they happen repeatedly over many months, it is reasonable to bring the pattern to a doctor and ask whether it is worth reviewing together.'
      },
      {
        id: 'illness-and-medication',
        title: 'Illness and medication',
        summary: 'Some illnesses and medicines can change bleeding, timing, or symptom intensity for a while.',
        body: 'Acute illness, fever, and sudden stress on the body can all affect the cycle. A person may notice a period arrives earlier or later, the flow seems different, or symptoms feel more intense. This can happen during a virus, a period of poor sleep, or after a big emotional or physical strain.\n\nMedication can have similar effects. Certain drugs, including some hormonal medicines, pain relievers, and anti-inflammatory treatments, may influence bleeding or cycle timing. Not every medicine causes changes, but it is common enough that it is worth noting.\n\nThe important thing is not to panic over a single month. A doctor can help sort out whether a change is likely related to illness or medication, especially if it keeps happening.'
      },
      {
        id: 'hormonal-contraception',
        title: 'Hormonal contraception and bleeding',
        summary: 'Bleeding on hormonal birth control is not always a “true” period because it may be withdrawal bleeding or scheduled bleeding.',
        body: 'Hormonal contraception works by changing the body’s usual hormone pattern, which means bleeding can look different from a typical natural cycle. Some people have breakthrough bleeding, spotting, or planned bleeding during a pill-free week, and this is not always the same as an ovulation-based period.\n\nThis is a big reason that a bleed while on hormonal contraception is often not treated as a “true” menstrual period in the same way as a natural cycle. The bleeding may be a withdrawal bleed from the hormones, rather than the lining being shed in the usual cycle pattern.\n\nThat does not mean the bleeding is meaningless or “fake.” It simply means it is being influenced by a medication. If bleeding is heavy, persistent, or unexpected, it is still worth discussing with a clinician.'
      },
      {
        id: 'perimenopause',
        title: 'Perimenopause and changing cycles',
        summary: 'Cycles can become less predictable during perimenopause, which is a natural transition rather than a diagnosis in itself.',
        body: 'Perimenopause is the transition period before menopause when ovaries gradually become less predictable in their hormone output. During this time, cycles may become shorter, longer, or more irregular. Some people also notice heavier bleeding, more intense PMS, or hot flashes.\n\nThis phase can begin in a person’s 40s or even earlier, depending on overall health and genetics. It is a common life stage, but it can still be unexpected and uncomfortable.\n\nA changing cycle does not automatically mean something is wrong, but it is still something to bring up with a doctor if it feels disruptive or if the bleeding patterns change in a way that is concerning. The goal is understanding, not alarm.'
      }
    ]
  },
  {
    id: 'common-symptoms',
    title: 'Common symptoms, explained',
    emoji: '💫',
    articles: [
      {
        id: 'cramps',
        title: 'Cramps and pelvic pressure',
        summary: 'Period cramps are common, but severe or unusual pain is a reason to ask for medical guidance.',
        body: 'Cramps are among the most common symptoms around the period, especially during the first one to two days. In many people they come from the uterus tightening and relaxing as it sheds the lining. The sensation may feel dull, sharp, or like pressure in the lower abdomen and back.\n\nSome people find cramps are mild and manageable; others find them difficult enough to affect daily life. Mild cramps often improve with rest, heat, movement, or simple pain relief. More intense pain, pain that continues beyond the period, or one-sided pain may deserve extra attention.\n\nPain can have different causes, and some patterns point to conditions that need evaluation. If cramps are severe, unusual, or steadily worsening, that is a good time to speak with a doctor rather than trying to interpret it alone.'
      },
      {
        id: 'pms-and-mood',
        title: 'PMS and mood changes',
        summary: 'Mood shifts around the cycle are common, while PMDD is a more intense pattern that deserves a different conversation.',
        body: 'Many people notice mood changes in the days before a period, such as irritability, sadness, feeling overwhelmed, or a lower tolerance for stress. This is often referred to as PMS, and it can range from mild to more noticeable. Sleep, hormones, and changing energy levels can all contribute.\n\nPMDD is a more severe form of this pattern, with intense mood symptoms that interfere with work, relationships, or daily routines. It is not the same as normal mood shifts and is worth discussing with a doctor if it is intense or recurring.\n\nThe key point is that mood changes around the cycle are common, but they are not always “just hormones.” If they are frequent, severe, or feel out of proportion to your usual experience, that is a good time to seek professional support.'
      },
      {
        id: 'bloating',
        title: 'Bloating and water retention',
        summary: 'Bloating is commonly linked to hormone shifts and can be temporary, frustrating, and very variable.',
        body: 'Bloating often shows up in the days before or during a period, when fluid retention increases and the digestive system can feel a little slower or more sensitive. A swollen, uncomfortable feeling in the abdomen can also be related to gas, constipation, or general hormonal shifts.\n\nThe experience can vary a lot from cycle to cycle. It may be mild and brief, or feel uncomfortable enough to affect clothing, appetite, or energy. A gentle rhythm of hydration, movement, and balanced meals can help some people feel better, but it is not a guaranteed fix.\n\nBloating is common and often temporary, but if it becomes severe or is joined by other symptoms that feel new or unusual, it is reasonable to mention it to a doctor.'
      },
      {
        id: 'headaches-migraines',
        title: 'Headaches and migraines',
        summary: 'Some headaches are tied to the cycle, while others are part of a broader pattern that deserves attention.',
        body: 'Headaches and migraines can become more common in the lead-up to a period, especially when hormone levels shift. They may be mild and brief or more intense, with sensitivity to light, sound, or movement. The exact pattern varies, and not everyone experiences the same type of headache.\n\nStress, poor sleep, dehydration, and changes in routine can also make headaches worse. That is why it can help to notice where they fall in the cycle and whether they are coming with other symptoms such as nausea, mood changes, or breast tenderness.\n\nA pattern that repeats or becomes severe is worth discussing with a doctor. Not every headache is cycle-related, and it can be helpful to look at the broader picture rather than assume one cause.'
      },
      {
        id: 'breast-tenderness',
        title: 'Breast tenderness',
        summary: 'Tender or sore breasts can be a normal part of the cycle, especially in the late luteal phase.',
        body: 'Breast tenderness is common in the days leading up to a period. Some people notice a heavy, sore, or swollen feeling that is mild and transient, while others find it more uncomfortable. It is linked to hormone changes, especially around the late luteal phase.\n\nThis usually improves once the period starts or the cycle shifts. A supportive bra, reducing caffeine if that helps you, and keeping an eye on your usual pattern can make it easier to manage.\n\nIf breast tenderness becomes persistent, severe, or is new in a way that feels unusual, it is wise to speak with a doctor, not because it is necessarily serious, but because that kind of pattern deserves context.'
      }
    ]
  },
  {
    id: 'when-to-talk-to-doctor',
    title: 'When to talk to a doctor',
    emoji: '🩺',
    articles: [
      {
        id: 'red-flags-patterns',
        title: 'Bleeding and pain patterns worth noting',
        summary: 'Specific patterns are easier to explain and track than vague worries.',
        body: 'It can be helpful to notice patterns rather than guessing based on one symptom. A few examples that are worth raising with a clinician include:\n\n- bleeding that lasts longer than 7 to 8 days\n- very heavy bleeding that soaks through a pad or tampon every hour for several hours\n- periods that are much shorter than usual or stop and start unpredictably\n- cycles that are consistently very short, such as fewer than 21 days, or very long, such as more than 35 days\n- no period for 3 months or more when it is otherwise not expected\n- sudden, severe pain that is not typical for you\n- bleeding between periods or after sex\n- any bleeding after menopause\n\nThese patterns do not automatically mean anything serious, but they are concrete details that help a clinician understand the situation. Exported log data in this app can make that conversation more grounded and easier to follow.'
      },
      {
        id: 'missed-periods',
        title: 'Missed periods, pain, and changes over time',
        summary: 'Sudden changes in cycle pattern or pain deserve context and a proper medical conversation.',
        body: 'A cycle that suddenly becomes very irregular, or a period that repeatedly does not arrive when it usually does, is worth paying attention to. A missed period can happen for many reasons, including stress, travel, illness, major lifestyle changes, or pregnancy. It is not automatically a problem, but if it happens many times or you notice the pattern is changing in a new way, it is reasonable to talk about it with a doctor.\n\nPain matters too. If cramps are severe enough to interfere with normal movement, or if there is deep pain outside the usual period window, that is not something to ignore. The goal is not to panic, but to gather clear information.\n\nTracking symptoms in a consistent way helps a clinician ask the right questions. This app can help you keep a trail of dates, symptoms, and flow changes so the conversation is practical and specific.'
      }
    ]
  },
  {
    id: 'fertility-basics',
    title: 'Fertility basics',
    emoji: '🌼',
    articles: [
      {
        id: 'fertile-window',
        title: 'What the fertile window is',
        summary: 'Fertility is often spread across several days, not a single day.',
        body: 'The fertile window is the time when pregnancy is more likely to happen if sperm are present. It is not just one exact day, because sperm can survive for a short time and an egg may remain viable for a period of time after it is released. That means the fertile window is often a range of a few days rather than one narrow moment.\n\nA person may notice signs such as cervical mucus changes, a mild rise in body temperature, or a shift in energy or mood, but these are not always obvious. The window can also change from cycle to cycle, so trying to predict it precisely from a calendar alone is not always reliable.\n\nUnderstanding the fertile window is helpful for planning, but it is not the same as a medical recommendation. It is a general explanation of physiology, not a personal fertility plan.'
      },
      {
        id: 'calendar-predictions-not-contraception',
        title: 'Calendar estimates are not a guarantee',
        summary: 'Estimated fertile days can be useful context, but they are not a stand-in for precise contraception.',
        body: 'Calendar-based prediction can estimate a likely fertility window, but it is not a reliable way to prevent pregnancy on its own. Cycles vary, hormones can shift, and even a “typical” pattern does not guarantee the same timing each month.\n\nFor real contraception guidance, more precise methods such as condoms, hormonal contraception, IUDs, or a clinician’s recommendations are usually more dependable. A healthcare provider can help match a method to your routine, health history, and preferences.\n\nThis app should be used as a general educational and tracking tool, not as a literal guarantee of fertility or pregnancy risk. That is why the best approach is to treat predictions as estimates and seek medical guidance for decisions that matter personally.'
      }
    ]
  },
  {
    id: 'conditions-to-know-about',
    title: 'Conditions to know about',
    emoji: '📚',
    articles: [
      {
        id: 'pcos',
        title: 'PCOS',
        summary: 'PCOS is a common hormonal condition that can show up as irregular cycles and other symptoms.',
        body: 'Polycystic ovary syndrome, or PCOS, is a common hormonal condition that can affect how often ovulation happens and how regular the cycle is. People with PCOS may notice irregular periods, missed periods, or cycles that vary more than expected. Some people also have acne, excess hair growth, or scalp hair thinning, though not everyone experiences the same set of symptoms.\n\nPCOS is not a diagnosis a person should make on their own, but it is a condition worth asking a doctor about if cycle patterns are consistently unusual. The way it shows up can vary a lot from person to person.\n\nThe goal is not to label a person from a few signs, but to understand whether a pattern deserves medical review. That is especially helpful if there are broader symptoms affecting quality of life.'
      },
      {
        id: 'endometriosis',
        title: 'Endometriosis',
        summary: 'Endometriosis can cause painful periods and pelvic pain that is more than ordinary cramps.',
        body: 'Endometriosis is a condition in which tissue similar to the uterine lining grows outside the uterus. It can be associated with painful periods, pelvic pain, or fertility concerns, and it is one reason a person may have worsening pain that is not explained by ordinary cramps alone.\n\nThis condition can sometimes cause pain that feels sharp, deep, or persistent, not just the familiar period discomfort in the first few days. It may also affect bowel habits, sex, or daily routines.\n\nIt is not a self-diagnosis checklist. If a pattern of pain is severe, recurring, or disruptive, it is a good idea to discuss with a doctor. This kind of information can help guide the next steps without guessing.'
      },
      {
        id: 'thyroid-and-cycle',
        title: 'Thyroid and cycle irregularity',
        summary: 'Thyroid issues can influence energy and cycle regularity without being obvious from one missed period.',
        body: 'The thyroid helps regulate metabolism and hormones, and problems in this system can sometimes show up as changes in cycle timing, fatigue, or energy levels. A person may notice cycles that are heavier, lighter, shorter, longer, or more irregular than usual. These changes can also overlap with mood, sleep, and temperature sensitivity.\n\nThyroid imbalances do not mean a diagnosis is certain, but they are one of the common medical factors that can affect period regularity. A clinician may look at a pattern of symptoms together rather than one single month in isolation.\n\nThis is another example of why tracking patterns over time is useful. It helps separate a temporary blip from a pattern that is worth asking about.'
      },
      {
        id: 'amenorrhea',
        title: 'Amenorrhea',
        summary: 'Amenorrhea describes a missing period that is outside the usual pattern, and it can have several causes.',
        body: 'Amenorrhea means having no period for a period of time that is beyond the usual pattern. It can happen for many reasons, including stress, weight changes, dieting, intense exercise, pregnancy, hormonal shifts, or other medical conditions. It is not a label you should diagnose on your own, but it is a pattern worth understanding.\n\nOne absent period is not always a sign of a problem. But repeated absence or a noticeable change from a person’s usual pattern is something to discuss with a clinician. The cause can be a mix of health, lifestyle, and timing, and a doctor is the best person to sort through it.\n\nThe key point is that patterns matter more than a single skipped cycle. What is unusual for one person may be normal for another, which is why context matters.'
      }
    ]
  }
]
