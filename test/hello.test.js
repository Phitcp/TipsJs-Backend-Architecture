const { hello } = require('../src/hello');

it('Should return hello', () => {
  const result = hello();
  expect(result).to.equal('Hello');
});
