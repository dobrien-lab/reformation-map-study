const regions = [
  { id: 'portugal', name: 'Portugal', tradition: 'catholic', label: 'Roman Catholic', x: 6.5, y: 68, note: 'Portugal remained firmly Roman Catholic and supported overseas Catholic missions.' },
  { id: 'spain', name: 'Spain', tradition: 'catholic', label: 'Roman Catholic', x: 17, y: 67, note: 'Spain was a major Catholic power and strongly supported Catholic reform.' },
  { id: 'ireland', name: 'Ireland', tradition: 'catholic', label: 'Roman Catholic', x: 20.5, y: 29, note: 'Ireland remained largely Catholic despite English attempts to extend Protestant rule.' },
  { id: 'england', name: 'England', tradition: 'anglican', label: 'Anglican', x: 27.5, y: 31, note: 'The Church of England separated from Rome under Henry VIII and became more distinctly Protestant under later rulers.' },
  { id: 'scotland', name: 'Scotland', tradition: 'reformed', label: 'Calvinist / Reformed', x: 24, y: 16, note: 'John Knox helped shape a Scottish Reformation with a Presbyterian form of Reformed Christianity.' },
  { id: 'france', name: 'France', tradition: 'catholic', label: 'Catholic with Huguenot minorities', x: 30, y: 49, note: 'France remained officially Catholic, but Huguenot communities made it an important mixed-confession conflict zone.' },
  { id: 'netherlands', name: 'The Netherlands', tradition: 'reformed', label: 'Calvinist / Reformed and contested', x: 33.5, y: 34, note: 'The Netherlands became a center of Calvinist resistance to Catholic Habsburg rule.' },
  { id: 'swiss', name: 'Swiss Confederation', tradition: 'mixed', label: 'Catholic and Reformed patchwork', x: 39.5, y: 52, note: 'Swiss cantons split between Catholic areas and Reformed centers such as Geneva and Zürich.' },
  { id: 'italy', name: 'Italian states', tradition: 'catholic', label: 'Roman Catholic', x: 49, y: 62, note: 'The Italian states remained Catholic, and Rome became the center of the Catholic response to Protestantism.' },
  { id: 'scandinavia', name: 'Scandinavia', tradition: 'lutheran', label: 'Lutheran', x: 48.5, y: 16, note: 'Denmark–Norway and Sweden–Finland adopted Lutheranism through royal reforms.' },
  { id: 'german-states', name: 'German states', tradition: 'mixed', label: 'Catholic, Lutheran, and Reformed patchwork', x: 44, y: 40, note: 'The Holy Roman Empire was not one religious block. Northern and eastern states were often Lutheran; many southern states remained Catholic; some adopted Reformed Christianity.' },
  { id: 'austria', name: 'Austria and Habsburg lands', tradition: 'catholic', label: 'Roman Catholic', x: 54.5, y: 49.5, note: 'The Austrian Habsburg lands became a base for Catholic renewal, even though Protestant communities were present.' },
  { id: 'poland-lithuania', name: 'Poland–Lithuania', tradition: 'catholic', label: 'Mostly Catholic and religiously diverse', x: 68, y: 35, note: 'The commonwealth was officially Catholic but unusually diverse, with Protestant, Orthodox, and Jewish communities.' },
  { id: 'orthodox', name: 'Eastern Orthodox lands', tradition: 'orthodox', label: 'Eastern Orthodox', x: 84, y: 37, note: 'Eastern Christian lands lay beyond the main Catholic–Protestant division and followed Orthodox traditions.' },
  { id: 'ottoman', name: 'Ottoman southeastern Europe', tradition: 'islam', label: 'Islam under Ottoman rule', x: 70, y: 64, note: 'The Ottoman Empire ruled much of southeastern Europe; Muslim rulers governed religiously diverse populations.' }
];

