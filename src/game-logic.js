export const DIE_FACTOR_BY_ROLL = { 1: 0.45, 2: 0.75, 3: 1, 4: 1.15, 5: 1.35, 6: 1.65 };
export const MIN_SAVINGS = -10;
export const NOBEL_REQUIREMENTS = { prestige: 70, papers: 6, discoveries: 2, wellbeing: 20 };
export const MAX_GAME_ROUNDS = 10;
/** Wellbeing at or below this value triggers a forced burnout game-over. */
export const BURNOUT_THRESHOLD = 10;

export const ACHIEVEMENTS = [
  { id: 'degree',       condition: (s) => s.rounds >= 1 },
  { id: 'first_paper',  condition: (s) => s.papers >= 1 },
  { id: 'phd',          condition: (s) => s.prestige >= 20 && s.papers >= 2 },
  { id: 'ten_papers',   condition: (s) => s.papers >= 10 },
  { id: 'discovery',    condition: (s) => s.discoveries >= 1 },
  { id: 'two_discoveries', condition: (s) => s.discoveries >= 2 },
  { id: 'prestige50',   condition: (s) => s.prestige >= 50 },
  { id: 'wellbeing80',  condition: (s) => s.wellbeing >= 80 },
];

/** Returns a signed string representation of a numeric delta, e.g. "+5" or "-3".
 *  Callers are expected to filter out zero deltas before invoking this function.
 */
function formatDelta(d) {
  return `${d > 0 ? '+' : ''}${d}`;
}

/**
 * Builds a list of human-readable delta strings for changed stats.
 * Returns an array so callers can join with a locale-specific separator
 * or apply further filtering before rendering.
 * @param {Array<[string, string]>} labels - Pairs of [display label, state key].
 * @param {Object} before - Snapshot of stats before the impact.
 * @param {Object} after  - Stats object after the impact.
 * @returns {string[]} Array of formatted delta strings for stats that changed.
 */
function buildImpactText(labels, before, after) {
  const deltas = labels
    .filter(([, key]) => after[key] !== before[key])
    .map(([label, key]) => `${label} ${formatDelta(after[key] - before[key])}`);
  return deltas;
}

