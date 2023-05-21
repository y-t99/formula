# formula

The simple formula executor based on ohm.

## Operation

### Arithmetic Operation

1. `Plus`

```typescript
const output = evaluate("1 + 1");
expect(output).toEqual(2);
```

2. `Minus`

```typescript
const output = evaluate("1 - 1");
expect(output).toEqual(0);
```

3. `Times`

```typescript
const output = evaluate("1 * 1");
expect(output).toEqual(1);
```

4. `Div`

```typescript
const output = evaluate("2 / 1");
expect(output).toEqual(2);
```

5. `Mod`

```typescript
const output = evaluate("1 % 2");
expect(output).toEqual(1);
```

### Logical Operation

1. `Equal` and `NotEqual`

```typescript
const equal = evaluate("1 == 1");
expect(equal).toEqual(1);

const notEqual = evaluate("1 != 1");
expect(notEqual).toEqual(0);
```

2. `Greater` and `GreaterEqual`

```typescript
const greater = evaluate("1 > 1");
expect(greater).toEqual(0);

const greaterEqual = evaluate("1 >= 1");
expect(greaterEqual).toEqual(1);
```

3. `Less` and `LessEqual`

```typescript
const greater = evaluate("1 < 1");
expect(greater).toEqual(0);

const greaterEqual = evaluate("1 <= 1");
expect(greaterEqual).toEqual(1);
```

4. `Or`

```typescript
const output = evaluate("0 || 1");
expect(output).toEqual(1);
```

5. `And`

```typescript
const output = evaluate("1 && 2");
expect(output).toEqual(1);
```

6. `Not`

```typescript
const output = evaluate("!100");
expect(output).toEqual(0);
```

7. `Plus` and `Minus`

```typescript
const output = evaluate("-+-1");
expect(output).toEqual(1);
```

### Operator Precedence

The following table lists operators in order from highest precedence (7) to lowest precedence (1).

| Operator Name              | Precedence | Operator |
| -------------------------- | ---------- | -------- | 
| Grouping                   |     7      | `(...)`  |
| Logical NOT (!)            |     6      |  `!...`  |
| Unary plus (+)             |     6      |  `+...`  |
| Unary negation (-)         |     6      |  `-...`  |
| Multiplication (\*)        |     5      | `..*..`  |
| Division (/)               |     5      | `../..`  |
| Remainder (%)              |     5      | `..%..`  |
| Addition (+)               |     4      | `..+..`  |
| Subtraction (-)            |     4      | `..-..`  |
| Less Than (<)              |     3      | `..<..`  |
| Less Than Or Equal (<=)    |     3      | `..<=..` |
| Greater Than (>)           |     3      | `..>..`  |
| Greater Than Or Equal (>=) |     3      | `..>=..` |
| Equality (=)               |     2      | `..=..`  |
| Inequality (!=)            |     2      | `..!=..` |
| Logical AND (&&)           |     1      | `..&&..` |
| Logical OR (\|\|)          |     1      | `..\|\|..` | 
