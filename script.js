const storyBox = document.querySelector("[data-story-id]");
const assetBase = location.pathname.includes("/kids/") || location.pathname.includes("/parents/") ? "../assets/" : "assets/";
const earnedStampsKey = "nethakase:earned-stamps";
const stampStories = Array.from({ length: 10 }, (_, index) => {
  const number = index + 1;
  const padded = String(number).padStart(2, "0");

  return {
    href: `story-${padded}.html`,
    id: `story-${padded}`,
    number,
    title: `第${number}話`,
  };
});

const getEarnedStamps = () => {
  try {
    const stamps = JSON.parse(localStorage.getItem(earnedStampsKey) || "[]");
    return Array.isArray(stamps) ? stamps : [];
  } catch {
    return [];
  }
};

const setEarnedStamps = (stamps) => {
  try {
    localStorage.setItem(earnedStampsKey, JSON.stringify(stamps));
  } catch {
    // localStorage may be unavailable in some browser settings.
  }
};

const updatePowerMeters = () => {
  const earnedCount = getEarnedStamps().length;
  const level = earnedCount;
  const percentage = Math.round((earnedCount / stampStories.length) * 100);

  document.querySelectorAll("[data-guard-level]").forEach((element) => {
    element.textContent = `Lv.${level}`;
  });

  document.querySelectorAll("[data-guard-bar]").forEach((element) => {
    element.style.width = `${percentage}%`;
  });
};

const renderStampBoards = () => {
  const earnedStamps = getEarnedStamps();
  const earnedCount = earnedStamps.length;

  document.querySelectorAll("[data-stamp-board]").forEach((board) => {
    const count = board.querySelector("[data-stamp-count]");
    const slots = board.querySelector("[data-stamp-slots]");

    if (count) {
      count.textContent = `${earnedCount} / ${stampStories.length}`;
    }

    if (!slots) {
      return;
    }

    slots.textContent = "";

    stampStories.forEach((story) => {
      const isEarned = earnedStamps.includes(story.id);
      const slot = document.createElement("a");
      const number = document.createElement("span");
      const state = document.createElement("span");

      slot.className = "stamp-slot";
      slot.href = story.href;
      slot.dataset.stampSlot = story.id;
      slot.setAttribute("aria-label", `${story.title} ${isEarned ? "スタンプ済み" : "まだ"}`);
      slot.classList.toggle("is-earned", isEarned);

      number.className = "stamp-slot__number";
      number.textContent = String(story.number);

      state.className = "stamp-slot__state";
      state.textContent = isEarned ? "合格" : "まだ";

      slot.append(number, state);
      slots.appendChild(slot);
    });
  });
};

const renderStampCards = () => {
  const earnedStamps = getEarnedStamps();

  document.querySelectorAll("[data-stamp-card]").forEach((card) => {
    const stampId = card.dataset.stampId;
    const isEarned = earnedStamps.includes(stampId);
    const seal = card.querySelector("[data-stamp-seal]");
    const message = card.querySelector("[data-stamp-message]");

    if (seal) {
      seal.textContent = isEarned ? "合格" : "第1話";
      seal.classList.toggle("stamp-card__seal--earned", isEarned);
    }

    if (message) {
      message.textContent = isEarned
        ? "第1話のスタンプをゲット済み。はやとのまもり力が少しアップしています。"
        : "クイズをクリアすると、ここにスタンプがつきます。";
    }
  });

  renderStampBoards();
  updatePowerMeters();
};

const earnStamp = (stampId) => {
  if (!stampId) {
    return;
  }

  const earnedStamps = getEarnedStamps();

  if (!earnedStamps.includes(stampId)) {
    earnedStamps.push(stampId);
    setEarnedStamps(earnedStamps);
  }

  renderStampCards();
};

document.querySelectorAll(".story-page .lesson-box").forEach((section) => {
  const label = section.querySelector(".eyebrow")?.textContent.trim();

  if (label !== "ネットはかせのポイント" || section.querySelector(".hakase-point__img")) {
    return;
  }

  const hakase = document.createElement("img");
  hakase.className = "hakase-point__img";
  hakase.src = `${assetBase}hakase-glass-a.webp`;
  hakase.alt = "";
  hakase.setAttribute("aria-hidden", "true");
  hakase.width = 88;
  hakase.height = 79;
  hakase.loading = "lazy";

  section.classList.add("lesson-box--with-hakase");
  section.appendChild(hakase);
});

