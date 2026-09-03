module.exports = async function handler(req, res) {
  // 設定 CORS 標頭
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 完全不碰資料庫、不跑商業邏輯，秒回 200 OK 喚醒伺服器
  return res.status(200).json({ success: true, message: 'pong' });
};
