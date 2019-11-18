const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  var hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx("login")
      .insert({
        hash: hash,
        email: email
      })
      .then(() => {
        trx("users")
          .insert({
            name: name,
            email: email,
            time: new Date()
          })
          .returning("*")
          .then(user => {
            res.json(user[0]);
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch(err => res.status(400).json("unable to register"));
  });
};

module.exports = {
  handleRegister: handleRegister
};
