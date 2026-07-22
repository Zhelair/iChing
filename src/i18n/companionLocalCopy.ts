import type { Locale } from '../domain/locales'

type LocalCompanionCopy = {
  eyebrow: string
  title: string
  body: string
  enable: string
  enableBody: string
  privacy: string
  privacyBody: string
  noRequest: string
  /** Legacy translated copy kept for export compatibility; no longer rendered. */
  routineTitle?: string
  routine?: [string, string, string, string]
  aiEnable: string
  aiEnableBody: string
}

const en: LocalCompanionCopy = {
  eyebrow: 'Local screen companion',
  title: 'Your quiet companion',
  body: 'Choose an original 2.5D tuxedo cat or Labrador. The pet lives at the edge of the screen, reacts locally, and works fully without AI.',
  enable: 'Keep the companion on screen',
  enableBody: 'Independent from AI reflections. Turning AI off never removes the pet.',
  privacy: 'A local companion, separate from AI',
  privacyBody: 'Pet motion, sounds, and route-aware routines run only in this browser. AI reflections are a separate, optional BYOK feature.',
  noRequest: 'Opening or playing with the companion never sends data. Pet sounds happen only after your direct interaction.',
  aiEnable: 'Enable AI reflections',
  aiEnableBody: 'Optional BYOK layer. No background requests; each request needs your explicit preview and confirmation.',
}

