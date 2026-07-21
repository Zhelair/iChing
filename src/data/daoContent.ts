import type { Locale } from '../domain/locales'

export type DaoCopy = {
  navIChing: string
  navDao: string
  eyebrow: string
  title: string
  intro: string
  study: string
  studyBody: string
  notebook: string
  notebookBody: string
  practice: string
  practiceBody: string
  living: string
  livingBody: string
  beginStudy: string
  beginPractice: string
  readerEyebrow: string
  readerTitle: string
  readerIntro: string
  passages: Array<{ id: string; title: string; body: string }>
  scope: string
  scopeValue: string
  sourceHeading: string
  sourceBody: string
  note: string
  noteHint: string
  noteSave: string
  noteSaved: string
  notesHeading: string
  noNotes: string
  freeTitle: string
  freeBody: string
  freeTitleHint: string
  freeBodyHint: string
  saveJournal: string
  journalSaved: string
  practiceTitle: string
  practiceIntro: string
  safety: string
  minutes: string
  sound: string
  start: string
  pause: string
  resume: string
  finish: string
  settle: string
  breathe: string
  close: string
  reflection: string
  reflectionHint: string
  saveReflection: string
  complete: string
  livingTitle: string
  notice: string
  noticeHint: string
  allow: string
  allowHint: string
  respond: string
  respondHint: string
  reflect: string
  reflectHint: string
  saveLiving: string
}

