const fs = require('fs');
const path = require('path');

fs.unlinkSync(path.resolve(__dirname, './bind-generated.ts'));

function generateEventMapEntries() {
  const eventMapsMap = Object.create(null);

  const libDOM = fs.readFileSync(
    path.resolve(__dirname, '../node_modules/typescript/lib/lib.dom.d.ts'),
    'utf-8',
  );

  libDOM.split(' ').forEach((token) => {
    if (token.endsWith('EventMap')) {
      const targetType = token.substr(0, token.length - 8);
      eventMapsMap[targetType] = token;
    }
  });
  // sort the types by length, so that more specific types
  // get matched first (e.g. HTMLElement and HTMLFrameSetElement)
  const targetAndMapEntries = Object.entries(eventMapsMap).sort(
    (a, b) => b[0].length - a[0].length,
  );

  return targetAndMapEntries;
}

const importStatements = `import { UnbindFn, Binding } from './types'`;

const bindBody = `{
  target.addEventListener(type, listener, options);

  return function unbind() {
    target.removeEventListener(type, listener, options);
  };
}`;

const generateOverload = (target, eventMap, hasBody) => {
  const [typeConstraint, event] =
    typeof eventMap === 'string' ? [`keyof ${eventMap}`, `${eventMap}[Type]`] : ['string', 'Event'];
  const end = hasBody ? `UnbindFn ${bindBody}` : `UnbindFn;`;
  return `export function bind<Target extends ${target}, Type extends ${typeConstraint}>(target: Target, { type, listener, options }: Binding<Type, ${event}>): ${end}`;
};

const implementationAndFallback = [
  generateOverload('EventTarget', null, false),
  generateOverload('EventTarget', null, true),
];

const overloads = generateEventMapEntries().map((entry) => generateOverload(...entry, false));
const result = [importStatements, '', ...overloads, ...implementationAndFallback].join('\n');

fs.writeFileSync(path.resolve(__dirname, './bind-generated.ts'), result);
