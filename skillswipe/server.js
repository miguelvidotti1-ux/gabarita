const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'sw_user',
  password: process.env.DB_PASS || 'sw_pass',
  database: process.env.DB_NAME || 'skillswipe'
});

const SECRET = process.env.JWT_SECRET || 'sw_secret';
const SESSION_SIZE = 10;

// MIDDLEWARE
const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Sem token' });
  try { req.userId = jwt.verify(token, SECRET).userId; next(); }
  catch { res.status(401).json({ error: 'Token inválido' }); }
};

// REGISTER
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email, total_xp, current_level',
      [name, email, hash]
    );
    await pool.query('INSERT INTO streaks (user_id) VALUES ($1)', [rows[0].id]);
    const token = jwt.sign({ userId: rows[0].id }, SECRET, { expiresIn: '7d' });
    res.json({ user: rows[0], token });
  } catch (e) { res.status(400).json({ error: e.code === '23505' ? 'Email já existe' : 'Erro' }); }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (!rows.length) return res.status(404).json({ error: 'Usuário não encontrado' });
  if (!await bcrypt.compare(password, rows[0].password_hash))
    return res.status(401).json({ error: 'Senha incorreta' });
  delete rows[0].password_hash;
  const token = jwt.sign({ userId: rows[0].id }, SECRET, { expiresIn: '7d' });
  res.json({ user: rows[0], token });
});

// LISTAR TRILHAS
app.get('/api/trails', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM trails ORDER BY title');
  res.json(rows);
});

// DETALHE DA TRILHA
app.get('/api/trails/:id', async (req, res) => {
  const trail = (await pool.query('SELECT * FROM trails WHERE id = $1', [req.params.id])).rows[0];
  if (!trail) return res.status(404).json({ error: 'Trilha não encontrada' });
  const cards = (await pool.query('SELECT * FROM cards WHERE trail_id = $1 ORDER BY position', [req.params.id])).rows;
  res.json({ ...trail, cards });
});

// NOVOS CARDS: retorna apenas cards NÃO vistos pelo usuário
app.get('/api/trails/:id/cards/new', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const trail = (await pool.query('SELECT * FROM trails WHERE id = $1', [id])).rows[0];
  if (!trail) return res.status(404).json({ error: 'Trilha não encontrada' });

  // Fetch all cards from this trail
  const { rows: trailCards } = await pool.query(
    'SELECT id, position, front_content, back_content FROM cards WHERE trail_id = $1',
    [id]
  );

  // Fetch all other cards from other trails to check for duplicates
  const { rows: otherCards } = await pool.query(
    'SELECT front_content FROM cards WHERE trail_id != $1',
    [id]
  );

  // Fetch seen card IDs for this user
  const { rows: seenRows } = await pool.query(
    'SELECT card_id FROM card_interactions WHERE user_id = $1',
    [userId]
  );
  const seenCardIds = seenRows.map(r => r.card_id);

  const otherFronts = new Set(otherCards.map(c => c.front_content.toLowerCase().trim()));
  const seenFronts = new Set();
  const uniqueCards = [];
  let dupCount = 0;

  for (const card of trailCards) {
    const frontKey = card.front_content.toLowerCase().trim();
    if (seenFronts.has(frontKey) || otherFronts.has(frontKey)) {
      dupCount++;
    } else {
      seenFronts.add(frontKey);
      uniqueCards.push(card);
    }
  }

  const unseenCards = uniqueCards.filter(card => !seenCardIds.includes(card.id));
  const totalCards = uniqueCards.length;
  const seenCards = totalCards - unseenCards.length;
  const remaining = unseenCards.length;

  const shuffled = [...unseenCards].sort(() => Math.random() - 0.5);
  const sessionCards = shuffled.slice(0, SESSION_SIZE);

  res.json({
    trail: { id: trail.id, title: trail.title, color_theme: trail.color_theme, category: trail.category },
    cards: sessionCards,
    stats: {
      totalCards,
      seenCards,
      remaining,
      sessionSize: Math.min(SESSION_SIZE, remaining),
      allSeen: remaining === 0,
      dupCount
    }
  });
});

