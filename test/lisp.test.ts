import { createEnv, runLisp } from "formula";

describe('LISP basic test', ()=> {
  const LISP_BASIC_TEST = `
(def y 5)

(def add-two (fn (n) (+ n (+ 2 1))))

(def x (add-two y))

(log (str y "plus 3 is" x))
`;
  function createLoggingEnv(): [any, any] {
    const env = createEnv();
    const log: any[] = [];
    env.bind('log', (...args: any[]) => {
      log.push(args.map(x => JSON.stringify(x)).join(' '));
    });
    return [env, log];
  }
  test('runLisp', () => {
    const [env, log] = createLoggingEnv();
    runLisp(LISP_BASIC_TEST, env);
    expect(log).toEqual(['"5 plus 3 is 8"']);
  });
});