export const LANG = {
  es: {
    htmlLang: 'es',
    pageTitle: 'Carrera Científica: Camino al Nobel',
    gameTitle: 'Carrera Científica: Camino al Nobel',
    subtitle: 'Un juego rápido para entender lo bonito y lo duro de la ciencia.',
    characterSectionTitle: 'Tu personaje',
    questionSectionStart: 'Empieza tu camino',
    questionPlaceholder: 'Pulsa en "Comenzar" para recibir tu primera decisión.',
    resultSectionTitle: 'Resultado',
    resultPlaceholder: 'Aquí verás qué pasó con tu decisión.',
    startBtnLabel: 'Comenzar',
    restartBtnLabel: 'Jugar otra vez',
    achievementsTitle: 'Logros',
    achievementsPlaceholder: 'Aún no has conseguido ningún logro.',
    achievements: {
      degree:          '🎓 ¡Licenciado/a! Elegiste tu carrera universitaria.',
      first_paper:     '📄 ¡Primer paper publicado!',
      phd:             '🔬 ¡Doctorado aprobado! Prestigio y papers suficientes.',
      ten_papers:      '📚 ¡10 papers publicados! Investigador/a prolífico/a.',
      discovery:       '💡 ¡Primer descubrimiento científico!',
      two_discoveries: '🌌 ¡Dos descubrimientos! Camino al Nobel.',
      prestige50:      '⭐ ¡Prestigio 50! Referente en tu campo.',
      wellbeing80:     '😊 ¡Bienestar 80! Equilibrio vida-ciencia.',
    },
    genders: ['mujer', 'hombre', 'persona no binaria'],
    genderDescriptors: {
      mujer: 'una mujer',
      hombre: 'un hombre',
      'persona no binaria': 'una persona no binaria'
    },
    characterIntro: (descriptor, age) =>
      `Tu protagonista es ${descriptor} de ${age} años que empieza a decidir su camino científico.`,
    dieIntro: 'Cada opción se resuelve con un dado virtual (1-6).',
    dieText: (roll) => {
      if (roll <= 2) return `🎲 Sacaste un ${roll}: hubo obstáculos imprevistos.`;
      if (roll <= 4) return `🎲 Sacaste un ${roll}: resultado razonable.`;
      return `🎲 Sacaste un ${roll}: ¡salió mejor de lo esperado!`;
    },
    decisionText: (label) => `Decidiste: "${label}"`,
    impactText: (before, after) => {
      const deltas = buildImpactText(
        [['Prestigio', 'prestige'], ['Bienestar', 'wellbeing'], ['Ahorros', 'savings'], ['Papers', 'papers'], ['Hallazgos', 'discoveries']],
        before, after
      );
      return deltas.length ? `📊 Cambios: ${deltas.join(' · ')}` : '📊 Sin cambios en estadísticas.';
    },
    statsText: (s) =>
      `Edad: ${s.age} · Prestigio: ${s.prestige} · Bienestar: ${s.wellbeing} · Ahorros: ${s.savings} · Papers: ${s.papers} · Hallazgos: ${s.discoveries}`,
    gameEndTitle: 'Final de partida',
    nobelWin: '¡Ganaste el Nobel! Llegaste lejos combinando rigor, decisiones difíciles y algo de suerte.',
    nobelLose: 'No llegó el Nobel esta vez, pero construiste una carrera real: con aprendizaje, tropiezos y logros.',
    gameEndResult: (s) =>
      `Cierre: terminaste con ${s.papers} papers y ${s.discoveries} descubrimientos. La ciencia es una maratón, no un sprint.`,
    leftAcademiaTitle: 'Nueva etapa fuera de la academia',
    leftAcademiaMsg: 'Elegiste salir de la academia. No toda carrera científica termina en un laboratorio: muchos exinvestigadores transforman el mundo desde la empresa, la política o la educación. Fue una decisión valiente y completamente legítima.',
    leftAcademiaResult: (s) =>
      `Saliste en la ronda ${s.rounds}. Acumulaste ${s.papers} papers y ${s.discoveries} descubrimientos. El conocimiento que adquiriste te acompañará siempre.`,
    burnoutTitle: 'Burnout: el límite del cuerpo y la mente',
    burnoutMsg: 'La presión acumulada te pasó factura. El burnout científico afecta a casi la mitad de las personas en investigación. Parar a tiempo también es sabiduría: tu bienestar importa más que cualquier paper.',
    burnoutResult: (s) =>
      `Tu bienestar llegó al límite en la ronda ${s.rounds}. Con ${s.papers} papers y ${s.discoveries} descubrimientos, dejaste huella aunque el camino se cortó antes de lo esperado.`,
    endingCharacterLabel: 'Tu homólogo científico',
    questions: [
      {
        order: 1,
        title: 'Primera gran decisión',
        text: 'Tienes 18 años. La selectividad ha quedado atrás y llega el momento de elegir tu carrera. ¿Qué camino científico escoges?',
        options: [
          { label: 'Biología: te fascina el origen de la vida y la célula.', impact: { prestige: 6, wellbeing: 2, papers: 1 } },
          { label: 'Física: quieres descifrar las leyes del universo.', impact: { prestige: 7, papers: 1 } },
          { label: 'Ingeniería biomédica: ciencia con impacto real e inmediato.', impact: { prestige: 5, savings: 2 } }
        ]
      },
      {
        order: 2,
        title: 'El trabajo de fin de grado',
        text: 'En tu último año de carrera, un profesor te invita a su laboratorio para el TFG. Es tu primera chispa real de investigación. ¿Qué haces?',
        options: [
          { label: 'Me implico a fondo: quiero publicar algo aunque me cueste noches.', impact: { prestige: 5, wellbeing: -1, papers: 1 } },
          { label: 'Lo hago bien pero sin obsesionarme; equilibro vida y ciencia.', impact: { prestige: 3, wellbeing: 3 } },
          { label: 'Me doy cuenta de que no es lo mío y busco trabajo fuera.', impact: { wellbeing: 3, savings: 3 }, exitAcademia: true }
        ]
      },
      {
        order: 3,
        title: '¿Doctorado o mercado laboral?',
        text: 'Tu directora de TFG queda encantada contigo y te ofrece una beca de doctorado. Son cuatro años, sueldo bajo y mucha incertidumbre. ¿Aceptas?',
        options: [
          { label: 'Acepto. Quiero llegar lejos en la ciencia.', impact: { prestige: 8, savings: -3, papers: 1 } },
          { label: 'Me lo pienso y busco opciones mixtas entre academia e industria.', impact: { prestige: 4, savings: 1 } },
          { label: 'Rechazo. Prefiero estabilidad y un buen sueldo ya.', impact: { savings: 5, wellbeing: 4 }, exitAcademia: true }
        ]
      },
      {
        order: 4,
        title: 'Los primeros experimentos',
        text: 'Llevas un año en el doctorado y los experimentos no salen como esperabas. El fracaso se repite semana tras semana. ¿Cómo gestionas la frustración?',
        options: [
          { label: 'Busco ayuda y reformulo la hipótesis con calma y método.', impact: { prestige: 6, wellbeing: 2, papers: 1 } },
          { label: 'Me encierro y trabajo el doble de horas para compensar.', impact: { prestige: 5, wellbeing: -7, papers: 1 } },
          { label: 'Hablo con compañeros de doctorado: descubro que no soy el único.', impact: { prestige: 3, wellbeing: 4 } }
        ]
      },
      {
        order: 5,
        title: 'Crisis con el supervisor',
        text: 'Tu supervisor lleva meses ignorando tu trabajo y minimizando tus ideas. Estás al límite. Una colega te dice: "Denuncia, lo que hace no está bien."',
        options: [
          { label: 'Pido formalmente un cambio de supervisor.', impact: { prestige: 4, wellbeing: 3, savings: -1 } },
          { label: 'Aguanto en silencio. Seguro que mejora...', impact: { prestige: 1, wellbeing: -10 } },
          { label: 'No puedo más con esto. Dejo el doctorado.', impact: { wellbeing: 6, savings: 2 }, exitAcademia: true }
        ]
      },
      {
        order: 6,
        title: 'La defensa de tesis',
        text: 'Llegó el gran día. Cuatro años condensados en 200 páginas y 45 minutos ante el tribunal. Es el momento de defender quién eres como investigador/a.',
        options: [
          { label: 'Me preparo a fondo y defiendo con seguridad y pasión.', impact: { prestige: 10, wellbeing: 3, papers: 1, discoveries: 1 } },
          { label: 'Los nervios me bloquean y respondo con dudas ante el tribunal.', impact: { prestige: 4, wellbeing: -2 } },
          { label: 'Presento los datos honestamente, sin adornos, con rigor.', impact: { prestige: 7, wellbeing: 2, papers: 1 } }
        ]
      },
      {
        order: 7,
        title: 'El primer postdoc',
        text: 'Con el doctorado en la mano, te llega una oferta de postdoc en el extranjero. Más recursos, pero lejos de todo lo conocido. ¿Qué haces?',
        options: [
          { label: 'Me mudo: la movilidad internacional abre puertas clave.', impact: { prestige: 9, wellbeing: -2, savings: -2, papers: 1 } },
          { label: 'Prefiero un postdoc local; cuido mi red de apoyo.', impact: { prestige: 5, wellbeing: 3 } },
          { label: 'Acepto un trabajo en industria. La academia puede esperar.', impact: { savings: 6, wellbeing: 5 }, exitAcademia: true }
        ]
      },
      {
        order: 8,
        title: 'La lucha por financiación',
        text: 'Tu contrato postdoctoral termina en dos meses. No hay proyecto nuevo. El laboratorio se queda sin fondos. ¿Cómo sobrevives?',
        options: [
          { label: 'Me lanzo a escribir una propuesta de proyecto competitivo.', impact: { prestige: 7, wellbeing: -5, papers: 1 } },
          { label: 'Busco colaboración con un grupo que tenga financiación.', impact: { prestige: 5, savings: 2, wellbeing: 1 } },
          { label: 'Sin fondos ni perspectivas, dejo la ciencia.', impact: { wellbeing: 3, savings: 4 }, exitAcademia: true }
        ]
      },
      {
        order: 9,
        title: 'El hallazgo inesperado',
        text: 'En un experimento de rutina aparece una señal que no cuadra con nada conocido. Podría ser ruido... o el descubrimiento de tu vida. ¿Qué haces?',
        options: [
          { label: 'Lo investigo con rigor: replico, valido y documento todo.', impact: { prestige: 12, wellbeing: 2, discoveries: 1 } },
          { label: 'Anuncio el descubrimiento antes de validarlo para adelantarme.', impact: { prestige: 3, wellbeing: -3, papers: 1 } },
          { label: 'Pido una revisión externa antes de publicar absolutamente nada.', impact: { prestige: 9, wellbeing: 1, discoveries: 1, papers: 1 } }
        ]
      },
      {
        order: 10,
        title: 'El camino al Nobel',
        text: 'El Comité Nobel empieza a citar tu trabajo. Estás en el círculo de los grandes. Este es el momento de dejar tu huella definitiva en la ciencia.',
        options: [
          { label: 'Publico el paper que lo cambia todo y doy conferencias globales.', impact: { prestige: 15, papers: 2, discoveries: 1 } },
          { label: 'Me centro en mentorizar a la siguiente generación de científicos.', impact: { wellbeing: 10, prestige: 8 } },
          { label: 'Fusiono mi investigación con aplicaciones que salvan vidas.', impact: { prestige: 12, discoveries: 1, wellbeing: 5, papers: 1 } }
        ]
      }
    ]
  },
  en: {
    htmlLang: 'en',
    pageTitle: 'Scientific Career: Road to the Nobel',
    gameTitle: 'Scientific Career: Road to the Nobel',
    subtitle: 'A quick game to understand the beauty and hardship of science.',
    characterSectionTitle: 'Your character',
    questionSectionStart: 'Start your journey',
    questionPlaceholder: 'Press "Start" to receive your first decision.',
    resultSectionTitle: 'Result',
    resultPlaceholder: 'Here you will see what happened with your decision.',
    startBtnLabel: 'Start',
    restartBtnLabel: 'Play again',
    achievementsTitle: 'Achievements',
    achievementsPlaceholder: 'No achievements unlocked yet.',
    achievements: {
      degree:          '🎓 Graduated! You chose your university degree.',
      first_paper:     '📄 First paper published!',
      phd:             '🔬 PhD passed! Enough prestige and papers.',
      ten_papers:      '📚 10 papers published! Prolific researcher.',
      discovery:       '💡 First scientific discovery!',
      two_discoveries: '🌌 Two discoveries! On the road to the Nobel.',
      prestige50:      '⭐ Prestige 50! A reference in your field.',
      wellbeing80:     '😊 Wellbeing 80! Great work-life balance.',
    },
    genders: ['woman', 'man', 'non-binary person'],
    genderDescriptors: {
      woman: 'a woman',
      man: 'a man',
      'non-binary person': 'a non-binary person'
    },
    characterIntro: (descriptor, age) =>
      `Your protagonist is ${descriptor}, ${age} years old, starting to decide their scientific path.`,
    dieIntro: 'Each option is resolved with a virtual die (1-6).',
    dieText: (roll) => {
      if (roll <= 2) return `🎲 You rolled a ${roll}: there were unexpected obstacles.`;
      if (roll <= 4) return `🎲 You rolled a ${roll}: a reasonable outcome.`;
      return `🎲 You rolled a ${roll}: it went better than expected!`;
    },
    decisionText: (label) => `You chose: "${label}"`,
    impactText: (before, after) => {
      const deltas = buildImpactText(
        [['Prestige', 'prestige'], ['Wellbeing', 'wellbeing'], ['Savings', 'savings'], ['Papers', 'papers'], ['Discoveries', 'discoveries']],
        before, after
      );
      return deltas.length ? `📊 Changes: ${deltas.join(' · ')}` : '📊 No stat changes.';
    },
    statsText: (s) =>
      `Age: ${s.age} · Prestige: ${s.prestige} · Wellbeing: ${s.wellbeing} · Savings: ${s.savings} · Papers: ${s.papers} · Discoveries: ${s.discoveries}`,
    gameEndTitle: 'Game over',
    nobelWin: 'You won the Nobel! You went far combining rigour, difficult decisions, and a bit of luck.',
    nobelLose: "The Nobel didn't come this time, but you built a real career: with learning, setbacks, and achievements.",
    gameEndResult: (s) =>
      `Closing: you finished with ${s.papers} papers and ${s.discoveries} discoveries. Science is a marathon, not a sprint.`,
    leftAcademiaTitle: 'A new chapter outside academia',
    leftAcademiaMsg: "You chose to leave academia. Not every scientific career ends in a lab: many former researchers transform the world through industry, policy, or education. It was a brave and completely legitimate decision.",
    leftAcademiaResult: (s) =>
      `You left in round ${s.rounds}. You accumulated ${s.papers} papers and ${s.discoveries} discoveries. The knowledge you gained will always stay with you.`,
    burnoutTitle: 'Burnout: the limit of body and mind',
    burnoutMsg: 'The accumulated pressure took its toll. Scientific burnout affects almost half of all researchers. Knowing when to stop is also wisdom: your wellbeing matters more than any paper.',
    burnoutResult: (s) =>
      `Your wellbeing reached its limit in round ${s.rounds}. With ${s.papers} papers and ${s.discoveries} discoveries, you left your mark even though the journey was cut short.`,
    endingCharacterLabel: 'Your scientific counterpart',
    questions: [
      {
        order: 1,
        title: 'First big decision',
        text: 'You are 18 years old. Exams are behind you and it is time to choose your degree. Which scientific path do you take?',
        options: [
          { label: 'Biology: you are fascinated by the origin of life and the cell.', impact: { prestige: 6, wellbeing: 2, papers: 1 } },
          { label: 'Physics: you want to decode the laws of the universe.', impact: { prestige: 7, papers: 1 } },
          { label: 'Biomedical Engineering: science with immediate real impact.', impact: { prestige: 5, savings: 2 } }
        ]
      },
      {
        order: 2,
        title: 'Final year project',
        text: 'In your final year, a professor invites you to their lab for your thesis project. It is your first real spark of research. What do you do?',
        options: [
          { label: 'I go all in: I want to publish something even if it costs me nights.', impact: { prestige: 5, wellbeing: -1, papers: 1 } },
          { label: 'I do it well but without obsessing; I balance life and science.', impact: { prestige: 3, wellbeing: 3 } },
          { label: 'I realise research is not for me and look for a job outside.', impact: { wellbeing: 3, savings: 3 }, exitAcademia: true }
        ]
      },
      {
        order: 3,
        title: 'PhD or job market?',
        text: 'Your thesis supervisor is impressed and offers you a PhD scholarship. Four years, low pay, lots of uncertainty. Do you accept?',
        options: [
          { label: 'I accept. I want to go far in science.', impact: { prestige: 8, savings: -3, papers: 1 } },
          { label: 'I think it over and look for hybrid options between academia and industry.', impact: { prestige: 4, savings: 1 } },
          { label: 'I decline. I prefer stability and a good salary now.', impact: { savings: 5, wellbeing: 4 }, exitAcademia: true }
        ]
      },
      {
        order: 4,
        title: 'First experiments',
        text: 'You have been doing your PhD for a year and the experiments keep failing week after week. How do you handle the frustration?',
        options: [
          { label: 'I seek help and calmly reformulate the hypothesis with method.', impact: { prestige: 6, wellbeing: 2, papers: 1 } },
          { label: 'I lock myself away and work twice as hard to compensate.', impact: { prestige: 5, wellbeing: -7, papers: 1 } },
          { label: 'I talk to fellow PhD students: I discover I am not alone.', impact: { prestige: 3, wellbeing: 4 } }
        ]
      },
      {
        order: 5,
        title: 'Supervisor crisis',
        text: 'Your supervisor has been ignoring your work for months, dismissing your ideas. You are at your limit. A colleague says: "Report them. What they are doing is not okay."',
        options: [
          { label: 'I formally request a change of supervisor.', impact: { prestige: 4, wellbeing: 3, savings: -1 } },
          { label: 'I endure in silence. It will get better...', impact: { prestige: 1, wellbeing: -10 } },
          { label: "I can't take it anymore. I quit the PhD.", impact: { wellbeing: 6, savings: 2 }, exitAcademia: true }
        ]
      },
      {
        order: 6,
        title: 'The thesis defence',
        text: 'The big day has arrived. Four years compressed into 200 pages and 45 minutes before the committee. It is time to defend who you are as a researcher.',
        options: [
          { label: 'I prepare thoroughly and defend with confidence and passion.', impact: { prestige: 10, wellbeing: 3, papers: 1, discoveries: 1 } },
          { label: 'Nerves get the better of me and I answer with hesitation.', impact: { prestige: 4, wellbeing: -2 } },
          { label: 'I present the data honestly, without embellishment, with rigour.', impact: { prestige: 7, wellbeing: 2, papers: 1 } }
        ]
      },
      {
        order: 7,
        title: 'First postdoc',
        text: 'With your PhD in hand, you receive a postdoc offer abroad. More resources, but far from everything familiar. What do you do?',
        options: [
          { label: 'I move: international mobility opens key doors.', impact: { prestige: 9, wellbeing: -2, savings: -2, papers: 1 } },
          { label: 'I prefer a local postdoc, close to my support network.', impact: { prestige: 5, wellbeing: 3 } },
          { label: 'I take an industry job. Academia can wait.', impact: { savings: 6, wellbeing: 5 }, exitAcademia: true }
        ]
      },
      {
        order: 8,
        title: 'The funding battle',
        text: 'Your postdoc contract ends in two months. There is no new project. The lab is running out of money. How do you survive?',
        options: [
          { label: 'I write a competitive research grant proposal.', impact: { prestige: 7, wellbeing: -5, papers: 1 } },
          { label: 'I seek collaboration with a well-funded research group.', impact: { prestige: 5, savings: 2, wellbeing: 1 } },
          { label: 'With no funds and no prospects, I leave academia.', impact: { wellbeing: 3, savings: 4 }, exitAcademia: true }
        ]
      },
      {
        order: 9,
        title: 'The unexpected finding',
        text: 'During a routine experiment, an anomalous signal appears that does not fit anything known. It could be noise... or the discovery of your life.',
        options: [
          { label: 'I investigate it rigorously: I replicate, validate and document everything.', impact: { prestige: 12, wellbeing: 2, discoveries: 1 } },
          { label: 'I announce the discovery before validating it to get ahead.', impact: { prestige: 3, wellbeing: -3, papers: 1 } },
          { label: 'I request an external review before publishing anything.', impact: { prestige: 9, wellbeing: 1, discoveries: 1, papers: 1 } }
        ]
      },
      {
        order: 10,
        title: 'The road to the Nobel',
        text: 'The Nobel Committee is starting to cite your work. You are in the circle of the greats. This is the moment to leave your definitive mark on science.',
        options: [
          { label: 'I publish the paper that changes everything and give global talks.', impact: { prestige: 15, papers: 2, discoveries: 1 } },
          { label: 'I focus on mentoring the next generation of scientists.', impact: { wellbeing: 10, prestige: 8 } },
          { label: 'I merge my research with life-saving applications.', impact: { prestige: 12, discoveries: 1, wellbeing: 5, papers: 1 } }
        ]
      }
    ]
  }
};

