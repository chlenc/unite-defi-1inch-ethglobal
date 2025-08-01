import BigNumber from "bignumber.js";
import { Undefinable } from "tsdef";

BigNumber.config({ EXPONENTIAL_AT: [-100, 100] });

type Value = BN | BigNumber.Value;

const bigNumberify = (n: any): string | number => {
  if (n !== null && n !== undefined && n.toString) {
    const primitive = n.toString();

    if (typeof primitive !== "object") {
      return primitive;
    }
  }

  return n;
};

class BN extends BigNumber {
  static ZERO = new BN(0);
  static MaxUint256 = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
  dividedBy = this.div;
  exponentiatedBy = this.pow;
  modulo = this.mod;
  multipliedBy = this.times;
  squareRoot = this.sqrt;

  constructor(n: Value, base?: number) {
    super(bigNumberify(n), base);
  }

  static clamp(number: Value, min: Value, max: Value): BN {
    return BN.min(BN.max(number, min), max);
  }

  static max(...n: Value[]): BN {
    return new BN(super.max(...n.map(bigNumberify)));
  }

  static min(...n: Value[]): BN {
    return new BN(super.min(...n.map(bigNumberify)));
  }

  static toBN(p: Promise<number | string>): Promise<BN> {
    return p.then((v) => new BN(v));
  }

  static parseUnits(value: Value, decimals = 8): BN {
    return new BN(10).pow(decimals).times(bigNumberify(value));
  }

  static formatUnits(value: Value, decimals = 8): BN {
    return new BN(value).div(new BN(10).pow(decimals));
  }

  static percentOf(value: Value, percent: Value): BN {
    return new BN(new BN(value).times(percent).div(100).toFixed(0));
  }

  static ratioOf(valueA: Value, valueB: Value): BN {
    return new BN(valueA).div(valueB).times(100);
  }

  static sum = (...n: Value[]): BN => {
    if (!n.length) {
      return BN.ZERO;
    }

    return new BN(super.sum(...n.map(bigNumberify)));
  };

  abs(): BN {
    return new BN(super.abs());
  }

  div(n: Value, base?: Undefinable<number>): BN {
    return new BN(super.div(bigNumberify(n), base));
  }

  pow(n: Value, m?: Undefinable<Value>): BN {
    return new BN(super.pow(bigNumberify(n), bigNumberify(m)));
  }

  minus(n: Value, base?: Undefinable<number>): BN {
    return new BN(super.minus(bigNumberify(n), base));
  }

  mod(n: Value, base?: Undefinable<number>): BN {
    return new BN(super.mod(bigNumberify(n), base));
  }

  times(n: Value, base?: Undefinable<number>): BN {
    return new BN(super.times(bigNumberify(n), base));
  }

  negated(): BN {
    return new BN(super.negated());
  }

  plus(n: Value, base?: Undefinable<number>): BN {
    return new BN(super.plus(bigNumberify(n), base));
  }

  sqrt(): BN {
    return new BN(super.sqrt());
  }

  toDecimalPlaces(decimalPlaces: number, roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN): BN {
    return new BN(super.dp(decimalPlaces, roundingMode));
  }

  toBigFormat(decimalPlaces: number): string {
    if (super.toNumber() > 999 && super.toNumber() < 1000000) {
      return (super.toNumber() / 1000).toFixed(1) + "K";
    } else if (super.toNumber() > 1000000) {
      return (super.toNumber() / 1000000).toFixed(1) + "M";
    } else if (super.toNumber() < 900) {
      return super.toFormat(decimalPlaces); // if value < 1000, nothing to do
    }
    return super.toFormat(decimalPlaces);
  }

  /**
   * @example
   * new BN('1234.5678').toSignificant(2) === 1,234.56
   * new BN('1234.506').toSignificant(2) === 1,234.5
   * new BN('123.0000').toSignificant(2) === 123
   * new BN('0.001234').toSignificant(2) === 0.0012
   */
  toSignificant = (
    significantDigits: number,
    roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN,
    format?: BigNumber.Format,
  ): string => {
    return this.abs().gte(1) || significantDigits === 0
      ? this.toFormat(significantDigits, roundingMode, format).replace(/(\.[0-9]*[1-9])0+$|\.0+$/, "$1")
      : super.precision(significantDigits, roundingMode).toString();
  };
}

export default BN;
