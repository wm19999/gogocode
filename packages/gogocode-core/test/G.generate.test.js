const $ = require('../index');
const config = require('./config');
const jc1 = require('./code/simple1');
const jc2 = require('./code/simple2');
const hc1 = require('./code/simple1.html');

test('$.generate: simple js code', () => {
    expect(()=>{
        $('var a = 1;').generate();
    }).not.toThrow();
})
test('$.generate: this[0] is null', () => {
    expect(()=>{
       const G = $('var a = 1;');
       G[0] = null
       G.generate();
    }).toThrow();
})

test('$.generate:simple js code 1', () => {
    const str = $('var a = 1;').generate();
    expect(str).toBe('var a = 1;');
})
test('$.generate:simple js code 2', () => {
    const str =$('function a() {}').generate();
    expect(str).toBe('function a() {}');
})
test('$.generate: append result object should not throw', () => {
     const CODE = `
    function a(){
        var a = 1;
    }
    `;
    const code = $(CODE).append($('var a = 1;').node).generate()
    expect(code.indexOf('var a = 1;') > -1).toBeTruthy();
})
test('$.generate: simple html code', () => {
    expect(()=>{
        $('<div class="test" ><a href=""/></div>',config.html).generate();
    }).not.toThrow();
})
test('$.generate: simple html code 1 result should be ok', () => {
    const str = $('<div class="test" >test</div>',config.html).generate();
    expect(str).toBe('<div class=\"test\">test</div>');
})
test('$.generate: simple1 html code result should be ok', () => {
    const str = $(hc1,config.html).generate();
    expect(str.length > 1).toBeTruthy();
})
test('$.generate: simple1 html code result should be ok', () => {
    const res = $(`
        import a from 'a';console.log('get A');var b = console.log();console.log.bind();var c = console.log;console.log = func;
    `)
    .replace(`var $_$ = console.log()`, `var $_$ = void 0;`)
    .replace(`var $_$ = console.log`, `var $_$ = function(){};`)
    .find(`console.log()`)
    .remove()
    .generate({ isPretty: true });
    expect(res == `import a from "a";
var b = void 0;
console.log.bind();
var c = function() {};
console.log = func;`).toBeTruthy();
})
// todo magix attr
// test('$.generate: simple html code 2 {{ test', () => {
    // const code = `<span class="{{= body_stateColor(this,crowd) }}" {{= body_updateState(this,crowd) }}>{{= body_stateText(this,crowd) }}</span>`;
    // const str = $(code, config.html).generate();
    // expect(str).toBe('<span class="{{= body_stateColor(this,crowd) }}" {{= body_updateState(this,crowd) }}>{{= body_stateText(this,crowd) }}</span>');
// })

test('$.generate: simple1 html code result should be ok', () => {
    const res = $(`
        <s-end
        a:elif="{{gameSta
            
            tus === 3}}"
        pic="{{level.p}}"
        last="{{(level.i + 1) >= levelTotal}}"
        award="{{award}}"
        nextAward="{{nextAward}}"
        lastAward="{{lastAward}}"
        used="{{used}}"
        onUse="handleEndUseTap"
        onNext="handleEndNextTap"
    />
    `, { parseOptions: { language: 'html' } } )
    .generate();
    expect(!!res.match(`/>`)).toBeTruthy();
})
