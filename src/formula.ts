'use strict';

import grammar, {LispSemantics} from './lisp.ohm-bundle';

const semantics: LispSemantics = grammar.createSemantics();

const isArray = Array.isArray;

const evalLisp = (x: any, env: Env) => (x && x.eval ? x.eval(env) : x);

const macroExpand = (x: any, env: Env) => {
  if (x instanceof Lambda && x.isMacro) {
    return x.eval(env);
  }

  return x;
};

const unquote = (values: any, env: Env): any[] => {
  if (!isArray(values)) {
    return values;
  }

  const result = [];

  for (const value of values) {
    if (!isArray(value)) {
      result.push(unquote(value, env));
      continue;
    }

    if (value[0].name === 'unquote') {
      result.push(evalLisp(value[1], env));
    } else if (value[0].name === 'splice-unquote') {
      result.push(...evalLisp(value[1], env));
    } else {
      result.push(new List(unquote(value, env)));
    }
  }

  return result;
};

class Env {

  env: any;

  constructor() {
    this.env = {};
  }

  bind(name: string, value: any) {
    this.env[name] = value;
  }

  get(name: string) {
    if (!this.env[name]) {
      throw new Error(`${name} not in env`);
    }

    return this.env[name];
  }

  // this could be replaced with parentEnv and "looking up" if something is not found
  duplicate() {
    const dupEnv = new Env();

    Object.entries(this.env).forEach(([key, value]) => {
      dupEnv.bind(key, value);
    });

    return dupEnv;
  }
}

class List {

  args: any[];

  constructor(args: any[]) {
    this.args = args;
  }

  eval(env: Env) {
    const name = this.args[0];
    let args = this.args.slice(1);

    const fun = env.get(name);

    const isLambda = fun instanceof Lambda;
    const isMacro = isLambda && fun.isMacro;

    if (isMacro) {
      return fun.eval(env, args);
    }

    args = args.map(arg => evalLisp(arg, env)).map(arg => macroExpand(arg, env));

    if (isLambda) {
      return fun.eval(env, args);
    }

    return fun(...args);
  }

  toString() {
    return '(' + this.args.map(arg => arg.toString()).join(' ') + ')';
  }
}

class Fn {

  bindNames: string[];
  body: any;

  constructor(bindNames: string[], body: any) {
    this.bindNames = bindNames;
    this.body = body;
  }

  eval() {
    return new Lambda(this.bindNames, this.body);
  }

  toString() {
    const argsList = this.bindNames.map(b => b.toString()).join(' ');
    return `(fn (${argsList}) ${this.body.toString()}))`;
  }
}

class Macro {

  bindNames: string[];
  body: any;

  constructor(bindNames: string[], body: any) {
    this.bindNames = bindNames;
    this.body = body;
  }

  eval() {
    return new Lambda(this.bindNames, this.body, true);
  }

  toString() {
    const argsList = this.bindNames.map(b => b.toString()).join(' ');
    return `(macro (${argsList}) ${this.body.toString()}))`;
  }
}

class Lambda {

  bindNames: string[];
  body: any;
  isMacro: boolean;

  constructor(bindNames: string[], body: any, isMacro = false) {
    this.bindNames = bindNames;
    this.body = body;
    this.isMacro = isMacro;
  }

  eval(env: Env, args: any[] = []) {
    const localEnv = env.duplicate();

    args.forEach((arg, i) => {
      const bindName = this.bindNames[i].toString();
      const value = this.isMacro ? arg : evalLisp(arg, env);

      localEnv.bind(bindName, value);
    });

    const evaled = this.body.eval(localEnv, args);

    if (!this.isMacro) {
      return evaled;
    }

    const list = new List(evaled);
    const stringified = list.toString();

    return evalLisp(stringified, env);
  }
}

class Def {

  name: string;
  arg: any;

  constructor(name: string, arg: any) {
    this.name = name;
    this.arg = arg;
  }

  eval(env: Env) {
    const evaled = evalLisp(this.arg, env);
    env.bind(this.name, evaled);
  }

  toString() {
    return `(def ${this.name} ${this.arg})`;
  }
}

class Sym {

  name: string;

  constructor(name: string) {
    this.name = name;
  }

  eval(env: Env) {
    return env.get(this.name);
  }

  toString() {
    return this.name;
  }
}

class Quote {

  value: any;

  constructor(value: any) {
    this.value = value;
  }

  eval() {
    return this.value;
  }

  toString() {
    return `(quote ${this.value})`;
  }
}

class Quasiquote {

  value: any;

  constructor(value: any) {
    this.value = value;
  }

  eval(env: Env) {
    return unquote(this.value, env);
  }

  toString() {
    return `(quasiquote ${this.value})`;
  }
}

semantics.addOperation('toAST', {
  Program(sexps) {
    return sexps.children.map(c => c.toAST());
  },

  Sexp(_1, stmt, _2) {
    return stmt.toAST();
  },

  Stmt_list(args) {
    return new List(args.asIteration().children.map(c => c.toAST()));
  },

  Stmt_fn(_, args, body) {
    return new Fn(args.toAST(), body.toAST());
  },

  Stmt_def(_, name, arg) {
    return new Def(name.sourceString, arg.toAST());
  },

  Stmt_macro(_, args, body) {
    return new Macro(args.toAST(), body.toAST());
  },

  Stmt_quote(_, any) {
    return new Quote(any.toAST());
  },

  Stmt_quasiquote(_, any) {
    return new Quasiquote(any.toAST());
  },

  argList(_1, args, _2) {
    return args.asIteration().children.map(c => c.toAST());
  },

  symbol(_) {
    return new Sym(this.sourceString);
  },

  number(_) {
    return parseInt(this.sourceString);
  },

  string(_1, text, _3) {
    return text.sourceString;
  }
});

export const runLisp = (str: string, env: Env) => {
  const match = grammar.match(str);
  let result;

  if (match.failed()) {
    throw new Error(match.message);
  }

  const adapter = semantics(match);
  const ast = adapter.toAST();

  ast.forEach((ast: { eval: (arg0: Env) => any; }) => {
    result = ast.eval(env);
  });

  return result;
};

export const createEnv = () => {
  const env = new Env();

  const multiArgOp =
    (    cb: { (a: any, b: any): any; (a: any, b: any): number; (a: any, b: any): number; (a: any, b: any): number; (previousValue: any, currentValue: any, currentIndex: number, array: any[]): any; }) =>
    (...args: any[]) => {
      if (args.length === 1) {
        return args[0];
      }

      return args.slice(1).reduce(cb, args[0]);
    };

  env.bind('str', (...args: any[]) => args.map(arg => arg.toString()).join(' '));

  // eslint-disable-next-line no-console
  env.bind('log', (...text: any) => console.log('lisp>', ...text));

  env.bind(
    '+',
    multiArgOp((a, b) => a + b)
  );
  env.bind(
    '-',
    multiArgOp((a, b) => a - b)
  );
  env.bind(
    '*',
    multiArgOp((a, b) => a * b)
  );
  env.bind(
    '/',
    multiArgOp((a, b) => a / b)
  );

  env.bind('first', (xs: any[]) => xs[0]);
  env.bind('second', (xs: any[]) => xs[1]);
  env.bind('nth', (idx: string | number, xs: { [x: string]: any; }) => xs[idx]);

  return env;
};