// SWIPE CARD — registra interação + XP + streak + progresso
app.post('/api/cards/:cardId/swipe', auth, async (req, res) => {
  const { action } = req.body;
  const { cardId } = req.params;
  const userId = req.userId;

  if (!['known', 'review'].includes(action))
    return res.status(400).json({ error: 'Action deve ser "known" ou "review"' });

  const card = (await pool.query('SELECT trail_id FROM cards WHERE id = $1', [cardId])).rows[0];
  if (!card) return res.status(404).json({ error: 'Card não encontrado' });

  // Registrar interação (mesmo que já tenha visto, atualiza)
  await pool.query(
    'INSERT INTO card_interactions (user_id, card_id, action) VALUES ($1,$2,$3)',
    [userId, cardId, action]
  );

  let xpGained = 0;
  if (action === 'known') {
    xpGained = 10;
    await pool.query('UPDATE users SET total_xp = total_xp + 10, current_level = (total_xp + 10) / 100 + 1 WHERE id = $1', [userId]);
    await pool.query(
      `INSERT INTO user_progress (user_id, trail_id, cards_completed, xp_earned, status)
       VALUES ($1, $2, 1, 10, 'in_progress')
       ON CONFLICT (user_id, trail_id) DO UPDATE SET cards_completed = user_progress.cards_completed + 1, xp_earned = user_progress.xp_earned + 10`,
      [userId, card.trail_id]
    );
  }

  // STREAK
  const today = new Date().toISOString().split('T')[0];
  const s = (await pool.query('SELECT * FROM streaks WHERE user_id = $1', [userId])).rows[0];
  if (!s) {
    await pool.query('INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date) VALUES ($1,1,1,$2)', [userId, today]);
  } else if (s.last_active_date?.toISOString?.().split('T')[0] !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const streak = s.last_active_date == yesterday ? s.current_streak + 1 : 1;
    await pool.query('UPDATE streaks SET current_streak=$1, longest_streak=GREATEST(longest_streak,$1), last_active_date=$2 WHERE user_id=$3', [streak, today, userId]);
  }

  // Verificar se completou a trilha
  const prog = (await pool.query(
    'SELECT up.cards_completed, t.total_cards FROM user_progress up JOIN trails t ON t.id=up.trail_id WHERE up.user_id=$1 AND up.trail_id=$2',
    [userId, card.trail_id]
  )).rows[0];
  let trailCompleted = false;
  if (prog && prog.cards_completed >= prog.total_cards) {
    await pool.query("UPDATE user_progress SET status='completed', completed_at=NOW() WHERE user_id=$1 AND trail_id=$2", [userId, card.trail_id]);
    trailCompleted = true;
  }

  const user = (await pool.query('SELECT total_xp, current_level FROM users WHERE id=$1', [userId])).rows[0];
  const streak = (await pool.query('SELECT current_streak, longest_streak FROM streaks WHERE user_id=$1', [userId])).rows[0];
  res.json({ xpGained, trailCompleted, user, streak });
});

// RESETAR TRILHA — apaga interações e progresso
app.post('/api/trails/:id/reset', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  await pool.query('DELETE FROM card_interactions WHERE user_id=$1 AND card_id IN (SELECT id FROM cards WHERE trail_id=$2)', [userId, id]);
  await pool.query("UPDATE user_progress SET cards_completed=0, status='not_started', completed_at=NULL WHERE user_id=$1 AND trail_id=$2", [userId, id]);
  res.json({ message: 'Resetado com sucesso' });
});

// PERFIL
app.get('/api/profile', auth, async (req, res) => {
  const user = (await pool.query('SELECT id, name, email, total_xp, current_level FROM users WHERE id=$1', [req.userId])).rows[0];
  const streak = (await pool.query('SELECT current_streak, longest_streak FROM streaks WHERE user_id=$1', [req.userId])).rows[0];
  const progress = (await pool.query('SELECT trail_id, cards_completed, xp_earned, status FROM user_progress WHERE user_id=$1', [req.userId])).rows;
  res.json({ ...user, streak: streak || {}, progress });
});

// STATS GLOBAIS — cards vistos em TODAS as trilhas
app.get('/api/stats/global', auth, async (req, res) => {
  const userId = req.userId;

  // Fetch all trails
  const { rows: trails } = await pool.query('SELECT * FROM trails ORDER BY title');

  // Fetch all cards
  const { rows: allCards } = await pool.query('SELECT * FROM cards');

  // Fetch seen card IDs for this user
  const { rows: seenRows } = await pool.query(
    'SELECT card_id FROM card_interactions WHERE user_id = $1',
    [userId]
  );
  const seenCardIds = seenRows.map(r => r.card_id);

  let grandTotal = 0;
  let grandSeen = 0;

  const perTrail = trails.map(trail => {
    const trailCards = allCards.filter(c => c.trail_id === trail.id);
    const otherCards = allCards.filter(c => c.trail_id !== trail.id);

    const otherFronts = new Set(otherCards.map(c => c.front_content.toLowerCase().trim()));
    const seenFronts = new Set();
    const uniqueCards = [];

    for (const card of trailCards) {
      const frontKey = card.front_content.toLowerCase().trim();
      if (!seenFronts.has(frontKey) && !otherFronts.has(frontKey)) {
        seenFronts.add(frontKey);
        uniqueCards.push(card);
      }
    }

    const total = uniqueCards.length;
    const seen = uniqueCards.filter(c => seenCardIds.includes(c.id)).length;
    const remaining = total - seen;

    grandTotal += total;
    grandSeen += seen;

    return {
      id: trail.id,
      title: trail.title,
      category: trail.category,
      color_theme: trail.color_theme,
      total,
      seen,
      remaining
    };
  });

  res.json({
    totalCards: grandTotal,
    seenCards: grandSeen,
    unseenCards: grandTotal - grandSeen,
    perTrail
  });
});

app.listen(3000, () => console.log('SkillSwipe API na porta 3000'));
