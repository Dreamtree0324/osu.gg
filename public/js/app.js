sessionStorage.setItem("userName", document.getElementById('nickname').innerText);

//해당 모드 셀렉트시 모드명 뒤에 별 붙혀주는 함수
(function () {
    let modeCode = document.getElementById("modeCode").value;

    switch (modeCode) {
        case "0":
            document.getElementById("mstd").style.cssText = "border-bottom:2px solid #fff;";
            break;
        case "1":
            document.getElementById("mtai").style.cssText = "border-bottom:2px solid #fff;";
            break;
        case "2":
            document.getElementById("mcat").style.cssText = "border-bottom:2px solid #fff;";
            break;
        case "3":
            document.getElementById("mman").style.cssText = "border-bottom:2px solid #fff;";
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

    document.getElementById('calc_title').innerText = document.getElementById("song_title" + index).innerText;
    document.getElementById('calc_diff').innerText = document.getElementById("song_diff" + index).innerText;
    document.getElementById('calc_ratings').innerText = "★" + document.getElementById("song_rating" + index).innerText;
    document.getElementById('calc_mods').setAttribute("value", document.getElementById("song_mods" + index).innerText);

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

function abc(val) {
    document.getElementById('inputScore').setAttribute("value", val);
}

//모드 변경 버튼을 눌렀을 때 해당 모드의 정보를 불러올 수 있게 해주는 함수
function changeMode(mode) {
    let modes = document.getElementById("modes");
    switch (mode) {
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

//mods 구하는 함수
function getMods(value) {
    let arr = [];
    let bcc = [];

    for (let i = 0; i < value.length; i++) {
        let v = value[i];

        arr.push('0'.repeat(i) + v + '0'.repeat(value.length - i - 1));
    }

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].includes('1')) {
            let c = parseInt(arr[i], 2);
            bcc.push(c)
        }
    }

    return getModsName(bcc);
}

function getModsName(value) {
    let modsArray = [];
    let modsObject = {
        "0": "None",
        "1": "NF",
        "2": "EZ",
        "4": "TD",
        "8": "HD",
        "16": "HR",
        "32": "SD",
        "64": "DT",
        "128": "RL",
        "256": "HT",
        "512": "NC",
        "1024": "FL",
        "2048": "Auto",
        "4096": "Spun",
        "8192": "RL2",
        "16384": "PF",
        "32768": "4K",
        "65536": "5K",
        "131072": "6K",
        "262144": "7K",
        "524288": "8K",
        "1048576": "FI",
        "2097152": "RD",
        "4194304": "CI",
        "8388608": "TG",
        "16777216": "9K",
        "33554432": "CO",
        "67108864": "1K",
        "134217728": "3K",
        "268435456": "2K",
        "536870912": "V2",
        "1073741824": "MR",
    }
    
    for(i = 0; i < value.length ; i++){
        if(value.includes(512)){
            if(value[i] == 64){
                continue;
            }
        }
        modsArray.push(modsObject[value[i]]);
    }

    return modsArray;
}

for(let i = 0; i < document.querySelectorAll(".song_info").length; i++){
    let modsNum = document.getElementById("song_mods"+i).innerHTML;
    if(modsNum !== '0'){
        let modsArray = getMods(parseInt(modsNum).toString(2));

        document.getElementById('emods' + i).innerHTML = '+'+modsArray;
    } else{
        document.getElementById('emods'+ i).innerHTML = "";
    }
}