import type { Locale } from '../domain/locales'
import type { BeadTone } from '../domain/casting'

export const AI_ASSISTED_UI_DRAFT = 'ai-assisted-ui-draft-needs-native-review' as const

export type BeadCopy = {
  methodTitle: string
  methodBody: string
  eyebrow: string
  title: string
  body: string
  drawFirst: string
  drawNext: string
  mixing: string
  selected: string
  returning: string
  completeSet: string
  source: string
  colors: Record<BeadTone, string>
  guideEyebrow: string
  guideTitle: string
  guideBody: string
  modernNote: string
  returnNote: string
  tokensLabel: string
  probabilityLabel: string
  sourceLabel: string
}

type FeaturePack<T> = {
  status: 'source-authored' | typeof AI_ASSISTED_UI_DRAFT
  copy: T
}

export const BEAD_COPY: Record<Locale, FeaturePack<BeadCopy>> = {
  en: {
    status: 'source-authored',
    copy: {
      methodTitle: '16 colored beads',
      methodBody: 'Draw one of sixteen equal tokens, return it to the whole, and repeat. The 1:3:5:7 groups reproduce the standardized yarrow probabilities.',
      eyebrow: 'Sixteen-bead practice',
      title: 'Draw one bead; return it before the next line',
      body: 'Hold the situation lightly. Mix the complete set, receive one token, recognize its line, then return it. Six encounters build the figure from the ground upward.',
      drawFirst: 'Draw the first bead',
      drawNext: 'Draw the next bead',
      mixing: 'Mixing all sixteen beads',
      selected: 'One bead comes forward',
      returning: 'Returning it to the whole',
      completeSet: 'The complete set is present again.',
      source: 'This modern sixteen-token method was described in connection with Martin Gardner’s 1974 Scientific American discussion. It models the standardized yarrow odds; it is not the historical physical yarrow-stalk procedure.',
      colors: { plum: 'plum', gold: 'gold', forest: 'forest green', 'blue-jade': 'blue jade' },
      guideEyebrow: 'A modern probability practice',
      guideTitle: 'Sixteen equal tokens make the yarrow odds visible.',
      guideBody: 'One token represents old yin (6), three represent old yang (9), five represent young yang (7), and seven represent young yin (8). Each draw uses the browser’s secure random source.',
      modernNote: 'The bead method is a modern model, not a shortened version of the historical stalk ritual.',
      returnNote: 'After every draw, the selected bead returns to the container, so every line begins from the same complete field of sixteen.',
      tokensLabel: 'Equal tokens', probabilityLabel: 'Probability', sourceLabel: 'Method note and source',
    },
  },
  bg: {
    status: AI_ASSISTED_UI_DRAFT,
    copy: {
      methodTitle: '16 цветни мъниста', methodBody: 'Изтеглете едно от шестнадесет равностойни мъниста, върнете го при останалите и повторете. Групите 1:3:5:7 възпроизвеждат стандартизираните вероятности на белия равнец.',
      eyebrow: 'Практика с шестнадесет мъниста', title: 'Изтеглете едно мънисто и го върнете преди следващата линия', body: 'Дръжте ситуацията леко в съзнанието си. Смесете целия комплект, приемете едно мънисто, разпознайте линията му и го върнете. Шест срещи изграждат фигурата отдолу нагоре.',
      drawFirst: 'Изтеглете първото мънисто', drawNext: 'Изтеглете следващото мънисто', mixing: 'Смесване на всичките шестнадесет мъниста', selected: 'Едно мънисто излиза напред', returning: 'Връщане към цялото', completeSet: 'Пълният комплект отново е цял.',
      source: 'Този съвременен метод с шестнадесет мъниста е описан във връзка с статията на Мартин Гарднър в Scientific American от 1974 г. Той моделира стандартизираните вероятности на белия равнец, но не е историческата физическа процедура със стъбла.',
      colors: { plum: 'сливово', gold: 'златно', forest: 'горскозелено', 'blue-jade': 'син нефрит' },
      guideEyebrow: 'Съвременна практика на вероятностите', guideTitle: 'Шестнадесет равностойни мъниста правят вероятностите видими.', guideBody: 'Едно мънисто означава стар ин (6), три — стар ян (9), пет — млад ян (7), а седем — млад ин (8). Всяко теглене използва сигурния генератор на браузъра.', modernNote: 'Методът с мъниста е съвременен модел, а не съкратен вариант на историческия ритуал със стъбла.', returnNote: 'След всяко теглене мънистото се връща в съда, така че всяка линия започва от същото цяло от шестнадесет.', tokensLabel: 'Равностойни мъниста', probabilityLabel: 'Вероятност', sourceLabel: 'Бележка за метода и източник',
    },
  },
  ru: {
    status: AI_ASSISTED_UI_DRAFT,
    copy: {
      methodTitle: '16 цветных бусин', methodBody: 'Вытяните одну из шестнадцати равновероятных бусин, верните её в набор и повторите. Группы 1:3:5:7 воспроизводят стандартизированные вероятности тысячелистника.',
      eyebrow: 'Практика с шестнадцатью бусинами', title: 'Вытяните одну бусину и верните её перед следующей линией', body: 'Мягко удерживайте ситуацию в уме. Перемешайте полный набор, примите одну бусину, распознайте её линию и верните. Шесть встреч строят фигуру снизу вверх.',
      drawFirst: 'Вытянуть первую бусину', drawNext: 'Вытянуть следующую бусину', mixing: 'Перемешиваем все шестнадцать бусин', selected: 'Одна бусина выходит вперёд', returning: 'Возвращаем её в целое', completeSet: 'Полный набор снова собран.',
      source: 'Этот современный метод шестнадцати бусин описан в связи со статьёй Мартина Гарднера в Scientific American 1974 года. Он моделирует стандартизированные вероятности тысячелистника, но не является исторической физической процедурой со стеблями.',
      colors: { plum: 'сливовая', gold: 'золотая', forest: 'лесная зелёная', 'blue-jade': 'сине-нефритовая' },
      guideEyebrow: 'Современная практика вероятностей', guideTitle: 'Шестнадцать равновероятных бусин делают вероятности видимыми.', guideBody: 'Одна бусина означает старый инь (6), три — старый ян (9), пять — молодой ян (7), семь — молодой инь (8). Каждое извлечение использует безопасный источник случайности браузера.', modernNote: 'Метод бусин — современная модель, а не сокращённая версия исторического ритуала со стеблями.', returnNote: 'После каждого извлечения бусина возвращается в сосуд, поэтому каждая линия начинается из одного и того же полного набора шестнадцати.', tokensLabel: 'Равновероятные бусины', probabilityLabel: 'Вероятность', sourceLabel: 'Примечание о методе и источник',
    },
  },
  de: {
    status: AI_ASSISTED_UI_DRAFT,
    copy: {
      methodTitle: '16 farbige Perlen', methodBody: 'Ziehen Sie eine von sechzehn gleichwertigen Perlen, legen Sie sie zurück und wiederholen Sie den Vorgang. Die Gruppen 1:3:5:7 bilden die standardisierten Schafgarben-Wahrscheinlichkeiten ab.', eyebrow: 'Praxis mit sechzehn Perlen', title: 'Eine Perle ziehen und vor der nächsten Linie zurücklegen', body: 'Halten Sie die Situation leicht im Bewusstsein. Mischen Sie den vollständigen Satz, nehmen Sie eine Perle wahr, erkennen Sie ihre Linie und legen Sie sie zurück. Sechs Begegnungen bauen die Figur von unten nach oben auf.', drawFirst: 'Die erste Perle ziehen', drawNext: 'Die nächste Perle ziehen', mixing: 'Alle sechzehn Perlen werden gemischt', selected: 'Eine Perle tritt hervor', returning: 'Rückkehr zum Ganzen', completeSet: 'Der vollständige Satz ist wieder beisammen.', source: 'Diese moderne Methode mit sechzehn Spielsteinen wurde im Zusammenhang mit Martin Gardners Scientific-American-Beitrag von 1974 beschrieben. Sie bildet die standardisierten Schafgarben-Wahrscheinlichkeiten ab, ist aber nicht das historische physische Stängelverfahren.', colors: { plum: 'pflaumenfarben', gold: 'golden', forest: 'waldgrün', 'blue-jade': 'blauer Jade' }, guideEyebrow: 'Eine moderne Wahrscheinlichkeitspraxis', guideTitle: 'Sechzehn gleiche Spielsteine machen die Wahrscheinlichkeiten sichtbar.', guideBody: 'Eine Perle steht für altes Yin (6), drei für altes Yang (9), fünf für junges Yang (7) und sieben für junges Yin (8). Jede Ziehung nutzt die sichere Zufallsquelle des Browsers.', modernNote: 'Die Perlenmethode ist ein modernes Modell, keine verkürzte Form des historischen Stängelrituals.', returnNote: 'Nach jeder Ziehung kehrt die Perle in das Gefäß zurück; jede Linie beginnt wieder mit allen sechzehn.', tokensLabel: 'Gleiche Spielsteine', probabilityLabel: 'Wahrscheinlichkeit', sourceLabel: 'Methodenhinweis und Quelle',
    },
  },
  it: {
    status: AI_ASSISTED_UI_DRAFT,
    copy: {
      methodTitle: '16 perle colorate', methodBody: 'Estrai una delle sedici perle equivalenti, rimettila nell’insieme e ripeti. I gruppi 1:3:5:7 riproducono le probabilità standardizzate dell’achillea.', eyebrow: 'Pratica delle sedici perle', title: 'Estrai una perla e rimettila prima della linea successiva', body: 'Tieni la situazione con leggerezza. Mescola l’insieme completo, accogli una perla, riconosci la sua linea e rimettila. Sei incontri costruiscono la figura dal basso verso l’alto.', drawFirst: 'Estrai la prima perla', drawNext: 'Estrai la perla successiva', mixing: 'Mescolando tutte le sedici perle', selected: 'Una perla viene avanti', returning: 'Ritorno all’insieme', completeSet: 'L’insieme completo è di nuovo presente.', source: 'Questo moderno metodo dei sedici gettoni è stato descritto in relazione all’articolo di Martin Gardner su Scientific American del 1974. Modella le probabilità standardizzate dell’achillea, ma non è la procedura fisica storica con gli steli.', colors: { plum: 'prugna', gold: 'oro', forest: 'verde bosco', 'blue-jade': 'giada blu' }, guideEyebrow: 'Una moderna pratica di probabilità', guideTitle: 'Sedici gettoni equivalenti rendono visibili le probabilità.', guideBody: 'Una perla rappresenta il vecchio yin (6), tre il vecchio yang (9), cinque il giovane yang (7) e sette il giovane yin (8). Ogni estrazione usa la sorgente casuale sicura del browser.', modernNote: 'Il metodo delle perle è un modello moderno, non una versione abbreviata del rito storico con gli steli.', returnNote: 'Dopo ogni estrazione la perla torna nel recipiente, così ogni linea ricomincia dallo stesso insieme completo di sedici.', tokensLabel: 'Gettoni equivalenti', probabilityLabel: 'Probabilità', sourceLabel: 'Nota sul metodo e fonte',
    },
  },
  fr: {
    status: AI_ASSISTED_UI_DRAFT,
    copy: {
      methodTitle: '16 perles colorées', methodBody: 'Tirez une perle parmi seize perles équiprobables, remettez-la dans l’ensemble et recommencez. Les groupes 1:3:5:7 reproduisent les probabilités standardisées de l’achillée.', eyebrow: 'Pratique des seize perles', title: 'Tirez une perle et remettez-la avant la ligne suivante', body: 'Gardez doucement la situation à l’esprit. Mélangez l’ensemble complet, accueillez une perle, reconnaissez sa ligne puis remettez-la. Six rencontres construisent la figure de bas en haut.', drawFirst: 'Tirer la première perle', drawNext: 'Tirer la perle suivante', mixing: 'Mélange des seize perles', selected: 'Une perle se présente', returning: 'Retour à l’ensemble', completeSet: 'L’ensemble complet est de nouveau réuni.', source: 'Cette méthode moderne à seize jetons a été décrite en lien avec l’article de Martin Gardner paru dans Scientific American en 1974. Elle modélise les probabilités standardisées de l’achillée, mais ne constitue pas la procédure physique historique avec les tiges.', colors: { plum: 'prune', gold: 'or', forest: 'vert forêt', 'blue-jade': 'jade bleu' }, guideEyebrow: 'Une pratique moderne des probabilités', guideTitle: 'Seize jetons égaux rendent les probabilités visibles.', guideBody: 'Une perle représente le vieux yin (6), trois le vieux yang (9), cinq le jeune yang (7) et sept le jeune yin (8). Chaque tirage utilise la source aléatoire sécurisée du navigateur.', modernNote: 'La méthode des perles est un modèle moderne, et non une version abrégée du rituel historique des tiges.', returnNote: 'Après chaque tirage, la perle retourne dans le récipient : chaque ligne recommence avec le même ensemble complet de seize.', tokensLabel: 'Jetons égaux', probabilityLabel: 'Probabilité', sourceLabel: 'Note sur la méthode et source',
    },
  },
  es: {
    status: AI_ASSISTED_UI_DRAFT,
    copy: {
      methodTitle: '16 cuentas de colores', methodBody: 'Saca una de dieciséis cuentas equivalentes, devuélvela al conjunto y repite. Los grupos 1:3:5:7 reproducen las probabilidades estandarizadas de la milenrama.', eyebrow: 'Práctica de las dieciséis cuentas', title: 'Saca una cuenta y devuélvela antes de la línea siguiente', body: 'Mantén la situación con ligereza. Mezcla el conjunto completo, recibe una cuenta, reconoce su línea y devuélvela. Seis encuentros construyen la figura de abajo arriba.', drawFirst: 'Sacar la primera cuenta', drawNext: 'Sacar la cuenta siguiente', mixing: 'Mezclando las dieciséis cuentas', selected: 'Una cuenta se presenta', returning: 'Devolviéndola al conjunto', completeSet: 'El conjunto completo vuelve a estar presente.', source: 'Este método moderno de dieciséis fichas fue descrito en relación con el artículo de Martin Gardner publicado en Scientific American en 1974. Modela las probabilidades estandarizadas de la milenrama, pero no es el procedimiento físico histórico con tallos.', colors: { plum: 'ciruela', gold: 'dorada', forest: 'verde bosque', 'blue-jade': 'jade azul' }, guideEyebrow: 'Una práctica moderna de probabilidad', guideTitle: 'Dieciséis fichas iguales hacen visibles las probabilidades.', guideBody: 'Una cuenta representa el yin viejo (6), tres el yang viejo (9), cinco el yang joven (7) y siete el yin joven (8). Cada extracción usa la fuente aleatoria segura del navegador.', modernNote: 'El método de las cuentas es un modelo moderno, no una versión abreviada del ritual histórico con tallos.', returnNote: 'Después de cada extracción, la cuenta vuelve al recipiente; cada línea comienza de nuevo con el mismo conjunto completo de dieciséis.', tokensLabel: 'Fichas iguales', probabilityLabel: 'Probabilidad', sourceLabel: 'Nota sobre el método y fuente',
    },
  },
  'pt-PT': {
    status: AI_ASSISTED_UI_DRAFT,
    copy: {
      methodTitle: '16 contas coloridas', methodBody: 'Retira uma de dezasseis contas equivalentes, devolve-a ao conjunto e repete. Os grupos 1:3:5:7 reproduzem as probabilidades padronizadas do milefólio.', eyebrow: 'Prática das dezasseis contas', title: 'Retira uma conta e devolve-a antes da linha seguinte', body: 'Mantém a situação com leveza. Mistura o conjunto completo, recebe uma conta, reconhece a sua linha e devolve-a. Seis encontros constroem a figura de baixo para cima.', drawFirst: 'Retirar a primeira conta', drawNext: 'Retirar a conta seguinte', mixing: 'A misturar as dezasseis contas', selected: 'Uma conta apresenta-se', returning: 'A devolvê-la ao conjunto', completeSet: 'O conjunto completo está novamente presente.', source: 'Este método moderno de dezasseis fichas foi descrito em ligação com o artigo de Martin Gardner publicado na Scientific American em 1974. Modela as probabilidades padronizadas do milefólio, mas não é o procedimento físico histórico com varetas.', colors: { plum: 'ameixa', gold: 'dourada', forest: 'verde-floresta', 'blue-jade': 'jade azul' }, guideEyebrow: 'Uma prática moderna de probabilidade', guideTitle: 'Dezasseis fichas iguais tornam visíveis as probabilidades.', guideBody: 'Uma conta representa o yin velho (6), três o yang velho (9), cinco o yang jovem (7) e sete o yin jovem (8). Cada retirada usa a fonte aleatória segura do navegador.', modernNote: 'O método das contas é um modelo moderno, não uma versão abreviada do ritual histórico das varetas.', returnNote: 'Depois de cada retirada, a conta regressa ao recipiente; cada linha recomeça com o mesmo conjunto completo de dezasseis.', tokensLabel: 'Fichas iguais', probabilityLabel: 'Probabilidade', sourceLabel: 'Nota sobre o método e fonte',
    },
  },
  pl: {
    status: AI_ASSISTED_UI_DRAFT,
    copy: {
      methodTitle: '16 kolorowych koralików', methodBody: 'Wylosuj jeden z szesnastu równoważnych koralików, odłóż go z powrotem i powtórz. Grupy 1:3:5:7 odtwarzają standaryzowane prawdopodobieństwa krwawnika.', eyebrow: 'Praktyka szesnastu koralików', title: 'Wylosuj koralik i odłóż go przed następną linią', body: 'Lekko utrzymuj sytuację w uwadze. Wymieszaj pełny zestaw, przyjmij jeden koralik, rozpoznaj jego linię i odłóż go. Sześć spotkań buduje figurę od dołu ku górze.', drawFirst: 'Wylosuj pierwszy koralik', drawNext: 'Wylosuj następny koralik', mixing: 'Mieszanie wszystkich szesnastu koralików', selected: 'Jeden koralik wysuwa się naprzód', returning: 'Powrót do całości', completeSet: 'Pełny zestaw znów jest razem.', source: 'Ta współczesna metoda szesnastu żetonów została opisana w związku z artykułem Martina Gardnera w Scientific American z 1974 roku. Modeluje standaryzowane prawdopodobieństwa krwawnika, ale nie jest historyczną fizyczną procedurą z łodygami.', colors: { plum: 'śliwkowy', gold: 'złoty', forest: 'leśna zieleń', 'blue-jade': 'błękitny jadeit' }, guideEyebrow: 'Współczesna praktyka prawdopodobieństwa', guideTitle: 'Szesnaście równych żetonów uwidacznia prawdopodobieństwa.', guideBody: 'Jeden koralik oznacza stare yin (6), trzy stare yang (9), pięć młode yang (7), a siedem młode yin (8). Każde losowanie korzysta z bezpiecznego źródła losowości przeglądarki.', modernNote: 'Metoda koralików jest współczesnym modelem, a nie skróconą wersją historycznego rytuału z łodygami.', returnNote: 'Po każdym losowaniu koralik wraca do naczynia, więc każda linia zaczyna się od tego samego pełnego zestawu szesnastu.', tokensLabel: 'Równe żetony', probabilityLabel: 'Prawdopodobieństwo', sourceLabel: 'Nota o metodzie i źródło',
    },
  },
}

export function beadCopyFor(locale: Locale) {
  return BEAD_COPY[locale].copy
}

export function beadCopyStatus(locale: Locale) {
  return BEAD_COPY[locale].status
}