export const DAO_COPY: Record<Locale, DaoCopy> = {
  en: {
    navIChing: 'I Ching', navDao: 'Dao', eyebrow: 'Study · practice · personal notes', title: 'Study the Way. Practise without forcing.', intro: 'A quiet place for texts, questions, embodied practice, and reflections that stay on this device.',
    study: 'Study', studyBody: 'Read short, sourced chapters with context and clear scope labels.', notebook: 'Notebook', notebookBody: 'Keep passage notes and longer journal entries without turning insight into a score.', practice: 'Practice', practiceBody: 'Use gentle, timed exercises with optional motion and sound.', living: 'Living the Way', livingBody: 'Bring attention to ordinary choices: notice, allow, respond, reflect.', beginStudy: 'Open the first chapter', beginPractice: 'Begin a settling breath',
    readerEyebrow: 'Start here · editorial introduction', readerTitle: 'Water does not hurry, yet it finds a way.', readerIntro: 'This chapter uses water as one doorway into Daoist thought. It is not a rule for every situation, and it is not a substitute for reading the texts themselves.',
    passages: [
      { id: 'water', title: 'Begin with relationship', body: 'Dao is often translated as “the Way”, but it is better approached as a living pattern of relationship than as a fixed route. The early texts repeatedly question rigid names and forced certainty. Study begins by noticing what a definition reveals—and what it leaves out.' },
      { id: 'softness', title: 'Softness is not passivity', body: 'Water yields to the shape before it and still alters stone over time. In this image, softness means responsive strength: meeting conditions clearly, using less unnecessary force, and refusing the idea that domination is the only form of power.' },
      { id: 'daily', title: 'Return to the ordinary', body: 'A Daoist orientation is not one universal lifestyle. Traditions differ, and historical Daoism includes communities, ritual, cultivation, ethics, medicine, and contemplative disciplines. A modest daily beginning is simpler: notice strain, leave room, and choose the least coercive adequate response.' },
    ],
    scope: 'Scope', scopeValue: 'Yi Path editorial reflection informed by early Daoist themes', sourceHeading: 'Study trail', sourceBody: 'Begin with the Daodejing, especially chapters 1, 8, 22, 37, and 78, then compare translations. Read the Zhuangzi for a different voice. Historical practices and later lineages are labelled separately throughout Yi Path.',
    note: 'Note on this passage', noteHint: 'What does this passage clarify, complicate, or leave open?', noteSave: 'Save passage note', noteSaved: 'Note saved locally', notesHeading: 'Your passage notes', noNotes: 'No passage notes yet.',
    freeTitle: 'Write in your Dao notebook', freeBody: 'Create a longer entry that is not attached to one passage.', freeTitleHint: 'A title for this reflection', freeBodyHint: 'What are you studying, questioning, or noticing?', saveJournal: 'Save to Journal', journalSaved: 'Entry saved locally',
    practiceTitle: 'Settling breath', practiceIntro: 'Let the breath remain natural. The circle follows time; you do not need to force your body to follow it.', safety: 'Sit or stand comfortably. Do not hold or deepen the breath. Stop if you feel dizzy, short of breath, or uncomfortable.', minutes: 'minutes', sound: 'Ambient sound', start: 'Begin practice', pause: 'Pause', resume: 'Resume', finish: 'End practice', settle: 'Arrive', breathe: 'Breathe naturally', close: 'Let the practice close', reflection: 'After the practice', reflectionHint: 'What changed, if anything? “Nothing noticeable” is also a complete answer.', saveReflection: 'Save reflection', complete: 'Practice complete',
    livingTitle: 'Meet one situation with less force', notice: 'Notice', noticeHint: 'What is actually happening, before interpretation?', allow: 'Allow', allowHint: 'What feeling or uncertainty can be present without immediate fixing?', respond: 'Respond', respondHint: 'What is the least forceful adequate response?', reflect: 'Reflect', reflectHint: 'What might you learn after acting?', saveLiving: 'Save as a Journal reflection',
  },
  bg: {
    navIChing: 'И Дзин', navDao: 'Дао', eyebrow: 'Изучаване · практика · лични бележки', title: 'Изучавай Пътя. Практикувай без насилие.', intro: 'Тихо място за текстове, въпроси, телесни практики и размисли, които остават на това устройство.',
    study: 'Изучаване', studyBody: 'Чети кратки глави с източници, контекст и ясни обозначения.', notebook: 'Бележник', notebookBody: 'Пази бележки към пасажи и по-дълги записи, без да превръщаш прозрението в оценка.', practice: 'Практика', practiceBody: 'Нежни упражнения с време, движение и звук по желание.', living: 'Да живееш Пътя', livingBody: 'Насочи внимание към обикновените избори: забележи, допусни, отговори, осмисли.', beginStudy: 'Отвори първата глава', beginPractice: 'Започни успокояващо дишане',
    readerEyebrow: 'Начало · редакционно въведение', readerTitle: 'Водата не бърза, но намира път.', readerIntro: 'Тази глава използва водата като един вход към даоистката мисъл. Тя не е правило за всяка ситуация и не замества самите текстове.',
    passages: [
      { id: 'water', title: 'Започни с отношението', body: 'Дао често се превежда като „Пътят“, но е по-полезно да го доближим като жив модел на отношения, а не като фиксиран маршрут. Ранните текстове многократно поставят под въпрос строгите имена и насилената сигурност.' },
      { id: 'softness', title: 'Мекотата не е пасивност', body: 'Водата приема формата пред себе си и все пак променя камъка с времето. Тук мекотата е отзивчива сила: да срещнеш условията ясно и да не приемаш господството за единствена форма на мощ.' },
      { id: 'daily', title: 'Върни се към обикновеното', body: 'Няма един универсален даоистки начин на живот. Традициите се различават. Скромното ежедневно начало е по-просто: забележи напрежението, остави място и избери най-малко принудителния достатъчен отговор.' },
    ],
    scope: 'Обхват', scopeValue: 'Редакционен размисъл на Yi Path, вдъхновен от ранни даоистки теми', sourceHeading: 'Пътека за изучаване', sourceBody: 'Започни с „Даодъдзин“, особено глави 1, 8, 22, 37 и 78, и сравнявай преводи. После прочети „Джуан Дзъ“. Историческите практики и по-късните школи се обозначават отделно.',
    note: 'Бележка към пасажа', noteHint: 'Какво изяснява, усложнява или оставя отворено този пасаж?', noteSave: 'Запази бележката', noteSaved: 'Бележката е запазена локално', notesHeading: 'Твоите бележки', noNotes: 'Все още няма бележки.', freeTitle: 'Пиши в своя Дао бележник', freeBody: 'Създай по-дълъг запис, който не е свързан с един пасаж.', freeTitleHint: 'Заглавие на размисъла', freeBodyHint: 'Какво изучаваш, поставяш под въпрос или забелязваш?', saveJournal: 'Запази в Дневника', journalSaved: 'Записът е запазен локално',
    practiceTitle: 'Успокояващо дишане', practiceIntro: 'Остави дишането естествено. Кръгът следва времето; не е нужно да принуждаваш тялото да го следва.', safety: 'Седни или стой удобно. Не задържай и не задълбочавай дъха. Спри при замайване, задух или дискомфорт.', minutes: 'минути', sound: 'Фонов звук', start: 'Започни практиката', pause: 'Пауза', resume: 'Продължи', finish: 'Завърши', settle: 'Пристигни', breathe: 'Дишай естествено', close: 'Остави практиката да завърши', reflection: 'След практиката', reflectionHint: 'Какво се промени, ако изобщо нещо се промени?', saveReflection: 'Запази размисъла', complete: 'Практиката завърши',
    livingTitle: 'Посрещни една ситуация с по-малко сила', notice: 'Забележи', noticeHint: 'Какво действително се случва преди тълкуването?', allow: 'Допусни', allowHint: 'Кое чувство или несигурност може да остане без незабавна поправка?', respond: 'Отговори', respondHint: 'Кой е най-малко принудителният достатъчен отговор?', reflect: 'Осмисли', reflectHint: 'Какво можеш да научиш след действието?', saveLiving: 'Запази като размисъл в Дневника',
  },
  ru: {
    navIChing: 'Ицзин', navDao: 'Дао', eyebrow: 'Изучение · практика · личные заметки', title: 'Изучайте Путь. Практикуйте без принуждения.', intro: 'Тихое место для текстов, вопросов, телесной практики и размышлений, которые остаются на этом устройстве.',
    study: 'Изучение', studyBody: 'Читайте короткие главы с источниками, контекстом и ясными пометками.', notebook: 'Блокнот', notebookBody: 'Сохраняйте заметки к отрывкам и длинные записи, не превращая понимание в оценку.', practice: 'Практика', practiceBody: 'Мягкие упражнения с таймером, необязательными движением и звуком.', living: 'Жить в согласии с Путём', livingBody: 'Обращайте внимание на обычные решения: заметить, позволить, ответить, осмыслить.', beginStudy: 'Открыть первую главу', beginPractice: 'Начать успокаивающее дыхание',
    readerEyebrow: 'Начало · редакционное введение', readerTitle: 'Вода не спешит, но находит путь.', readerIntro: 'Эта глава использует образ воды как один из входов в даосскую мысль. Это не правило для любой ситуации и не замена чтению самих текстов.',
    passages: [
      { id: 'water', title: 'Начните с отношений', body: 'Дао часто переводят как «Путь», но полезнее приближаться к нему как к живому узору отношений, а не как к фиксированному маршруту. Ранние тексты вновь и вновь ставят под вопрос жёсткие названия и вынужденную уверенность.' },
      { id: 'softness', title: 'Мягкость — не пассивность', body: 'Вода принимает форму того, что перед ней, и со временем изменяет камень. Здесь мягкость означает отзывчивую силу: ясно встречать условия и не считать господство единственной формой мощи.' },
      { id: 'daily', title: 'Вернитесь к повседневному', body: 'Единого универсального даосского образа жизни нет. Традиции различаются. Скромное ежедневное начало проще: заметить напряжение, оставить пространство и выбрать наименее принудительный достаточный ответ.' },
    ],
    scope: 'Рамки', scopeValue: 'Редакционное размышление Yi Path, опирающееся на темы раннего даосизма', sourceHeading: 'Маршрут изучения', sourceBody: 'Начните с «Даодэцзина», особенно глав 1, 8, 22, 37 и 78, и сравнивайте переводы. Затем прочитайте «Чжуан-цзы». Исторические практики и поздние школы отмечаются отдельно.',
    note: 'Заметка к отрывку', noteHint: 'Что этот отрывок проясняет, усложняет или оставляет открытым?', noteSave: 'Сохранить заметку', noteSaved: 'Заметка сохранена локально', notesHeading: 'Ваши заметки', noNotes: 'Заметок пока нет.', freeTitle: 'Пишите в блокноте Дао', freeBody: 'Создайте длинную запись, не привязанную к одному отрывку.', freeTitleHint: 'Заголовок размышления', freeBodyHint: 'Что вы изучаете, ставите под вопрос или замечаете?', saveJournal: 'Сохранить в Журнал', journalSaved: 'Запись сохранена локально',
    practiceTitle: 'Успокаивающее дыхание', practiceIntro: 'Пусть дыхание остаётся естественным. Круг следует времени; телу не нужно под него подстраиваться.', safety: 'Сядьте или встаньте удобно. Не задерживайте и не углубляйте дыхание. Остановитесь при головокружении, одышке или дискомфорте.', minutes: 'минут', sound: 'Фоновый звук', start: 'Начать практику', pause: 'Пауза', resume: 'Продолжить', finish: 'Завершить', settle: 'Прибыть', breathe: 'Дышите естественно', close: 'Позвольте практике завершиться', reflection: 'После практики', reflectionHint: 'Что изменилось, если вообще что-то изменилось?', saveReflection: 'Сохранить размышление', complete: 'Практика завершена',
    livingTitle: 'Встретьте одну ситуацию с меньшим усилием', notice: 'Заметьте', noticeHint: 'Что происходит на самом деле, до интерпретации?', allow: 'Позвольте', allowHint: 'Какое чувство или неопределённость могут побыть без немедленного исправления?', respond: 'Ответьте', respondHint: 'Каков наименее принудительный достаточный ответ?', reflect: 'Осмыслите', reflectHint: 'Чему можно научиться после действия?', saveLiving: 'Сохранить как запись в Журнале',
  },
  de: {
    navIChing: 'I Ging', navDao: 'Dao', eyebrow: 'Studium · Praxis · persönliche Notizen', title: 'Den Weg studieren. Üben, ohne zu erzwingen.', intro: 'Ein stiller Ort für Texte, Fragen, verkörperte Praxis und Gedanken, die auf diesem Gerät bleiben.',
    study: 'Studium', studyBody: 'Kurze, belegte Kapitel mit Kontext und klaren Einordnungen lesen.', notebook: 'Notizbuch', notebookBody: 'Passagennotizen und längere Einträge bewahren, ohne Einsicht zu bewerten.', practice: 'Praxis', practiceBody: 'Sanfte Zeitübungen mit optionaler Bewegung und Klang.', living: 'Den Weg leben', livingBody: 'Gewöhnliche Entscheidungen beachten: wahrnehmen, zulassen, antworten, nachdenken.', beginStudy: 'Erstes Kapitel öffnen', beginPractice: 'Beruhigenden Atem beginnen',
    readerEyebrow: 'Hier beginnen · redaktionelle Einführung', readerTitle: 'Wasser eilt nicht und findet doch einen Weg.', readerIntro: 'Dieses Kapitel nutzt Wasser als einen Zugang zum daoistischen Denken. Es ist keine Regel für jede Lage und kein Ersatz für die Texte selbst.', passages: [
      { id: 'water', title: 'Mit Beziehung beginnen', body: 'Dao wird oft als „der Weg“ übersetzt. Hilfreicher ist es, Dao als lebendiges Beziehungsmuster statt als feste Route zu betrachten. Frühe Texte hinterfragen starre Namen und erzwungene Gewissheit.' },
      { id: 'softness', title: 'Weichheit ist nicht Passivität', body: 'Wasser nimmt die Form vor ihm an und verändert mit der Zeit Stein. Weichheit meint hier antwortende Stärke: Bedingungen klar begegnen und Herrschaft nicht mit Kraft verwechseln.' },
      { id: 'daily', title: 'Zum Gewöhnlichen zurückkehren', body: 'Es gibt nicht die eine daoistische Lebensweise. Traditionen unterscheiden sich. Ein bescheidener Anfang: Anspannung bemerken, Raum lassen und die am wenigsten zwingende ausreichende Antwort wählen.' },
    ], scope: 'Einordnung', scopeValue: 'Yi-Path-Reflexion, angeregt durch frühe daoistische Themen', sourceHeading: 'Lesespur', sourceBody: 'Beginne mit dem Daodejing, besonders Kapitel 1, 8, 22, 37 und 78, und vergleiche Übersetzungen. Lies danach das Zhuangzi. Historische Praktiken und spätere Schulen werden getrennt gekennzeichnet.',
    note: 'Notiz zu dieser Passage', noteHint: 'Was klärt, erschwert oder öffnet diese Passage?', noteSave: 'Passagennotiz speichern', noteSaved: 'Notiz lokal gespeichert', notesHeading: 'Deine Passagennotizen', noNotes: 'Noch keine Notizen.', freeTitle: 'Ins Dao-Notizbuch schreiben', freeBody: 'Einen längeren Eintrag ohne Bindung an eine Passage anlegen.', freeTitleHint: 'Titel der Reflexion', freeBodyHint: 'Was studierst, hinterfragst oder bemerkst du?', saveJournal: 'Im Journal speichern', journalSaved: 'Eintrag lokal gespeichert',
    practiceTitle: 'Beruhigender Atem', practiceIntro: 'Lass den Atem natürlich. Der Kreis folgt der Zeit; dein Körper muss ihm nicht folgen.', safety: 'Bequem sitzen oder stehen. Den Atem weder halten noch vertiefen. Bei Schwindel, Atemnot oder Unbehagen aufhören.', minutes: 'Minuten', sound: 'Umgebungsklang', start: 'Praxis beginnen', pause: 'Pause', resume: 'Fortsetzen', finish: 'Beenden', settle: 'Ankommen', breathe: 'Natürlich atmen', close: 'Die Praxis ausklingen lassen', reflection: 'Nach der Praxis', reflectionHint: 'Was hat sich verändert, wenn überhaupt?', saveReflection: 'Reflexion speichern', complete: 'Praxis beendet',
    livingTitle: 'Einer Situation mit weniger Kraft begegnen', notice: 'Wahrnehmen', noticeHint: 'Was geschieht tatsächlich, noch vor der Deutung?', allow: 'Zulassen', allowHint: 'Welches Gefühl darf ohne sofortige Lösung da sein?', respond: 'Antworten', respondHint: 'Was ist die am wenigsten zwingende ausreichende Antwort?', reflect: 'Nachdenken', reflectHint: 'Was lässt sich nach dem Handeln lernen?', saveLiving: 'Als Journalreflexion speichern',
  },
  it: {
    navIChing: 'I Ching', navDao: 'Dao', eyebrow: 'Studio · pratica · note personali', title: 'Studia la Via. Pratica senza forzare.', intro: 'Uno spazio quieto per testi, domande, pratica corporea e riflessioni che restano su questo dispositivo.',
    study: 'Studio', studyBody: 'Leggi brevi capitoli documentati, con contesto e ambito dichiarato.', notebook: 'Taccuino', notebookBody: 'Conserva note sui brani e riflessioni più lunghe senza dare voti alla comprensione.', practice: 'Pratica', practiceBody: 'Esercizi delicati a tempo, con movimento e suono facoltativi.', living: 'Vivere la Via', livingBody: 'Porta attenzione alle scelte comuni: nota, accogli, rispondi, rifletti.', beginStudy: 'Apri il primo capitolo', beginPractice: 'Inizia un respiro quieto',
    readerEyebrow: 'Inizia qui · introduzione editoriale', readerTitle: 'L’acqua non ha fretta, eppure trova la via.', readerIntro: 'Questo capitolo usa l’acqua come accesso al pensiero daoista. Non è una regola per ogni situazione e non sostituisce la lettura dei testi.', passages: [
      { id: 'water', title: 'Comincia dalla relazione', body: 'Dao viene spesso tradotto come “la Via”, ma è più utile avvicinarlo come un modello vivente di relazioni, non come un percorso fisso. I testi antichi interrogano nomi rigidi e certezze forzate.' },
      { id: 'softness', title: 'La morbidezza non è passività', body: 'L’acqua accoglie la forma che incontra e nel tempo modifica la pietra. Qui la morbidezza è forza responsiva: incontrare chiaramente le condizioni senza confondere dominio e potenza.' },
      { id: 'daily', title: 'Torna all’ordinario', body: 'Non esiste un unico stile di vita daoista. Le tradizioni differiscono. Un inizio quotidiano modesto: nota la tensione, lascia spazio e scegli la risposta adeguata meno coercitiva.' },
    ], scope: 'Ambito', scopeValue: 'Riflessione editoriale Yi Path ispirata a temi del primo daoismo', sourceHeading: 'Percorso di studio', sourceBody: 'Inizia dal Daodejing, soprattutto i capitoli 1, 8, 22, 37 e 78, confrontando più traduzioni. Prosegui con lo Zhuangzi. Pratiche storiche e scuole successive sono indicate separatamente.',
    note: 'Nota su questo brano', noteHint: 'Che cosa chiarisce, complica o lascia aperto?', noteSave: 'Salva la nota', noteSaved: 'Nota salvata in locale', notesHeading: 'Le tue note', noNotes: 'Ancora nessuna nota.', freeTitle: 'Scrivi nel taccuino Dao', freeBody: 'Crea una riflessione più lunga non legata a un solo brano.', freeTitleHint: 'Titolo della riflessione', freeBodyHint: 'Che cosa stai studiando, mettendo in dubbio o notando?', saveJournal: 'Salva nel Diario', journalSaved: 'Voce salvata in locale',
    practiceTitle: 'Respiro quieto', practiceIntro: 'Lascia naturale il respiro. Il cerchio segue il tempo; il corpo non deve seguirlo.', safety: 'Siedi o resta in piedi comodamente. Non trattenere né approfondire il respiro. Fermati in caso di capogiro, affanno o disagio.', minutes: 'minuti', sound: 'Suono ambientale', start: 'Inizia la pratica', pause: 'Pausa', resume: 'Riprendi', finish: 'Termina', settle: 'Arriva', breathe: 'Respira naturalmente', close: 'Lascia chiudere la pratica', reflection: 'Dopo la pratica', reflectionHint: 'Che cosa è cambiato, se è cambiato qualcosa?', saveReflection: 'Salva la riflessione', complete: 'Pratica completata',
    livingTitle: 'Incontra una situazione con meno forza', notice: 'Nota', noticeHint: 'Che cosa accade davvero, prima dell’interpretazione?', allow: 'Accogli', allowHint: 'Quale emozione può esserci senza essere subito risolta?', respond: 'Rispondi', respondHint: 'Qual è la risposta adeguata meno coercitiva?', reflect: 'Rifletti', reflectHint: 'Che cosa puoi imparare dopo aver agito?', saveLiving: 'Salva come riflessione nel Diario',
  },
  fr: {
    navIChing: 'Yi Jing', navDao: 'Dao', eyebrow: 'Étude · pratique · notes personnelles', title: 'Étudier la Voie. Pratiquer sans forcer.', intro: 'Un lieu calme pour les textes, les questions, la pratique incarnée et les réflexions conservées sur cet appareil.',
    study: 'Étude', studyBody: 'Lire de courts chapitres sourcés, avec contexte et périmètre clair.', notebook: 'Carnet', notebookBody: 'Garder des notes de passage et des entrées plus longues sans noter sa compréhension.', practice: 'Pratique', practiceBody: 'Des exercices doux et minutés, avec mouvement et son facultatifs.', living: 'Vivre la Voie', livingBody: 'Porter attention aux choix ordinaires : remarquer, accueillir, répondre, réfléchir.', beginStudy: 'Ouvrir le premier chapitre', beginPractice: 'Commencer une respiration apaisante',
    readerEyebrow: 'Commencer ici · introduction éditoriale', readerTitle: 'L’eau ne se presse pas, pourtant elle trouve un chemin.', readerIntro: 'Ce chapitre emploie l’eau comme une porte vers la pensée daoïste. Ce n’est ni une règle universelle ni un remplacement des textes eux-mêmes.', passages: [
      { id: 'water', title: 'Commencer par la relation', body: 'Dao est souvent traduit par « la Voie ». Il est plus fécond de l’approcher comme un motif vivant de relations que comme un itinéraire fixe. Les textes anciens questionnent les noms rigides et les certitudes forcées.' },
      { id: 'softness', title: 'La douceur n’est pas la passivité', body: 'L’eau épouse la forme rencontrée et transforme pourtant la pierre avec le temps. La douceur devient ici une force de réponse : rencontrer clairement les conditions sans confondre domination et puissance.' },
      { id: 'daily', title: 'Revenir à l’ordinaire', body: 'Il n’existe pas un unique mode de vie daoïste. Les traditions diffèrent. Un début quotidien modeste : remarquer la tension, laisser de l’espace et choisir la réponse suffisante la moins coercitive.' },
    ], scope: 'Périmètre', scopeValue: 'Réflexion éditoriale Yi Path inspirée de thèmes daoïstes anciens', sourceHeading: 'Piste d’étude', sourceBody: 'Commencez par le Daodejing, notamment les chapitres 1, 8, 22, 37 et 78, en comparant les traductions. Lisez ensuite le Zhuangzi. Pratiques historiques et écoles tardives sont signalées séparément.',
    note: 'Note sur ce passage', noteHint: 'Que clarifie, complique ou laisse ouvert ce passage ?', noteSave: 'Enregistrer la note', noteSaved: 'Note enregistrée localement', notesHeading: 'Vos notes de passage', noNotes: 'Aucune note pour le moment.', freeTitle: 'Écrire dans votre carnet Dao', freeBody: 'Créer une entrée plus longue, sans l’attacher à un passage.', freeTitleHint: 'Titre de la réflexion', freeBodyHint: 'Qu’étudiez-vous, questionnez-vous ou remarquez-vous ?', saveJournal: 'Enregistrer dans le Journal', journalSaved: 'Entrée enregistrée localement',
    practiceTitle: 'Respiration apaisante', practiceIntro: 'Laissez la respiration naturelle. Le cercle suit le temps ; votre corps n’a pas à le suivre.', safety: 'Asseyez-vous ou tenez-vous confortablement. Ne retenez ni n’amplifiez le souffle. Arrêtez en cas de vertige, d’essoufflement ou d’inconfort.', minutes: 'minutes', sound: 'Ambiance sonore', start: 'Commencer la pratique', pause: 'Pause', resume: 'Reprendre', finish: 'Terminer', settle: 'Arriver', breathe: 'Respirer naturellement', close: 'Laisser la pratique se clore', reflection: 'Après la pratique', reflectionHint: 'Qu’est-ce qui a changé, le cas échéant ?', saveReflection: 'Enregistrer la réflexion', complete: 'Pratique terminée',
    livingTitle: 'Rencontrer une situation avec moins de force', notice: 'Remarquer', noticeHint: 'Que se passe-t-il vraiment, avant l’interprétation ?', allow: 'Accueillir', allowHint: 'Quelle émotion peut être présente sans correction immédiate ?', respond: 'Répondre', respondHint: 'Quelle est la réponse suffisante la moins coercitive ?', reflect: 'Réfléchir', reflectHint: 'Que pourrez-vous apprendre après avoir agi ?', saveLiving: 'Enregistrer comme réflexion dans le Journal',
  },
  es: {
    navIChing: 'I Ching', navDao: 'Dao', eyebrow: 'Estudio · práctica · notas personales', title: 'Estudia el Camino. Practica sin forzar.', intro: 'Un lugar sereno para textos, preguntas, práctica corporal y reflexiones guardadas en este dispositivo.',
    study: 'Estudio', studyBody: 'Lee capítulos breves con fuentes, contexto y alcance claro.', notebook: 'Cuaderno', notebookBody: 'Guarda notas de pasajes y entradas extensas sin convertir la comprensión en una nota.', practice: 'Práctica', practiceBody: 'Ejercicios suaves y cronometrados, con movimiento y sonido opcionales.', living: 'Vivir el Camino', livingBody: 'Atiende a decisiones cotidianas: observa, permite, responde, reflexiona.', beginStudy: 'Abrir el primer capítulo', beginPractice: 'Comenzar una respiración serena',
    readerEyebrow: 'Empieza aquí · introducción editorial', readerTitle: 'El agua no se apresura, pero encuentra su camino.', readerIntro: 'Este capítulo usa el agua como una entrada al pensamiento daoísta. No es una regla para toda situación ni sustituye la lectura de los textos.', passages: [
      { id: 'water', title: 'Empieza por la relación', body: 'Dao suele traducirse como «el Camino», pero resulta más útil acercarse a él como un patrón vivo de relaciones que como una ruta fija. Los textos antiguos cuestionan los nombres rígidos y la certeza forzada.' },
      { id: 'softness', title: 'La suavidad no es pasividad', body: 'El agua adopta la forma que encuentra y, con el tiempo, transforma la piedra. Aquí la suavidad es una fuerza receptiva: encontrarse con las condiciones sin confundir dominio con poder.' },
      { id: 'daily', title: 'Vuelve a lo cotidiano', body: 'No existe un único modo de vida daoísta. Las tradiciones difieren. Un comienzo diario modesto: observa la tensión, deja espacio y elige la respuesta suficiente menos coercitiva.' },
    ], scope: 'Alcance', scopeValue: 'Reflexión editorial de Yi Path inspirada en temas daoístas antiguos', sourceHeading: 'Ruta de estudio', sourceBody: 'Empieza por el Daodejing, sobre todo los capítulos 1, 8, 22, 37 y 78, y compara traducciones. Continúa con el Zhuangzi. Las prácticas históricas y escuelas posteriores se señalan por separado.',
    note: 'Nota sobre este pasaje', noteHint: '¿Qué aclara, complica o deja abierto este pasaje?', noteSave: 'Guardar la nota', noteSaved: 'Nota guardada localmente', notesHeading: 'Tus notas de pasajes', noNotes: 'Aún no hay notas.', freeTitle: 'Escribe en tu cuaderno Dao', freeBody: 'Crea una entrada extensa que no dependa de un solo pasaje.', freeTitleHint: 'Título de la reflexión', freeBodyHint: '¿Qué estudias, cuestionas u observas?', saveJournal: 'Guardar en el Diario', journalSaved: 'Entrada guardada localmente',
    practiceTitle: 'Respiración serena', practiceIntro: 'Deja que la respiración sea natural. El círculo sigue el tiempo; tu cuerpo no tiene que seguirlo.', safety: 'Siéntate o ponte de pie cómodamente. No retengas ni profundices la respiración. Detente si sientes mareo, falta de aire o malestar.', minutes: 'minutos', sound: 'Sonido ambiente', start: 'Comenzar la práctica', pause: 'Pausa', resume: 'Continuar', finish: 'Terminar', settle: 'Llegar', breathe: 'Respira con naturalidad', close: 'Deja que la práctica termine', reflection: 'Después de la práctica', reflectionHint: '¿Qué cambió, si cambió algo?', saveReflection: 'Guardar reflexión', complete: 'Práctica completada',
    livingTitle: 'Encuentra una situación con menos fuerza', notice: 'Observa', noticeHint: '¿Qué está ocurriendo antes de interpretarlo?', allow: 'Permite', allowHint: '¿Qué emoción puede estar presente sin arreglarla enseguida?', respond: 'Responde', respondHint: '¿Cuál es la respuesta suficiente menos coercitiva?', reflect: 'Reflexiona', reflectHint: '¿Qué puedes aprender después de actuar?', saveLiving: 'Guardar como reflexión en el Diario',
  },
  'pt-PT': {
    navIChing: 'I Ching', navDao: 'Dao', eyebrow: 'Estudo · prática · notas pessoais', title: 'Estuda o Caminho. Pratica sem forçar.', intro: 'Um lugar tranquilo para textos, perguntas, prática corporal e reflexões guardadas neste dispositivo.',
    study: 'Estudo', studyBody: 'Lê capítulos breves com fontes, contexto e âmbito claro.', notebook: 'Caderno', notebookBody: 'Guarda notas sobre passagens e textos longos sem transformar compreensão em pontuação.', practice: 'Prática', practiceBody: 'Exercícios suaves e cronometrados, com movimento e som opcionais.', living: 'Viver o Caminho', livingBody: 'Leva atenção às escolhas comuns: nota, permite, responde, reflete.', beginStudy: 'Abrir o primeiro capítulo', beginPractice: 'Começar uma respiração tranquila',
    readerEyebrow: 'Começa aqui · introdução editorial', readerTitle: 'A água não se apressa, mas encontra caminho.', readerIntro: 'Este capítulo usa a água como entrada no pensamento daoista. Não é uma regra para todas as situações nem substitui a leitura dos textos.', passages: [
      { id: 'water', title: 'Começa pela relação', body: 'Dao é muitas vezes traduzido por «o Caminho», mas é mais útil aproximá-lo como um padrão vivo de relações do que como uma rota fixa. Os textos antigos questionam nomes rígidos e certezas forçadas.' },
      { id: 'softness', title: 'Suavidade não é passividade', body: 'A água assume a forma que encontra e, com o tempo, transforma a pedra. Aqui, suavidade é força responsiva: encontrar as condições com clareza sem confundir domínio com poder.' },
      { id: 'daily', title: 'Regressa ao quotidiano', body: 'Não existe um único modo de vida daoista. As tradições diferem. Um começo diário modesto: nota a tensão, deixa espaço e escolhe a resposta suficiente menos coerciva.' },
    ], scope: 'Âmbito', scopeValue: 'Reflexão editorial Yi Path inspirada em temas daoistas antigos', sourceHeading: 'Percurso de estudo', sourceBody: 'Começa pelo Daodejing, sobretudo os capítulos 1, 8, 22, 37 e 78, e compara traduções. Depois lê o Zhuangzi. Práticas históricas e escolas posteriores são identificadas separadamente.',
    note: 'Nota sobre esta passagem', noteHint: 'O que esclarece, complica ou deixa em aberto esta passagem?', noteSave: 'Guardar nota', noteSaved: 'Nota guardada localmente', notesHeading: 'As tuas notas', noNotes: 'Ainda não há notas.', freeTitle: 'Escreve no teu caderno Dao', freeBody: 'Cria uma entrada mais longa que não esteja ligada a uma só passagem.', freeTitleHint: 'Título da reflexão', freeBodyHint: 'O que estás a estudar, questionar ou notar?', saveJournal: 'Guardar no Diário', journalSaved: 'Entrada guardada localmente',
    practiceTitle: 'Respiração tranquila', practiceIntro: 'Deixa a respiração natural. O círculo segue o tempo; o corpo não precisa de o seguir.', safety: 'Senta-te ou fica de pé confortavelmente. Não retenhas nem aprofunde a respiração. Para se sentires tonturas, falta de ar ou desconforto.', minutes: 'minutos', sound: 'Som ambiente', start: 'Começar prática', pause: 'Pausa', resume: 'Retomar', finish: 'Terminar', settle: 'Chegar', breathe: 'Respira naturalmente', close: 'Deixa a prática terminar', reflection: 'Depois da prática', reflectionHint: 'O que mudou, se alguma coisa mudou?', saveReflection: 'Guardar reflexão', complete: 'Prática concluída',
    livingTitle: 'Encontra uma situação com menos força', notice: 'Nota', noticeHint: 'O que está realmente a acontecer antes da interpretação?', allow: 'Permite', allowHint: 'Que emoção pode estar presente sem correção imediata?', respond: 'Responde', respondHint: 'Qual é a resposta suficiente menos coerciva?', reflect: 'Reflete', reflectHint: 'O que podes aprender depois de agir?', saveLiving: 'Guardar como reflexão no Diário',
  },
  pl: {
    navIChing: 'I Ching', navDao: 'Dao', eyebrow: 'Studium · praktyka · osobiste notatki', title: 'Studiuj Drogę. Praktykuj bez przymusu.', intro: 'Spokojne miejsce na teksty, pytania, praktykę ucieleśnioną i refleksje zapisane na tym urządzeniu.',
    study: 'Studium', studyBody: 'Czytaj krótkie, oparte na źródłach rozdziały z kontekstem i jasnym zakresem.', notebook: 'Notatnik', notebookBody: 'Zachowuj uwagi do fragmentów i dłuższe wpisy bez oceniania zrozumienia.', practice: 'Praktyka', practiceBody: 'Łagodne ćwiczenia na czas, z opcjonalnym ruchem i dźwiękiem.', living: 'Życie Drogą', livingBody: 'Zwracaj uwagę na zwykłe wybory: zauważ, dopuść, odpowiedz, przemyśl.', beginStudy: 'Otwórz pierwszy rozdział', beginPractice: 'Zacznij uspokajający oddech',
    readerEyebrow: 'Zacznij tutaj · wprowadzenie redakcyjne', readerTitle: 'Woda się nie spieszy, a jednak znajduje drogę.', readerIntro: 'Ten rozdział używa wody jako jednego z wejść do myśli daoistycznej. Nie jest regułą na każdą sytuację ani zamiennikiem czytania samych tekstów.', passages: [
      { id: 'water', title: 'Zacznij od relacji', body: 'Dao często tłumaczy się jako „Droga”, lecz lepiej zbliżać się do niego jak do żywego wzoru relacji, a nie ustalonej trasy. Wczesne teksty kwestionują sztywne nazwy i wymuszoną pewność.' },
      { id: 'softness', title: 'Miękkość nie jest biernością', body: 'Woda przyjmuje napotkany kształt, a z czasem zmienia kamień. Miękkość oznacza tu reagującą siłę: jasne spotkanie z warunkami bez mylenia dominacji z mocą.' },
      { id: 'daily', title: 'Wróć do codzienności', body: 'Nie istnieje jeden uniwersalny daoistyczny styl życia. Tradycje się różnią. Skromny początek: zauważ napięcie, zostaw przestrzeń i wybierz najmniej przymuszającą wystarczającą odpowiedź.' },
    ], scope: 'Zakres', scopeValue: 'Refleksja redakcyjna Yi Path inspirowana wczesnymi tematami daoistycznymi', sourceHeading: 'Ścieżka studium', sourceBody: 'Zacznij od Daodejingu, zwłaszcza rozdziałów 1, 8, 22, 37 i 78, porównując przekłady. Następnie przeczytaj Zhuangzi. Praktyki historyczne i późniejsze szkoły są oznaczane oddzielnie.',
    note: 'Notatka do fragmentu', noteHint: 'Co ten fragment wyjaśnia, komplikuje lub pozostawia otwarte?', noteSave: 'Zapisz notatkę', noteSaved: 'Notatka zapisana lokalnie', notesHeading: 'Twoje notatki', noNotes: 'Nie ma jeszcze notatek.', freeTitle: 'Pisz w notatniku Dao', freeBody: 'Utwórz dłuższy wpis niezwiązany z jednym fragmentem.', freeTitleHint: 'Tytuł refleksji', freeBodyHint: 'Co studiujesz, kwestionujesz lub zauważasz?', saveJournal: 'Zapisz w Dzienniku', journalSaved: 'Wpis zapisany lokalnie',
    practiceTitle: 'Uspokajający oddech', practiceIntro: 'Niech oddech pozostanie naturalny. Krąg podąża za czasem; ciało nie musi podążać za nim.', safety: 'Usiądź lub stań wygodnie. Nie wstrzymuj ani nie pogłębiaj oddechu. Przerwij przy zawrotach głowy, duszności lub dyskomforcie.', minutes: 'minut', sound: 'Dźwięk tła', start: 'Rozpocznij praktykę', pause: 'Pauza', resume: 'Wznów', finish: 'Zakończ', settle: 'Przybądź', breathe: 'Oddychaj naturalnie', close: 'Pozwól praktyce dobiec końca', reflection: 'Po praktyce', reflectionHint: 'Co się zmieniło, jeśli cokolwiek?', saveReflection: 'Zapisz refleksję', complete: 'Praktyka zakończona',
    livingTitle: 'Spotkaj sytuację z mniejszym naciskiem', notice: 'Zauważ', noticeHint: 'Co naprawdę się dzieje, zanim to zinterpretujesz?', allow: 'Dopuść', allowHint: 'Jakie uczucie może być obecne bez natychmiastowej naprawy?', respond: 'Odpowiedz', respondHint: 'Jaka jest najmniej przymuszająca wystarczająca odpowiedź?', reflect: 'Przemyśl', reflectHint: 'Czego możesz się nauczyć po działaniu?', saveLiving: 'Zapisz jako refleksję w Dzienniku',
  },
}

