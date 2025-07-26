import express from 'express';
import { entrenar } from '../ai/iaUrgencia.js';

export async function entrenarModelo(req, res) {
  try {
    const { data } = req.body; // array de { texto, urgencia }
    await entrenar(data);
    res.json({ ok: true, message: 'Modelo entrenado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function predecirUrgenciaManual(req, res) {
  try {
    const { texto } = req.body;
    const urgencia = await predecirUrgencia(texto);
    res.json({ texto, urgencia });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}