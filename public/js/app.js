sessionStorage.setItem("userName", document.getElementById('nickname').innerText);

//해당 모드 셀렉트시 모드명 뒤에 별 붙혀주는 함수
(function(){
    let modeCode = document.getElementById("modeCode").value;

    switch(modeCode){
        case "0":
            document.getElementById("mstd").innerText = "Standard★"
            break;
        case "1":
            document.getElementById("mtai").innerText = "Taiko★"
            break;
        case "2":
            document.getElementById("mcat").innerText = "Catch★"
            break;
        case "3":
            document.getElementById("mman").innerText = "Mania★"
            break;
    }
})();

//pp 계산기 띄워주는 팝업,팝업을 닫았다 새로 열때마다 값이 초기화 된 후 새롭게 정보 다시 받아서 뿌려줌
function popup(index) {
    document.getElementById('calcPopup').classList.toggle("hidden");
    
    document.getElementById('inputScore').value = "";
    document.getElementById('calc_mods').innerText = "";
    document.getElementById('calc_total').setAttribute("value", document.getElementById("total" + index).innerText)
    document.getElementById('calc_rating').setAttribute("value", document.getElementById("song_rating" + index).innerText)

    document.getElementById('calc_title').innerText =  document.getElementById("song_title" + index).innerText;
    document.getElementById('calc_diff').innerText =  document.getElementById("song_diff" + index).innerText;
    document.getElementById('calc_ratings').innerText = "★" + document.getElementById("song_rating" + index).innerText;
    document.getElementById('calc_mods').setAttribute("value", document.getElementById("song_mods" + index).innerText)
    if(document.getElementById('calc_mods').getAttribute("value") == 64){
        document.getElementById('calc_mods').innerText = "+DT";
    }

    document.getElementById("calculatedPP").innerText = "";
}

//팝업창 닫기
function closePopup() {
    document.getElementById('calcPopup').classList.toggle("hidden");
}

//매니아 PP 계산식
function calcPP() {
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

function abc(val){
    document.getElementById('inputScore').setAttribute("value", val);
}

//모드 변경 버튼을 눌렀을 때 해당 모드의 정보를 불러올 수 있게 해주는 함수
function changeMode(mode){
    let modes = document.getElementById("modes");
    switch(mode){
        case "mstd":
            modes.setAttribute("value", "0");
            break;
        case "mtai":
            modes.setAttribute("value", "1");
            break;
        case "mcat":
            modes.setAttribute("value", "2");
            break;
        case "mman":
            modes.setAttribute("value", "3");
            break;
    }
    document.getElementById("user").setAttribute("value", sessionStorage.getItem("userName"));

    document.getElementById("userForm").submit();
}