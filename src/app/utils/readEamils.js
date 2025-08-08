import Imap from 'node-imap';

export async function readEmails(email, app_password) {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: email,
      password: app_password,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false,
      },
      
    });

    const replies = [];

    function openInbox(cb) {
      imap.openBox('INBOX', true, cb); // Open inbox in read-only mode
    }

    imap.once('ready', () => {
      openInbox((err, box) => {
        if (err) return reject(err);

        imap.search(['ALL'], (err, results) => {
          if (err) return reject(err);

          const last10 = results.slice(-10);

          if (last10.length === 0) {
            imap.end();
            return resolve([]);
          }

          const fetch = imap.fetch(last10, {
            bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)', 'TEXT'],
          });

          let current = {};

          fetch.on('message', (msg) => {
            current = {};

            msg.on('body', (stream, info) => {
              let buffer = '';

              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
              });

              stream.on('end', () => {
                if (info.which === 'TEXT') {
                  current.body = buffer;
                } else if (
                  info.which &&
                  info.which.toLowerCase().includes('header.fields')
                ) {
                  const lines = buffer.split(/\r?\n/);
                  lines.forEach((line) => {
                    if (line.toLowerCase().startsWith('from:')) {
                      current.from = line.substring(5).trim();
                    } else if (line.toLowerCase().startsWith('subject:')) {
                      current.subject = line.substring(8).trim();
                    } else if (line.toLowerCase().startsWith('date:')) {
                      current.date = line.substring(5).trim();
                    }
                  });
                }
              });
            });

            msg.once('end', () => {
              replies.push(current);
            });
          });

          fetch.once('error', (err) => {
            console.error('Fetch error:', err);
            reject(err);
          });

          fetch.once('end', () => {
            imap.end();
          });
        });
      });
    });

    imap.once('error', (err) => {
      console.error('IMAP error:', err);
      reject(err);
    });

    imap.once('end', () => {
      resolve(replies);
    });

    imap.connect();
  });
}