if (storyBox) {
  const storyId = storyBox.dataset.storyId;
  const result = storyBox.querySelector("[data-quiz-result]");
  const options = [...storyBox.querySelectorAll(".quiz-option")];
  const markRead = storyBox.querySelector("[data-mark-read]");
  const correctMessage =
    storyBox.dataset.correctMessage || "せいかい。あやしい画面は、大人に見せよう。";
  const wrongMessage =
    storyBox.dataset.wrongMessage || "もう一度見てみよう。押す前に、大人に相談だよ。";

  options.forEach((button) => {
    button.addEventListener("click", () => {
      const isCorrect = button.dataset.correct === "true";

      options.forEach((option) => {
        option.disabled = true;
        option.classList.toggle("is-correct", option.dataset.correct === "true");
      });

      if (!isCorrect) {
        button.classList.add("is-wrong");
      }

      result.textContent = isCorrect ? correctMessage : wrongMessage;

      if (isCorrect && !storyBox.querySelector(".quiz-hakase")) {
        const cheer = document.createElement("img");
        cheer.className = "quiz-hakase";
        cheer.src = `${assetBase}hakase-good.webp`;
        cheer.alt = "よろこぶネットはかせ";
        cheer.width = 96;
        result.insertAdjacentElement("afterend", cheer);
      }

      localStorage.setItem(`${storyId}:quiz`, isCorrect ? "correct" : "tried");
    });
  });

  markRead?.addEventListener("click", () => {
    localStorage.setItem(`${storyId}:read`, "true");
    markRead.textContent = "読んだよ、を記録しました";
    markRead.disabled = true;
  });

  if (localStorage.getItem(`${storyId}:read`) === "true" && markRead) {
    markRead.textContent = "読んだよ、を記録しました";
    markRead.disabled = true;
  }
}

const quizCorner = document.querySelector("[data-quiz-corner]");

if (quizCorner) {
  const steps = [...quizCorner.querySelectorAll("[data-quiz-step]")];
  const complete = quizCorner.querySelector("[data-quiz-complete]");
  const progress = quizCorner.querySelector("[data-quiz-progress]");
  let currentStep = 0;
  let score = 0;

  const showStep = (index) => {
    steps.forEach((step, stepIndex) => {
      step.hidden = stepIndex !== index;
      step.classList.toggle("is-active", stepIndex === index);
    });

    if (progress) {
      progress.textContent = `${index + 1} / ${steps.length}`;
    }
  };

  steps.forEach((step, stepIndex) => {
    const result = step.querySelector("[data-result]");
    const buttons = [...step.querySelectorAll(".quiz-option")];

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const isCorrect = button.dataset.correct === "true";

        buttons.forEach((option) => {
          option.disabled = true;
          option.classList.toggle("is-correct", option.dataset.correct === "true");
        });

        if (!isCorrect) {
          button.classList.add("is-wrong");
        } else {
          score += 1;
        }

        result.textContent = isCorrect
          ? "せいかい。いい判断です。"
          : "おしい。赤くなったところを見て、もう一度たしかめよう。";

        window.setTimeout(() => {
          currentStep = stepIndex + 1;

          if (currentStep >= steps.length) {
            step.hidden = true;
            step.classList.remove("is-active");
            complete.hidden = false;
            progress.textContent = `${score} / ${steps.length}`;
            try {
              localStorage.setItem("story-01:quiz-corner", String(score));
            } catch {
              // Progress display still works even when browser storage is blocked.
            }
            earnStamp(complete.querySelector("[data-stamp-unlock]")?.dataset.stampId || "story-01");
            return;
          }

          showStep(currentStep);
        }, 1200);
      });
    });
  });

  showStep(0);
}

renderStampCards();

const backToTop = document.createElement("button");
backToTop.className = "back-to-top";
backToTop.type = "button";
backToTop.setAttribute("aria-label", "ページの上へもどる");
backToTop.textContent = "↑";
document.body.appendChild(backToTop);

const toggleBackToTop = () => {
  backToTop.classList.toggle("is-visible", window.scrollY > 400);
};

window.addEventListener("scroll", toggleBackToTop, { passive: true });
toggleBackToTop();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
