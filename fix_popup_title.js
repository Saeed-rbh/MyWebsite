const fs = require("fs");
const path = "src/components/Popup/Popup.module.css";
let content = fs.readFileSync(path, "utf8");

const oldTitle = `.title {
  margin-top: 0;
  font-size: 35px;
  font-weight: 400;
  margin-bottom: 1rem;
  border-bottom: 2px solid #d49d81;
  padding-bottom: 0.5rem;
  letter-spacing: 1px;
  flex-shrink: 0;
  text-align: left;

  /* User requested styles */
  font-family: "Rubik", sans-serif !important;
  font-weight: 900;
  background: linear-gradient(to right, #b96032a8 0%, #d4a58d 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`;

const newTitle = `@keyframes popupTitleSlide {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.title {
  margin-top: 0;
  font-size: 35px;
  font-weight: 400;
  margin-bottom: 1rem;
  border-bottom: 2px solid #d49d81;
  padding-bottom: 0.5rem;
  letter-spacing: 1px;
  flex-shrink: 0;
  text-align: left;

  /* User requested styles */
  font-family: "Rubik", sans-serif !important;
  font-weight: 900;
  background: linear-gradient(to right, #b96032a8 0%, #d4a58d 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  /* Animation */
  opacity: 0;
  animation: popupTitleSlide 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  animation-delay: 0.1s;
}`;

content = content.replace(oldTitle, newTitle);
fs.writeFileSync(path, content);
console.log("Title animation added!");

