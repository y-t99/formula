import { IterationNode, NonterminalNode, TerminalNode } from "ohm-js";
import grammar, { FormulaSemantics } from "./formula.ohm-bundle";

const semantics: FormulaSemantics = grammar.createSemantics();

semantics.addOperation("run", {
  Expression: (expression: NonterminalNode) => {
    return expression.run();
  },
  AddStatement_plus: (left: NonterminalNode, _: TerminalNode, right: NonterminalNode) => {
    return left.run() + right.run();
  },
  AddStatement_minus: (left: NonterminalNode, _: TerminalNode, right: NonterminalNode) => {
    return left.run() - right.run();
  },
  AddStatement: (statement: NonterminalNode) => {
    return statement.run();
  },
  MultiStatement_times: (left: NonterminalNode, _: TerminalNode, right: NonterminalNode) => {
    return left.run() * right.run();
  },
  MultiStatement_divide: (left: NonterminalNode, _: TerminalNode, right: NonterminalNode) => {
    return left.run() / right.run();
  },
  MultiStatement: (statement: NonterminalNode) => {
    return statement.run();
  },
  PriorityStatement_paren: (_left: TerminalNode, statement: NonterminalNode, _right: TerminalNode) => {
    return statement.run();
  },
  PriorityStatement: (statement: NonterminalNode) => {
    return statement.run();
  },
  number_fract: (i: IterationNode, _: TerminalNode, d: IterationNode) => {
    return parseFloat(`${i.sourceString}.${d.sourceString}`)
  },
  number_whole: (i: IterationNode) => {
    return parseInt(i.sourceString);
  },
  number: (statement: NonterminalNode) => {
    return statement.run();
  }
});

export const evaluate = (input: string) => {
  const match = grammar.match(input);

  if (match.failed()) {
    throw new Error(match.message);
  }

  const adapter = semantics(match);

  return adapter.run();
};