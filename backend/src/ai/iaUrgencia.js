// iaUrgencia.js
import * as tf from '@tensorflow/tfjs';
import natural from 'natural';
import fs from 'fs';

const tokenizer = new natural.WordTokenizer();
let model;
let palabras = [];

// Cargar o inicializar el modelo
export async function cargarModelo() {
  if (fs.existsSync('./modeloUrgencia/model.json')) {
    model = await tf.loadLayersModel('file://modeloUrgencia/model.json');
    palabras = JSON.parse(fs.readFileSync('./modeloUrgencia/vocabulario.json'));
  } else {
    model = crearModelo();
  }
}

// Crear red neuronal
function crearModelo() {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [23], units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

  model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
  return model;
}

// Convertir texto a vector numérico simple (bag of words)
function textoAVector(texto) {
  const tokens = tokenizer.tokenize(texto.toLowerCase());
  const vector = new Array(palabras.length).fill(0);
  tokens.forEach(token => {
    const idx = palabras.indexOf(token);
    if (idx !== -1) vector[idx] = 1;
  });
  return vector;
}

// Entrenar modelo con nuevos datos
export async function entrenar(datasets) {
  palabras = Array.from(new Set(datasets.flatMap(d => tokenizer.tokenize(d.texto.toLowerCase()))));
  const xs = tf.tensor2d(datasets.map(d => textoAVector(d.texto)));
  const ys = tf.tensor2d(datasets.map(d => oneHot(d.urgencia)));

  model = crearModelo();
  await model.fit(xs, ys, { epochs: 20 });
  await model.save('file://modeloUrgencia');
  fs.writeFileSync('./modeloUrgencia/vocabulario.json', JSON.stringify(palabras));
}

// Convertir 'alta' | 'media' | 'baja' → one-hot
function oneHot(label) {
  if (label === 'alto') return [1, 0, 0];
  if (label === 'medio') return [0, 1, 0];
  return [0, 0, 1];
}

// Predecir urgencia desde descripción
export async function predecirUrgencia(texto) {
  if (!model) await cargarModelo();
  const vector = textoAVector(texto);
  const input = tf.tensor2d([vector]);
  const prediccion = model.predict(input);
  const resultado = (await prediccion.array())[0];
  const maxIdx = resultado.indexOf(Math.max(...resultado));
  return ['alto', 'medio', 'bajo'][maxIdx];
}
