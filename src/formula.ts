import { IterationNode, NonterminalNode, TerminalNode } from "ohm-js";
import grammar, { FormulaSemantics } from "./formula.ohm-bundle";

const semantics: FormulaSemantics = grammar.createSemantics();

enum OperatorToken {
  Or = "||",
  And = "&&",
  Equal = "=",
  NotEqual = "!=",
  Less = "<",
  LessEqual = "<=",
  Greater = ">",
  GreaterEqual = ">=",
  Plus = "+",
  Minus = "-",
  Div = "/",
  Times = "*",
  Mod = "%",
  Not = "!",
}

semantics.addOperation("run", {
  Expression: (expression: NonterminalNode) => {
    return expression.run();
  },
  Statement: (statement: NonterminalNode) => {
    return statement.run();
  },
  Operator_binary: (operation: NonterminalNode) => {
    return operation.run();
  },
  Operator_unary: (operation: NonterminalNode) => {
    return operation.run();
  },
  Operator: (operation: NonterminalNode) => {
    return operation.run();
  },
  BinaryOperator: (
    left: NonterminalNode,
    operator: NonterminalNode,
    right: NonterminalNode
  ) => {
    if (operator.sourceString == OperatorToken.Or) {
      return left.run() == 1 || right.run() == 1 ? 1 : 0;
    } else if (operator.sourceString == OperatorToken.And) {
      return left.run() == 1 && right.run() == 1 ? 1 : 0;
    } else if (operator.sourceString == OperatorToken.Equal) {
      return left.run() == right.run() ? 1 : 0;
    } else if (operator.sourceString == OperatorToken.NotEqual) {
      return left.run() != right.run() ? 1 : 0;
    } else if (operator.sourceString == OperatorToken.Less) {
      return left.run() < right.run() ? 1 : 0;
    } else if (operator.sourceString == OperatorToken.LessEqual) {
      return left.run() <= right.run() ? 1 : 0;
    } else if (operator.sourceString == OperatorToken.Greater) {
      return left.run() > right.run() ? 1 : 0;
    } else if (operator.sourceString == OperatorToken.GreaterEqual) {
      return left.run() >= right.run() ? 1 : 0;
    } else if (operator.sourceString == OperatorToken.Plus) {
      return left.run() + right.run();
    } else if (operator.sourceString == OperatorToken.Minus) {
      return left.run() - right.run();
    } else if (operator.sourceString == OperatorToken.Div) {
      return left.run() / right.run();
    } else if (operator.sourceString == OperatorToken.Times) {
      return left.run() * right.run();
    } else if (operator.sourceString == OperatorToken.Mod) {
      return left.run() % right.run();
    } 
    throw new Error("unkonwn operator");
  },
  UnaryOperator: (operator: NonterminalNode, factor: NonterminalNode) => {
    if (operator.sourceString == OperatorToken.Not) {
      return !factor.run() ? 1 : 0;
    } else if (operator.sourceString == OperatorToken.Plus) {
      return +factor.run();
    } else if (operator.sourceString == OperatorToken.Minus) {
      return -factor.run();
    } 
    throw new Error("unkonwn operator");
  },
  PriorityStatement_expression: (
    _left: TerminalNode,
    expression: NonterminalNode,
    _right: TerminalNode
  ) => {
    return expression.run();
  },
  PriorityStatement: (statement: NonterminalNode) => {
    return statement.run();
  },
  BinaryOperatorToken: (operator: NonterminalNode) => {
    return operator.run();
  },
  LowerPrecedenceBinaryOperatorToken: (operator: TerminalNode) => {
    return operator.run();
  },
  LowPrecedenceBinaryOperatorToken: (operator: TerminalNode) => {
    return operator.run();
  },
  HighPrecedenceBinaryOperatorToken: (operator: TerminalNode) => {
    return operator.run();
  },
  HigherPrecedenceBinaryOperatorToken: (operator: TerminalNode) => {
    return operator.run();
  },
  HighestPrecedenceBinaryOperatorToken: (operator: TerminalNode) => {
    return operator.run();
  },
  UnaryOperatorToken: (operator: TerminalNode) => {
    return operator.run();
  },
  number_fract: (i: IterationNode, _: TerminalNode, d: IterationNode) => {
    return parseFloat(`${i.sourceString}.${d.sourceString}`);
  },
  number_whole: (i: IterationNode) => {
    return parseInt(i.sourceString);
  },
  number: (statement: NonterminalNode) => {
    return statement.run();
  },
});

export const evaluate = (input: string) => {
  const match = grammar.match(input);

  if (match.failed()) {
    throw new Error(match.message);
  }

  const adapter = semantics(match);

  return adapter.run();
};
