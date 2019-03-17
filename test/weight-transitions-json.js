const assert = require('assert');
const fs = require('fs');
const {describe, it} = require('mocha');
const path = require('path');

describe('weight-transitions.json', function() {
  const weightTransitionsJson = fs.readFileSync(path.join(__dirname, '../src/weight-transitions.json')).toString();

  it('should be a JSON file', function() {
    JSON.parse(weightTransitionsJson);
  });

  it('should be a valid schema', function() {
    const jsonData = JSON.parse(weightTransitionsJson);
    assert(jsonData.weightTransitions instanceof Array);

    jsonData.weightTransitions.forEach(weightTransition => {
      assert.strictEqual(typeof weightTransition.date, 'string');
      assert(/^\d{4}-\d{2}-\d{2}$/.test(weightTransition.date));
      assert.strictEqual(typeof weightTransition.weight, 'number');
      assert(weightTransition.weight >= 0);
      // Maybe I will not be heavier than KONISHIKI.
      assert(weightTransition.weight < 285);
      assert.strictEqual(typeof weightTransition.memo, 'string');
    });
  });
});
