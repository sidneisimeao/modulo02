module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  database: 'gobarber',
  username: 'postgres',
  password: 'docker',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
