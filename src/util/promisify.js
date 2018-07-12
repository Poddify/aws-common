export default handler => (...args) =>
    new Promise((resolve, reject) => {
        handler(...args, (err, data) => {
            if (err) return reject(err);

            return resolve(data);
        });
    });