const mapQuestions = [
  { id: 'england', prompt: 'Find England, the center of Anglican Christianity.' },
  { id: 'scotland', prompt: 'Find the Reformed kingdom shaped by John Knox.' },
  { id: 'france', prompt: 'Find the officially Catholic kingdom with a large Huguenot minority.' },
  { id: 'netherlands', prompt: 'Find the Calvinist center that resisted Catholic Habsburg rule.' },
  { id: 'swiss', prompt: 'Find the confederation divided among Catholic and Reformed cantons.' },
  { id: 'scandinavia', prompt: 'Find the region where Lutheran royal reforms became strong.' },
  { id: 'german-states', prompt: 'Find the central European patchwork of Catholic, Lutheran, and Reformed states.' },
  { id: 'italy', prompt: 'Find the Catholic states surrounding Rome.' },
  { id: 'poland-lithuania', prompt: 'Find the large eastern commonwealth that was Catholic and religiously diverse.' },
  { id: 'ottoman', prompt: 'Find Ottoman-controlled southeastern Europe.' }
];

const counterQuestions = [
  { q: 'Which meeting clarified Catholic beliefs and reformed Church discipline?', options: ['Council of Trent', 'Peace of Augsburg', 'Diet of Worms', 'English Parliament'], answer: 0, why: 'The Council of Trent (1545–1563) clarified Catholic teaching and addressed abuses.' },
  { q: 'Which new Catholic order became famous for education and missionary work?', options: ['Jesuits', 'Huguenots', 'Anabaptists', 'Puritans'], answer: 0, why: 'The Society of Jesus, or Jesuits, founded schools and sent missionaries across the world.' },
  { q: 'Ignatius of Loyola is most closely connected to which group?', options: ['Jesuits', 'Lutherans', 'Anglicans', 'Calvinists'], answer: 0, why: 'Ignatius of Loyola founded the Society of Jesus.' },
  { q: 'Why were schools important to the Counter-Reformation?', options: ['They trained clergy and taught Catholic belief', 'They ended every religious disagreement', 'They replaced churches', 'They created national borders'], answer: 0, why: 'Catholic schools improved clergy education and strengthened religious teaching.' },
  { q: 'Which statement best describes the Counter-Reformation?', options: ['Catholic reform and response to Protestantism', 'A single military battle', 'The end of Christianity in Europe', 'A Protestant movement in Scandinavia'], answer: 0, why: 'It combined internal Catholic reform with efforts to respond to Protestant expansion.' }
];

const atlasViewport = document.querySelector('#atlas-viewport');
const atlasCanvas = document.querySelector('#atlas-canvas');
const overlay = document.querySelector('#religion-overlay');
const markerLayer = document.querySelector('#map-markers');
const regionIndex = document.querySelector('#region-index');
const regionDetail = document.querySelector('#region-detail');
const zoomStatus = document.querySelector('#zoom-status');
const overlayButton = document.querySelector('#toggle-overlay');
const modeButtons = [...document.querySelectorAll('.mode-button')];
const legendButtons = [...document.querySelectorAll('.legend button')];
const studyPanel = document.querySelector('#study-panel');
const practicePanel = document.querySelector('#practice-panel');
const practicePrompt = document.querySelector('#practice-prompt');
const practiceFeedback = document.querySelector('#practice-feedback');
const questionCount = document.querySelector('#question-count');
const mapScore = document.querySelector('#map-score');
const showAnswerButton = document.querySelector('#show-answer');
const nextQuestionButton = document.querySelector('#next-question');

let zoom = window.innerWidth < 760 ? 125 : 100;
let overlayVisible = true;
let mode = 'study';
let selectedRegionId = null;
let activeFilter = null;
let questionIndex = 0;
let practiceCorrect = 0;
let practiceAttempts = 0;
let questionAnswered = false;

regions.forEach((region, index) => {
  const number = index + 1;
  const marker = document.createElement('button');
  marker.type = 'button';
  marker.className = `map-marker ${region.tradition}`;
  marker.dataset.regionId = region.id;
  marker.style.left = `${region.x}%`;
  marker.style.top = `${region.y}%`;
  marker.textContent = String(number);
  marker.setAttribute('aria-label', `${number}. ${region.name}`);
  marker.addEventListener('click', () => handleRegionChoice(region.id, false));
  markerLayer.append(marker);

  const indexButton = document.createElement('button');
  indexButton.type = 'button';
  indexButton.dataset.regionId = region.id;
  indexButton.innerHTML = `<span class="region-number">${number}</span><span>${region.name}</span>`;
  indexButton.addEventListener('click', () => handleRegionChoice(region.id, true));
  regionIndex.append(indexButton);
});

