/**
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个歌词对象
 * {time：开始时间，words：歌词内容}
 */

function parseLrc() {
  let lines = lrc.split("\n");
  let result = [];
  lines.forEach(i => {
    let parts = i.split("]");
    let timeStr = parts[0].substring(1);
    let obj = {
      time: parseTime(timeStr),
      words: parts[1]
    };
    result.push(obj);
  });
  return result;
}

/**
 *将一个时间字符串解析为数字（秒）
 * @param {string} timeStr 时间字符串
 * @returns {number}
 */

function parseTime(timeStr) {
  // return timeStr.replace(/:/g, ".");
  let parts = timeStr.split(":");
  return +parts[0] * 60 + +parts[1];
}
let lrcData = parseLrc();

// 获取需要的dom
let doms = {
  audio: document.querySelector("audio"),
  ul: document.querySelector(".container ul"),
  container: document.querySelector(".container"),
  button: document.querySelector(".button")
};
/**
 * 计算出在当前播放器播放到第几秒的情况下
 * lrcData数组中，应该高亮显示的歌词下标
 * 如果没有要显示的歌词 就返回-1
 */

function findIndex() {
  let res = true;
  let curTime = doms.audio.currentTime;
  // lrcData.forEach((i, index) => {
  //   if (curTime < i.time) {
  //     return index - 1;
  //   }
  // });

  for (let i = 0; i < lrcData.length; i++) {
    // console.log(lrcData[i], "lrcData[i]");
    if (curTime < lrcData[i].time) {
      return i - 1;
    }
  }
  return lrcData.length - 1;
}

/**
 * 创建歌词元素li
 */
function createLrcElements() {
  let frag = document.createDocumentFragment(); //文档片段
  lrcData.forEach(i => {
    let li = document.createElement("li");
    li.textContent = i.words;
    frag.appendChild(li); //改动了dom树
  });
  doms.ul.appendChild(frag);
}
createLrcElements();

let containerHeight = doms.container.clientHeight;
let liHeight = doms.ul.children[0].clientHeight;
let maxOffset = doms.ul.clientHeight - containerHeight;
/**
 * 设置ul的偏移量
 */
function setOffset() {
  let index = findIndex();
  let offset = liHeight * index + liHeight / 2 - containerHeight / 2;
  if (offset < 0) offset = 0;
  if (offset > maxOffset) offset = maxOffset;
  doms.ul.style.transform = `translateY(-${offset}px)`;
  if (doms.ul.querySelector(".active"))
    doms.ul.querySelector(".active").classList.remove("active");
  if (doms.ul.children[index]) doms.ul.children[index].classList.add("active");
}

let btnClick = true;
doms.button.onclick = () => {
  btnClick = !btnClick;
  if (btnClick === true) doms.audio.pause();
  else doms.audio.play();
};
doms.audio.addEventListener("timeupdate", () => {
  setOffset();
});

let animateButton = function(e) {
  e.preventDefault;
  //reset animation
  e.target.classList.remove("animate");

  e.target.classList.add("animate");
  setTimeout(function() {
    e.target.classList.remove("animate");
  }, 700);
};

let bubblyButtons = document.getElementsByClassName("button");

for (let i = 0; i < bubblyButtons.length; i++) {
  bubblyButtons[i].addEventListener("click", animateButton, false);
}
