function button() {
    let btnEl = document.getElementById("btn");
    let imgEl = document.getElementById("imgEgg");

    if (btnEl.textContent === "+") btnEl.textContent = "-";
    else btnEl.textContent= "+";

    if (imgEl.style.display === "none") {
        imgEl.style.display = "block";
      } else {
        imgEl.style.display = "none";
      }
}