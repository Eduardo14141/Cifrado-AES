  	 
document.querySelector("#AES").addEventListener("submit", function (e) {
    e.preventDefault();
    let text = document.querySelector("#text-cif-aes").value;
    let pass = document.querySelector("#pass-cif-aes").value;
    let arr_matriz_text = GenerarMatriz4x4(text);
    let arr_matriz_pass = GenerarMatriz4x4(pass);
    if(!arr_matriz_text.arr_matriz)
        return {warning: true, msg: "El texto no se puede dividir en bloques de 16 caracteres"};
    if(!arr_matriz_pass.arr_matriz)
        return {warning: true, msg: "El texto no se puede dividir en bloques de 16 caracteres"};
    console.log(addRoundKey(arr_matriz_text.arr_matriz[0], arr_matriz_pass.arr_matriz[0]));
});
function GenerarMatriz4x4(text) {
    let matriz = [];	
    let arr_matriz = [];
    let sobras = null;
    let text_length = text.length;
    if (text.length % 16 != 0)
        sobras = text.slice(text_length - text_length%16, text_length);
    text = text.split("");
    while (text.length >= 16) {
        for (let m = 0; m <= 4; m++) {
            matriz.push(text.splice(0, 4));
            if (matriz.length >= 4) 
                arr_matriz.push(matriz.splice(0, matriz.length));
        }
    }
    return {arr_matriz: encodeToHex(arr_matriz), sobras: sobras };
}
function encodeToHex(arr_matriz){
    if(!arr_matriz)
        return false;
    for(let k=0; k<arr_matriz.length; k++){
        for(let i=0; i<4; i++){
            for(let j=0; j<4; j++){
                arr_matriz[k][i][j]= arr_matriz[k][i][j].charCodeAt(0).toString(16);
            }
        }
    }
    return arr_matriz;
}
const sBox =["63","7c","77","7b","f2","6b","6f","c5","30","01","67","2b","fe","d7","ab","76",
             "ca","82","c9","7d","fa","59","47","f0","ad","d4","a2","af","9c","a4","72","c0",
             "b7","fd","93","26","36","3f","f7","cc","34","a5","e5","f1","71","d8","31","15",
             "04","c7","23","c3","18","96","05","9a","07","12","80","e2","eb","27","b2","75",
             "09","83","2c","1a","1b","6e","5a","a0","52","3b","d6","b3","29","e3","2f","84",
             "53","d1","00","ed","20","fc","b1","5b","6a","cb","be","39","4a","4c","58","cf",
             "d0","ef","aa","fb","43","4d","33","85","45","f9","02","7f","50","3c","9f","a8",
             "51","a3","40","8f","92","9d","38","f5","bc","b6","da","21","10","ff","f3","d2",
             "cd","0c","13","ec","5f","97","44","17","c4","a7","7e","3d","64","5d","19","73",
             "60","81","4f","dc","22","2a","90","88","46","ee","b8","14","de","5e","0b","db",
             "e0","32","3a","0a","49","06","24","5c","c2","d3","ac","62","91","95","e4","79",
             "e7","c8","37","6d","8d","d5","4e","a9","6c","56","f4","ea","65","7a","ae","08",
             "ba","78","25","2e","1c","a6","b4","c6","e8","dd","74","1f","4b","bd","8b","8a",
             "70","3e","b5","66","48","03","f6","0e","61","35","57","b9","86","c1","1d","9e",
             "e1","f8","98","11","69","d9","8e","94","9b","1e","87","e9","ce","55","28","df",
             "8c","a1","89","0d","bf","e6","42","68","41","99","2d","0f","b0","54","bb","16"];
const sBoxColumn= [0,1,2,3,4,5,6,7,8,9,"a","b","c","d","e","f"];
function matrixToSubBytes(matrix){
    for(let i=0; i<4; i++){
        for(let j=0; j<4; j++){
            let x = sBoxColumn.indexOf(matrix[i][j].charAt(0));
            let y = sBoxColumn.indexOf(matrix[i][j].charAt(1));
            matrix[i][j] = sBox[x+(y*16)];
        }
    }
}
function shiftRows (matrix){
    let t = new Array(4);
    for (let r=1; r<4; r++) {
        for (let c=0; c<4; c++) 
            t[c] = matrix[r][(c+r)%4];
        for (let m=0; m<4; m++) 
            matrix[r][m] = t[m];
    }
    return matrix;
}
function mixColumns(matrix) {
    for (let c=0; c<4; c++) {
        let a = new Array(4);
        let b = new Array(4);
        let h;
        for (let i=0; i<4; i++) {
        	console.log((matrix[i][c]).toString(2), (80).toString(2));
            a[i] = matrix[c][i];
            b[i] ^= matrix[c][i];
        }
        // a[n] ^ b[n] is a•{03} in GF(2^8)
        matrix[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // {02}•a0 + {03}•a1 + a2 + a3
        matrix[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 • {02}•a1 + {03}•a2 + a3
        matrix[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + {02}•a2 + {03}•a3
        matrix[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // {03}•a0 + a1 + a2 + {02}•a3
    }
    return matrix;
};
function addRoundKey(matrix_txt, matrix_pass ){
	let matrix_key=[];
	let round_key=[];
	for (let i = 0; i < 4; i++) {
		for (let m = 0; m < 4; m++) 
			round_key.push(matrix_txt[i][m] ^ matrix_pass[i][m]);
		matrix_key.push(round_key.splice(0, round_key.length));
	}
	return matrix_key;
}