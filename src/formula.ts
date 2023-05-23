import { IterationNode, Node, NonterminalNode, TerminalNode } from "ohm-js";
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
  CallStatement: (functionName: NonterminalNode, args: NonterminalNode) => {
    const nodes: Node[] = args.run();
    switch (functionName.sourceString) {
      case "Contains":
        return nodes[0]?.run()?.includes(nodes[1]?.run());
      case "Find":
        return nodes[0]?.run()?.indexOf(nodes[1]?.run()) + 1;
      case "Join":
        return nodes[0]?.run().join(nodes[1]?.run());
      case "Left":
        return nodes[0]?.run()?.substring(0, nodes[1]?.run());
      case "Length":
        return nodes[0]?.run()?.length;
      case "Lowercase":
        return nodes[0]?.run()?.toLowerCase();
      case "Replace":
        return nodes[0]?.run()?.replace(nodes[1]?.run(), nodes[2]?.run());
      case "Right":
        return nodes[0]?.run()?.substring(nodes[0]?.run().length - nodes[1]?.run());
      case "Substring":
        return nodes[0]?.run()?.substring(nodes[1]?.run() - 1, nodes[1]?.run() + nodes[2]?.run() - 1);
      case "Uppercase":
        return nodes[0]?.run()?.toUpperCase();
      default:
        throw new Error("unkonwn function");
    }
  },
  args: (_left: TerminalNode, args: NonterminalNode, _right: TerminalNode) => {
    return args.asIteration().children;
  },
  valueLiteral_array: (
    _left: TerminalNode,
    array: NonterminalNode,
    _right: TerminalNode
  ) => {
    return array.asIteration().children.map((c) => c.run());
  },
  number_fract: (i: IterationNode, _: TerminalNode, d: IterationNode) => {
    return parseFloat(`${i.sourceString}.${d.sourceString}`);
  },
  number_whole: (i: IterationNode) => {
    return parseInt(i.sourceString);
  },
  nullLiteral: (value: TerminalNode) => {
    return null;
  },
  booleanLiteral: (value: TerminalNode) => {
    return Boolean(value.sourceString);
  },
  string: (_left: TerminalNode, value: IterationNode, _right: TerminalNode) => {
    return value.sourceString;
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
