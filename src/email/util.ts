// 拼接 SMTP 服务器地址
function genEmailSmtpPServer() {
  const from = process.env.EMAIL_FROM || "";
  const host = process.env.EMAIL_HOST || "";
  const port = process.env.EMAIL_PORT || "";
  const password = process.env.EMAIL_PASSWORD || "";

  const username = from.split("@")[0];

  const server = `smtp://${username}:${password}@${host}:${port}`;
  // 格式如 smtp://huashuiai_noreply:xxxxxxxx@smtp.163.com:25

  // console.log('Email Server:', server)
  return server;
}