// ---------------------------------------------------------------------------
// Endings
// Each entry: id, gender ('male'|'female'|'nonbinary'|'any'), tier
// ('high'|'medium-high'|'medium-low'|'low'), optional threshold fields
// (minPrestige, maxPrestige, minPapers, minDiscoveries, minWellbeing,
// minSavings), photo path (null until images are provided), and locale text.
//
// Within each tier entries are ordered hardest → easiest so that getEnding()
// returns the most impressive match first.
//
// Photo filenames (place files in images/endings/ in the repo root):
//   ramon-y-cajal.jpg · severo-ochoa.jpg · margarita-salas.jpg
//   juan-ignacio-cirac.jpg · maria-blasco.jpg · pedro-duque.jpg
//   angela-nieto.jpg · luisma-escudero.jpg · carme-torras.jpg
//   juan-luis-arsuaga.jpg · gabriella-morreale.jpg · jose-elguero.jpg
//   mateo-valero.jpg
// ---------------------------------------------------------------------------
export const ENDINGS = [
  // ── HIGH TIER ─────────────────────────────────────────────────────────────
  {
    id: 'ramon-y-cajal',
    gender: 'male',
    tier: 'high',
    minPrestige: 105, minPapers: 7, minDiscoveries: 3, minWellbeing: 30,
    photo: 'images/endings/ramon-y-cajal.jpg',
    es: {
      name: 'Santiago Ramón y Cajal',
      description: 'Tu carrera llegó tan alto como pocos en la historia de la ciencia. Tus investigaciones sobre el sistema nervioso revolucionaron la neurología. En 1906 recibiste el Premio Nobel, convirtiéndote en el científico más universal de España.'
    },
    en: {
      name: 'Santiago Ramón y Cajal',
      description: 'Your career reached heights few in the history of science have achieved. Your research on the nervous system revolutionised neurology. In 1906 you received the Nobel Prize, becoming Spain\'s most universal scientist.'
    }
  },
  {
    id: 'severo-ochoa',
    gender: 'male',
    tier: 'high',
    minPrestige: 95, minPapers: 7, minDiscoveries: 3, minWellbeing: 25,
    photo: 'images/endings/severo-ochoa.jpg',
    es: {
      name: 'Severo Ochoa',
      description: 'Tu dedicación a la bioquímica cambió el mundo. Tus descubrimientos sobre la síntesis del ARN sentaron las bases de la biología molecular. En 1959 el Premio Nobel reconoció lo que todos sabían: eras de los mejores.'
    },
    en: {
      name: 'Severo Ochoa',
      description: 'Your dedication to biochemistry changed the world. Your discoveries on RNA synthesis laid the foundations of molecular biology. In 1959 the Nobel Prize confirmed what everyone knew: you were among the best.'
    }
  },
  {
    id: 'margarita-salas',
    gender: 'female',
    tier: 'high',
    minPrestige: 90, minPapers: 7, minDiscoveries: 2, minWellbeing: 25,
    photo: 'images/endings/margarita-salas.jpg',
    es: {
      name: 'Margarita Salas',
      description: 'Pionera incansable de la biología molecular en España. Tu descubrimiento de la ADN polimerasa phi29 es hoy esencial en biotecnología. Una carrera brillante que abrió puertas para toda una generación de científicas.'
    },
    en: {
      name: 'Margarita Salas',
      description: 'A tireless pioneer of molecular biology in Spain. Your discovery of phi29 DNA polymerase is now essential in biotechnology. A brilliant career that opened doors for an entire generation of women in science.'
    }
  },
  {
    id: 'juan-ignacio-cirac',
    gender: 'male',
    tier: 'high',
    minPrestige: 82, minPapers: 6, minDiscoveries: 2, minWellbeing: 20,
    photo: 'images/endings/juan-ignacio-cirac.jpg',
    es: {
      name: 'Juan Ignacio Cirac',
      description: 'Tu trabajo teórico en física cuántica te situó como referencia mundial en computación cuántica. Tus modelos pioneros sentaron las bases de una nueva era tecnológica.'
    },
    en: {
      name: 'Juan Ignacio Cirac',
      description: 'Your theoretical work in quantum physics placed you as a world reference in quantum computing. Your pioneering models laid the foundations for a new technological era.'
    }
  },
  {
    id: 'maria-blasco',
    gender: 'female',
    tier: 'high',
    minPrestige: 70, minPapers: 6, minDiscoveries: 2, minWellbeing: 20,
    photo: 'images/endings/maria-blasco.jpg',
    es: {
      name: 'María Blasco',
      description: 'Bióloga molecular y directora del CNIO. Tu trabajo sobre los telómeros ha revolucionado el conocimiento sobre el envejecimiento y el cáncer. Una carrera que combina rigor científico y liderazgo institucional.'
    },
    en: {
      name: 'María Blasco',
      description: 'Molecular biologist and director of the CNIO. Your work on telomeres has revolutionised the understanding of ageing and cancer. A career that combines scientific rigour and institutional leadership.'
    }
  },
  {
    id: 'pedro-duque',
    gender: 'male',
    tier: 'high',
    minPrestige: 70, minPapers: 6, minDiscoveries: 2, minWellbeing: 20,
    photo: 'images/endings/pedro-duque.jpg',
    es: {
      name: 'Pedro Duque',
      description: 'Ingeniero aeroespacial y primer astronauta español. Completaste dos misiones espaciales y después serviste como Ministro de Ciencia. Una carrera que inspiró a millones de jóvenes a mirar hacia las estrellas.'
    },
    en: {
      name: 'Pedro Duque',
      description: 'Aerospace engineer and first Spanish astronaut. You completed two space missions and later served as Minister of Science. A career that inspired millions of young people to look toward the stars.'
    }
  },
  // ── MEDIUM-HIGH TIER ──────────────────────────────────────────────────────
  {
    id: 'angela-nieto',
    gender: 'female',
    tier: 'medium-high',
    minPrestige: 48, minPapers: 4, minDiscoveries: 1, minWellbeing: 15,
    photo: 'images/endings/angela-nieto.jpg',
    es: {
      name: 'Ángela Nieto',
      description: 'Investigadora del CSIC en biología del desarrollo. Tu trabajo sobre los procesos embrionarios te valió el premio "Para las Mujeres en la Ciencia" de la UNESCO. Una carrera marcada por el rigor y el compromiso.'
    },
    en: {
      name: 'Ángela Nieto',
      description: 'CSIC researcher in developmental biology. Your work on embryonic processes earned you UNESCO\'s "For Women in Science" award. A career marked by rigour and commitment.'
    }
  },
  {
    id: 'luisma-escudero',
    gender: 'male',
    tier: 'medium-high',
    minPrestige: 48, minPapers: 4, minDiscoveries: 1, minWellbeing: 15,
    photo: 'images/endings/luisma-escudero.jpg',
    es: {
      name: 'Luisma Escudero',
      description: 'Biólogo del desarrollo que descubrió el escutoide, una forma geométrica presente en las células del cuerpo. Un hallazgo inesperado que demostró que la naturaleza aún tiene secretos por revelar.'
    },
    en: {
      name: 'Luisma Escudero',
      description: 'Developmental biologist who discovered the scutoid, a geometric shape present in body cells. An unexpected finding that proved nature still has secrets to reveal.'
    }
  },
  {
    id: 'carme-torras',
    gender: 'female',
    tier: 'medium-high',
    minPrestige: 40, minPapers: 3, minWellbeing: 10,
    photo: 'images/endings/carme-torras.jpg',
    es: {
      name: 'Carme Torras',
      description: 'Investigadora de referencia en robótica inteligente y social en España. Premio Nacional de Investigación. Tu trabajo acerca la robótica a las personas y abre nuevas posibilidades para la tecnología del futuro.'
    },
    en: {
      name: 'Carme Torras',
      description: 'A leading researcher in intelligent and social robotics in Spain. National Research Award winner. Your work brings robotics closer to people and opens new possibilities for the technology of the future.'
    }
  },
  {
    id: 'juan-luis-arsuaga',
    gender: 'male',
    tier: 'medium-high',
    minPrestige: 40, minPapers: 3, minWellbeing: 10,
    photo: 'images/endings/juan-luis-arsuaga.jpg',
    es: {
      name: 'Juan Luis Arsuaga',
      description: 'Paleontólogo y divulgador científico. Codirector de las excavaciones de Atapuerca, un yacimiento clave para entender la evolución humana. Una carrera dedicada a descubrir de dónde venimos.'
    },
    en: {
      name: 'Juan Luis Arsuaga',
      description: 'Palaeontologist and science communicator. Co-director of the Atapuerca excavations, a key site for understanding human evolution. A career dedicated to discovering where we come from.'
    }
  },
  // ── MEDIUM-LOW TIER ───────────────────────────────────────────────────────
  {
    id: 'gabriella-morreale',
    gender: 'female',
    tier: 'medium-low',
    minPrestige: 22, minPapers: 2,
    photo: 'images/endings/gabriella-morreale.jpg',
    es: {
      name: 'Gabriella Morreale',
      description: 'Científica ítalo-española, referencia en endocrinología. Tu trabajo fue fundamental para prevenir el cretinismo a través de la detección temprana del hipotiroidismo. Una contribución que salvó vidas.'
    },
    en: {
      name: 'Gabriella Morreale',
      description: 'Italian-Spanish scientist, a reference in endocrinology. Your work was fundamental in preventing cretinism through early hypothyroidism detection. A contribution that saved lives.'
    }
  },
  {
    id: 'jose-elguero',
    gender: 'male',
    tier: 'medium-low',
    minPrestige: 22, minPapers: 2,
    photo: 'images/endings/jose-elguero.jpg',
    es: {
      name: 'José Elguero Bertolini',
      description: 'Químico orgánico y medicinal de referencia. Expresidente del CSIC y galardonado con la Medalla de Oro de la Real Sociedad Española de Química. Una carrera sólida al servicio de la ciencia española.'
    },
    en: {
      name: 'José Elguero Bertolini',
      description: 'A reference in organic and medicinal chemistry. Former CSIC president, awarded the Gold Medal of the Royal Spanish Chemical Society. A solid career in the service of Spanish science.'
    }
  },
  {
    id: 'mateo-valero',
    gender: 'male',
    tier: 'medium-low',
    minPrestige: 16, minPapers: 1,
    photo: 'images/endings/mateo-valero.jpg',
    es: {
      name: 'Mateo Valero',
      description: 'Experto en ingeniería computacional. Tu trabajo en redes de interconexión y procesadores es muy reconocido en el campo de la supercomputación. Una carrera técnica de alto impacto.'
    },
    en: {
      name: 'Mateo Valero',
      description: 'Expert in computational engineering. Your work on interconnection networks and processors is highly recognised in the field of supercomputing. A high-impact technical career.'
    }
  },
  // ── LOW TIER ──────────────────────────────────────────────────────────────
  // Scandal endings (negative prestige, ordered gender-specific → any)
  {
    id: 'dra-moreno',
    gender: 'female',
    tier: 'low',
    maxPrestige: -1, minPapers: 1,
    photo: null,
    es: {
      name: 'Dra. Moreno',
      description: 'Falseaste tus datos para conseguir una publicación. Te pillaron, y te convertiste en un ejemplo de qué no hay que hacer para jóvenes científicos. Tu nombre vive, aunque no como querías.'
    },
    en: {
      name: 'Dr. Moreno',
      description: 'You faked your data to get a publication. You were caught, and became a cautionary tale for young scientists about what not to do. Your name lives on, though not as you wanted.'
    }
  },
  {
    id: 'dr-alvarez',
    gender: 'male',
    tier: 'low',
    maxPrestige: -1, minPapers: 1,
    photo: null,
    es: {
      name: 'Dr. Álvarez',
      description: 'Te apropiaste del trabajo de tus estudiantes. La voz corrió. Ahora nadie quiere trabajar contigo y tu laboratorio está vacío. Las ideas de otros no duran cuando las llevas tú.'
    },
    en: {
      name: 'Dr. Álvarez',
      description: 'You took credit for your students\' work. Word spread. Now no one wants to work with you and your lab is empty. Other people\'s ideas do not last when you carry them.'
    }
  },
  {
    id: 'dra-castillo',
    gender: 'nonbinary',
    tier: 'low',
    maxPrestige: -1, minPapers: 1,
    photo: null,
    es: {
      name: 'Dra. Castillo',
      description: 'Plagiaste un artículo de una investigadora junior. El escándalo acabó con tu carrera antes de que empezara de verdad. Una decisión que destruyó años de esfuerzo en un instante.'
    },
    en: {
      name: 'Dr. Castillo',
      description: 'You plagiarised a paper from a junior researcher. The scandal ended your career before it truly began. One decision that destroyed years of effort in an instant.'
    }
  },
  {
    id: 'the-fraudster',
    gender: 'any',
    tier: 'low',
    maxPrestige: -1,
    photo: null,
    es: {
      name: 'El Impostor',
      description: 'Tomaste atajos, fabricaste datos o robaste el trabajo de otras personas. Te descubrieron. Tu reputación quedó destruida, y tu nombre se asocia para siempre con el fraude científico.'
    },
    en: {
      name: 'The Fraudster',
      description: 'You took shortcuts, fabricated data, or stole others\' work. You were found out. Your reputation was destroyed, and your name is forever associated with scientific fraud.'
    }
  },
  // Sellout endings (high savings, low prestige)
  {
    id: 'dr-ramirez',
    gender: 'male',
    tier: 'low',
    minSavings: 4, maxPrestige: 4,
    photo: null,
    es: {
      name: 'Dr. Ramírez',
      description: 'Vendiste tu experiencia a una empresa petrolera para desmentir el cambio climático. Ganaste dinero, pero perdiste tu integridad. La ciencia te recuerda como un caso de estudio en ética de la investigación.'
    },
    en: {
      name: 'Dr. Ramírez',
      description: 'You sold your expertise to an oil company to disprove climate change. You won money, but lost your integrity. Science remembers you as a case study in research ethics.'
    }
  },
  {
    id: 'happy-in-industry',
    gender: 'any',
    tier: 'low',
    minSavings: 6,
    photo: null,
    es: {
      name: 'Feliz en la Industria',
      description: 'La academia no era para ti, y lo reconociste a tiempo. Te fuiste a la industria, tienes un buen sueldo y duermes bien por las noches. No hay Nobel, pero tampoco tienes que justificar tu financiación cada dos años.'
    },
    en: {
      name: 'Happy in Industry',
      description: 'Academia was not for you, and you recognised it in time. You went to industry, have a good salary, and sleep well at night. No Nobel, but you also do not have to justify your funding every two years.'
    }
  },
  // Tried but mediocre
  {
    id: 'dra-romero',
    gender: 'female',
    tier: 'low',
    minPapers: 1, minWellbeing: 35,
    photo: null,
    es: {
      name: 'Dra. Romero',
      description: 'Intentaste ser divulgadora científica, pero no era lo tuyo. Tu canal de YouTube tiene 12 suscriptores (3 son tu familia). Pero al menos lo intentaste, y eso cuenta.'
    },
    en: {
      name: 'Dr. Romero',
      description: 'You tried to become a science communicator, but it was not your thing. Your YouTube channel has 12 subscribers (3 are your family). But at least you tried, and that counts.'
    }
  },
  {
    id: 'bureaucratic-scientist',
    gender: 'any',
    tier: 'low',
    minPapers: 1,
    photo: null,
    es: {
      name: 'El Científico Burocrático',
      description: 'Empezaste con entusiasmo, pero te perdiste en la gestión, las reuniones y la política académica. Publicaste, pero nada relevante. Un final gris para un comienzo prometedor.'
    },
    en: {
      name: 'The Bureaucratic Scientist',
      description: 'You started with enthusiasm, but got lost in management, meetings, and academic politics. You published, but nothing relevant. A grey ending for a promising start.'
    }
  },
  {
    id: 'dr-torres',
    gender: 'male',
    tier: 'low',
    minDiscoveries: 1,
    photo: null,
    es: {
      name: 'Dr. Torres',
      description: 'Pasaste tu vida intentando inventar el movimiento perpetuo. Fallaste. Todos te dijeron que era imposible. No escuchaste. Al menos eras persistente.'
    },
    en: {
      name: 'Dr. Torres',
      description: 'You spent your life trying to invent perpetual motion. You failed. Everyone told you it was impossible. You did not listen. At least you were persistent.'
    }
  },
  // Generic poor endings (no extra threshold)
  {
    id: 'dra-suarez',
    gender: 'female',
    tier: 'low',
    photo: null,
    es: {
      name: 'Dra. Suárez',
      description: 'Te convertiste en conspiracionista. Ahora escribes blogs sobre extraterrestres y el 5G en lugar de hacer ciencia real. Perdiste tus credenciales, pero ganaste muchos seguidores en redes sociales.'
    },
    en: {
      name: 'Dr. Suárez',
      description: 'You became a conspiracy theorist. Now you write blogs about aliens and 5G instead of real science. You lost your credentials but gained many followers on social media.'
    }
  },
  {
    id: 'dr-ortega',
    gender: 'nonbinary',
    tier: 'low',
    photo: null,
    es: {
      name: 'Dr. Ortega',
      description: 'Tu investigación era tan irrelevante que tu única cita es de una página de Wikipedia sobre "contribuciones científicas triviales". Al menos apareces en algún lado.'
    },
    en: {
      name: 'Dr. Ortega',
      description: 'Your research was so irrelevant that your only citation is from a Wikipedia page about "trivial scientific contributions". At least you appear somewhere.'
    }
  },
  // Catch-all
  {
    id: 'the-forgotten',
    gender: 'any',
    tier: 'low',
    photo: null,
    es: {
      name: 'El Olvidado',
      description: 'Hiciste un trabajo mediocre en un campo oscuro. Tu único legado es una tesis polvorienta en un rincón olvidado de una biblioteca. Nadie te recuerda, pero tampoco te odian.'
    },
    en: {
      name: 'The Forgotten',
      description: 'You did mediocre work in an obscure field. Your only legacy is a dusty thesis in a forgotten library corner. No one remembers you, but no one hates you either.'
    }
  }
];