function getRegion(id) {
  return regions.find((region) => region.id === id);
}

function getMarker(id) {
  return markerLayer.querySelector(`[data-region-id="${id}"]`);
}

function handleRegionChoice(id, centerMap) {
  if (mode === 'practice') {
    answerMapQuestion(id);
    return;
  }
  selectRegion(id, centerMap);
}

function selectRegion(id, centerMap = false) {
  selectedRegionId = id;
  const region = getRegion(id);
  document.querySelectorAll('[data-region-id]').forEach((element) => element.classList.toggle('is-selected', element.dataset.regionId === id));
  regionDetail.innerHTML = `
    <h3>${region.name}</h3>
    <span class="tradition-tag ${region.tradition}">${region.label}</span>
    <p>${region.note}</p>`;
  if (centerMap) {
    if (zoom < 150) setZoom(150);
    requestAnimationFrame(() => centerOnRegion(region));
  }
}

function centerOnRegion(region) {
  const left = (region.x / 100) * atlasCanvas.scrollWidth - atlasViewport.clientWidth / 2;
  const top = (region.y / 100) * atlasCanvas.scrollHeight - atlasViewport.clientHeight / 2;
  atlasViewport.scrollTo({ left: Math.max(0, left), top: Math.max(0, top), behavior: 'smooth' });
}

function setZoom(nextZoom) {
  const oldWidth = atlasCanvas.scrollWidth || atlasViewport.clientWidth;
  const centerX = atlasViewport.scrollLeft + atlasViewport.clientWidth / 2;
  const centerY = atlasViewport.scrollTop + atlasViewport.clientHeight / 2;
  zoom = Math.max(100, Math.min(225, nextZoom));
  atlasCanvas.style.width = `${zoom}%`;
  zoomStatus.textContent = `${zoom}%`;
  requestAnimationFrame(() => {
    const ratio = atlasCanvas.scrollWidth / oldWidth;
    atlasViewport.scrollLeft = centerX * ratio - atlasViewport.clientWidth / 2;
    atlasViewport.scrollTop = centerY * ratio - atlasViewport.clientHeight / 2;
  });
}

document.querySelector('#zoom-in').addEventListener('click', () => setZoom(zoom + 25));
document.querySelector('#zoom-out').addEventListener('click', () => setZoom(zoom - 25));
document.querySelector('#zoom-fit').addEventListener('click', () => {
  setZoom(100);
  atlasViewport.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
});

overlayButton.addEventListener('click', () => {
  overlayVisible = !overlayVisible;
  overlay.classList.toggle('is-hidden', !overlayVisible);
  overlayButton.classList.toggle('is-on', overlayVisible);
  overlayButton.setAttribute('aria-pressed', String(overlayVisible));
  overlayButton.textContent = `Color overlay: ${overlayVisible ? 'on' : 'off'}`;
});

legendButtons.forEach((button) => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  activeFilter = activeFilter === filter ? null : filter;
  legendButtons.forEach((item) => item.classList.toggle('is-active', item.dataset.filter === activeFilter));
  markerLayer.querySelectorAll('.map-marker').forEach((marker) => {
    const region = getRegion(marker.dataset.regionId);
    marker.classList.toggle('is-dimmed', Boolean(activeFilter && region.tradition !== activeFilter));
  });
  overlay.querySelectorAll('.zone').forEach((zone) => {
    zone.style.opacity = activeFilter && !zone.classList.contains(activeFilter) ? '.035' : '';
  });
}));

