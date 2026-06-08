const storyBox = document.querySelector("[data-story-id]");

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
