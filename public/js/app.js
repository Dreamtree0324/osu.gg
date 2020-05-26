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
    maniaCalcPP();
}

/*
    TODO : 매니아 외의 모드 pp 계산기 추가하기
    STEP1 - 스탠다드 계산기
*/

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