import type { Locale } from '../domain/locales'

export type DaoShellCopy = {
  overview: string
  previewLabel: string
  previewBody: string
  open: string
  sourceLink: string
  sourceNote: string
  modernLabel: string
  modernBody: string
}

export const DAO_SHELL_COPY: Record<Locale, DaoShellCopy> = {
  en: {
    overview: 'Overview',
    previewLabel: 'Early preview · work in progress',
    previewBody: 'This is a small Yi Path introduction, not a complete account of Daoist traditions. Clearer source trails, more texts, and carefully reviewed practices will be added as this space develops.',
    open: 'Open this path',
    sourceLink: 'Read the public-domain translation',
    sourceNote: 'James Legge translation, 1891 · Project Gutenberg eBook 216 · public domain in the USA',
    modernLabel: 'Modern introductory exercise',
    modernBody: 'This settling practice is a Yi Path exercise inspired by non-forcing. It is not presented as an ancient or lineage Daoist breathing method.',
  },
  bg: {
    overview: 'Преглед',
    previewLabel: 'Ранен преглед · в процес на разработка',
    previewBody: 'Това е кратко въведение на Yi Path, а не пълен разказ за даоистките традиции. С развитието на това пространство ще добавяме по-ясни източници, още текстове и внимателно проверени практики.',
    open: 'Отвори тази пътека',
    sourceLink: 'Прочети превода в обществено достояние',
    sourceNote: 'Превод на Джеймс Леге, 1891 · Project Gutenberg eBook 216 · обществено достояние в САЩ',
    modernLabel: 'Съвременно въвеждащо упражнение',
    modernBody: 'Тази успокояваща практика е упражнение на Yi Path, вдъхновено от ненасилването. Не я представяме като древен или традиционен даоистки метод на дишане.',
  },
  ru: {
    overview: 'Обзор',
    previewLabel: 'Ранняя версия · в разработке',
    previewBody: 'Это небольшое введение Yi Path, а не полный обзор даосских традиций. По мере развития раздела появятся более ясные источники, новые тексты и тщательно проверенные практики.',
    open: 'Открыть этот путь',
    sourceLink: 'Прочитать перевод в общественном достоянии',
    sourceNote: 'Перевод Джеймса Легга, 1891 · Project Gutenberg eBook 216 · общественное достояние в США',
    modernLabel: 'Современное вводное упражнение',
    modernBody: 'Эта успокаивающая практика — упражнение Yi Path, вдохновлённое темой недеяния без принуждения. Она не представлена как древний или традиционный даосский метод дыхания.',
  },
  de: {
    overview: 'Übersicht',
    previewLabel: 'Frühe Vorschau · in Arbeit',
    previewBody: 'Dies ist eine kleine Einführung von Yi Path, keine vollständige Darstellung daoistischer Traditionen. Klarere Quellenwege, weitere Texte und sorgfältig geprüfte Übungen werden nach und nach ergänzt.',
    open: 'Diesen Pfad öffnen',
    sourceLink: 'Gemeinfreie Übersetzung lesen',
    sourceNote: 'Übersetzung von James Legge, 1891 · Project Gutenberg eBook 216 · in den USA gemeinfrei',
    modernLabel: 'Moderne Einführungsübung',
    modernBody: 'Diese beruhigende Praxis ist eine Yi-Path-Übung, angeregt vom Nicht-Erzwingen. Sie wird nicht als alte oder traditionsgebundene daoistische Atemmethode dargestellt.',
  },
  it: {
    overview: 'Panoramica',
    previewLabel: 'Anteprima iniziale · lavori in corso',
    previewBody: 'Questa è una breve introduzione di Yi Path, non un resoconto completo delle tradizioni daoiste. Aggiungeremo fonti più chiare, altri testi e pratiche attentamente verificate.',
    open: 'Apri questo percorso',
    sourceLink: 'Leggi la traduzione di pubblico dominio',
    sourceNote: 'Traduzione di James Legge, 1891 · Project Gutenberg eBook 216 · pubblico dominio negli Stati Uniti',
    modernLabel: 'Esercizio introduttivo moderno',
    modernBody: 'Questa pratica calmante è un esercizio Yi Path ispirato al non forzare. Non viene presentata come un antico metodo di respirazione daoista o di lignaggio.',
  },
  fr: {
    overview: 'Vue d’ensemble',
    previewLabel: 'Aperçu initial · travail en cours',
    previewBody: 'Ceci est une courte introduction de Yi Path, et non une présentation complète des traditions daoïstes. Des sources plus claires, davantage de textes et des pratiques soigneusement vérifiées seront ajoutés progressivement.',
    open: 'Ouvrir ce parcours',
    sourceLink: 'Lire la traduction du domaine public',
    sourceNote: 'Traduction de James Legge, 1891 · Project Gutenberg eBook 216 · domaine public aux États-Unis',
    modernLabel: 'Exercice d’introduction moderne',
    modernBody: 'Cette pratique d’apaisement est un exercice Yi Path inspiré du non-forçage. Elle n’est pas présentée comme une méthode respiratoire daoïste ancienne ou issue d’une lignée.',
  },
  es: {
    overview: 'Resumen',
    previewLabel: 'Vista previa · trabajo en curso',
    previewBody: 'Esta es una breve introducción de Yi Path, no una descripción completa de las tradiciones daoístas. Añadiremos fuentes más claras, más textos y prácticas revisadas cuidadosamente a medida que crezca este espacio.',
    open: 'Abrir este camino',
    sourceLink: 'Leer la traducción de dominio público',
    sourceNote: 'Traducción de James Legge, 1891 · Project Gutenberg eBook 216 · dominio público en Estados Unidos',
    modernLabel: 'Ejercicio introductorio moderno',
    modernBody: 'Esta práctica de asentamiento es un ejercicio de Yi Path inspirado en no forzar. No se presenta como un método respiratorio daoísta antiguo ni perteneciente a un linaje.',
  },
  'pt-PT': {
    overview: 'Visão geral',
    previewLabel: 'Pré-visualização · trabalho em curso',
    previewBody: 'Esta é uma breve introdução da Yi Path, não uma descrição completa das tradições daoistas. Serão acrescentadas fontes mais claras, mais textos e práticas cuidadosamente revistas à medida que este espaço crescer.',
    open: 'Abrir este percurso',
    sourceLink: 'Ler a tradução em domínio público',
    sourceNote: 'Tradução de James Legge, 1891 · Project Gutenberg eBook 216 · domínio público nos Estados Unidos',
    modernLabel: 'Exercício introdutório moderno',
    modernBody: 'Esta prática de acalmar é um exercício Yi Path inspirado em não forçar. Não é apresentada como um método de respiração daoista antigo ou pertencente a uma linhagem.',
  },
  pl: {
    overview: 'Przegląd',
    previewLabel: 'Wczesny podgląd · prace trwają',
    previewBody: 'To krótkie wprowadzenie Yi Path, a nie pełny opis tradycji daoistycznych. Wraz z rozwojem tej przestrzeni dodamy wyraźniejsze źródła, kolejne teksty i starannie sprawdzone praktyki.',
    open: 'Otwórz tę ścieżkę',
    sourceLink: 'Przeczytaj przekład z domeny publicznej',
    sourceNote: 'Przekład Jamesa Legge’a, 1891 · Project Gutenberg eBook 216 · domena publiczna w USA',
    modernLabel: 'Współczesne ćwiczenie wprowadzające',
    modernBody: 'Ta praktyka uspokojenia jest ćwiczeniem Yi Path inspirowanym niedziałaniem bez przymusu. Nie przedstawiamy jej jako dawnej ani przekazywanej w linii daoistycznej metody oddechowej.',
  },
}
