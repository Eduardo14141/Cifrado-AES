document.querySelector("#AES").addEventListener("submit", function (e) {
    e.preventDefault();
    let text = document.querySelector("#text-cif-aes").value;
    let pass = document.querySelector("#pass-cif-aes").value;
    let arr_matriz_text = GenerarMatriz4x4(text);
    let arr_matriz_pass = GenerarMatriz4x4(pass);
    console.log(arr_matriz_text);
    console.log(matrixToSubBytes(arr_matriz_text.arr_matriz[0]));
    //if(!arr_matriz_text.arr_matriz)
        return {warning: true, msg: "El texto no se puede dividir en bloques de 16 caracteres"};
    if(!arr_matriz_pass.arr_matriz)
        return {warning: true, msg: "El texto no se puede dividir en bloques de 16 caracteres"};
});
function encrypt(txt_matrix, pass_matrix){
    let addRoundKey= addRoundKey(txt_matrix, pass_matrix);
    let state = 
    for(let i=0; i<9; i++){
        let subBytes = matrixToSubBytes(addRoundKey);
        let shiftRows = shiftRows(subBytes);
        let mixColumns = mixColumns(shiftRows);
        addRoundKey= addRoundKey(addRoundKey, )
    }

}
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
                arr_matriz[k][i][j]= "0x" + arr_matriz[k][i][j].charCodeAt(0).toString(16);
            }
        }
    }
    return arr_matriz;
}
const sBox =[0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
             0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
             0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
             0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
             0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
             0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
             0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
             0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
             0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
             0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
             0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
             0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
             0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
             0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
             0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
             0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];
const sBoxColumn= ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
function matrixToSubBytes(matrix){
    for(let i=0; i<4; i++){
        for(let j=0; j<4; j++){
            let x = sBoxColumn.indexOf(matrix[i][j].charAt(2));
            let y = sBoxColumn.indexOf(matrix[i][j].charAt(3));
            matrix[i][j] = sBox[x+(y*16)];
        }
    }
    return matrix;
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
		for (let m = 0; m < 4; m++) {
            console.log("text: " + matrix_txt[i][m]);
            console.log("pass: " + matrix_pass[i][m]);
            console.log("XOR: " + decToHex((matrix_txt[i][m] ^ matrix_pass[i][m])));
			round_key.push(decToHex(matrix_txt[i][m] ^ matrix_pass[i][m]));
	    }
        matrix_key.push(round_key.splice(0, round_key.length));	
	}
	return matrix_key;
}
function decToHex(number){
    return  ("0x"+(Number(number).toString(16))).slice(-2);
}