const packs: Record<Locale, LocalCompanionCopy> = {
  en,
  bg: { ...en, eyebrow: 'Локален спътник на екрана', title: 'Вашият тих спътник', body: 'Изберете оригинална 2.5D котка смокинг или лабрадор. Любимецът живее в края на екрана, реагира локално и работи напълно без AI.', enable: 'Показвай спътника на екрана', enableBody: 'Независим от AI размислите. Изключването на AI не премахва любимеца.', privacy: 'Локален спътник, отделен от AI', privacyBody: 'Движенията, звуците и поведението по страници работят само в този браузър. AI размислите са отделна BYOK функция.', noRequest: 'Играта със спътника никога не изпраща данни. Звуци има само след ваше действие.', routineTitle: 'Тиха локална рутина', routine: ['Начало · нежен поздрав', 'Хвърляне · спи тихо', 'Дневник · почива до вас', 'Настройки · остава на екрана'], aiEnable: 'Включи DeepSeek размисли', aiEnableBody: 'Незадължителен BYOK слой. Няма фонови заявки; всяка заявка изисква преглед и потвърждение.' },
  ru: { ...en, eyebrow: 'Локальный экранный спутник', title: 'Ваш тихий спутник', body: 'Выберите оригинального 2,5D кота-смокинга или лабрадора. Питомец живёт у края экрана, реагирует локально и полностью работает без ИИ.', enable: 'Показывать спутника на экране', enableBody: 'Не зависит от ИИ-размышлений. Отключение ИИ не убирает питомца.', privacy: 'Локальный спутник, отдельно от ИИ', privacyBody: 'Движения, звуки и поведение по разделам работают только в этом браузере. ИИ-размышления — отдельная функция BYOK.', noRequest: 'Игра со спутником никогда не отправляет данные. Звуки звучат только после вашего действия.', routineTitle: 'Тихий локальный распорядок', routine: ['Главная · мягкое приветствие', 'Бросок · тихо спит', 'Дневник · отдыхает рядом', 'Настройки · остаётся на экране'], aiEnable: 'Включить размышления DeepSeek', aiEnableBody: 'Необязательный слой BYOK. Нет фоновых запросов; каждый запрос требует просмотра и подтверждения.' },
  de: { ...en, eyebrow: 'Lokaler Bildschirmbegleiter', title: 'Dein ruhiger Begleiter', body: 'Wähle eine originale 2,5D-Tuxedo-Katze oder einen Labrador. Das Tier lebt am Bildschirmrand, reagiert lokal und funktioniert vollständig ohne KI.', enable: 'Begleiter auf dem Bildschirm anzeigen', enableBody: 'Unabhängig von KI-Reflexionen. Das Abschalten der KI entfernt das Tier nicht.', privacy: 'Lokaler Begleiter, getrennt von KI', privacyBody: 'Bewegung, Töne und Seitenroutinen laufen nur in diesem Browser. KI-Reflexionen sind eine getrennte BYOK-Funktion.', noRequest: 'Spielen sendet niemals Daten. Tiergeräusche folgen nur auf deine direkte Interaktion.', routineTitle: 'Ruhige lokale Routine', routine: ['Start · sanfte Begrüßung', 'Werfen · schläft ruhig', 'Journal · ruht bei dir', 'Einstellungen · bleibt sichtbar'], aiEnable: 'DeepSeek-Reflexionen aktivieren', aiEnableBody: 'Optionale BYOK-Ebene. Keine Hintergrundanfragen; jede Anfrage braucht Vorschau und Bestätigung.' },
  it: { ...en, eyebrow: 'Compagno locale sullo schermo', title: 'Il tuo compagno tranquillo', body: 'Scegli un originale gatto tuxedo o Labrador in 2,5D. Vive sul bordo dello schermo, reagisce in locale e funziona pienamente senza IA.', enable: 'Mostra il compagno sullo schermo', enableBody: 'Indipendente dalle riflessioni IA. Disattivare l’IA non rimuove il pet.', privacy: 'Compagno locale, separato dall’IA', privacyBody: 'Movimento, suoni e routine funzionano solo in questo browser. Le riflessioni IA sono una funzione BYOK separata.', noRequest: 'Giocare non invia mai dati. I suoni partono solo dopo un’interazione diretta.', routineTitle: 'Routine locale tranquilla', routine: ['Home · saluto gentile', 'Lancio · dorme tranquillo', 'Diario · riposa accanto a te', 'Impostazioni · resta visibile'], aiEnable: 'Attiva riflessioni DeepSeek', aiEnableBody: 'Livello BYOK facoltativo. Nessuna richiesta in background; ogni richiesta richiede anteprima e conferma.' },
  fr: { ...en, eyebrow: 'Compagnon local à l’écran', title: 'Votre compagnon tranquille', body: 'Choisissez un chat tuxedo ou un Labrador original en 2,5D. Il vit au bord de l’écran, réagit localement et fonctionne entièrement sans IA.', enable: 'Garder le compagnon à l’écran', enableBody: 'Indépendant des réflexions IA. Désactiver l’IA ne retire pas l’animal.', privacy: 'Compagnon local, séparé de l’IA', privacyBody: 'Mouvements, sons et routines s’exécutent uniquement dans ce navigateur. Les réflexions IA sont une fonction BYOK séparée.', noRequest: 'Jouer n’envoie jamais de données. Les sons suivent uniquement une interaction directe.', routineTitle: 'Routine locale calme', routine: ['Accueil · salutation douce', 'Tirage · dort calmement', 'Journal · se repose près de vous', 'Réglages · reste visible'], aiEnable: 'Activer les réflexions DeepSeek', aiEnableBody: 'Couche BYOK facultative. Aucune requête en arrière-plan ; chaque demande exige aperçu et confirmation.' },
  es: { ...en, eyebrow: 'Compañero local en pantalla', title: 'Tu compañero tranquilo', body: 'Elige un gato tuxedo o Labrador original en 2,5D. Vive al borde de la pantalla, reacciona localmente y funciona por completo sin IA.', enable: 'Mantener el compañero en pantalla', enableBody: 'Independiente de las reflexiones de IA. Desactivar la IA no quita la mascota.', privacy: 'Compañero local, separado de la IA', privacyBody: 'Movimiento, sonidos y rutinas funcionan solo en este navegador. Las reflexiones de IA son una función BYOK separada.', noRequest: 'Jugar nunca envía datos. Los sonidos solo siguen a tu interacción directa.', routineTitle: 'Rutina local tranquila', routine: ['Inicio · saludo suave', 'Lanzamiento · duerme tranquilo', 'Diario · descansa contigo', 'Ajustes · permanece visible'], aiEnable: 'Activar reflexiones DeepSeek', aiEnableBody: 'Capa BYOK opcional. Sin solicitudes de fondo; cada petición requiere vista previa y confirmación.' },
  'pt-PT': { ...en, eyebrow: 'Companheiro local no ecrã', title: 'O teu companheiro tranquilo', body: 'Escolhe um gato tuxedo ou Labrador original em 2,5D. Vive na margem do ecrã, reage localmente e funciona totalmente sem IA.', enable: 'Manter o companheiro no ecrã', enableBody: 'Independente das reflexões de IA. Desligar a IA não remove o animal.', privacy: 'Companheiro local, separado da IA', privacyBody: 'Movimento, sons e rotinas funcionam apenas neste navegador. As reflexões de IA são uma função BYOK separada.', noRequest: 'Brincar nunca envia dados. Os sons só acontecem após interação direta.', routineTitle: 'Rotina local tranquila', routine: ['Início · saudação suave', 'Lançamento · dorme tranquilo', 'Diário · descansa contigo', 'Definições · fica visível'], aiEnable: 'Ativar reflexões DeepSeek', aiEnableBody: 'Camada BYOK opcional. Sem pedidos em segundo plano; cada pedido exige pré-visualização e confirmação.' },
  pl: { ...en, eyebrow: 'Lokalny towarzysz ekranu', title: 'Twój spokojny towarzysz', body: 'Wybierz oryginalnego kota tuxedo lub Labradora 2,5D. Zwierzak mieszka przy krawędzi ekranu, reaguje lokalnie i działa w pełni bez AI.', enable: 'Pokazuj towarzysza na ekranie', enableBody: 'Niezależny od refleksji AI. Wyłączenie AI nie usuwa zwierzaka.', privacy: 'Lokalny towarzysz, oddzielony od AI', privacyBody: 'Ruch, dźwięki i rutyny działają tylko w tej przeglądarce. Refleksje AI to oddzielna funkcja BYOK.', noRequest: 'Zabawa nigdy nie wysyła danych. Dźwięki pojawiają się tylko po bezpośredniej interakcji.', routineTitle: 'Spokojna lokalna rutyna', routine: ['Start · łagodne powitanie', 'Rzut · śpi spokojnie', 'Dziennik · odpoczywa obok', 'Ustawienia · pozostaje widoczny'], aiEnable: 'Włącz refleksje DeepSeek', aiEnableBody: 'Opcjonalna warstwa BYOK. Brak żądań w tle; każde wymaga podglądu i potwierdzenia.' },
}

export function companionLocalCopyFor(locale: Locale) {
  return packs[locale]
}
