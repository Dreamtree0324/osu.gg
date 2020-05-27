function maniaCalcPP() {
    const c = document.getElementById('calc_rating').getAttribute("value");
    const g = document.getElementById('calc_total').getAttribute("value");
    const scaledScore = document.getElementById('inputScore').getAttribute("value");
    if(scaledScore < 0 || scaledScore > 1000000){
        document.getElementById('inputScore').setAttribute("value", "");
        alert("점수는 0 미만, 1,000,000 초과일 수 없습니다.");
        return;
    } else if(!Number.isInteger(parseInt(scaledScore))){
        document.getElementById('inputScore').setAttribute("value", "");
        alert("정수형 숫자만 입력하세요 ^^");
        return;
    }

    let strainValue = Math.pow(5 * Math.max(1, c / 0.2) - 4.0, 2.2) / 135.0;
    let accuracyValue;

    strainValue *= 1.0 + 0.1 * Math.min(1.0, g / 1500.0);

    if (scaledScore <= 500000)
        strainValue = 0;
    else if (scaledScore <= 600000)
        strainValue *= (scaledScore - 500000) / 100000 * 0.3;
    else if (scaledScore <= 700000)
        strainValue *= 0.3 + (scaledScore - 600000) / 100000 * 0.25;
    else if (scaledScore <= 800000)
        strainValue *= 0.55 + (scaledScore - 700000) / 100000 * 0.20;
    else if (scaledScore <= 900000)
        strainValue *= 0.75 + (scaledScore - 800000) / 100000 * 0.15;
    else
        strainValue *= 0.90 + (scaledScore - 900000) / 100000 * 0.1;
    
        accuracyValue = Math.max(0.0, 0.2 - (0 - 34) * 0.006667) * strainValue * Math.pow(Math.max(0.0, scaledScore - 960000) / 40000, 1.1);

        let totalPP = Math.pow(Math.pow(strainValue, 1.1) + Math.pow(accuracyValue, 1.1), 1.0/1.1) * 0.8;

        document.getElementById("calculatedPP").innerText = totalPP.toFixed(2) + "PP";
}

function standardCalcPP(){

}