let dragStart = null;
atlasViewport.addEventListener('pointerdown', (event) => {
  if (event.target.closest('.map-marker')) return;
  dragStart = { x: event.clientX, y: event.clientY, left: atlasViewport.scrollLeft, top: atlasViewport.scrollTop };
  atlasViewport.classList.add('is-dragging');
  atlasViewport.setPointerCapture(event.pointerId);
});
atlasViewport.addEventListener('pointermove', (event) => {
  if (!dragStart) return;
  atlasViewport.scrollLeft = dragStart.left - (event.clientX - dragStart.x);
  atlasViewport.scrollTop = dragStart.top - (event.clientY - dragStart.y);
});
function endDrag(event) {
  if (!dragStart) return;
  dragStart = null;
  atlasViewport.classList.remove('is-dragging');
  if (atlasViewport.hasPointerCapture(event.pointerId)) atlasViewport.releasePointerCapture(event.pointerId);
}
atlasViewport.addEventListener('pointerup', endDrag);
atlasViewport.addEventListener('pointercancel', endDrag);

modeButtons.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));

function setMode(nextMode) {
  mode = nextMode;
  modeButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.mode === mode));
  studyPanel.hidden = mode !== 'study';
  practicePanel.hidden = mode !== 'practice';
  regionIndex.hidden = mode !== 'study';
  document.querySelector('#map-instructions').textContent = mode === 'study'
    ? 'Select a numbered marker or a region name. Zoom in to read the original atlas labels; drag the map to move it.'
    : 'Read the prompt, then choose a numbered marker. Zoom and drag whenever you need a closer look.';
  clearMarkerStates();
  if (mode === 'practice') {
    overlayVisible = false;
    overlay.classList.add('is-hidden');
    overlayButton.classList.remove('is-on');
    overlayButton.setAttribute('aria-pressed', 'false');
    overlayButton.textContent = 'Color overlay: off';
    startPractice();
  } else {
    overlayVisible = true;
    overlay.classList.remove('is-hidden');
    overlayButton.classList.add('is-on');
    overlayButton.setAttribute('aria-pressed', 'true');
    overlayButton.textContent = 'Color overlay: on';
  }
}

function startPractice() {
  questionIndex = 0;
  practiceCorrect = 0;
  practiceAttempts = 0;
  showMapQuestion();
}

function showMapQuestion() {
  questionAnswered = false;
  clearMarkerStates();
  const question = mapQuestions[questionIndex];
  questionCount.textContent = `${questionIndex + 1} / ${mapQuestions.length}`;
  practicePrompt.textContent = question.prompt;
  practiceFeedback.textContent = 'Choose a numbered marker on the map.';
  mapScore.textContent = `${practiceCorrect} / ${practiceAttempts}`;
  showAnswerButton.disabled = false;
  nextQuestionButton.disabled = true;
  nextQuestionButton.textContent = questionIndex === mapQuestions.length - 1 ? 'Results' : 'Next';
  delete nextQuestionButton.dataset.action;
}

function answerMapQuestion(id) {
  if (questionAnswered) return;
  questionAnswered = true;
  const question = mapQuestions[questionIndex];
  const chosen = getRegion(id);
  const correct = id === question.id;
  practiceAttempts += 1;
  getMarker(id).classList.add(correct ? 'is-correct' : 'is-wrong');
  getMarker(question.id).classList.add('is-correct');
  if (correct) {
    practiceCorrect += 1;
    practiceFeedback.textContent = `Correct — ${chosen.name}.`;
  } else {
    practiceFeedback.textContent = `Not quite. The highlighted answer is ${getRegion(question.id).name}.`;
  }
  mapScore.textContent = `${practiceCorrect} / ${practiceAttempts}`;
  showAnswerButton.disabled = true;
  nextQuestionButton.disabled = false;
  centerOnRegion(getRegion(question.id));
}

showAnswerButton.addEventListener('click', () => {
  if (questionAnswered) return;
  questionAnswered = true;
  const answer = getRegion(mapQuestions[questionIndex].id);
  getMarker(answer.id).classList.add('is-correct');
  practiceFeedback.textContent = `Answer: ${answer.name}. Study its position, then continue.`;
  showAnswerButton.disabled = true;
  nextQuestionButton.disabled = false;
  centerOnRegion(answer);
});

