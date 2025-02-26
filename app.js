const root = document.querySelector("#root");
console.log(root);

//view
function renderAddWordBlock() {
  return `<section class="flex-col-mid words-open words-add-word_block">
          <form method="post" action="/api/word">
            <div class="form-word_input">
              <label for="en_word">Введите слово на английском</label>
              <input type="text" name="en_word" id="en_word" />
            </div>
            <div class="form-word_input">
              <label for="ru_word">Введите слово на русском</label>
              <input type="text" name="ru_word" id="ru_word" />
            </div>
          </form>
          <button class="btn add-word_btn">Submit</button>
        </section>`;
}

function renderAllWordsBlock() {
  return `        <section class="flex-col-mid words-open words-all-words_block">
          <div>word - слово</div>
          <div>word - слово</div>
          <div>word - слово</div>
          <div>word - слово</div>
          <div>word - слово</div>
          <div>word - слово</div>
          <div>word - слово</div>
        </section>`;
}

function renderQuizBlock() {
  return `
          <section class="flex-col-mid words-open words-quiz_block">
          <div class="form-word_input">
            <label for="ru_word">Word</label>
            <input type="text" name="ru_word" id="ru_word" />
            <button class="btn">☑️</button>
          </div>
          <div class="form-word_input">
            <label for="ru_word">Word</label>
            <input type="text" name="ru_word" id="ru_word" />
            <button class="btn">☑️</button>
          </div>
          <div class="form-word_input">
            <label for="ru_word">Word</label>
            <input type="text" name="ru_word" id="ru_word" />
            <button class="btn">☑️</button>
          </div>
          <div class="form-word_input">
            <label for="ru_word">Word</label>
            <input type="text" name="ru_word" id="ru_word" />
            <button class="btn">☑️</button>
          </div>
          <div class="form-word_input">
            <label for="ru_word">Word</label>
            <input type="text" name="ru_word" id="ru_word" />
            <button class="btn">☑️</button>
          </div>
          <div class="quiz-resilt">Result 0/5</div>
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

function changeOpenBlock(blockName) {
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
      openBlock.innerHTML = renderQuizBlock();
      break;
    default:
      openBlock.innerHTML = renderAddWordBlock();
      break;
  }
}

//controller

function mainController() {
  const nav = root.querySelector(".words-navigation");
  nav.addEventListener("click", (e) => {
    console.dir(e.target);
    if (e.target.classList.contains("navigation_block")) {
      const navBlock = e.target.dataset.nav;

      changeOpenBlock(navBlock);
    }
  });
}

function main() {
  renderMain();
  mainController();
}

main();
