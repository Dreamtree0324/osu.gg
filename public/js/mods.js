let none           = 0;
let noFail         = 1;
let easy           = 2;
let touchDevice    = 4;
let hidden         = 8;
let hardRock       = 16;
let suddenDeath    = 32;
let doubleTime     = 64;
let relax          = 128;
let halfTime       = 256;
let nightcore      = 512;
let flashlight     = 1024;
let autoplay       = 2048;
let spunOut        = 4096;
let relax2         = 8192; 
let perfect        = 16384;
let key4           = 32768;
let key5           = 65536;
let key6           = 131072;
let key7           = 262144;
let key8           = 524288;
let fadeIn         = 1048576;
let random         = 2097152;
let cinema         = 4194304;
let target         = 8388608;
let key9           = 16777216;
let keyCoop        = 33554432;
let key1           = 67108864;
let key3           = 134217728;
let key2           = 268435456;
let scoreV2        = 536870912;
let mirror         = 1073741824;
let keyMod = key1 | key2 | key3 | key4 | key5 | key6 | key7 | key8 | key9 | keyCoop;
let freeModAllowed = noFail | easy | hidden | hardRock | suddenDeath | flashlight | fadeIn | relax | relax2 | spunOut | keyMod;
let scoreIncreaseMods = hidden | hardRock | doubleTime | flashlight | fadeIn;

function enabledMode(mods){
  switch(mods){
    case hardRock:
      alert("abc")
      break;
    case hardRock+doubleTime:
      alert("HR+DT");
      break;  
    default:
      alert("error");
  }
};

enabledMode(hardRock + doubleTime);