const root = document.querySelector("#root");

let WORDS = {
  castle: { en: "castle", ru: "замок" },
};
let quizWords;
const url = "http://127.0.0.1:3000";
const resultState = {
  current: 0,
  madeMoves: 0,
  max: 5,
};

//view
function renderAddWordBlock() {
  return `<section class="flex-col-mid words-open words-add-word_block">
          <form method="post" action="/api/word" class="flex-col-mid">
            <div class="form-word_input">
              <label for="en_word">Введите слово на английском</label>
              <input type="text" name="en_word" id="en_word" />
            </div>
            <div class="form-word_input">
              <label for="ru_word">Введите слово на русском</label>
              <input type="text" name="ru_word" id="ru_word" />
            </div>
            <button class="btn add-word_btn">Submit</button>
          </form>
        </section>`;
}

function renderAllWordsBlock() {
  console.log(Object.keys(WORDS));
  const wordsBlocks = Object.keys(WORDS)
    .map((word) => `<div>${WORDS[word].en} - ${WORDS[word].ru}</div>`)
    .join("");
  return `<section class="flex-col-mid words-open words-all-words_block">
${wordsBlocks}
        </section>`;
}

function renderQuizBlock(data) {
  console.log(data);
  const blockToRender = data.map((word, i) => {
    const html = `
    <div class="quiz-word_input">
      <label for="word-${i}">${word.en}</label>
      <input type="text" name="word-${i}" id="word-${i}" />
      <button class="btn">☑️</button>
    </div>
    `;
    return html;
  });
  return `
          <section class="flex-col-mid words-open words-quiz_block">
          ${blockToRender.join("")}
          <div class="quiz-result">Result ${resultState.current}/${
    resultState.max
  }</div>
          <button class="btn quiz-restart_btn">Restart</button>
        </section>`;
}

function renderMain() {
  root.innerHTML = `
  <main class="words-main_wrapper flex-col-mid">
        <nav class="words-navigation flex-row-mid">
          <div class="navigation_block" data-nav="all">All Words</div>
          <div class="navigation_block active" data-nav="add">Add Word</div>
          <div class="navigation_block" data-nav="quiz">Quiz</div>
        </nav>
        <div class="words-open-wrapper">
        ${renderAddWordBlock()}
        </div>
      
      </main>
  `;
}
function removeActiveBtn(parent, btnSelector) {
  const buttons = parent.querySelectorAll(`${btnSelector}`);
  buttons.forEach((btn) => {
    btn.classList.remove("active");
  });
}

function changeOpenBlock(blockName, dataFromServer) {
  const openBlock = root.querySelector(".words-open-wrapper");
  const navBlock = root.querySelector(".words-navigation");
  removeActiveBtn(navBlock, ".navigation_block");
  const activeBtn = navBlock.querySelector(`[data-nav="${blockName}"]`);
  activeBtn.classList.add("active");
  switch (blockName) {
    case "all":
      openBlock.innerHTML = renderAllWordsBlock();
      break;
    case "add":
      openBlock.innerHTML = renderAddWordBlock();
      break;
    case "quiz":
      openBlock.innerHTML = renderQuizBlock(dataFromServer);
      break;
    default:
      openBlock.innerHTML = renderAddWordBlock();
      break;
  }
}
//model
//! should be refactored trough controller and view parts

function showResult(isUp) {
  const resultBlock = root.querySelector(".quiz-result");
  if (isUp) resultState.current += 1;
  resultBlock.innerHTML = `<div class="quiz-result">Result ${resultState.current}/${resultState.max}</div>`;
}

function handleQuizCheckBtn(e) {
  if (!e.target.classList.contains("btn")) return;
  const block = this;
  const en_word = block.querySelector("label").textContent;
  const btn = block.querySelector(".btn");
  const data = quizWords.find((word) => (word.en === en_word ? word : null));
  const input = block.querySelector("input");

  if (data.ru === input.value) {
    btn.innerHTML = "✅";
    showResult(true);
    input.disabled = true;
    btn.disabled = true;
    resultState.madeMoves += 1;
  } else {
    btn.innerHTML = "❌";
    showResult(false);
    input.disabled = true;
    btn.disabled = true;
    resultState.madeMoves += 1;
  }

  if (resultState.madeMoves === resultState.max) {
    console.log("game is ended");
  }
}

function runQuiz(data) {
  quizWords = data;
  const quizBlock = root.querySelector(".words-quiz_block");
  const wordsToCheck = quizBlock.querySelectorAll(".quiz-word_input");
  wordsToCheck.forEach((quizBlock) => {
    quizBlock.addEventListener("click", handleQuizCheckBtn);
  });
  const restartBtn = root.querySelector(".quiz-restart_btn");
  restartBtn.addEventListener("click", restartGame);
}

async function restartGame() {
  resultState.current = 0;
  resultState.madeMoves = 0;
  const data = await fetch(`${url}/api/quiz`, { method: "get" });
  const jsonData = (await data.json()).data;
  changeOpenBlock("quiz", jsonData);
  runQuiz(jsonData);
}

//controller

async function handleSubmitNewWord(e) {
  e.preventDefault();
  const form = e.target;

  const formData = new FormData(form);
  const wordToSend = JSON.stringify(
    Object.fromEntries(Array.from(formData.entries()))
  );
  console.log(wordToSend);
  await fetch(`${url}/api/word`, { method: "post", body: wordToSend });
  form.reset();
}

async function handleNavActiveBlock(e) {
  if (e.target.classList.contains("navigation_block")) {
    const navBlock = e.target.dataset.nav;
    if (navBlock === "all") {
      const data = await fetch(`${url}/api/all`, { method: "get" });
      WORDS = (await data.json()).data;
      changeOpenBlock(navBlock);
    }
    if (navBlock === "add") {
      changeOpenBlock(navBlock);
      const form = root.querySelector(".words-open form");
      form.addEventListener("submit", handleSubmitNewWord);
    }
    if (navBlock === "quiz") {
      const data = await fetch(`${url}/api/quiz`, { method: "get" });
      const jsonData = (await data.json()).data;
      changeOpenBlock(navBlock, jsonData);
      runQuiz(jsonData);
    }
  }
}

function mainController() {
  const nav = root.querySelector(".words-navigation");
  nav.addEventListener("click", handleNavActiveBlock);

  const form = root.querySelector(".words-open form");
  form.addEventListener("submit", handleSubmitNewWord);
}

async function main() {
  renderMain();
  mainController();
}

main();