function normalizePlayerGender(gender) {
  if (gender === 'mujer' || gender === 'woman') return 'female';
  if (gender === 'hombre' || gender === 'man') return 'male';
  if (gender === 'persona no binaria' || gender === 'non-binary person') return 'nonbinary';
  // Empty or unrecognised value: use a sentinel that matches no gender-specific
  // ending so getEnding falls through to 'any'-gender or the best eligible entry.
  return 'unknown';
}

function meetsEndingThreshold(state, ending) {
  return (
    (ending.minPrestige == null || state.prestige >= ending.minPrestige) &&
    (ending.maxPrestige == null || state.prestige <= ending.maxPrestige) &&
    (ending.minPapers == null || state.papers >= ending.minPapers) &&
    (ending.minDiscoveries == null || state.discoveries >= ending.minDiscoveries) &&
    (ending.minWellbeing == null || state.wellbeing >= ending.minWellbeing) &&
    (ending.minSavings == null || state.savings >= ending.minSavings)
  );
}

function getEndingTier(state) {
  if (hasMetNobelRequirements(state)) return 'high';
  if (state.prestige >= 40 && state.papers >= 3) return 'medium-high';
  if (state.prestige >= 16 && state.papers >= 1) return 'medium-low';
  return 'low';
}

export function getEnding(state) {
  const playerGender = normalizePlayerGender(state.gender);
  const tier = getEndingTier(state);
  const candidates = ENDINGS.filter((e) => e.tier === tier);

  // Pass 1: gender-specific match or 'any', in array order (hardest first)
  for (const ending of candidates) {
    if (
      meetsEndingThreshold(state, ending) &&
      (ending.gender === playerGender || ending.gender === 'any')
    ) {
      return ending;
    }
  }

  // Pass 2: any eligible ending in this tier (fallback for unmatched genders)
  for (const ending of candidates) {
    if (meetsEndingThreshold(state, ending)) {
      return ending;
    }
  }

  // Ultimate fallback
  return ENDINGS[ENDINGS.length - 1];
}

