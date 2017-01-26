const {assert} = require('chai');
const {jsdom} = require('jsdom');

const {dom, rule, ruleset, out, type} = require('../index');


describe('LHS', function () {
    it('makes a dom() LHS that rule() tolerates', function () {
        const lhs = dom('smoo');
        const rhs = type('bar');
        rule(lhs, rhs);
    });

    it('finds max-scoring nodes of a type', function () {
        const doc = jsdom(`
            <p></p>
            <div></div>
            <div></div>
        `);
        const rules = ruleset(
            rule(dom('p'), type('smoo').score(2)),
            rule(dom('div'), type('smoo').score(5)),
            rule(type('smoo').max(), out('best'))
        );
        const facts = rules.against(doc);
        const best = facts.get('best');
        assert.equal(best.length, 2);
        assert.equal(best[0].element.nodeName, 'DIV');
        assert.equal(best[1].element.nodeName, 'DIV');
    });

    it('can have its type overridden', function () {
        const doc = jsdom('<p></p>');
        const rules = ruleset(
            rule(dom('p'), type('bar')),
            rule(type('foo').type('bar'), out('best'))
        );
        const facts = rules.against(doc);
        const best = facts.get('best');
        assert.equal(best.length, 1);
    });
});