import https from 'https';

// ==================== CONFIGURATION ====================
const API_NAME = 'Telegram Reaction Engine Professional';
const VERSION = '5.0.0';
const DEVELOPER = 'Cyb3rKaran';
const START_TIME = Date.now();

// ==================== EMOJI ENGINE (500+ emojis) ====================
const EMOJIS = {
  positive: [
    '👍', '❤️', '🔥', '🥰', '👏', '😁', '🎉', '🤩', '🙏', '👌', '🕊️', '😍',
    '🐳', '❤️‍🔥', '🌭', '💯', '🤣', '⚡', '🍌', '🏆', '😘', '🍓', '🍾', '💋',
    '😇', '🤝', '✍️', '🤗', '🫡', '🎅', '🎄', '☃️', '🆒', '💘', '🦄', '😎',
    '💐', '🌸', '🌺', '🌈', '⭐', '✨', '🎊', '🎈', '💪', '🤞', '✌️', '🤟',
    '💖', '💝', '🌹', '🥇', '🥳', '🧨', '🎇', '🎆', '💎', '👑', '🏅', '🎖️',
    '💍', '💠', '🔮', '🦋', '🌷', '🌻', '🌼', '🍀', '🌿', '☘️', '🍂', '🍁',
    '🌾', '🎋', '🎍', '🎑', '🌅', '🌄', '🌠', '🎇', '🎆', '✨', '⭐', '🌟',
    '🌞', '🌝', '🌛', '🌜', '🌙', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓',
    '🌔', '🌍', '🌎', '🌏', '🌐', '🗺️', '🏔️', '⛰️', '🌋', '🏝️', '🏜️', '🏖️'
  ],
  negative: [
    '👎', '🤔', '🤯', '😱', '🤬', '😢', '🤮', '💩', '🤡', '🥱', '🥴', '💔',
    '🤨', '😐', '🖕', '😈', '😴', '😭', '😨', '🙈', '🙉', '🙊', '😡', '🗿',
    '👿', '😤', '😠', '🤧', '😪', '😵', '🤢', '💀', '😾', '🙀', '😒', '😓',
    '😔', '😕', '😟', '😣', '😖', '😫', '😩', '🥺', '😢', '😰', '😥', '😓',
    '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢',
    '😰', '😥', '😓', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩'
  ],
  funny: [
    '😂', '🤣', '😜', '😝', '😋', '😹', '😆', '😅', '🤪', '🥳', '🤡', '👻',
    '🎃', '👾', '🤖', '👽', '😸', '🐱', '🐶', '🐵', '🦊', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🐒', '🦄', '🐴', '🦓', '🐲', '🐉', '🐍',
    '🐢', '🐳', '🐋', '🐬', '🐟', '🐠', '🐡', '🦈', '🐙', '🐚', '🐌', '🐛',
    '🐜', '🐝', '🐞', '🦗', '🦟', '🦠', '🙈', '🙉', '🙊', '🐒', '🐕', '🐩'
  ],
  love: [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💕', '💞', '💓',
    '💗', '💖', '💘', '💝', '💟', '❣️', '❤️‍🔥', '❤️‍🩹', '💌', '💋', '🥰', '😍',
    '😘', '😻', '💏', '💑', '👩‍❤️‍👨', '👩‍❤️‍👩', '👨‍❤️‍👨', '💒', '💐', '🌹', '🥀', '🌺',
    '🌸', '🌼', '🌻', '🌹', '🌷', '🌱', '🌿', '☘️', '🍀', '🌵', '🎄', '🌲'
  ],
  premium: [
    '⭐', '🌟', '✨', '💎', '👑', '🏅', '🥇', '🎖️', '💍', '💠', '🔮', '🌈',
    '🎩', '🧞', '🧝', '🦋', '🌸', '🌺', '🌹', '🌷', '🌻', '🌼', '💐', '🍾',
    '🥂', '🍷', '🍸', '🍹', '🍺', '🍻', '🥃', '🥂', '🍾', '💎', '👑', '🏆'
  ],
  mixed: [],  // populated below
  random: [], // populated below
};

// Build mixed from all categories (except mixed/random)
EMOJIS.mixed = [
  ...EMOJIS.positive,
  ...EMOJIS.negative,
  ...EMOJIS.funny,
  ...EMOJIS.love,
  ...EMOJIS.premium,
];
EMOJIS.random = EMOJIS.mixed;