export function randomInt(maxExclusive) {
  if (!globalThis.crypto || typeof globalThis.crypto.getRandomValues !== 'function') {
    throw new Error('This game requires a browser with crypto.getRandomValues support.');
  }
  const values = new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);
  return values[0] % maxExclusive;
}

export function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function rollDie() {
  return randomInt(6) + 1;
}

export function dieFactor(roll) {
  return DIE_FACTOR_BY_ROLL[roll];
}

export function applyImpact(state, baseImpact, roll) {
  const factor = dieFactor(roll);
  const keys = ['prestige', 'wellbeing', 'savings', 'papers', 'discoveries'];

  keys.forEach((key) => {
    const raw = baseImpact[key] || 0;
    state[key] += Math.round(raw * factor);
  });

  state.wellbeing = Math.max(0, Math.min(100, state.wellbeing));
  state.savings = Math.max(MIN_SAVINGS, state.savings);
  state.age += 1;
  state.rounds += 1;
}

export function hasMetNobelRequirements(state) {
  return (
    state.prestige >= NOBEL_REQUIREMENTS.prestige &&
    state.papers >= NOBEL_REQUIREMENTS.papers &&
    state.discoveries >= NOBEL_REQUIREMENTS.discoveries &&
    state.wellbeing >= NOBEL_REQUIREMENTS.wellbeing
  );
}

