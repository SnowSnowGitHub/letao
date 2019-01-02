function setHtmlSize() {
    var designWidth = 750;
    var designFontSize = 200;
    var screenWidth = document.documentElement.offsetWidth;
    var nowFontSize=screenWidth/(designWidth/designFontSize);
    if(nowFontSize>200) nowFontSize=200;
    document.documentElement.style.fontSize =nowFontSize+'px';
    console.log(document.documentElement.style.fontSize );
    
}
setHtmlSize();
window.addEventListener('resize', setHtmlSize);