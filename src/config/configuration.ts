type Config = {
  password: {
    saltOrRounds: number;
  };
  token: {
    secret: string;
    expiresIn: string;
  };
  database: {
    url: string;
    name: string;
  };
};

export default (): Config => ({
  password: {
    saltOrRounds: +process.env.PASSWORD_SALT_OR_ROUNDS || 10,
  },
  token: {
    secret: process.env.TOKEN_SECRET || 'secret',
    expiresIn: process.env.TOKEN_EXPIRES_IN || '7d',
  },
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017',
    name: process.env.DATABASE_NAME || 'messaging-app',
  },
});