export function createInitialState() {
  return {
    age: 18,
    gender: '',
    prestige: 0,
    wellbeing: 50,
    savings: 10,
    papers: 0,
    discoveries: 0,
    rounds: 0,
    maxRounds: Math.min(MAX_GAME_ROUNDS, LANG.es.questions.length),
    queue: [],
    achievements: []
  };
}

export function buildQueue(questions, maxRounds) {
  // Sort by the numeric `order` property so the narrative arc is always preserved.
  const sorted = [...questions].sort((a, b) => a.order - b.order);
  const selected = sorted.slice(0, maxRounds);
  // Queue is consumed via .pop(), so items at the END are shown FIRST.
  // Reversing puts order-1 at the end so it is shown first in the game.
  return [...selected].reverse();
}

export function checkAchievements(state) {
  return ACHIEVEMENTS
    .filter((a) => !state.achievements.includes(a.id) && a.condition(state))
    .map((a) => a.id);
}

export function snapshotStats(state) {
  return {
    prestige: state.prestige,
    wellbeing: state.wellbeing,
    savings: state.savings,
    papers: state.papers,
    discoveries: state.discoveries
  };
}

/**
 * Checks whether the game should end early after applying an impact.
 * Burnout (wellbeing at or below BURNOUT_THRESHOLD) is checked first so that
 * a harsh die roll can force an exit even on an option that doesn't voluntarily
 * leave academia.
 * @param {Object} state - Current player state (after impact was applied).
 * @param {boolean} [optionExitsAcademia=false] - True when the chosen option
 *   explicitly leaves academia (option.exitAcademia === true).
 * @returns {'burnout'|'leftAcademia'|null}
 */
export function checkEarlyEnd(state, optionExitsAcademia = false) {
  if (state.wellbeing <= BURNOUT_THRESHOLD) return 'burnout';
  if (optionExitsAcademia) return 'leftAcademia';
  return null;
}