nextQuestionButton.addEventListener('click', () => {
  if (nextQuestionButton.dataset.action === 'restart') {
    startPractice();
    return;
  }
  if (questionIndex < mapQuestions.length - 1) {
    questionIndex += 1;
    showMapQuestion();
  } else {
    clearMarkerStates();
    practicePrompt.textContent = `Score: ${practiceCorrect} out of ${mapQuestions.length}`;
    practiceFeedback.textContent = practiceCorrect >= 8 ? 'Strong map reading. Move on to the Counter-Reformation check.' : 'Review the Study map, then practice again.';
    nextQuestionButton.textContent = 'Practice again';
    nextQuestionButton.dataset.action = 'restart';
    nextQuestionButton.disabled = false;
    showAnswerButton.disabled = true;
  }
});

function clearMarkerStates() {
  markerLayer.querySelectorAll('.map-marker').forEach((marker) => marker.classList.remove('is-selected', 'is-correct', 'is-wrong'));
}

const challengeStart = document.querySelector('#challenge-start');
const challengeQuestion = document.querySelector('#challenge-question');
const challengeOptions = document.querySelector('#challenge-options');
const challengeFeedback = document.querySelector('#challenge-feedback');
const challengeProgress = document.querySelector('#challenge-progress');
const bestScore = document.querySelector('#best-score');
let challengeIndex = 0;
let challengeCorrect = 0;

function loadBestScore() {
  const stored = Number(localStorage.getItem('reformation-best-score') || 0);
  bestScore.textContent = `${stored} / ${counterQuestions.length}`;
}

function startChallenge() {
  challengeIndex = 0;
  challengeCorrect = 0;
  challengeStart.hidden = true;
  showChallengeQuestion();
}

function showChallengeQuestion() {
  const question = counterQuestions[challengeIndex];
  challengeQuestion.textContent = question.q;
  challengeFeedback.textContent = '';
  challengeOptions.innerHTML = '';
  challengeProgress.style.width = `${(challengeIndex / counterQuestions.length) * 100}%`;
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option-button';
    button.textContent = option;
    button.addEventListener('click', () => answerChallenge(index, button));
    challengeOptions.append(button);
  });
}

function answerChallenge(choice, button) {
  const question = counterQuestions[challengeIndex];
  [...challengeOptions.children].forEach((element) => { element.disabled = true; });
  if (choice === question.answer) {
    challengeCorrect += 1;
    button.classList.add('correct');
    challengeFeedback.textContent = `Correct. ${question.why}`;
  } else {
    button.classList.add('wrong');
    challengeOptions.children[question.answer].classList.add('correct');
    challengeFeedback.textContent = `The best answer is “${question.options[question.answer]}.” ${question.why}`;
  }
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'primary-button';
  next.textContent = challengeIndex === counterQuestions.length - 1 ? 'See results' : 'Next question';
  next.addEventListener('click', advanceChallenge);
  challengeOptions.append(next);
}

function advanceChallenge() {
  challengeIndex += 1;
  if (challengeIndex < counterQuestions.length) {
    showChallengeQuestion();
    return;
  }
  challengeProgress.style.width = '100%';
  challengeOptions.innerHTML = '';
  challengeQuestion.textContent = `Score: ${challengeCorrect} out of ${counterQuestions.length}`;
  challengeFeedback.textContent = challengeCorrect >= 4 ? 'Excellent. You connected the map to the Catholic response.' : 'Review the explanations, then try once more.';
  const previous = Number(localStorage.getItem('reformation-best-score') || 0);
  localStorage.setItem('reformation-best-score', String(Math.max(previous, challengeCorrect)));
  loadBestScore();
  challengeStart.textContent = 'Try again';
  challengeStart.hidden = false;
}

challengeStart.addEventListener('click', startChallenge);
document.querySelector('#clear-progress').addEventListener('click', () => {
  localStorage.removeItem('reformation-best-score');
  loadBestScore();
});

setZoom(zoom);
loadBestScore();