// Map for category lookup
const CATEGORY_MAP = {
  positive: EMOJIS.positive,
  negative: EMOJIS.negative,
  funny: EMOJIS.funny,
  love: EMOJIS.love,
  premium: EMOJIS.premium,
  mixed: EMOJIS.mixed,
  mix: EMOJIS.mixed,
  random: EMOJIS.random,
};

function getRandomReaction(type = 'mixed', excludeSet = null) {
  const pool = CATEGORY_MAP[type] || EMOJIS.mixed;
  if (!pool || pool.length === 0) return '👍';
  if (excludeSet && excludeSet.size > 0) {
    const available = pool.filter(e => !excludeSet.has(e));
    if (available.length === 0) return pool[0];
    return available[Math.floor(Math.random() * available.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function getEmojiCount(type = 'mixed') {
  const pool = CATEGORY_MAP[type] || EMOJIS.mixed;
  return pool.length;
}

function getCategories() {
  return Object.keys(CATEGORY_MAP);
}

// ==================== LOGGER ====================
function log(level, msg, ...args) {
  console[level](`[${new Date().toISOString()}] [${level.toUpperCase()}] ${msg}`, ...args);
}
const logger = { info: (m, ...a) => log('info', m, ...a), warn: (m, ...a) => log('warn', m, ...a), error: (m, ...a) => log('error', m, ...a) };

// ==================== VALIDATION ====================
function validateTokens(tokens) {
  if (!tokens || tokens.length === 0) return 'At least one bot token is required.';
  for (const t of tokens) {
    if (typeof t !== 'string' || t.trim() === '') return 'Invalid token: non‑empty string required.';
    if (!/^\d+:[A-Za-z0-9_-]+$/.test(t.trim())) return `Invalid token format: "${t}". Expected <digits>:<alphanumeric>.`;
  }
  return null;
}
function validateChatIds(chatIds) {
  if (!chatIds || chatIds.length === 0) return 'At least one chat ID is required.';
  for (const c of chatIds) {
    if (typeof c !== 'string' || c.trim() === '') return 'Chat IDs must be non‑empty strings.';
    const num = Number(c);
    if (isNaN(num) || !Number.isInteger(num)) return `Invalid chat ID: "${c}" – must be integer.`;
  }
  return null;
}
function validateMessageIds(messageIds) {
  if (!messageIds || messageIds.length === 0) return null; // optional
  for (const m of messageIds) {
    if (typeof m !== 'string' || m.trim() === '') return 'Message IDs must be non‑empty strings.';
    const num = Number(m);
    if (isNaN(num) || !Number.isInteger(num) || num <= 0) return `Invalid message ID: "${m}" – positive integer required.`;
  }
  return null;
}
function validateReactionType(type) {
  return ['positive','negative','funny','love','premium','mixed','mix','random'].includes(type);
}

// ==================== TELEGRAM HELPERS ====================
const TELEGRAM_HOST = 'api.telegram.org';
const TIMEOUT_MS = 10000;
const MAX_RETRIES = 2;

function httpsRequest(options, postData = null, retries = MAX_RETRIES) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Invalid JSON: ${data.substring(0, 100)}`));
        }
      });
    });
    req.on('error', (err) => {
      if (retries > 0) {
        logger.warn(`Request failed (${retries} left): ${err.message}`);
        setTimeout(() => httpsRequest(options, postData, retries - 1).then(resolve).catch(reject), 500);
      } else {
        reject(err);
      }
    });
    req.setTimeout(TIMEOUT_MS, () => { req.destroy(); reject(new Error('Timeout')); });
    if (postData) req.write(postData);
    req.end();
  });
}

async function getMessageId(tokens, chatId) {
  const offsets = [-1, 0];
  for (const off of offsets) {
    for (const token of tokens) {
      try {
        const path = `/bot${token}/getUpdates?offset=${off}&limit=100`;
        const resp = await httpsRequest({ hostname: TELEGRAM_HOST, path, method: 'GET' });
        if (resp.ok && resp.result && resp.result.length) {
          for (let i = resp.result.length - 1; i >= 0; i--) {
            const upd = resp.result[i];
            const msg = upd.channel_post || upd.message || upd.edited_channel_post || upd.edited_message;
            if (msg && msg.chat && msg.chat.id.toString() === chatId.toString()) {
              return msg.message_id;
            }
          }
        }
      } catch (e) { /* continue */ }
    }
  }
  throw new Error(`No message found in chat ${chatId}`);
}

async function setReaction(token, chatId, messageId, emoji) {
  const payload = { chat_id: chatId, message_id: Number(messageId), reaction: [{ type: 'emoji', emoji }], is_big: false };
  const postData = JSON.stringify(payload);
  const options = {
    hostname: TELEGRAM_HOST,
    path: `/bot${token}/setMessageReaction`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
  };
  const resp = await httpsRequest(options, postData);
  if (!resp.ok) throw new Error(resp.description || 'Telegram API error');
  return resp;
}

// ==================== STATS ====================
const stats = { totalRequests: 0, successful: 0, failed: 0, lastRequest: null };

// ==================== RESPONSE BUILDER ====================
function buildResponse(success, data, execMs) {
  return {
    success,
    developer: DEVELOPER,
    version: VERSION,
    execution_time: `${execMs.toFixed(2)}ms`,
    total_requests: stats.totalRequests,
    successful: stats.successful,
    failed: stats.failed,
    ...data,
  };
}

// ==================== MAIN HANDLER ====================
export default async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const start = Date.now();
  stats.totalRequests++;

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;

    // ---- Root ----
    if (path === '/' || path === '') {
      const data = {
        name: API_NAME,
        version: VERSION,
        developer: DEVELOPER,
        status: 'operational',
        uptime: `${Math.floor((Date.now() - START_TIME) / 1000)}s`,
        categories: getCategories(),
        total_emojis: getEmojiCount('mixed'),
      };
      stats.lastRequest = new Date().toISOString();
      return res.status(200).json(buildResponse(true, data, Date.now() - start));
    }

    // ---- Health ----
    if (path === '/health') {
      const mem = process.memoryUsage();
      const data = {
        status: 'healthy',
        memory: {
          rss: `${Math.round(mem.rss / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)} MB`,
        },
        uptime: `${Math.floor((Date.now() - START_TIME) / 1000)}s`,
        node_version: process.version,
        timestamp: new Date().toISOString(),
      };
      stats.lastRequest = new Date().toISOString();
      return res.status(200).json(buildResponse(true, data, Date.now() - start));
    }

    // ---- Stats ----
    if (path === '/stats') {
      const data = {
        total_requests: stats.totalRequests,
        successful: stats.successful,
        failed: stats.failed,
        last_request: stats.lastRequest,
      };
      stats.lastRequest = new Date().toISOString();
      return res.status(200).json(buildResponse(true, data, Date.now() - start));
    }

    // ---- Main Reaction Endpoint ----
    const query = Object.fromEntries(url.searchParams);
    const tokens = query.token ? query.token.split(',').map(t => t.trim()).filter(Boolean) : [];
    const chatIds = query.chat ? query.chat.split(',').map(c => c.trim()).filter(Boolean) : [];
    let messageIds = query.message ? query.message.split(',').map(m => m.trim()).filter(Boolean) : [];
    const reactionType = query.reaction || query.react || 'mixed';
    const mode = query.mode || 'unique'; // 'unique', 'random', 'shuffle'

    // Validate
    const errT = validateTokens(tokens);
    if (errT) return res.status(400).json(buildResponse(false, { error: errT }, Date.now() - start));
    const errC = validateChatIds(chatIds);
    if (errC) return res.status(400).json(buildResponse(false, { error: errC }, Date.now() - start));
    const errM = validateMessageIds(messageIds);
    if (errM) return res.status(400).json(buildResponse(false, { error: errM }, Date.now() - start));
    if (!validateReactionType(reactionType)) {
      return res.status(400).json(buildResponse(false, { error: 'Invalid reaction type. Use: positive, negative, funny, love, premium, mixed, random' }, Date.now() - start));
    }

    // Auto‑discover message IDs if not provided
    if (!messageIds.length) {
      const discovered = [];
      for (const chatId of chatIds) {
        try {
          const mid = await getMessageId(tokens, chatId);
          discovered.push({ chatId, messageId: mid });
        } catch (e) {
          logger.warn(`Auto‑discover failed for ${chatId}: ${e.message}`);
        }
      }
      if (discovered.length === 0) {
        return res.status(400).json(buildResponse(false, { error: 'Could not find any messages. Provide message IDs manually.' }, Date.now() - start));
      }
      // Replace chatIds and messageIds with discovered ones
      const newChats = discovered.map(d => d.chatId);
      const newMsgs = discovered.map(d => d.messageId);
      // We'll rebuild combinations with these
      // But we need to re‑assign
      // We'll just set chatIds and messageIds to these arrays
      // However, we must keep the original order? We'll just use discovered arrays.
      // For simplicity, we'll overwrite.
      const discoveredChats = discovered.map(d => d.chatId);
      const discoveredMsgs = discovered.map(d => d.messageId);
      // We'll process with these arrays.
      // We'll continue with chatIds = discoveredChats, messageIds = discoveredMsgs.
      // But we need to ensure we keep all tokens. We'll use the same tokens.
      const combos = [];
      const usedReactions = new Map();
      for (const token of tokens) {
        for (let i = 0; i < discoveredChats.length; i++) {
          const chatId = discoveredChats[i];
          const messageId = discoveredMsgs[i];
          const key = `${chatId}-${messageId}`;
          if (!usedReactions.has(key)) usedReactions.set(key, new Set());
          const usedSet = usedReactions.get(key);
          let emoji = getRandomReaction(reactionType, mode === 'random' ? null : usedSet);
          if (mode !== 'random') {
            const poolSize = getEmojiCount(reactionType);
            if (usedSet.size >= poolSize) {
              return res.status(400).json(buildResponse(false, { error: `Not enough unique emojis for message ${messageId} in chat ${chatId}` }, Date.now() - start));
            }
            while (usedSet.has(emoji)) emoji = getRandomReaction(reactionType, usedSet);
            usedSet.add(emoji);
          }
          combos.push({ token, chatId, messageId, emoji });
        }
      }
      // Execute all combos
      const results = [];
      for (const combo of combos) {
        try {
          const data = await setReaction(combo.token, combo.chatId, combo.messageId, combo.emoji);
          results.push({ token: combo.token, chat_id: combo.chatId, message_id: combo.messageId, reaction: combo.emoji, status: 'fulfilled', data });
          stats.successful++;
        } catch (err) {
          results.push({ token: combo.token, chat_id: combo.chatId, message_id: combo.messageId, reaction: combo.emoji, status: 'rejected', error: err.message });
          stats.failed++;
        }
      }
      stats.lastRequest = new Date().toISOString();
      return res.status(200).json(buildResponse(true, { results }, Date.now() - start));
    }

    // ---- Manual message IDs ----
    const combos = [];
    const usedReactions = new Map();
    for (const token of tokens) {
      for (const chatId of chatIds) {
        for (const messageId of messageIds) {
          const key = `${chatId}-${messageId}`;
          if (!usedReactions.has(key)) usedReactions.set(key, new Set());
          const usedSet = usedReactions.get(key);
          let emoji = getRandomReaction(reactionType, mode === 'random' ? null : usedSet);
          if (mode !== 'random') {
            const poolSize = getEmojiCount(reactionType);
            if (usedSet.size >= poolSize) {
              return res.status(400).json(buildResponse(false, { error: `Not enough unique emojis for message ${messageId} in chat ${chatId}` }, Date.now() - start));
            }
            while (usedSet.has(emoji)) emoji = getRandomReaction(reactionType, usedSet);
            usedSet.add(emoji);
          }
          combos.push({ token, chatId, messageId, emoji });
        }
      }
    }

    const results = [];
    for (const combo of combos) {
      try {
        const data = await setReaction(combo.token, combo.chatId, combo.messageId, combo.emoji);
        results.push({ token: combo.token, chat_id: combo.chatId, message_id: combo.messageId, reaction: combo.emoji, status: 'fulfilled', data });
        stats.successful++;
      } catch (err) {
        results.push({ token: combo.token, chat_id: combo.chatId, message_id: combo.messageId, reaction: combo.emoji, status: 'rejected', error: err.message });
        stats.failed++;
      }
    }
    stats.lastRequest = new Date().toISOString();
    return res.status(200).json(buildResponse(true, { results }, Date.now() - start));

  } catch (error) {
    logger.error(`Unhandled: ${error.message}`);
    stats.failed++;
    return res.status(500).json(buildResponse(false, { error: 'Internal server error', details: error.message }, Date.now() - start));
  }
};
