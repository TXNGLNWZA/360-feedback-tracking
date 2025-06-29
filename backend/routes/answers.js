// routes/answers.js
const express = require('express');
const router = express.Router();
const pool = require('../models/db');

router.get('/', async (req, res) => {
  const { evaluator_id, evaluatee_id } = req.query;

  try {
    const relRes = await pool.query(
      `SELECT id FROM evaluation_relations WHERE evaluator_id = $1 AND evaluatee_id = $2`,
      [evaluator_id, evaluatee_id]
    );

    if (relRes.rows.length === 0) {
      return res.json([]); // ยังไม่มี relation
    }

    const relationId = relRes.rows[0].id;

    const answersRes = await pool.query(
      `SELECT question_id, score, answer_text FROM answers WHERE evaluation_relation_id = $1`,
      [relationId]
    );

    res.json(answersRes.rows);
  } catch (err) {
    console.error('Load answers failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

