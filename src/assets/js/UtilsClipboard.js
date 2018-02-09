let textArea;

const isOS = () => navigator.userAgent.match(/ipad|iphone/i);

const createTextArea = text => {
  textArea = document.createElement('textArea');
  textArea.value = text;
  document.body.appendChild(textArea);
}

const selectText = () => {
  if (isOS()) {
    const range = document.createRange();
    range.selectNodeContents(textArea);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    textArea.setSelectionRange(0, 999999);
  } else {
    textArea.select();
  }
}

export const copyToClipboard = function(text) {
  createTextArea(text);
  selectText();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};
