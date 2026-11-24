const publicUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  accountType: user.accountType,
  status: user.status || 'active',
});

module.exports = publicUser;