const alumnos = [
    {
      id: 0,
      nombre: "Leandro",
      apellido: "Borrelli",
      legajo: 20210308,
      notas: [],
    },
    {
      id: 1,
      nombre: "Esteban",
      apellido: "Piazza",
      legajo: 20210211,
      notas: [],
    },
    {
      id: 2,
      nombre: "Martin",
      apellido: "Cejas",
      legajo: 20210218,
      notas: [],
    },
    {
      id: 3,
      nombre: "Karina",
      apellido: "Borgna",
      legajo: 20210516,
      notas: [],
    },
    {
      id: 5,
      nombre: "Javier",
      apellido: "Riera",
      legajo: 20220125,
      notas: [],
    },
];

console.log("Este es array alumnos --> \n",alumnos)


const sortLegajo = (alumnos) => {
    return alumnos.sort((a, b) => {
        return b.legajo - a.legajo  ;
    });
}


console.log("Ordenados de forma descendente -->  \n",sortLegajo(alumnos));



























// console.log(multiplicacionDiagonales(matriz))
// console.log(impar(matriz));
// console.log(sumaMultiplosDe5(matriz))















// const alumno = {
//     id: 5,
//     nombre: "Lucas",
//     apellido: "Astrada",
//     legajo: 20220125,
//     notas: [10,6,8,7,9]
// }

// const recorrer = (alumno) => {
//     let prom = 0
//     for (let key in alumno.notas) {
//         console.log(alumno.notas[key])
//         prom = prom + alumno.notas[key]/5
//     }
//     return +prom;
// }

// const ordenarNotas = (alumno) => {
//     let notas = alumno.notas
//     notas.sort(function(a, b){return a-b})
//     return notas
// }

// console.log(recorrer(alumno))
// console.log(ordenarNotas(alumno))